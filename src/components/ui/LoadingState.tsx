/**
 * LoadingState - A reusable loading indicator component
 * Used for screen loading states and async operations
 */

import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

interface LoadingStateProps {
  /** Optional message to display below the spinner */
  readonly message?: string;
  /** Size of the activity indicator */
  readonly size?: "small" | "large";
}

export function LoadingState({
  message,
  size = "large",
}: LoadingStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      accessibilityLabel={message ?? "Loading"}
      accessibilityRole="progressbar"
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
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
