/**
 * DurationButton - Animated button for timer duration selection
 * Part of GH-019: Refactor large components
 * Updated in GH-021: Improved to use non-bouncy timing animation
 */

import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../components/providers/ThemeProvider";
import { typography } from "../../lib/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DurationButtonProps {
  readonly duration: number;
  readonly isSelected: boolean;
  readonly onPress: () => void;
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

export function DurationButton({
  duration,
  isSelected,
  onPress,
}: DurationButtonProps) {
  const { theme } = useTheme();
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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        {
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          backgroundColor: isSelected
            ? `${theme.colors.primary}15`
            : theme.colors.surface,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isSelected ? theme.colors.primary : theme.colors.text },
        ]}
      >
        {duration}s
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
  },
});
