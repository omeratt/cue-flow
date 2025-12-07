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

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type {
  FoulValue,
  GameMode,
  SnookerBallType,
} from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { BallButtonRow } from "./BallButtonRow";
import { FoulButton } from "./FoulButton";

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
  readonly canUndo: boolean;
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
  canUndo,
  colors,
  hapticEnabled = true,
}: ScoringPanelProps) {
  const isSnooker = gameMode === "snooker";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Snooker Scoring Header */}
      {isSnooker && (
        <View style={styles.snookerScoresContainer}>
          {/* Frames Won - smaller, on top */}
          <View style={styles.framesWonRow}>
            <Text
              style={[styles.framesWonLabel, { color: colors.textSecondary }]}
            >
              {player1Name}
            </Text>
            <View style={styles.framesWonScoreContainer}>
              <Text style={[styles.framesWonValue, { color: colors.text }]}>
                {player1SessionWins}
              </Text>
              <Text
                style={[
                  styles.framesWonDivider,
                  { color: colors.textSecondary },
                ]}
              >
                –
              </Text>
              <Text style={[styles.framesWonValue, { color: colors.text }]}>
                {player2SessionWins}
              </Text>
            </View>
            <Text
              style={[styles.framesWonLabel, { color: colors.textSecondary }]}
            >
              {player2Name}
            </Text>
          </View>

          <Text
            style={[styles.framesWonSubtitle, { color: colors.textSecondary }]}
          >
            Frames
          </Text>

          {/* Current Frame Score - larger, prominent */}
          <View style={styles.currentFrameRow}>
            <Text style={[styles.currentFrameValue, { color: colors.primary }]}>
              {player1FrameScore}
            </Text>
            <Text
              style={[
                styles.currentFrameDivider,
                { color: colors.textSecondary },
              ]}
            >
              —
            </Text>
            <Text style={[styles.currentFrameValue, { color: colors.primary }]}>
              {player2FrameScore}
            </Text>
          </View>
        </View>
      )}

      {/* Ball buttons (Snooker only) */}
      {isSnooker && (
        <BallButtonRow
          onBallPress={onBallPress}
          hapticEnabled={hapticEnabled}
        />
      )}

      {/* Action buttons row */}
      <View style={styles.actionsRow}>
        {/* Undo button - icon only for cleaner look */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.undoButton,
            {
              backgroundColor: canUndo ? colors.surfaceElevated : "transparent",
              borderColor: colors.border,
            },
          ]}
          onPress={onUndo}
          disabled={!canUndo}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-undo"
            size={18}
            color={canUndo ? colors.text : colors.textMuted}
          />
        </TouchableOpacity>

        {/* Foul button (Snooker only) */}
        {isSnooker && (
          <FoulButton
            onFoul={onFoul}
            colors={{
              buttonBackground: colors.buttonBackground,
              buttonText: colors.buttonText,
              modalBackground: "rgba(0, 0, 0, 0.6)",
              modalSurface: colors.surface,
              modalText: colors.text,
              modalTextSecondary: colors.textSecondary,
              error: colors.error,
            }}
            hapticEnabled={hapticEnabled}
          />
        )}

        {/* Win frame/game button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.winButton,
            { backgroundColor: colors.success },
          ]}
          onPress={onWinFrame}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, { color: "#ffffff" }]}>
            {isSnooker ? "Frame Win" : "Game Win"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    gap: 2,
  },
  framesWonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  framesWonLabel: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    minWidth: 60,
    textAlign: "center",
  },
  framesWonScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  framesWonValue: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
  },
  framesWonDivider: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
  },
  framesWonSubtitle: {
    fontSize: 9,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  currentFrameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  currentFrameValue: {
    fontSize: 46,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
  },
  currentFrameDivider: {
    fontSize: 24,
    fontFamily: typography.fonts.regular,
  },
  currentFrameLabel: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  // Legacy styles (kept for compatibility)
  scoresHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionWinsContainer: {
    flex: 1,
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  undoButton: {
    borderWidth: 1.5,
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  winButton: {
    minWidth: 100,
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    letterSpacing: 0.5,
  },
});
