/**
 * CircularTimer - Animated circular timer display
 * Implements GH-005: View animated countdown
 * Refactored in GH-019: Extract animation logic to hook
 *
 * Features:
 * - Circular progress ring that depletes as time passes
 * - Large seconds display in center
 * - Color transitions: green → yellow → red
 * - 60fps animations using Reanimated
 * - Press animation with haptic feedback
 */

import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  SharedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useCircularTimerAnimation } from "../../hooks/useCircularTimerAnimation";
import type { TimerState } from "../../hooks/useGameTimer";
import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

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
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const {
    displaySeconds,
    currentTimerState,
    animatedCircleProps,
    animatedTextStyle,
    containerStyle,
    pressAnimatedStyle,
    handlePressIn,
    handlePressOut,
  } = useCircularTimerAnimation({
    progress,
    remainingTime,
    timerState,
    circumference,
    colors: theme.colors,
    hapticEnabled,
  });

  const handlePress = useCallback(() => onPress?.(), [onPress]);

  const getDisplayText = (): string => {
    if (currentTimerState === "idle") return "TAP";
    if (currentTimerState === "expired") return "0";
    return String(displaySeconds);
  };

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

  const getAccessibilityLabel = (): string => {
    switch (currentTimerState) {
      case "idle":
        return "Timer. Tap to start";
      case "running":
        return `Timer running. ${displaySeconds} seconds remaining. Tap to stop`;
      case "paused":
        return `Timer paused. ${displaySeconds} seconds remaining`;
      case "expired":
        return "Time is up. Tap to reset and switch player";
      default:
        return "Timer";
    }
  };

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
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
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

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityRole="button"
        accessibilityHint="Controls the turn timer"
      >
        {timerContent}
      </Pressable>
    );
  }

  return timerContent;
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  svg: { position: "absolute" },
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
