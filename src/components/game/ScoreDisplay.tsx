/**
 * ScoreDisplay - Shows current score for both players
 * Extracted from GamePlayScreen for better component organization
 * TODO: Connect to scoreSlice in Phase 3
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { typography } from "../../lib/theme";

interface ScoreDisplayColors {
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

interface ScoreDisplayProps {
  readonly player1Name: string;
  readonly player2Name: string;
  readonly player1Wins?: number;
  readonly player2Wins?: number;
  readonly colors: ScoreDisplayColors;
}

export function ScoreDisplay({
  player1Name,
  player2Name,
  player1Wins = 0,
  player2Wins = 0,
  colors,
}: Readonly<ScoreDisplayProps>) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.playerScore}>
        <Text
          style={[styles.playerName, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {player1Name}
        </Text>
        <Text style={[styles.score, { color: colors.text }]}>
          {player1Wins}
        </Text>
      </View>

      <View style={styles.divider}>
        <Text style={[styles.vs, { color: colors.textSecondary }]}>—</Text>
      </View>

      <View style={styles.playerScore}>
        <Text
          style={[styles.playerName, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {player2Name}
        </Text>
        <Text style={[styles.score, { color: colors.text }]}>
          {player2Wins}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  playerScore: {
    flex: 1,
    alignItems: "center",
  },
  playerName: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    marginBottom: 4,
  },
  score: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
  },
  divider: {
    paddingHorizontal: 16,
  },
  vs: {
    fontSize: 20,
    fontFamily: typography.fonts.regular,
  },
});
