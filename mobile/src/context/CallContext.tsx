import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { mobileClient } from "../api/mobileClient";
import type { IncomingCall } from "../types/domain";
import {
  cancelIncomingCallNotification,
  startCallForegroundService,
  stopCallForegroundService,
} from "../services/callNotificationService";

type ActiveCall = {
  callId: string;
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  displayName: string;
  universityName: string;
  isPeerParticipant: boolean;
};

type CallContextValue = {
  activeCall: ActiveCall | null;
  incomingCall: IncomingCall | null;
  startCall: (bookingId: number, peerName: string, universityName: string) => Promise<void>;
  acceptIncomingCall: () => Promise<void>;
  declineIncomingCall: () => void;
  endCall: () => Promise<void>;
  openIncomingCallById: (callId: string, callerDisplayName: string, universityName: string) => void;
  callError: string | null;
  isStarting: boolean;
};

const CallContext = createContext<CallContextValue | null>(null);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Poll for incoming calls every 3 seconds when app is active
  useEffect(() => {
    if (activeCall) return; // don't poll while in a call

    const poll = async () => {
      try {
        const calls = await mobileClient.getIncomingCalls();
        if (calls.length > 0) {
          setIncomingCall((prev) => {
            // only update if it's a new call or status changed
            if (!prev || prev.id !== calls[0].id || prev.status !== calls[0].status) {
              return calls[0];
            }
            return prev;
          });
        } else {
          setIncomingCall(null);
        }
      } catch {
        // silently ignore polling errors
      }
    };

    pollingRef.current = setInterval(poll, 3000);
    poll(); // immediate first check

    const sub = AppState.addEventListener("change", (state) => {
      appStateRef.current = state;
      if (state === "active") poll();
    });

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      sub.remove();
    };
  }, [activeCall]);

  const startCall = useCallback(async (bookingId: number, peerName: string, universityName: string) => {
    setIsStarting(true);
    setCallError(null);
    try {
      const { callId } = await mobileClient.startCall(bookingId);
      const tokenData = await mobileClient.getCallToken(callId);
      const call: ActiveCall = {
        callId,
        appId: tokenData.appId,
        channelName: tokenData.channelName,
        token: tokenData.token,
        uid: tokenData.uid,
        displayName: peerName,
        universityName,
        isPeerParticipant: tokenData.call.isPeerParticipant,
      };
      setActiveCall(call);
      startCallForegroundService(call.callId, call.displayName).catch(() => {});
    } catch (e: any) {
      setCallError(e?.message ?? "Failed to start call.");
    } finally {
      setIsStarting(false);
    }
  }, []);

  const acceptIncomingCall = useCallback(async () => {
    if (!incomingCall) return;
    setIsStarting(true);
    setCallError(null);
    try {
      const tokenData = await mobileClient.getCallToken(incomingCall.id);
      const call: ActiveCall = {
        callId: incomingCall.id,
        appId: tokenData.appId,
        channelName: tokenData.channelName,
        token: tokenData.token,
        uid: tokenData.uid,
        displayName: tokenData.call.peerName,
        universityName: tokenData.call.universityName,
        isPeerParticipant: false,
      };
      setActiveCall(call);
      setIncomingCall(null);
      cancelIncomingCallNotification(incomingCall.id).catch(() => {});
      startCallForegroundService(call.callId, call.displayName).catch(() => {});
    } catch (e: any) {
      setCallError(e?.message ?? "Failed to join call.");
    } finally {
      setIsStarting(false);
    }
  }, [incomingCall]);

  const declineIncomingCall = useCallback(() => {
    if (incomingCall) {
      mobileClient.endCall(incomingCall.id).catch(() => null);
    }
    setIncomingCall(null);
  }, [incomingCall]);

  const openIncomingCallById = useCallback((callId: string, callerDisplayName: string, universityName: string) => {
    if (activeCall?.callId === callId) return;
    setIncomingCall({
      id: callId,
      peerName: callerDisplayName,
      universityName,
      createdAt: null,
      status: "ringing",
    });
  }, [activeCall]);

  const endCall = useCallback(async () => {
    if (!activeCall) return;
    const { callId } = activeCall;
    setActiveCall(null);
    stopCallForegroundService(callId).catch(() => {});
    try {
      await mobileClient.endCall(callId);
    } catch {
      // ignore — call is ended locally regardless
    }
  }, [activeCall]);

  return (
    <CallContext.Provider
      value={{
        activeCall,
        incomingCall,
        startCall,
        acceptIncomingCall,
        declineIncomingCall,
        endCall,
        openIncomingCallById,
        callError,
        isStarting,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

const EMPTY_CALL_CTX: CallContextValue = {
  activeCall: null,
  incomingCall: null,
  startCall: async () => {},
  acceptIncomingCall: async () => {},
  declineIncomingCall: () => {},
  endCall: async () => {},
  openIncomingCallById: () => {},
  callError: null,
  isStarting: false,
};

export function useCall() {
  return useContext(CallContext) ?? EMPTY_CALL_CTX;
}
