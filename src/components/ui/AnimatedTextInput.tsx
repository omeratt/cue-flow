/**
 * AnimatedTextInput - Text input with focus border animation
 * Part of GH-021: Add micro-interaction animations
 *
 * Features:
 * - Smooth border color animation on focus
 * - Subtle scale effect on focus
 */

import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../../components/providers/ThemeProvider";
import { typography } from "../../lib/theme";

const AnimatedView = Animated.createAnimatedComponent(View);

interface AnimatedTextInputProps extends Omit<TextInputProps, "style"> {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (text: string) => void;
}

// Smooth animation config
const FOCUS_CONFIG = {
  duration: 150,
  easing: Easing.out(Easing.quad),
};

export function AnimatedTextInput({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}: AnimatedTextInputProps) {
  const { theme } = useTheme();
  const focusProgress = useSharedValue(0);

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) => {
      focusProgress.value = withTiming(1, FOCUS_CONFIG);
      onFocus?.(e);
    },
    [focusProgress, onFocus]
  );

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<TextInputProps["onBlur"]>>[0]) => {
      focusProgress.value = withTiming(0, FOCUS_CONFIG);
      onBlur?.(e);
    },
    [focusProgress, onBlur]
  );

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [theme.colors.border, theme.colors.primary]
    );

    return {
      borderColor,
      borderWidth: 1 + focusProgress.value * 0.5,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <AnimatedView
        style={[
          styles.inputWrapper,
          { backgroundColor: theme.colors.surface },
          animatedContainerStyle,
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="words"
          {...props}
        />
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: typography.fonts.regular,
  },
});
