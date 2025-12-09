/**
 * PlayerIndicator - Shows current player's turn with animated name
 * Extracted from GamePlayScreen for better component organization
 * Updated in GH-021: Improved animation to be smooth and non-bouncy
 */

import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { typography } from "../../lib/theme";

interface PlayerIndicatorProps {
  readonly currentPlayerName: string;
  readonly labelColor: string;
  readonly nameColor: string;
}

// Smooth animation config (non-bouncy as per user preference)
const SCALE_UP_CONFIG = {
  duration: 100,
  easing: Easing.out(Easing.quad),
};

const SCALE_DOWN_CONFIG = {
  duration: 150,
  easing: Easing.out(Easing.quad),
};

const FADE_OUT_CONFIG = {
  duration: 80,
  easing: Easing.out(Easing.quad),
};

const FADE_IN_CONFIG = {
  duration: 120,
  easing: Easing.out(Easing.quad),
};

export function PlayerIndicator({
  currentPlayerName,
  labelColor,
  nameColor,
}: Readonly<PlayerIndicatorProps>) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const previousName = useRef(currentPlayerName);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Animate player name on change with smooth slide
  useEffect(() => {
    if (previousName.current !== currentPlayerName) {
      // Subtle slide down and fade out, then slide up and fade in
      opacity.value = withSequence(
        withTiming(0.5, FADE_OUT_CONFIG),
        withTiming(1, FADE_IN_CONFIG)
      );
      translateY.value = withSequence(
        withTiming(4, FADE_OUT_CONFIG),
        withTiming(0, FADE_IN_CONFIG)
      );
      scale.value = withSequence(
        withTiming(1.08, SCALE_UP_CONFIG),
        withTiming(1, SCALE_DOWN_CONFIG)
      );
      previousName.current = currentPlayerName;
    }
  }, [currentPlayerName, scale, opacity, translateY]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.playerName, { color: nameColor }, animatedStyle]}
      >
        {currentPlayerName}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fonts.regular,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
  },
});
