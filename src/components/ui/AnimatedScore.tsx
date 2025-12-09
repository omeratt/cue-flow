/**
 * AnimatedScore - Animated score display with smooth number transitions
 * Part of GH-021: Add micro-interaction animations
 *
 * Features:
 * - Subtle scale pulse on change
 * - Smooth transform animation
 */

import React, { useEffect } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface AnimatedScoreProps {
  readonly value: number;
  readonly style?: StyleProp<TextStyle>;
}

// Smooth, non-bouncy animation configs
const SCALE_UP_CONFIG = {
  duration: 80,
  easing: Easing.out(Easing.quad),
};

const SCALE_DOWN_CONFIG = {
  duration: 120,
  easing: Easing.out(Easing.quad),
};

export function AnimatedScore({ value, style }: AnimatedScoreProps) {
  const scale = useSharedValue(1);

  // Animate scale on value change
  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, SCALE_UP_CONFIG),
      withTiming(1, SCALE_DOWN_CONFIG)
    );
  }, [value, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={style}>{value}</Text>
    </Animated.View>
  );
}
