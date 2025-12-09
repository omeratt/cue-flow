/**
 * LoadingState - A reusable loading indicator component
 * Used for screen loading states and async operations
 * Enhanced in GH-025: Fade-in animation
 */

import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

// Spring configuration for smooth fade-in
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.6,
};

interface LoadingStateProps {
  /** Optional message to display below the spinner */
  readonly message?: string;
  /** Size of the activity indicator */
  readonly size?: "small" | "large";
}

export function LoadingState({ message, size = "large" }: LoadingStateProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(1, SPRING_CONFIG);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);
    const scale = interpolate(progress.value, [0, 1], [0.9, 1]);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        animatedStyle,
      ]}
      accessibilityLabel={message ?? "Loading"}
      accessibilityRole="progressbar"
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: typography.fonts.regular,
    textAlign: "center",
  },
});
