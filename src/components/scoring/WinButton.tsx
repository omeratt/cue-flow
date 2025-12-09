/**
 * WinButton - Mark frame/game win for current player
 * Part of GH-008 implementation
 * Updated in GH-021: Added subtle press animation
 *
 * Displays a button to mark the current frame (snooker) or game (8-ball) as won.
 */

import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { GameMode } from "../../lib/constants/game";
import { typography } from "../../lib/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface WinButtonProps {
  readonly onWin: () => void;
  readonly gameMode: GameMode;
  readonly backgroundColor: string;
}

// Smooth, non-bouncy animation config
const PRESS_IN_CONFIG = {
  duration: 80,
  easing: Easing.out(Easing.quad),
};

const PRESS_OUT_CONFIG = {
  duration: 120,
  easing: Easing.out(Easing.quad),
};

export function WinButton({
  onWin,
  gameMode,
  backgroundColor,
}: WinButtonProps) {
  const buttonText = gameMode === "snooker" ? "Frame Win" : "Game Win";
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, PRESS_IN_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, PRESS_OUT_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.button, { backgroundColor }, animatedStyle]}
      onPress={onWin}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={buttonText}
      accessibilityRole="button"
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    letterSpacing: 0.5,
    color: "#ffffff",
  },
});
