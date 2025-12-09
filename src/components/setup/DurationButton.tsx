/**
 * DurationButton - Animated button for timer duration selection
 * Part of GH-019: Refactor large components
 */

import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../components/providers/ThemeProvider";
import { typography } from "../../lib/theme";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface DurationButtonProps {
  readonly duration: number;
  readonly isSelected: boolean;
  readonly onPress: () => void;
}

export function DurationButton({
  duration,
  isSelected,
  onPress,
}: DurationButtonProps) {
  const { theme } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1 - pressed.value * 0.05) }],
    };
  });

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      activeOpacity={1}
      style={[
        {
          flex: 1,
          minWidth: "30%",
          paddingVertical: 16,
          paddingHorizontal: 12,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          backgroundColor: isSelected
            ? `${theme.colors.primary}15`
            : theme.colors.surface,
          alignItems: "center",
          marginRight: 8,
          marginBottom: 8,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          fontFamily: typography.fonts.semiBold,
          color: isSelected ? theme.colors.primary : theme.colors.text,
        }}
      >
        {duration}s
      </Text>
    </AnimatedTouchable>
  );
}
