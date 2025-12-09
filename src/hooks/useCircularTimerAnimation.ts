/**
 * useCircularTimerAnimation - Hook for circular timer animation logic
 * Implements GH-020: Extract logic from UI components to hooks
 * Enhanced in GH-026: Added pulse, warning, and expired animations
 *
 * Responsibilities:
 * - Color interpolation based on progress
 * - Press animation with scale
 * - Haptic feedback on press
 * - React state sync from UI thread
 * - Pulse animation when running (smooth breathing effect)
 * - Faster pulse when warning (last 5 seconds)
 * - Organic shake + flash when expired
 */

import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TextStyle, ViewStyle } from "react-native";
import {
  AnimatedStyle,
  cancelAnimation,
  Easing,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
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
  readonly pulseStyle: AnimatedStyle<ViewStyle>;
  readonly shakeStyle: AnimatedStyle<ViewStyle>;
  readonly handlePressIn: () => void;
  readonly handlePressOut: () => void;
}

// Animation constants - tuned for smooth, organic motion
const PULSE_DURATION_NORMAL = 1200; // Slightly faster for better rhythm
const PULSE_DURATION_WARNING = 400; // Much faster for urgency
const PULSE_SCALE_MIN = 0.96; // Slightly more noticeable pulse
const WARNING_THRESHOLD_SECONDS = 5; // Last 5 seconds trigger warning pulse

// Shake animation - using timing with easing for controlled shake
const SHAKE_AMPLITUDE = 8;
const SHAKE_DURATION = 60; // Fast shake

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

  // Track if we're in warning mode (last 5 seconds)
  const [isWarningMode, setIsWarningMode] = useState(false);

  // Scale animation for press feedback
  const scale = useSharedValue(1);

  // Pulse animation for running state
  const pulseScale = useSharedValue(1);

  // Shake animation for expired state
  const shakeX = useSharedValue(0);

  // Flash opacity for expired state
  const flashOpacity = useSharedValue(1);

  // Track if shake animation has already played - using SharedValue for UI thread
  const hasPlayedShake = useSharedValue(false);

  // Ref to store timeout for haptic feedback
  const hapticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper function to start pulse animation - now uses withRepeat with reverse
  const startPulseAnimation = useCallback(
    (fast: boolean) => {
      const duration = fast ? PULSE_DURATION_WARNING : PULSE_DURATION_NORMAL;

      // Cancel any existing animation first
      cancelAnimation(pulseScale);

      // Use withRepeat with a single withTiming and reverse: true
      // This creates a smooth, symmetric breathing effect
      pulseScale.value = withRepeat(
        withTiming(PULSE_SCALE_MIN, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.sin), // Sinusoidal for organic breathing
        }),
        -1, // infinite
        true // reverse - this is the key for smooth animation!
      );
    },
    [pulseScale]
  );

  // Handle pulse animation based on timer state and warning mode
  useEffect(() => {
    if (currentTimerState === "running") {
      // 1 second delay to let pressOut animation complete fully
      const timeoutId = setTimeout(() => {
        startPulseAnimation(isWarningMode);
      }, 1000);

      return () => clearTimeout(timeoutId);
    } else {
      // Stop pulse and reset to normal scale smoothly
      cancelAnimation(pulseScale);
      pulseScale.value = withTiming(1, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [currentTimerState, isWarningMode, startPulseAnimation, pulseScale]);

  // Detect warning mode transition (last 5 seconds)
  useEffect(() => {
    const shouldBeWarning =
      displaySeconds <= WARNING_THRESHOLD_SECONDS && displaySeconds > 0;
    if (shouldBeWarning !== isWarningMode) {
      setIsWarningMode(shouldBeWarning);
    }
  }, [displaySeconds, isWarningMode]);

  // Trigger shake animation when timer expires - runs on UI thread
  // Only plays ONCE per expired state - resets when timer goes back to idle/running
  useAnimatedReaction(
    () => timerState.value,
    (state, previousState) => {
      if (
        state === "expired" &&
        previousState !== "expired" &&
        !hasPlayedShake.value
      ) {
        // Mark as played to prevent repeating
        hasPlayedShake.value = true;

        // Controlled shake using withTiming - no spring oscillation!
        shakeX.value = withSequence(
          withTiming(SHAKE_AMPLITUDE, { duration: SHAKE_DURATION }),
          withTiming(-SHAKE_AMPLITUDE, { duration: SHAKE_DURATION }),
          withTiming(SHAKE_AMPLITUDE * 0.7, { duration: SHAKE_DURATION }),
          withTiming(-SHAKE_AMPLITUDE * 0.7, { duration: SHAKE_DURATION }),
          withTiming(SHAKE_AMPLITUDE * 0.4, { duration: SHAKE_DURATION }),
          withTiming(-SHAKE_AMPLITUDE * 0.4, { duration: SHAKE_DURATION }),
          withTiming(0, { duration: SHAKE_DURATION })
        );

        // Flash animation with smooth easing
        flashOpacity.value = withSequence(
          withTiming(0.4, { duration: 80, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 120, easing: Easing.in(Easing.ease) }),
          withTiming(0.4, { duration: 80, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 120, easing: Easing.in(Easing.ease) }),
          withTiming(0.4, { duration: 80, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) })
        );
      } else if (state !== "expired" && previousState === "expired") {
        // Reset the flag when timer transitions FROM expired to another state
        hasPlayedShake.value = false;

        // Reset animations to default state
        cancelAnimation(shakeX);
        cancelAnimation(flashOpacity);
        shakeX.value = 0;
        flashOpacity.value = 1;
      }
    },
    []
  );

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
    return { opacity: isIdle ? 0.7 : flashOpacity.value };
  });

  // Animated style for press scale
  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Animated style for pulse effect on progress ring
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  // Animated style for shake effect on expired
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
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
    pulseStyle,
    shakeStyle,
    handlePressIn,
    handlePressOut,
  };
}
