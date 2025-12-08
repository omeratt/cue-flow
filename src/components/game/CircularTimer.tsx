/**
 * CircularTimer - Animated circular timer display
 * Implements GH-005: View animated countdown
 *
 * Features:
 * - Circular progress ring that depletes as time passes
 * - Large seconds display in center
 * - Color transitions: green → yellow → red
 * - 60fps animations using Reanimated
 * - Press animation with haptic feedback
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";

import type { TimerState } from "../../hooks/useGameTimer";
import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

// Create animated Circle component
const AnimatedCircle = createAnimatedComponent(Circle);

interface CircularTimerProps {
  readonly size: number;
  readonly strokeWidth?: number;
  readonly progress: SharedValue<number>;
  readonly remainingTime: SharedValue<number>;
  readonly timerState: SharedValue<TimerState>;
  readonly onPress?: () => void;
  readonly hapticEnabled?: boolean;
}

export function CircularTimer({
  size,
  strokeWidth = 12,
  progress,
  remainingTime,
  timerState,
  onPress,
  hapticEnabled = true,
}: Readonly<CircularTimerProps>) {
  const { theme } = useTheme();

  // React state for text display (updated from UI thread)
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [currentTimerState, setCurrentTimerState] =
    useState<TimerState>("idle");

  // Scale animation for press feedback
  const scale = useSharedValue(1);

  // Calculate circle dimensions
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let timer;
  // Press handlers for animation
  const handlePressIn = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    scale.value = withSpring(0.95, {
      damping: 25,
      stiffness: 400,
    });
  }, [hapticEnabled, scale]);

  const handlePressOut = useCallback(() => {
    if (hapticEnabled) {
      clearTimeout(timer);

      setTimeout(async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid).finally(() =>
          clearTimeout(timer)
        );
      }, 90);
    }

    scale.value = withSpring(1, {
      damping: 25,
      stiffness: 300,
    });
  }, [hapticEnabled, scale, timer]);

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

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
  const timerActive = theme.colors.timerActive;
  const timerWarning = theme.colors.timerWarning;
  const timerDanger = theme.colors.timerDanger;

  const progressColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 0.33, 0.66, 1],
      [timerDanger, timerDanger, timerWarning, timerActive]
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
    return {
      color: progressColor.value,
    };
  });

  // Animated style for opacity based on timer state
  const containerStyle = useAnimatedStyle(() => {
    const isIdle = timerState.value === "idle";
    return {
      opacity: isIdle ? 0.7 : 1,
    };
  });

  // Animated style for press scale
  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Get display text based on timer state
  const getDisplayText = (): string => {
    if (currentTimerState === "idle") {
      return "TAP";
    }
    if (currentTimerState === "expired") {
      return "0";
    }
    return String(displaySeconds);
  };

  // Get subtitle text based on timer state
  const getSubtitleText = (): string => {
    switch (currentTimerState) {
      case "idle":
        return "to start";
      case "paused":
        return "paused";
      case "expired":
        return "time up!";
      default:
        return "seconds";
    }
  };

  const subtitleColor =
    currentTimerState === "idle" || currentTimerState === "paused"
      ? theme.colors.textSecondary
      : theme.colors.textMuted;

  const timerContent = (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size },
        containerStyle,
        pressAnimatedStyle,
      ]}
    >
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle (track) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress circle (animated) */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          // Rotate to start from top
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        <Animated.Text style={[styles.secondsText, animatedTextStyle]}>
          {getDisplayText()}
        </Animated.Text>
        <Text style={[styles.subtitleText, { color: subtitleColor }]}>
          {getSubtitleText()}
        </Text>
      </View>
    </Animated.View>
  );

  // If onPress is provided, wrap in Pressable
  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {timerContent}
      </Pressable>
    );
  }

  return timerContent;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  centerContent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  secondsText: {
    fontSize: 72,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    marginTop: 4,
  },
});
