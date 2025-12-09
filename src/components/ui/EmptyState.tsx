/**
 * EmptyState - Shown when there are no rivalries yet
 * Enhanced in GH-025: Fade in with scale animation
 */

import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

// Spring configuration for smooth entrance
const SPRING_CONFIG = {
  damping: 16,
  stiffness: 180,
  mass: 0.8,
};

interface EmptyStateProps {
  readonly icon?: string;
  readonly title: string;
  readonly message: string;
}

export function EmptyState({ icon = "🎱", title, message }: EmptyStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(1, SPRING_CONFIG);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.85, 1]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0, 0.3, 1]);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["theme"]["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
      paddingVertical: 48,
    },
    icon: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    message: {
      fontSize: 16,
      fontFamily: typography.fonts.regular,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
    },
  });
