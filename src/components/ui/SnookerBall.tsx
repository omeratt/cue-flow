/**
 * SnookerBall - A versatile snooker/pool ball component
 *
 * Can be used as:
 * - A decorative icon (default)
 * - A pressable button (with onPress prop)
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { useSnookerBallAnimation } from "../../hooks/useSnookerBallAnimation";
import {
  BALL_PRESETS,
  type BallPreset,
  type BallSize,
  getBallAccessibilityLabel,
  getBallColors,
  getBallDimensions,
} from "../../lib/constants/ball";
import { typography } from "../../lib/theme";

export { type BallPreset, type BallSize } from "../../lib/constants/ball";

interface SnookerBallProps {
  readonly preset?: BallPreset;
  readonly color?: string;
  readonly darkColor?: string;
  readonly value?: number | string | null;
  readonly size?: BallSize;
  readonly showValue?: boolean;
  readonly onPress?: () => void;
  readonly hapticEnabled?: boolean;
  readonly disabled?: boolean;
  readonly style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const isPressable = !!onPress;
  const presetConfig = BALL_PRESETS[preset];
  const displayValue = value === undefined ? presetConfig.value : value;

  const { ballColor, ballDarkColor, textColor } = getBallColors(
    preset,
    color,
    darkColor
  );
  const dimensions = getBallDimensions(size);
  const { animatedStyle, handlePressIn, handlePressOut, handlePress } =
    useSnookerBallAnimation({ disabled, isPressable, hapticEnabled, onPress });

  const ballContent = (
    <View
      style={[
        styles.ball,
        {
          width: dimensions.ballSize,
          height: dimensions.ballSize,
          borderRadius: dimensions.ballSize / 2,
          backgroundColor: ballColor,
        },
      ]}
    >
      <LinearGradient
        colors={["transparent", `${ballDarkColor}60`]}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.bottomShadow,
          {
            borderBottomLeftRadius: dimensions.ballSize / 2,
            borderBottomRightRadius: dimensions.ballSize / 2,
          },
        ]}
      />
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
            borderTopLeftRadius: dimensions.ballSize / 2,
            borderTopRightRadius: dimensions.ballSize / 2,
          },
        ]}
      />
      <View
        style={[
          styles.specularHighlight,
          {
            top: dimensions.specularTop,
            left: dimensions.specularLeft,
            width: dimensions.specularWidth,
            height: dimensions.specularHeight,
            borderRadius: dimensions.specularHeight,
          },
        ]}
      />
      {showValue && displayValue !== null && (
        <Text
          style={[
            styles.value,
            { color: textColor, fontSize: dimensions.fontSize },
          ]}
        >
          {displayValue}
        </Text>
      )}
    </View>
  );

  const wrapperStyle = [
    styles.wrapper,
    { width: dimensions.ballSize, height: dimensions.ballSize },
    disabled && styles.disabled,
    style,
  ];

  if (!isPressable) {
    return <View style={wrapperStyle}>{ballContent}</View>;
  }

  return (
    <AnimatedPressable
      style={[wrapperStyle, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={getBallAccessibilityLabel(preset, displayValue)}
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

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  ball: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
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
