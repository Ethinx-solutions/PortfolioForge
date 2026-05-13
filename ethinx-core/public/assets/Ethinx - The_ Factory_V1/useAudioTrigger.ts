import { useCallback, useRef, useEffect } from "react";
import { useAudioContext } from "@/contexts/AudioContext";

/**
 * Audio trigger types mapped to dashboard events.
 *
 * - revenue_ping:      Plays on new revenue/payment events (sales ticker, Stripe webhooks)
 * - system_hardened:   Plays on security/system hardening events (connection status changes)
 * - flux_complete:     Plays on task/flux completion events (milestone completions, phase transitions)
 */
export type AudioTriggerType = "revenue_ping" | "system_hardened" | "flux_complete";

/** CDN URLs for synthesized audio assets */
const AUDIO_URLS: Record<AudioTriggerType, string> = {
  revenue_ping:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663475555141/Mz7RoWCArqbbwBLJz4NArS/revenue_ping_6446c9a8.wav",
  system_hardened:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663475555141/Mz7RoWCArqbbwBLJz4NArS/system_hardened_1162d487.wav",
  flux_complete:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663475555141/Mz7RoWCArqbbwBLJz4NArS/flux_complete_0cadb809.wav",
};

/** Volume levels per trigger type (0.0 - 1.0) */
const AUDIO_VOLUMES: Record<AudioTriggerType, number> = {
  revenue_ping: 0.6,
  system_hardened: 0.4,
  flux_complete: 0.5,
};

// Pre-loaded audio cache (module-level singleton)
const audioCache: Partial<Record<AudioTriggerType, HTMLAudioElement>> = {};
let preloaded = false;

/**
 * Preload all audio assets into memory so playback is instant.
 * Safe to call multiple times — only loads once.
 */
export function preloadAudioAssets(): void {
  if (preloaded) return;
  preloaded = true;

  for (const [key, url] of Object.entries(AUDIO_URLS)) {
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = AUDIO_VOLUMES[key as AudioTriggerType];
    audioCache[key as AudioTriggerType] = audio;
  }
}

/**
 * Play a specific audio trigger (low-level, ignores mute state).
 * Use the hook's `play` function instead for mute-aware playback.
 */
export async function playAudioTrigger(type: AudioTriggerType): Promise<void> {
  try {
    let audio = audioCache[type];
    if (!audio) {
      audio = new Audio(AUDIO_URLS[type]);
      audio.volume = AUDIO_VOLUMES[type];
      audioCache[type] = audio;
    }

    // Reset to start if already playing
    audio.currentTime = 0;
    audio.volume = AUDIO_VOLUMES[type];
    await audio.play();
  } catch {
    // Silently ignore autoplay policy errors — user hasn't interacted yet
    console.debug(`[AudioTrigger] Playback blocked for ${type} (autoplay policy)`);
  }
}

/**
 * React hook that provides a mute-aware `play` function for triggering dashboard sounds.
 * Preloads assets on mount. Respects global mute state from AudioProvider.
 * The play function is referentially stable across renders.
 *
 * @example
 * ```tsx
 * const { play, isMuted } = useAudioTrigger();
 *
 * // On new revenue event:
 * play("revenue_ping");  // No-op if muted
 *
 * // On security hardening event:
 * play("system_hardened");
 *
 * // On task completion:
 * play("flux_complete");
 * ```
 */
export function useAudioTrigger() {
  const { isMuted, toggleMute, setMuted } = useAudioContext();
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  // Preload on mount
  useEffect(() => {
    preloadAudioAssets();
  }, []);

  const play = useCallback((type: AudioTriggerType) => {
    if (isMutedRef.current) {
      console.debug(`[AudioTrigger] Muted — skipping ${type}`);
      return Promise.resolve();
    }
    return playAudioTrigger(type);
  }, []);

  return { play, isMuted, toggleMute, setMuted, AUDIO_URLS, AUDIO_VOLUMES };
}

export default useAudioTrigger;
