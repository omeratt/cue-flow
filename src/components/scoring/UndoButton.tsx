/**
 * UndoButton - Revert last scoring action
 * Part of GH-009, GH-010 implementation
 *
 * Displays an undo button that allows reverting the last scoring action.
 */

import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface UndoButtonColors {
  background: string;
  backgroundDisabled: string;
  icon: string;
  iconDisabled: string;
  border: string;
}

interface UndoButtonProps {
  readonly onUndo: () => void;
  readonly canUndo: boolean;
  readonly colors: UndoButtonColors;
}

export function UndoButton({ onUndo, canUndo, colors }: UndoButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: canUndo
            ? colors.background
            : colors.backgroundDisabled,
          borderColor: colors.border,
        },
      ]}
      onPress={onUndo}
      disabled={!canUndo}
      activeOpacity={0.7}
      accessibilityLabel="Undo last action"
      accessibilityRole="button"
      accessibilityState={{ disabled: !canUndo }}
    >
      <FontAwesome6
        name={"rotate-left"}
        size={22}
        color={canUndo ? colors.icon : colors.iconDisabled}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
