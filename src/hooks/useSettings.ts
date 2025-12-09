/**
 * useSettings - Hook for settings screen logic
 * Implements GH-020: Extract logic from UI components to hooks
 */

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetGame } from "../store/slices/gameSlice";
import { clearAllRivalries } from "../store/slices/rivalrySlice";
import { resetAllScores } from "../store/slices/scoreSlice";
import {
  resetSettings,
  setTheme,
  setUseSystemTheme,
  toggleHaptic,
  toggleSound,
} from "../store/slices/settingsSlice";

type ThemeOption = "auto" | "light" | "dark";

export function useSettings() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showClearDataModal, setShowClearDataModal] = useState(false);

  const {
    useSystemTheme,
    theme: savedTheme,
    soundEnabled,
    hapticEnabled,
  } = useAppSelector((state) => state.settings);

  const currentThemeOption: ThemeOption = useSystemTheme ? "auto" : savedTheme;

  const handleThemeSelect = useCallback(
    (option: ThemeOption) => {
      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      if (option === "auto") {
        dispatch(setUseSystemTheme(true));
      } else {
        dispatch(setTheme(option));
      }
    },
    [hapticEnabled, dispatch]
  );

  const handleToggleSound = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch(toggleSound());
  }, [hapticEnabled, dispatch]);

  const handleToggleHaptic = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch(toggleHaptic());
  }, [hapticEnabled, dispatch]);

  const handleClearDataRequest = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowClearDataModal(true);
  }, [hapticEnabled]);

  const handleConfirmClearData = useCallback(() => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    dispatch(resetGame());
    dispatch(resetAllScores());
    dispatch(clearAllRivalries());
    dispatch(resetSettings());
    setShowClearDataModal(false);
  }, [hapticEnabled, dispatch]);

  const handleCancelClearData = useCallback(() => {
    setShowClearDataModal(false);
  }, []);

  const handleBack = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  }, [hapticEnabled, router]);

  return {
    // State
    showClearDataModal,
    currentThemeOption,
    soundEnabled,
    hapticEnabled,
    // Handlers
    handleThemeSelect,
    handleToggleSound,
    handleToggleHaptic,
    handleClearDataRequest,
    handleConfirmClearData,
    handleCancelClearData,
    handleBack,
  };
}
