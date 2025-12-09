/**
 * GameModeSection - Section for selecting game mode
 * Extracted from HomeScreen as part of GH-019
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { GameMode } from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { GameModeCard } from "../cards/GameModeCard";
import { useTheme } from "../providers/ThemeProvider";

interface GameModeSectionProps {
  readonly onGameModeSelect: (mode: GameMode) => void;
}

export function GameModeSection({ onGameModeSelect }: GameModeSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
        New Game
      </Text>
      <GameModeCard mode="billiard" onPress={onGameModeSelect} />
      <GameModeCard mode="snooker" onPress={onGameModeSelect} />
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
