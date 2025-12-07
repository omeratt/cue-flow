/**
 * useGameTimer - Timer hook using Reanimated SharedValues
 * Implements GH-004: Start and stop timer
 *
 * IMPORTANT: All timer logic runs on the UI thread via SharedValues.
 * NO useState/useReducer for timer logic!
 */

import { useCallback, useEffect } from "react";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export type TimerState = "idle" | "running" | "paused" | "expired";

interface UseGameTimerOptions {
  /** Duration in seconds */
  duration: number;
  /** Callback when timer expires */
  onExpire?: () => void;
  /** Callback when player switches (timer stopped) */
  onPlayerSwitch?: () => void;
  /** Callback for each second tick (for audio/haptic feedback) */
  onTick?: (remainingSeconds: number) => void;
}

interface UseGameTimerReturn {
  /** Remaining time in milliseconds (SharedValue for animations) */
  remainingTime: ReturnType<typeof useSharedValue<number>>;
  /** Total duration in milliseconds (SharedValue) */
  totalDuration: ReturnType<typeof useSharedValue<number>>;
  /** Timer state: 'idle' | 'running' | 'paused' | 'expired' */
  timerState: ReturnType<typeof useSharedValue<TimerState>>;
  /** Progress from 0 to 1 (SharedValue for animations) */
  progress: ReturnType<typeof useSharedValue<number>>;
  /** Start or resume the timer */
  start: () => void;
  /** Stop the timer and switch player */
  stop: () => void;
  /** Pause the timer without switching player */
  pause: () => void;
  /** Resume a paused timer */
  resume: () => void;
  /** Reset timer to full duration */
  reset: () => void;
  /** Handle tap on timer (start if idle, stop if running) */
  handleTap: () => void;
}

export function useGameTimer({
  duration,
  onExpire,
  onPlayerSwitch,
  onTick,
}: UseGameTimerOptions): UseGameTimerReturn {
  const durationMs = duration * 1000;

  // SharedValues for timer state (runs on UI thread)
  const remainingTime = useSharedValue(durationMs);
  const totalDuration = useSharedValue(durationMs);
  const timerState = useSharedValue<TimerState>("idle");
  const progress = useSharedValue(1); // 1 = full, 0 = empty

  // Track last second for tick callback
  const lastTickSecond = useSharedValue(-1);

  // Update duration when prop changes
  useEffect(() => {
    totalDuration.value = durationMs;
    if (timerState.value === "idle") {
      remainingTime.value = durationMs;
      progress.value = 1;
    }
  }, [durationMs, totalDuration, remainingTime, progress, timerState]);

  // Frame callback for smooth countdown
  const frameCallback = useFrameCallback((frameInfo) => {
    "worklet";

    if (timerState.value !== "running") {
      return;
    }

    const { timeSincePreviousFrame } = frameInfo;
    if (timeSincePreviousFrame === null) return;

    // Decrease remaining time
    remainingTime.value = Math.max(
      0,
      remainingTime.value - timeSincePreviousFrame
    );

    // Update progress
    progress.value = remainingTime.value / totalDuration.value;

    // Check for second ticks (for audio/haptic feedback)
    const currentSecond = Math.ceil(remainingTime.value / 1000);
    if (currentSecond !== lastTickSecond.value && currentSecond >= 0) {
      lastTickSecond.value = currentSecond;
      if (onTick) {
        scheduleOnRN(onTick, currentSecond);
      }
    }

    // Check if timer expired
    if (remainingTime.value <= 0) {
      timerState.value = "expired";
      progress.value = 0;
      if (onExpire) {
        scheduleOnRN(onExpire);
      }
    }
  }, false); // autostart = false

  const start = useCallback(() => {
    "worklet";
    if (timerState.value === "idle" || timerState.value === "expired") {
      remainingTime.value = totalDuration.value;
      progress.value = 1;
      lastTickSecond.value = -1;
    }
    timerState.value = "running";
    frameCallback.setActive(true);
  }, [
    frameCallback,
    timerState,
    remainingTime,
    totalDuration,
    progress,
    lastTickSecond,
  ]);

  const stop = useCallback(() => {
    "worklet";
    timerState.value = "idle";
    frameCallback.setActive(false);
    remainingTime.value = totalDuration.value;
    progress.value = 1;
    lastTickSecond.value = -1;
    if (onPlayerSwitch) {
      scheduleOnRN(onPlayerSwitch);
    }
  }, [
    frameCallback,
    timerState,
    remainingTime,
    totalDuration,
    progress,
    lastTickSecond,
    onPlayerSwitch,
  ]);

  const pause = useCallback(() => {
    "worklet";
    if (timerState.value === "running") {
      timerState.value = "paused";
      frameCallback.setActive(false);
    }
  }, [frameCallback, timerState]);

  const resume = useCallback(() => {
    "worklet";
    if (timerState.value === "paused") {
      timerState.value = "running";
      frameCallback.setActive(true);
    }
  }, [frameCallback, timerState]);

  const reset = useCallback(() => {
    "worklet";
    timerState.value = "idle";
    frameCallback.setActive(false);
    remainingTime.value = totalDuration.value;
    progress.value = 1;
    lastTickSecond.value = -1;
  }, [
    frameCallback,
    timerState,
    remainingTime,
    totalDuration,
    progress,
    lastTickSecond,
  ]);

  const handleTap = useCallback(() => {
    const currentState = timerState.value;
    if (currentState === "idle") {
      start();
    } else if (currentState === "expired") {
      // When expired, just reset and switch player without auto-starting
      timerState.value = "idle";
      frameCallback.setActive(false);
      remainingTime.value = totalDuration.value;
      progress.value = 1;
      lastTickSecond.value = -1;
      if (onPlayerSwitch) {
        scheduleOnRN(onPlayerSwitch);
      }
    } else if (currentState === "running") {
      stop();
    } else if (currentState === "paused") {
      resume();
    }
  }, [
    timerState,
    start,
    stop,
    resume,
    frameCallback,
    remainingTime,
    totalDuration,
    progress,
    lastTickSecond,
    onPlayerSwitch,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      frameCallback.setActive(false);
    };
  }, [frameCallback]);

  return {
    remainingTime,
    totalDuration,
    timerState,
    progress,
    start,
    stop,
    pause,
    resume,
    reset,
    handleTap,
  };
}
