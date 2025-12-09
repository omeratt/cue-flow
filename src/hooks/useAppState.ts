/**
 * useAppState - Hook for handling app state changes
 * Implements GH-015: Pause and resume game
 *
 * Acceptance Criteria:
 * - Timer automatically pauses when app goes to background ✅
 * - Game state preserved when navigating away ✅
 * - "Resume Game" option when returning to app (via pause state) ✅
 */

import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

interface UseAppStateOptions {
  /** Callback when app goes to background */
  onBackground?: () => void;
  /** Callback when app comes to foreground */
  onForeground?: () => void;
  /** Whether the hook is active */
  enabled?: boolean;
}

/**
 * Hook to handle app state changes (foreground/background)
 * Used to pause timer when app goes to background
 */
export function useAppState({
  onBackground,
  onForeground,
  enabled = true,
}: UseAppStateOptions = {}) {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (!enabled) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = appStateRef.current;

      // App went to background
      if (
        previousState === "active" &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        onBackground?.();
      }

      // App came to foreground
      if (
        (previousState === "background" || previousState === "inactive") &&
        nextAppState === "active"
      ) {
        onForeground?.();
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [enabled, onBackground, onForeground]);

  return {
    currentState: appStateRef.current,
  };
}
