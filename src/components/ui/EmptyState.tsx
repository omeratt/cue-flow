/**
 * EmptyState - Shown when there are no rivalries yet
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export function EmptyState({ icon = "🎱", title, message }: EmptyStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
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
