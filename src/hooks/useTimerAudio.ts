/**
 * useTimerAudio - Hook for managing timer audio alerts
 * Implements GH-006: Hear audio alerts
 *
 * Acceptance Criteria:
 * - Beep sound plays every second in last 5 seconds ✅
 * - Ticking sound plays continuously during last 10 seconds ✅
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
const tickingSound = require("../../assets/audio/ticking-timer-65220.mp3");

// Constants for audio timing
const BEEP_THRESHOLD_SECONDS = 5; // Beeps play in last 5 seconds
const TICKING_THRESHOLD_SECONDS = 10; // Ticking plays in last 10 seconds

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
  /** Start the ticking sound */
  startTicking: () => Promise<void>;
  /** Stop the ticking sound */
  stopTicking: () => Promise<void>;
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
  const tickingPlayer = useAudioPlayer(tickingSound, { downloadFirst: true });

  // Track last played second to avoid duplicate plays
  const lastPlayedSecond = useRef<number>(-1);
  // Track if ticking is currently playing
  const isTickingPlaying = useRef<boolean>(false);

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

  // Check if audio should play for this second (last 5 seconds)
  const shouldPlayBeep = useCallback(
    (remainingSeconds: number): boolean => {
      if (!soundEnabled) return false;
      return (
        remainingSeconds <= BEEP_THRESHOLD_SECONDS && remainingSeconds >= 0
      );
    },
    [soundEnabled]
  );

  // Check if ticking should play (last 10 seconds)
  const shouldPlayTicking = useCallback(
    (remainingSeconds: number): boolean => {
      if (!soundEnabled) return false;
      return (
        remainingSeconds <= TICKING_THRESHOLD_SECONDS && remainingSeconds > 0
      );
    },
    [soundEnabled]
  );

  // Start the ticking sound
  const startTicking = useCallback(async () => {
    if (!soundEnabled || isTickingPlaying.current) return;

    try {
      if (!tickingPlayer.isLoaded) {
        console.warn("Ticking player not loaded yet");
        return;
      }
      await tickingPlayer.seekTo(0);
      tickingPlayer.play();
      isTickingPlaying.current = true;
    } catch (error) {
      console.warn("Failed to start ticking:", error);
    }
  }, [soundEnabled, tickingPlayer]);

  // Stop the ticking sound
  const stopTicking = useCallback(async () => {
    if (!isTickingPlaying.current) return;

    try {
      tickingPlayer.pause();
      await tickingPlayer.seekTo(0);
      isTickingPlaying.current = false;
    } catch (error) {
      console.warn("Failed to stop ticking:", error);
    }
  }, [tickingPlayer]);

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
      // Handle ticking sound (last 10 seconds)
      if (shouldPlayTicking(remainingSeconds)) {
        if (!isTickingPlaying.current) {
          startTicking();
        }
      } else if (isTickingPlaying.current) {
        stopTicking();
      }

      // Avoid playing the same beep second twice
      if (remainingSeconds === lastPlayedSecond.current) {
        return;
      }

      if (!shouldPlayBeep(remainingSeconds)) {
        return;
      }

      lastPlayedSecond.current = remainingSeconds;

      if (remainingSeconds === 0) {
        // Stop ticking and play longer/different tone at 0 (timer expired)
        stopTicking();
        playFinalBeep();
      } else if (remainingSeconds > 0) {
        // Play short beep for countdown seconds (1-5)
        playBeep();
      }
    },
    [
      shouldPlayBeep,
      shouldPlayTicking,
      playBeep,
      playFinalBeep,
      startTicking,
      stopTicking,
    ]
  );

  // Reset state when duration changes
  useEffect(() => {
    lastPlayedSecond.current = -1;
    isTickingPlaying.current = false;
  }, [duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTickingPlaying.current) {
        tickingPlayer.pause();
        isTickingPlaying.current = false;
      }
    };
  }, [tickingPlayer]);

  return {
    playBeep,
    playFinalBeep,
    handleTick,
    shouldPlayBeep,
    startTicking,
    stopTicking,
  };
}
