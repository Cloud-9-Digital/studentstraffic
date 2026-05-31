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
  const recoveryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recoveryUntilRef = useRef<number>(0);
  const syncInFlightRef = useRef(false);
  const lastSyncAtRef = useRef(0);
  const activeCallRef = useRef<ActiveCall | null>(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  const stopRecoverySync = useCallback(() => {
    recoveryUntilRef.current = 0;
    if (recoveryTimeoutRef.current) {
      clearTimeout(recoveryTimeoutRef.current);
      recoveryTimeoutRef.current = null;
    }
  }, []);

  const syncIncomingCalls = useCallback(async (options?: { force?: boolean }) => {
    if (activeCallRef.current) return;
    if (syncInFlightRef.current) return;

    const now = Date.now();
    if (!options?.force && now - lastSyncAtRef.current < 1500) return;

    syncInFlightRef.current = true;
    lastSyncAtRef.current = now;

    try {
      const calls = await mobileClient.getIncomingCalls();
      if (calls.length > 0) {
        setIncomingCall((prev) => {
          if (!prev || prev.id !== calls[0].id || prev.status !== calls[0].status) {
            return calls[0];
          }
          return prev;
        });
      } else {
        setIncomingCall(null);
      }
    } catch {
      // Ignore transient sync errors. Push delivery remains the primary path.
    } finally {
      syncInFlightRef.current = false;
    }
  }, []);

  const startRecoverySync = useCallback((durationMs = 20_000, intervalMs = 5_000) => {
    recoveryUntilRef.current = Date.now() + durationMs;
    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);

    const tick = async () => {
      if (activeCallRef.current || Date.now() >= recoveryUntilRef.current) {
        stopRecoverySync();
        return;
      }

      await syncIncomingCalls({ force: true });

      if (!activeCallRef.current && Date.now() < recoveryUntilRef.current) {
        recoveryTimeoutRef.current = setTimeout(tick, intervalMs);
      } else {
        stopRecoverySync();
      }
    };

    recoveryTimeoutRef.current = setTimeout(tick, intervalMs);
  }, [stopRecoverySync, syncIncomingCalls]);

  useEffect(() => {
    if (!activeCall) {
      syncIncomingCalls({ force: true });
    } else {
      stopRecoverySync();
      setIncomingCall(null);
    }

    const sub = AppState.addEventListener("change", (state) => {
      const prevState = appStateRef.current;
      appStateRef.current = state;

      if (state === "active" && prevState !== "active" && !activeCall) {
        syncIncomingCalls({ force: true });
        startRecoverySync(15_000, 5_000);
      }
    });

    return () => {
      sub.remove();
    };
  }, [activeCall, startRecoverySync, stopRecoverySync, syncIncomingCalls]);

  useEffect(() => () => stopRecoverySync(), [stopRecoverySync]);

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
      setIncomingCall(null);
      stopRecoverySync();
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
      stopRecoverySync();
      cancelIncomingCallNotification(incomingCall.id).catch(() => {});
      startCallForegroundService(call.callId, call.displayName).catch(() => {});
    } catch (e: any) {
      setCallError(e?.message ?? "Failed to join call.");
    } finally {
      setIsStarting(false);
    }
  }, [incomingCall, stopRecoverySync]);

  const declineIncomingCall = useCallback(() => {
    if (incomingCall) {
      mobileClient.endCall(incomingCall.id).catch(() => null);
    }
    setIncomingCall(null);
    startRecoverySync(10_000, 5_000);
  }, [incomingCall, startRecoverySync]);

  const openIncomingCallById = useCallback((callId: string, callerDisplayName: string, universityName: string) => {
    if (activeCall?.callId === callId) return;
    setIncomingCall({
      id: callId,
      peerName: callerDisplayName,
      universityName,
      createdAt: null,
      status: "ringing",
    });
    startRecoverySync(20_000, 5_000);
  }, [activeCall, startRecoverySync]);

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
    syncIncomingCalls({ force: true });
    startRecoverySync(10_000, 5_000);
  }, [activeCall, startRecoverySync, syncIncomingCalls]);

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
