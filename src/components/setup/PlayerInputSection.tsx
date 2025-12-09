/**
 * PlayerInputSection - Player name input fields for game setup
 * Part of GH-019: Refactor large components
 * Updated in GH-021: Added animated text inputs with focus effects
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";
import { AnimatedTextInput } from "../ui/AnimatedTextInput";

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

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
        Players
      </Text>

      <AnimatedTextInput
        label="Player 1"
        value={player1Name}
        onChangeText={onPlayer1Change}
        placeholder="Enter name"
        returnKeyType="next"
      />

      <AnimatedTextInput
        label="Player 2"
        value={player2Name}
        onChangeText={onPlayer2Change}
        placeholder="Enter name"
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
});
