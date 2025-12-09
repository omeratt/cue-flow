/**
 * AnimatedListItem - Wrapper for list items with staggered entrance animation
 * GH-025: Screen transition animations
 *
 * Features:
 * - Fade in with slide from bottom
 * - Staggered delay based on index
 * - Spring-based animation
 */

import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

// Spring configuration for natural movement
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.6,
};

// Stagger delay per item (ms)
const STAGGER_DELAY = 50;
// Maximum stagger delay (prevents very long delays for many items)
const MAX_STAGGER_DELAY = 400;

interface AnimatedListItemProps {
  readonly children: React.ReactNode;
  readonly index: number;
  readonly style?: ViewStyle;
}

export function AnimatedListItem({
  children,
  index,
  style,
}: AnimatedListItemProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Calculate stagger delay with a cap
    const delay = Math.min(index * STAGGER_DELAY, MAX_STAGGER_DELAY);
    progress.value = withDelay(delay, withSpring(1, SPRING_CONFIG));
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [30, 0]);
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);
    const scale = interpolate(progress.value, [0, 1], [0.95, 1]);

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
}
