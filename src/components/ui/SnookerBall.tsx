/**
 * SnookerBall - A versatile snooker/pool ball component
 *
 * Can be used as:
 * - A decorative icon (default)
 * - A pressable button (with onPress prop)
 *
 * Supports:
 * - All snooker balls (red, yellow, green, brown, blue, pink, black)
 * - Pool 8-ball
 * - Custom sizes (small, medium, large, or custom number)
 * - Custom colors
 */

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { typography } from "../../lib/theme";

// Preset ball configurations
const BALL_PRESETS = {
  // Snooker balls
  red: { color: "#E74C3C", value: 1, darkColor: "#9B2C2C" },
  yellow: { color: "#F1C40F", value: 2, darkColor: "#B7950B" },
  green: { color: "#27AE60", value: 3, darkColor: "#1D7A43" },
  brown: { color: "#8B4513", value: 4, darkColor: "#5D2E0C" },
  blue: { color: "#3498DB", value: 5, darkColor: "#2471A3" },
  pink: { color: "#E91E63", value: 6, darkColor: "#AD1457" },
  black: { color: "#2C3E50", value: 7, darkColor: "#1A252F" },
  // Pool balls
  "8ball": { color: "#1a1a1a", value: 8, darkColor: "#000000" },
  // Cue ball
  cue: { color: "#F5F5F5", value: null, darkColor: "#D0D0D0" },
} as const;

export type BallPreset = keyof typeof BALL_PRESETS;
export type BallSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

const SIZE_MAP: Record<Exclude<BallSize, number>, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80,
};

interface SnookerBallProps {
  /** Ball preset (red, yellow, green, brown, blue, pink, black, 8ball, cue) */
  readonly preset?: BallPreset;
  /** Custom color (overrides preset) */
  readonly color?: string;
  /** Custom dark color for shadow (auto-generated if not provided) */
  readonly darkColor?: string;
  /** Value to display on the ball (overrides preset) */
  readonly value?: number | string | null;
  /** Size of the ball */
  readonly size?: BallSize;
  /** Whether to show the value on the ball */
  readonly showValue?: boolean;
  /** Press handler - if provided, ball becomes pressable with animation */
  readonly onPress?: () => void;
  /** Whether haptic feedback is enabled (only for pressable) */
  readonly hapticEnabled?: boolean;
  /** Whether the ball is disabled */
  readonly disabled?: boolean;
  /** Additional styles */
  readonly style?: ViewStyle;
}

// Auto-generate darker shade if not provided
const generateDarkColor = (color: string): string => {
  // Simple darkening - reduce each RGB channel
  const hex = color.replace("#", "");
  const r = Math.max(0, Number.parseInt(hex.slice(0, 2), 16) - 40);
  const g = Math.max(0, Number.parseInt(hex.slice(2, 4), 16) - 40);
  const b = Math.max(0, Number.parseInt(hex.slice(4, 6), 16) - 40);
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export function SnookerBall({
  preset = "8ball",
  color,
  darkColor,
  value,
  size = "md",
  showValue = true,
  onPress,
  hapticEnabled = true,
  disabled = false,
  style,
}: SnookerBallProps) {
  const presetConfig = BALL_PRESETS[preset];
  const ballColor = color || presetConfig.color;
  const ballDarkColor =
    darkColor || (color ? generateDarkColor(color) : presetConfig.darkColor);
  const displayValue = value !== undefined ? value : presetConfig.value;

  const ballSize = typeof size === "number" ? size : SIZE_MAP[size];
  const scale = useSharedValue(1);

  const isPressable = !!onPress;

  const handlePressIn = useCallback(() => {
    if (disabled || !isPressable) return;
    scale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 400,
    });
  }, [disabled, isPressable, scale]);

  const handlePressOut = useCallback(() => {
    if (disabled || !isPressable) return;
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 300,
    });
  }, [disabled, isPressable, scale]);

  const handlePress = useCallback(() => {
    if (disabled || !onPress) return;
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [disabled, hapticEnabled, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Determine text color based on ball color for contrast
  const isLightBall =
    preset === "yellow" ||
    preset === "green" ||
    preset === "cue" ||
    (color && isLightColor(color));
  const textColor = isLightBall ? "#1a1a1a" : "#ffffff";

  // Calculate font size based on ball size
  const fontSize = Math.max(10, Math.round(ballSize * 0.4));

  // Specular highlight size proportional to ball
  const specularWidth = Math.max(4, Math.round(ballSize * 0.25));
  const specularHeight = Math.max(2, Math.round(ballSize * 0.125));
  const specularTop = Math.max(2, Math.round(ballSize * 0.15));
  const specularLeft = Math.max(4, Math.round(ballSize * 0.25));

  const ballContent = (
    <View
      style={[
        styles.ball,
        {
          width: ballSize,
          height: ballSize,
          borderRadius: ballSize / 2,
          backgroundColor: ballColor,
        },
      ]}
    >
      {/* Subtle bottom shadow for 3D depth */}
      <LinearGradient
        colors={["transparent", `${ballDarkColor}60`]}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.bottomShadow,
          {
            borderBottomLeftRadius: ballSize / 2,
            borderBottomRightRadius: ballSize / 2,
          },
        ]}
      />

      {/* Top shine - soft gradient */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.35)",
          "rgba(255,255,255,0.05)",
          "transparent",
        ]}
        locations={[0, 0.4, 0.7]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.topShine,
          {
            borderTopLeftRadius: ballSize / 2,
            borderTopRightRadius: ballSize / 2,
          },
        ]}
      />

      {/* Small specular highlight */}
      <View
        style={[
          styles.specularHighlight,
          {
            top: specularTop,
            left: specularLeft,
            width: specularWidth,
            height: specularHeight,
            borderRadius: specularHeight,
          },
        ]}
      />

      {/* Ball value text */}
      {showValue && displayValue !== null && (
        <Text
          style={[
            styles.value,
            {
              color: textColor,
              fontSize,
            },
          ]}
        >
          {displayValue}
        </Text>
      )}
    </View>
  );

  if (isPressable) {
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

    // Generate accessibility label
    let ballName = `${preset} ball`;
    if (preset === "8ball") {
      ballName = "8-ball";
    } else if (preset === "cue") {
      ballName = "cue ball";
    }

    let accessibilityLabel = ballName;
    if (displayValue !== null) {
      const pointsText = displayValue === 1 ? "point" : "points";
      accessibilityLabel = `${ballName}, ${displayValue} ${pointsText}`;
    }

    return (
      <AnimatedPressable
        style={[
          styles.wrapper,
          { width: ballSize, height: ballSize },
          disabled && styles.disabled,
          animatedStyle,
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityHint={
          disabled ? "Ball is disabled" : "Adds points to current player"
        }
        accessibilityState={{ disabled }}
      >
        {ballContent}
      </AnimatedPressable>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        { width: ballSize, height: ballSize },
        disabled && styles.disabled,
        style,
      ]}
    >
      {ballContent}
    </View>
  );
}

// Helper to check if a color is light
function isLightColor(color: string): boolean {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    // Subtle drop shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  bottomShadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  topShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "65%",
  },
  specularHighlight: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    transform: [{ rotate: "-25deg" }],
  },
  disabled: {
    opacity: 0.35,
  },
  value: {
    fontWeight: "800",
    fontFamily: typography.fonts.bold,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
