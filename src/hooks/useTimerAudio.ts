/**
 * useTimerAudio - Hook for managing timer audio alerts
 * Implements GH-006: Hear audio alerts
 *
 * Acceptance Criteria:
 * - Beep sound plays every second in final third of timer ✅
 * - For 30-second timer, beeps start at 10 seconds remaining ✅
 * - Final beep (at 0) is longer/different tone ✅
 * - Sounds are professional and tournament-like ✅
 * - Audio works when phone is on silent (optional setting) ✅
 */

import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useRef } from "react";

import { useAppSelector } from "../store/hooks";

// Audio assets
const beepSound = require("../../assets/audio/beep.mp3");
const beepLongSound = require("../../assets/audio/beep-long.mp3");

interface UseTimerAudioOptions {
  /** Total timer duration in seconds */
  duration: number;
}

interface UseTimerAudioReturn {
  /** Play the short beep sound */
  playBeep: () => Promise<void>;
  /** Play the long final beep sound */
  playFinalBeep: () => Promise<void>;
  /** Handle timer tick - plays appropriate sound based on remaining time */
  handleTick: (remainingSeconds: number) => void;
  /** Check if audio should play for this second */
  shouldPlayBeep: (remainingSeconds: number) => boolean;
}

export function useTimerAudio({
  duration,
}: UseTimerAudioOptions): UseTimerAudioReturn {
  // Get sound enabled setting from Redux
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled);

  // Audio players - using downloadFirst to ensure audio is ready before playback
  const beepPlayer = useAudioPlayer(beepSound, { downloadFirst: true });
  const finalBeepPlayer = useAudioPlayer(beepLongSound, {
    downloadFirst: true,
  });

  // Track last played second to avoid duplicate plays
  const lastPlayedSecond = useRef<number>(-1);

  // Configure audio mode on mount (to play in silent mode)
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: "mixWithOthers",
          interruptionModeAndroid: "duckOthers",
        });
      } catch (error) {
        console.warn("Failed to configure audio mode:", error);
      }
    };

    configureAudio();
  }, []);

  // Calculate threshold for when beeps should start (final third of timer)
  const getBeepThreshold = useCallback((): number => {
    return Math.ceil(duration / 3);
  }, [duration]);

  // Check if audio should play for this second
  const shouldPlayBeep = useCallback(
    (remainingSeconds: number): boolean => {
      if (!soundEnabled) return false;

      const threshold = getBeepThreshold();
      return remainingSeconds <= threshold && remainingSeconds >= 0;
    },
    [soundEnabled, getBeepThreshold]
  );

  // Play the short beep sound
  const playBeep = useCallback(async () => {
    if (!soundEnabled) return;

    try {
      // Check if player is loaded
      if (!beepPlayer.isLoaded) {
        console.warn("Beep player not loaded yet");
        return;
      }
      // Reset to start and play
      await beepPlayer.seekTo(0);
      beepPlayer.play();
    } catch (error) {
      console.warn("Failed to play beep:", error);
    }
  }, [soundEnabled, beepPlayer]);

  // Play the long final beep sound
  const playFinalBeep = useCallback(async () => {
    if (!soundEnabled) return;

    try {
      // Check if player is loaded
      if (!finalBeepPlayer.isLoaded) {
        console.warn("Final beep player not loaded yet");
        return;
      }
      // Reset to start and play
      await finalBeepPlayer.seekTo(0);
      finalBeepPlayer.play();
    } catch (error) {
      console.warn("Failed to play final beep:", error);
    }
  }, [soundEnabled, finalBeepPlayer]);

  // Handle timer tick - plays appropriate sound based on remaining time
  const handleTick = useCallback(
    (remainingSeconds: number) => {
      // Avoid playing the same second twice
      if (remainingSeconds === lastPlayedSecond.current) {
        return;
      }

      if (!shouldPlayBeep(remainingSeconds)) {
        return;
      }

      lastPlayedSecond.current = remainingSeconds;

      if (remainingSeconds === 0) {
        // Play longer/different tone at 0 (timer expired)
        playFinalBeep();
      } else if (remainingSeconds > 0) {
        // Play short beep for countdown seconds
        playBeep();
      }
    },
    [shouldPlayBeep, playBeep, playFinalBeep]
  );

  // Reset last played second when duration changes
  useEffect(() => {
    lastPlayedSecond.current = -1;
  }, [duration]);

  return {
    playBeep,
    playFinalBeep,
    handleTick,
    shouldPlayBeep,
  };
}
