/**
 * WinnerSelectionView - Player selection view for winner modal
 * Part of GH-019: Refactor large components
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { typography } from "../../lib/theme";

interface WinnerModalColors {
  modalText: string;
  modalTextSecondary: string;
  success: string;
  primary: string;
  border: string;
}

interface WinnerSelectionViewProps {
  readonly player1Name: string;
  readonly player2Name: string;
  readonly player1Score: number;
  readonly player2Score: number;
  readonly frameLabel: string;
  readonly colors: WinnerModalColors;
  readonly onSelectPlayer: (player: "player1" | "player2") => void;
  readonly onClose: () => void;
}

const ScoreColumn = ({
  name,
  score,
  colors,
}: {
  name: string;
  score: number;
  colors: WinnerModalColors;
}) => (
  <View style={styles.scoreColumn}>
    <Text style={[styles.scoreName, { color: colors.modalTextSecondary }]}>
      {name}
    </Text>
    <Text style={[styles.scoreValue, { color: colors.primary }]}>{score}</Text>
  </View>
);

const PlayerButton = ({
  name,
  onPress,
  colors,
}: {
  name: string;
  onPress: () => void;
  colors: WinnerModalColors;
}) => (
  <TouchableOpacity
    style={[styles.playerButton, { backgroundColor: colors.success }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.playerButtonText}>{name}</Text>
    <Text style={styles.playerButtonSubtext}>Wins</Text>
  </TouchableOpacity>
);

export function WinnerSelectionView({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  frameLabel,
  colors,
  onSelectPlayer,
  onClose,
}: WinnerSelectionViewProps) {
  return (
    <>
      <Text style={[styles.modalTitle, { color: colors.modalText }]}>
        Who Won the {frameLabel}?
      </Text>
      <View style={styles.scoresContainer}>
        <ScoreColumn name={player1Name} score={player1Score} colors={colors} />
        <Text
          style={[styles.scoreDivider, { color: colors.modalTextSecondary }]}
        >
          —
        </Text>
        <ScoreColumn name={player2Name} score={player2Score} colors={colors} />
      </View>
      <View style={styles.buttonsContainer}>
        <PlayerButton
          name={player1Name}
          onPress={() => onSelectPlayer("player1")}
          colors={colors}
        />
        <PlayerButton
          name={player2Name}
          onPress={() => onSelectPlayer("player2")}
          colors={colors}
        />
      </View>
      <TouchableOpacity
        style={[styles.cancelButton, { borderColor: colors.border }]}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.cancelButtonText,
            { color: colors.modalTextSecondary },
          ]}
        >
          Cancel
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    marginBottom: 16,
    textAlign: "center",
  },
  scoresContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    width: "100%",
  },
  scoreColumn: { flex: 1, alignItems: "center" },
  scoreName: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
  },
  scoreDivider: {
    fontSize: 20,
    fontFamily: typography.fonts.regular,
    marginHorizontal: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    width: "100%",
  },
  playerButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  playerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    color: "#ffffff",
    marginBottom: 2,
  },
  playerButtonSubtext: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
    color: "rgba(255, 255, 255, 0.8)",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
  },
});
