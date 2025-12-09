/**
 * useCircularTimerAnimation - Hook for circular timer animation logic
 * Implements GH-020: Extract logic from UI components to hooks
 *
 * Responsibilities:
 * - Color interpolation based on progress
 * - Press animation with scale
 * - Haptic feedback on press
 * - React state sync from UI thread
 */

import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import {
  AnimatedStyle,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import type { TimerState } from "./useGameTimer";

interface TimerColors {
  timerActive: string;
  timerWarning: string;
  timerDanger: string;
  border: string;
  textSecondary: string;
  textMuted: string;
}

interface UseCircularTimerAnimationProps {
  readonly progress: SharedValue<number>;
  readonly remainingTime: SharedValue<number>;
  readonly timerState: SharedValue<TimerState>;
  readonly circumference: number;
  readonly colors: TimerColors;
  readonly hapticEnabled?: boolean;
}

interface UseCircularTimerAnimationReturn {
  readonly displaySeconds: number;
  readonly currentTimerState: TimerState;
  readonly scale: SharedValue<number>;
  readonly progressColor: SharedValue<string>;
  readonly animatedCircleProps: Partial<{
    strokeDashoffset: number;
    stroke: string;
  }>;
  readonly animatedTextStyle: AnimatedStyle<TextStyle>;
  readonly containerStyle: AnimatedStyle<ViewStyle>;
  readonly pressAnimatedStyle: AnimatedStyle<ViewStyle>;
  readonly handlePressIn: () => void;
  readonly handlePressOut: () => void;
}

export function useCircularTimerAnimation({
  progress,
  remainingTime,
  timerState,
  circumference,
  colors,
  hapticEnabled = true,
}: UseCircularTimerAnimationProps): UseCircularTimerAnimationReturn {
  // React state for text display (updated from UI thread)
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [currentTimerState, setCurrentTimerState] =
    useState<TimerState>("idle");

  // Scale animation for press feedback
  const scale = useSharedValue(1);

  // Ref to store timeout for haptic feedback
  const hapticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Press handlers for animation
  const handlePressIn = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.95, { damping: 25, stiffness: 400 });
  }, [hapticEnabled, scale]);

  const handlePressOut = useCallback(() => {
    if (hapticEnabled) {
      if (hapticTimerRef.current) {
        clearTimeout(hapticTimerRef.current);
      }
      hapticTimerRef.current = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        hapticTimerRef.current = null;
      }, 90);
    }
    scale.value = withSpring(1, { damping: 25, stiffness: 300 });
  }, [hapticEnabled, scale]);

  // Sync timer state to React state for text display
  useAnimatedReaction(
    () => timerState.value,
    (newState) => {
      scheduleOnRN(setCurrentTimerState, newState);
    },
    []
  );

  // Sync display seconds to React state
  useAnimatedReaction(
    () => Math.ceil(remainingTime.value / 1000),
    (newSeconds) => {
      scheduleOnRN(setDisplaySeconds, newSeconds);
    },
    []
  );

  // Derive the color based on progress
  const progressColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 0.33, 0.66, 1],
      [
        colors.timerDanger,
        colors.timerDanger,
        colors.timerWarning,
        colors.timerActive,
      ]
    );
  });

  // Animated props for the progress circle
  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
      stroke: progressColor.value,
    };
  });

  // Animated style for the seconds text color
  const animatedTextStyle = useAnimatedStyle(() => {
    return { color: progressColor.value };
  });

  // Animated style for opacity based on timer state
  const containerStyle = useAnimatedStyle(() => {
    const isIdle = timerState.value === "idle";
    return { opacity: isIdle ? 0.7 : 1 };
  });

  // Animated style for press scale
  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    displaySeconds,
    currentTimerState,
    scale,
    progressColor,
    animatedCircleProps,
    animatedTextStyle,
    containerStyle,
    pressAnimatedStyle,
    handlePressIn,
    handlePressOut,
  };
}
