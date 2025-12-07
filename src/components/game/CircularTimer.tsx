/**
 * CircularTimer - Animated circular timer display
 * Implements GH-005: View animated countdown
 *
 * Features:
 * - Circular progress ring that depletes as time passes
 * - Large seconds display in center
 * - Color transitions: green → yellow → red
 * - 60fps animations using Reanimated
 */

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";

import type { TimerState } from "../../hooks/useGameTimer";
import { useTheme } from "../providers/ThemeProvider";

// Create animated Circle component
const AnimatedCircle = createAnimatedComponent(Circle);

interface CircularTimerProps {
  readonly size: number;
  readonly strokeWidth?: number;
  readonly progress: SharedValue<number>;
  readonly remainingTime: SharedValue<number>;
  readonly timerState: SharedValue<TimerState>;
}

export function CircularTimer({
  size,
  strokeWidth = 12,
  progress,
  remainingTime,
  timerState,
}: Readonly<CircularTimerProps>) {
  const { theme } = useTheme();

  // React state for text display (updated from UI thread)
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [currentTimerState, setCurrentTimerState] =
    useState<TimerState>("idle");

  // Calculate circle dimensions
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

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

  return (
    <Animated.View
      style={[styles.container, { width: size, height: size }, containerStyle]}
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
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 4,
  },
});
