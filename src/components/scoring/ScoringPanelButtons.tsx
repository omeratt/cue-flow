/**
 * ScoringPanelButtons - Action buttons row for scoring panel
 * Part of GH-008, GH-009, GH-010 implementation
 *
 * Contains:
 * - Undo button (all modes)
 * - Foul button (Snooker only)
 * - Win button (all modes)
 */

import React from "react";
import { StyleSheet, View } from "react-native";

import type { FoulValue, GameMode } from "../../lib/constants/game";
import { FoulButton } from "./FoulButton";
import { UndoButton } from "./UndoButton";
import { WinButton } from "./WinButton";

interface ScoringPanelButtonsColors {
  surfaceElevated: string;
  text: string;
  textMuted: string;
  textSecondary: string;
  border: string;
  buttonBackground: string;
  buttonText: string;
  surface: string;
  error: string;
  success: string;
}

interface ScoringPanelButtonsProps {
  readonly gameMode: GameMode;
  readonly onUndo: () => void;
  readonly canUndo: boolean;
  readonly onFoul: (points: FoulValue) => void;
  readonly onWin: () => void;
  readonly colors: ScoringPanelButtonsColors;
  readonly hapticEnabled?: boolean;
}

export function ScoringPanelButtons({
  gameMode,
  onUndo,
  canUndo,
  onFoul,
  onWin,
  colors,
  hapticEnabled = true,
}: ScoringPanelButtonsProps) {
  const isSnooker = gameMode === "snooker";

  return (
    <View style={styles.actionsRow}>
      {/* Undo button */}
      <UndoButton
        onUndo={onUndo}
        canUndo={canUndo}
        colors={{
          background: colors.surfaceElevated,
          backgroundDisabled: "transparent",
          icon: colors.text,
          iconDisabled: colors.textMuted,
          border: colors.border,
        }}
      />

      {/* Foul button (Snooker only) */}
      {isSnooker && (
        <FoulButton
          onFoul={onFoul}
          colors={{
            buttonText: colors.buttonText,
            modalSurface: colors.surface,
            modalText: colors.text,
            modalTextSecondary: colors.textSecondary,
            error: colors.error,
          }}
          hapticEnabled={hapticEnabled}
        />
      )}

      {/* Win frame/game button */}
      <WinButton
        onWin={onWin}
        gameMode={gameMode}
        backgroundColor={colors.success}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
});
