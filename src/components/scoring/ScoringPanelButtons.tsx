/**
 * ScoringPanelButtons - Action buttons row for scoring panel
 * Part of GH-008, GH-009, GH-010, GH-024 implementation
 *
 * Contains:
 * - Undo button (all modes)
 * - Redo button (all modes) - FEAT-001
 * - Foul button (Snooker only)
 * - Win button (all modes)
 */

import React from "react";
import { StyleSheet, View } from "react-native";

import type { FoulValue, GameMode } from "../../lib/constants/game";
import { FoulButton } from "./FoulButton";
import { RedoButton } from "./RedoButton";
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
  readonly onRedo: () => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly onFoul: (points: FoulValue) => void;
  readonly onWin: () => void;
  readonly colors: ScoringPanelButtonsColors;
  readonly hapticEnabled?: boolean;
}

export function ScoringPanelButtons({
  gameMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onFoul,
  onWin,
  colors,
  hapticEnabled = true,
}: ScoringPanelButtonsProps) {
  const isSnooker = gameMode === "snooker";

  return (
    <View style={styles.actionsRow}>
      {/* Undo/Redo buttons container */}
      <View style={styles.undoRedoContainer}>
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

        {/* Redo button */}
        <RedoButton
          onRedo={onRedo}
          canRedo={canRedo}
          colors={{
            background: colors.surfaceElevated,
            backgroundDisabled: "transparent",
            icon: colors.text,
            iconDisabled: colors.textMuted,
            border: colors.border,
          }}
        />
      </View>

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
  undoRedoContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
