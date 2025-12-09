/**
 * PlayerInputSection - Player name input fields for game setup
 * Part of GH-019: Refactor large components
 */

import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../../components/providers/ThemeProvider";
import { typography } from "../../lib/theme";

interface PlayerInputSectionProps {
  readonly player1Name: string;
  readonly player2Name: string;
  readonly onPlayer1Change: (name: string) => void;
  readonly onPlayer2Change: (name: string) => void;
}

export function PlayerInputSection({
  player1Name,
  player2Name,
  onPlayer1Change,
  onPlayer2Change,
}: PlayerInputSectionProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Players</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Player 1</Text>
        <TextInput
          style={styles.input}
          value={player1Name}
          onChangeText={onPlayer1Change}
          placeholder="Enter name"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Player 2</Text>
        <TextInput
          style={styles.input}
          value={player2Name}
          onChangeText={onPlayer2Change}
          placeholder="Enter name"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="words"
          returnKeyType="done"
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["theme"]["colors"]) =>
  StyleSheet.create({
    section: { marginBottom: 32 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 16,
    },
    inputContainer: { marginBottom: 16 },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      fontFamily: typography.fonts.medium,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      fontFamily: typography.fonts.regular,
      color: colors.text,
    },
  });
