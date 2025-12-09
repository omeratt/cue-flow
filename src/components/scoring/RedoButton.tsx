/**
 * RedoButton - Redo last undone scoring action
 * Part of GH-024 (FEAT-001) implementation
 *
 * Displays a redo button that allows redoing the last undone action.
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

interface RedoButtonColors {
  background: string;
  backgroundDisabled: string;
  icon: string;
  iconDisabled: string;
  border: string;
}

interface RedoButtonProps {
  readonly onRedo: () => void;
  readonly canRedo: boolean;
  readonly colors: RedoButtonColors;
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

export function RedoButton({ onRedo, canRedo, colors }: RedoButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    if (!canRedo) return;
    scale.value = withTiming(0.9, PRESS_IN_CONFIG);
    rotation.value = withTiming(15, PRESS_IN_CONFIG); // Opposite direction from undo
  }, [canRedo, scale, rotation]);

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
          backgroundColor: canRedo
            ? colors.background
            : colors.backgroundDisabled,
          borderColor: colors.border,
        },
        animatedStyle,
      ]}
      onPress={onRedo}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!canRedo}
      accessibilityLabel="Redo last action"
      accessibilityRole="button"
      accessibilityState={{ disabled: !canRedo }}
    >
      <FontAwesome6
        name={"rotate-right"}
        size={22}
        color={canRedo ? colors.icon : colors.iconDisabled}
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
