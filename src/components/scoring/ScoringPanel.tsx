/**
 * ScoringPanel - Complete scoring interface for games
 * Implements GH-008, GH-009, GH-010
 *
 * Displays:
 * - Frame scores (snooker mode)
 * - Ball buttons for snooker scoring
 * - Foul button
 * - Win frame button
 * - Undo last action button
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import type {
  FoulValue,
  GameMode,
  SnookerBallType,
} from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { AnimatedScore } from "../ui/AnimatedScore";
import { BallButtonRow } from "./BallButtonRow";
import { ScoringPanelButtons } from "./ScoringPanelButtons";

interface ScoringPanelColors {
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  error: string;
  success: string;
  border: string;
  buttonBackground: string;
  buttonText: string;
}

interface ScoringPanelProps {
  readonly gameMode: GameMode;
  readonly player1Name: string;
  readonly player2Name: string;
  readonly currentPlayer: "player1" | "player2";
  readonly player1FrameScore: number;
  readonly player2FrameScore: number;
  readonly player1SessionWins?: number;
  readonly player2SessionWins?: number;
  readonly onBallPress: (ballType: SnookerBallType, value: number) => void;
  readonly onFoul: (points: FoulValue) => void;
  readonly onWinFrame: () => void;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly colors: ScoringPanelColors;
  readonly hapticEnabled?: boolean;
}

export function ScoringPanel({
  gameMode,
  player1Name,
  player2Name,
  currentPlayer,
  player1FrameScore,
  player2FrameScore,
  player1SessionWins = 0,
  player2SessionWins = 0,
  onBallPress,
  onFoul,
  onWinFrame,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  colors,
  hapticEnabled = true,
}: ScoringPanelProps) {
  const isSnooker = gameMode === "snooker";

  const player1Wins = isSnooker ? player1FrameScore : player1SessionWins;
  const player2Wins = isSnooker ? player2FrameScore : player2SessionWins;

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Snooker Scoring Header */}
      <View style={styles.snookerScoresContainer}>
        {/* Action buttons row */}
        <ScoringPanelButtons
          gameMode={gameMode}
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onFoul={onFoul}
          onWin={onWinFrame}
          colors={{
            surfaceElevated: colors.surfaceElevated,
            text: colors.text,
            textMuted: colors.textMuted,
            textSecondary: colors.textSecondary,
            border: colors.border,
            buttonBackground: colors.buttonBackground,
            buttonText: colors.buttonText,
            surface: colors.surface,
            error: colors.error,
            success: colors.success,
          }}
          hapticEnabled={hapticEnabled}
        />

        <View style={styles.scoreContainer}>
          <View style={[styles.playerScore]}>
            <Text
              style={[styles.playerName, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {player1Name}
            </Text>
            <AnimatedScore
              value={player1Wins}
              style={[styles.score, { color: colors.primary }]}
            />
          </View>

          <View style={styles.divider}>
            <Text style={[styles.vs, { color: colors.textSecondary }]}>—</Text>
          </View>

          <View style={[styles.playerScore]}>
            <Text
              style={[styles.playerName, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {player2Name}
            </Text>
            <AnimatedScore
              value={player2Wins}
              style={[styles.score, { color: colors.primary }]}
            />
          </View>
        </View>
      </View>

      {/* Ball buttons (Snooker only) */}
      {isSnooker && (
        <BallButtonRow
          onBallPress={onBallPress}
          hapticEnabled={hapticEnabled}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
    // Subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  // New snooker vertical layout styles
  snookerScoresContainer: {
    alignItems: "center",
    gap: 6,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    width: "100%",
    justifyContent: "space-around",
  },
  playerScore: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerName: {
    fontSize: 32,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    marginBottom: 4,
  },
  score: {
    fontSize: 42,
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
