/**
 * UndoButton - Revert last scoring action
 * Part of GH-009, GH-010 implementation
 * Updated in GH-021: Added press animation
 *
 * Displays an undo button that allows reverting the last scoring action.
 */

import { FontAwesome6 } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface UndoButtonColors {
  background: string;
  backgroundDisabled: string;
  icon: string;
  iconDisabled: string;
  border: string;
}

interface UndoButtonProps {
  readonly onUndo: () => void;
  readonly canUndo: boolean;
  readonly colors: UndoButtonColors;
}

// Smooth animation config
const PRESS_IN_CONFIG = {
  duration: 80,
  easing: Easing.out(Easing.quad),
};

const PRESS_OUT_CONFIG = {
  duration: 120,
  easing: Easing.out(Easing.quad),
};

export function UndoButton({ onUndo, canUndo, colors }: UndoButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    if (!canUndo) return;
    scale.value = withTiming(0.9, PRESS_IN_CONFIG);
    rotation.value = withTiming(-15, PRESS_IN_CONFIG);
  }, [canUndo, scale, rotation]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, PRESS_OUT_CONFIG);
    rotation.value = withTiming(0, PRESS_OUT_CONFIG);
  }, [scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          backgroundColor: canUndo
            ? colors.background
            : colors.backgroundDisabled,
          borderColor: colors.border,
        },
        animatedStyle,
      ]}
      onPress={onUndo}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!canUndo}
      accessibilityLabel="Undo last action"
      accessibilityRole="button"
      accessibilityState={{ disabled: !canUndo }}
    >
      <FontAwesome6
        name={"rotate-left"}
        size={22}
        color={canUndo ? colors.icon : colors.iconDisabled}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
