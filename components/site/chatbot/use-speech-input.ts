"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Dictation for the composer, via the browser's own speech recognition.
 *
 * No audio leaves the page for us to handle and there is no extra API cost —
 * the browser does the transcription. That matters for the audience: most of
 * these visitors are on a phone, and typing out a question with any real
 * detail in it — a course, a destination, a budget and an intake — is the
 * single biggest friction in asking a good one.
 *
 * Support is uneven (Chrome and Safari yes, Firefox no), so `isSupported`
 * gates the button entirely rather than showing one that does nothing.
 */

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<
    ArrayLike<{ transcript: string }> & { isFinal: boolean }
  >;
};

function getRecognitionConstructor():
  | (new () => SpeechRecognitionLike)
  | undefined {
  if (typeof window === "undefined") return undefined;

  const candidate = window as typeof window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };

  return candidate.SpeechRecognition ?? candidate.webkitSpeechRecognition;
}

export function useSpeechInput({
  onTranscript,
}: {
  /** Called with the text so far; replaces what the last call appended. */
  onTranscript: (text: string, isFinal: boolean) => void;
}) {
  // Resolved once, lazily: support cannot change during a page view, and a
  // lazy initializer keeps it out of an effect. getRecognitionConstructor
  // guards `window`, and the dock never server-renders.
  const [isSupported] = useState(() => Boolean(getRecognitionConstructor()));
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const callbackRef = useRef(onTranscript);

  // Written in an effect, not during render: the recognition callbacks read it
  // long after the render that supplied it.
  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Recognition = getRecognitionConstructor();
    if (!Recognition) return;

    // Starting twice throws; treat a second press as "stop".
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new Recognition();
    // Indian English where available: most of this audience speaks it, and the
    // wrong locale mangles university and city names badly.
    recognition.lang = navigator.language?.startsWith("en")
      ? navigator.language
      : "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      let isFinal = false;

      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];
        transcript += result[0]?.transcript ?? "";
        if (result.isFinal) isFinal = true;
      }

      if (transcript.trim()) {
        callbackRef.current(transcript.trim(), isFinal);
      }
    };

    recognition.onerror = () => {
      // A denied microphone or a no-speech timeout both end the session; the
      // button returning to rest is the whole error message a visitor needs.
      recognition.stop();
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }, []);

  // Never leave the microphone open behind a closed dock.
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  return { isSupported, isListening, start, stop };
}
