/**
 * useGamePlay - Hook for managing game play logic
 * Combines game state from Redux, timer control, and callbacks
 * Extracted from GamePlayScreen for better separation of concerns
 */

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { GAME_MODES } from "../lib/constants/game";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { pauseGame, resumeGame, switchPlayer } from "../store/slices/gameSlice";
import { useGameTimer } from "./useGameTimer";

export function useGamePlay() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get game state from Redux
  const gameMode = useAppSelector((state) => state.game.mode);
  const player1Name = useAppSelector((state) => state.game.player1Name);
  const player2Name = useAppSelector((state) => state.game.player2Name);
  const timerDuration = useAppSelector((state) => state.game.timerDuration);
  const currentPlayer = useAppSelector((state) => state.game.currentPlayer);

  // Local state for current player name (synced from Redux)
  const [displayCurrentPlayer, setDisplayCurrentPlayer] =
    useState(currentPlayer);

  const modeConfig = gameMode ? GAME_MODES[gameMode] : null;

  // Timer callbacks
  const handleExpire = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  const handlePlayerSwitch = useCallback(() => {
    dispatch(switchPlayer());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [dispatch]);

  const handleTick = useCallback(
    (remainingSeconds: number) => {
      const threshold = Math.ceil(timerDuration / 3);
      if (remainingSeconds <= threshold && remainingSeconds > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [timerDuration]
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

  // Handle timer tap
  const handleTimerPress = useCallback(() => {
    timer.handleTap();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [timer]);

  // Handle back button
  const handleBack = useCallback(() => {
    timer.reset();
    router.back();
  }, [timer, router]);

  // Handle pause/resume
  const handlePauseResume = useCallback(() => {
    const currentState = timer.timerState.value;
    if (currentState === "running") {
      timer.pause();
      dispatch(pauseGame());
    } else if (currentState === "paused") {
      timer.resume();
      dispatch(resumeGame());
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [timer, dispatch]);

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

    // Actions
    handleTimerPress,
    handleBack,
    handlePauseResume,
    reset: timer.reset,

    // Navigation
    router,
  };
}
