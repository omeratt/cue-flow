/**
 * StartButton - Start game button for game setup
 * Part of GH-019: Refactor large components
 * Updated in GH-021: Added press animation
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StartButtonProps {
  readonly isValid: boolean;
  readonly onPress: () => void;
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

export function StartButton({ isValid, onPress }: StartButtonProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!isValid) return;
    scale.value = withTiming(0.97, PRESS_IN_CONFIG);
  }, [isValid, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, PRESS_OUT_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.divider,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <AnimatedPressable
        style={[
          styles.startButton,
          { backgroundColor: theme.colors.primary },
          !isValid && styles.startButtonDisabled,
          animatedStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isValid}
      >
        <Text
          style={[styles.startButtonText, { color: theme.colors.buttonText }]}
        >
          Start Game
        </Text>
        <Ionicons name="play" size={20} color={theme.colors.buttonText} />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  startButtonDisabled: { opacity: 0.5 },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
    marginRight: 8,
  },
});
