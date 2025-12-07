/**
 * useGamePlay - Hook for managing game play logic
 * Combines game state from Redux, timer control, and callbacks
 * Extracted from GamePlayScreen for better separation of concerns
 *
 * Implements:
 * - GH-006: Hear audio alerts (via useTimerAudio)
 */

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { GAME_MODES } from "../lib/constants/game";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { pauseGame, resumeGame, switchPlayer } from "../store/slices/gameSlice";
import { useGameTimer } from "./useGameTimer";
import { useTimerAudio } from "./useTimerAudio";

// Constants for feedback timing (aligned with audio)
const HAPTIC_THRESHOLD_SECONDS = 5; // Haptics play in last 5 seconds

export function useGamePlay() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get game state from Redux
  const gameMode = useAppSelector((state) => state.game.mode);
  const player1Name = useAppSelector((state) => state.game.player1Name);
  const player2Name = useAppSelector((state) => state.game.player2Name);
  const timerDuration = useAppSelector((state) => state.game.timerDuration);
  const currentPlayer = useAppSelector((state) => state.game.currentPlayer);
  const hapticEnabled = useAppSelector((state) => state.settings.hapticEnabled);

  // Local state for current player name (synced from Redux)
  const [displayCurrentPlayer, setDisplayCurrentPlayer] =
    useState(currentPlayer);

  const modeConfig = gameMode ? GAME_MODES[gameMode] : null;

  // Initialize audio hook for timer alerts (GH-006)
  const timerAudio = useTimerAudio({ duration: timerDuration });

  // Timer callbacks
  const handleExpire = useCallback(() => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    // Play final beep on timer expire
    timerAudio.playFinalBeep();
  }, [hapticEnabled, timerAudio]);

  const handlePlayerSwitch = useCallback(() => {
    dispatch(switchPlayer());
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [dispatch, hapticEnabled]);

  const handleTick = useCallback(
    (remainingSeconds: number) => {
      // Haptic feedback in last 5 seconds
      if (
        hapticEnabled &&
        remainingSeconds <= HAPTIC_THRESHOLD_SECONDS &&
        remainingSeconds > 0
      ) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Audio beep in last 5 seconds + ticking in last 10 seconds (GH-006)
      timerAudio.handleTick(remainingSeconds);
    },
    [hapticEnabled, timerAudio]
  );

  // Initialize timer hook
  const timer = useGameTimer({
    duration: timerDuration,
    onExpire: handleExpire,
    onPlayerSwitch: handlePlayerSwitch,
    onTick: handleTick,
  });

  // Sync current player from Redux to local state
  useEffect(() => {
    setDisplayCurrentPlayer(currentPlayer);
  }, [currentPlayer]);

  // Get current player name
  const getCurrentPlayerName = (): string => {
    return displayCurrentPlayer === "player1" ? player1Name : player2Name;
  };

  // Handle timer tap - stop ticking when timer is stopped
  const handleTimerPress = useCallback(() => {
    // If timer is running and will be stopped, stop ticking first
    if (timer.timerState.value === "running") {
      timerAudio.stopTicking();
    }
    timer.handleTap();
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [timer, hapticEnabled, timerAudio]);

  // Handle back button - stop ticking before navigating away
  const handleBack = useCallback(() => {
    timerAudio.stopTicking();
    timer.reset();
    router.back();
  }, [timer, router, timerAudio]);

  // Handle pause/resume - stop/resume ticking accordingly
  const handlePauseResume = useCallback(() => {
    const currentState = timer.timerState.value;
    if (currentState === "running") {
      timerAudio.stopTicking();
      timer.pause();
      dispatch(pauseGame());
    } else if (currentState === "paused") {
      timer.resume();
      dispatch(resumeGame());
      // Note: ticking will resume automatically via handleTick when timer runs
    }
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [timer, dispatch, hapticEnabled, timerAudio]);

  // Get sound enabled state from Redux
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled);

  // Handle toggle sound (GH-016) - stop ticking if sound is being disabled
  const handleToggleSound = useCallback(() => {
    // If sound is currently enabled and will be disabled, stop ticking
    if (soundEnabled) {
      timerAudio.stopTicking();
    }
    dispatch({ type: "settings/toggleSound" });
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [dispatch, hapticEnabled, soundEnabled, timerAudio]);

  return {
    // Game state
    gameMode,
    modeConfig,
    player1Name,
    player2Name,
    currentPlayerName: getCurrentPlayerName(),

    // Timer state
    remainingTime: timer.remainingTime,
    progress: timer.progress,
    timerState: timer.timerState,

    // Sound state
    soundEnabled,

    // Actions
    handleTimerPress,
    handleBack,
    handlePauseResume,
    handleToggleSound,
    reset: timer.reset,

    // Navigation
    router,
  };
}
