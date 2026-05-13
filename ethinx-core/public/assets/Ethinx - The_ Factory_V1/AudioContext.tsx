import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const AUDIO_MUTED_KEY = "empire-os-audio-muted";

interface AudioContextValue {
  /** Whether all audio is currently muted */
  isMuted: boolean;
  /** Toggle mute state */
  toggleMute: () => void;
  /** Explicitly set mute state */
  setMuted: (muted: boolean) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem(AUDIO_MUTED_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Persist to localStorage whenever mute state changes
  useEffect(() => {
    try {
      localStorage.setItem(AUDIO_MUTED_KEY, String(isMuted));
    } catch {
      // Silently ignore storage errors
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
  }, []);

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, setMuted }}>
      {children}
    </AudioCtx.Provider>
  );
}

/**
 * Access global audio mute state.
 * Must be used within an <AudioProvider>.
 */
export function useAudioContext(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAudioContext must be used within an <AudioProvider>");
  }
  return ctx;
}
