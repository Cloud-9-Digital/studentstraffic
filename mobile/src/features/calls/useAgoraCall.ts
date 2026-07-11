import { useCallback, useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

async function requestMicPermission() {
  if (Platform.OS !== "android") return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Microphone permission",
        message: "Students Traffic needs your microphone for voice calls.",
        buttonPositive: "Allow",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

// Lazy-load Agora so the app doesn't crash in Expo Go (native module not linked there).
// In a dev build / production build this will always be available.
function loadAgora() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-agora");
    return {
      createAgoraRtcEngine: mod.createAgoraRtcEngine as ((...args: any[]) => any),
      ChannelProfileType:   mod.ChannelProfileType   as Record<string, number>,
      ClientRoleType:       mod.ClientRoleType        as Record<string, number>,
    };
  } catch {
    return null;
  }
}

const agora = loadAgora();
const RING_TIMEOUT_MS = 60_000;

type AgoraCallState = "idle" | "connecting" | "ringing" | "connected" | "ended" | "error" | "unavailable";

type UseAgoraCallParams = {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  onEnd?: () => void;
};

export function useAgoraCall({ appId, channelName, token, uid, onEnd }: UseAgoraCallParams) {
  const engineRef = useRef<any>(null);
  const [callState, setCallState] = useState<AgoraCallState>(agora ? "idle" : "unavailable");
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const safe = useCallback((fn: () => void) => {
    if (mountedRef.current) fn();
  }, []);

  useEffect(() => {
    if (!agora) return; // Expo Go — skip

    mountedRef.current = true;

    let engine: any = null;

    (async () => {
      // Request mic permission on Android before joining
      const hasMicPermission = await requestMicPermission();
      if (!mountedRef.current) return;
      if (!hasMicPermission) {
        safe(() => {
          setError("Microphone permission denied");
          setCallState("error");
        });
        return;
      }

      engine = agora.createAgoraRtcEngine();
      engineRef.current = engine;

      engine.initialize({
        appId,
        channelProfile: agora.ChannelProfileType.ChannelProfileCommunication,
      });
      engine.enableAudio();
      engine.setEnableSpeakerphone(true);

      engine.registerEventHandler({
        onJoinChannelSuccess: () => {
          safe(() => setCallState("ringing"));
        },
        onUserJoined: (_connection: any, _remoteUid: any) => {
          safe(() => {
            setRemoteJoined(true);
            setCallState("connected");
          });
        },
        onUserOffline: (_connection: any, _remoteUid: any, _reason: any) => {
          safe(() => {
            setRemoteJoined(false);
            setCallState("ended");
            onEnd?.();
          });
        },
        onError: (_err: any, msg: any) => {
          safe(() => {
            setError(msg ?? "Call error");
            setCallState("error");
          });
        },
      });

      safe(() => setCallState("connecting"));

      engine.joinChannel(token, channelName, uid, {
        clientRoleType: agora.ClientRoleType.ClientRoleBroadcaster,
        autoSubscribeAudio: true,
        publishMicrophoneTrack: true,
      });
    })();

    return () => {
      mountedRef.current = false;
      if (engineRef.current) {
        engineRef.current.leaveChannel();
        engineRef.current.release();
        engineRef.current = null;
      }
    };
  }, [appId, channelName, token, uid]);

  const toggleMute = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const next = !isMuted;
    engine.muteLocalAudioStream(next);
    setIsMuted(next);
  }, [isMuted]);

  const toggleSpeaker = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const next = !isSpeakerOn;
    engine.setEnableSpeakerphone(next);
    setIsSpeakerOn(next);
  }, [isSpeakerOn]);

  const leaveChannel = useCallback(() => {
    engineRef.current?.leaveChannel();
    safe(() => setCallState("ended"));
  }, [safe]);

  // Do not leave callers stuck in a ringing state forever. Once the remote
  // party joins, callState changes to connected and this timer is cleared.
  useEffect(() => {
    if (callState !== "ringing") return;

    const timeout = setTimeout(() => {
      engineRef.current?.leaveChannel();
      safe(() => setCallState("ended"));
      onEnd?.();
    }, RING_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [callState, onEnd, safe]);

  return { callState, remoteJoined, isMuted, isSpeakerOn, toggleMute, toggleSpeaker, leaveChannel, error };
}
