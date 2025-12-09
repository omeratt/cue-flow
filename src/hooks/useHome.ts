/**
 * useHome - Hook for HomeScreen logic
 * Extracted from HomeScreen as part of GH-019
 */

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import type { GameMode } from "../lib/constants/game";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setGameMode } from "../store/slices/gameSlice";
import { deleteRivalry, setActiveRivalry } from "../store/slices/rivalrySlice";
import type { Rivalry } from "../types/rivalry";

export function useHome() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const rivalries = useAppSelector((state) => state.rivalry.rivalries);
  const hapticEnabled = useAppSelector((state) => state.settings.hapticEnabled);

  // State for delete confirmation modal
  const [rivalryToDelete, setRivalryToDelete] = useState<Rivalry | null>(null);

  // Sort rivalries by most recently played
  const sortedRivalries = useMemo(() => {
    return [...rivalries].sort(
      (a, b) =>
        new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime()
    );
  }, [rivalries]);

  const handleGameModeSelect = useCallback(
    (mode: GameMode) => {
      dispatch(setGameMode(mode));
      dispatch(setActiveRivalry(null));
      router.push("/game/setup");
    },
    [dispatch, router]
  );

  const handleRivalryPress = useCallback(
    (rivalry: Rivalry) => {
      dispatch(setGameMode(rivalry.gameMode));
      dispatch(setActiveRivalry(rivalry.id));
      router.push("/game/setup");
    },
    [dispatch, router]
  );

  const handleSettingsPress = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/settings");
  }, [hapticEnabled, router]);

  // GH-013: Delete rivalry handlers
  const handleDeleteRequest = useCallback(
    (rivalry: Rivalry) => {
      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      setRivalryToDelete(rivalry);
    },
    [hapticEnabled]
  );

  const handleConfirmDelete = useCallback(() => {
    if (rivalryToDelete) {
      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      dispatch(deleteRivalry(rivalryToDelete.id));
      setRivalryToDelete(null);
    }
  }, [rivalryToDelete, hapticEnabled, dispatch]);

  const handleCancelDelete = useCallback(() => {
    setRivalryToDelete(null);
  }, []);

  return {
    // State
    sortedRivalries,
    rivalryToDelete,
    // Actions
    handleGameModeSelect,
    handleRivalryPress,
    handleSettingsPress,
    handleDeleteRequest,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
