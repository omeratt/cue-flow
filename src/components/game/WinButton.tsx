/**
 * WinButton - Mark frame/game win for current player
 * Part of GH-008 implementation
 *
 * Displays a button to mark the current frame (snooker) or game (8-ball) as won.
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import type { GameMode } from "../../lib/constants/game";
import { typography } from "../../lib/theme";

interface WinButtonProps {
  readonly onWin: () => void;
  readonly gameMode: GameMode;
  readonly backgroundColor: string;
}

export function WinButton({
  onWin,
  gameMode,
  backgroundColor,
}: WinButtonProps) {
  const buttonText = gameMode === "snooker" ? "Frame Win" : "Game Win";

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onWin}
      activeOpacity={0.7}
      accessibilityLabel={buttonText}
      accessibilityRole="button"
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    letterSpacing: 0.5,
    color: "#ffffff",
  },
});
