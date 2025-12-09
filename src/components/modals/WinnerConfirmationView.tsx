/**
 * WinnerConfirmationView - Confirmation view for winner modal
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

interface WinnerConfirmationViewProps {
  readonly winnerName: string;
  readonly frameLabel: string;
  readonly colors: WinnerModalColors;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function WinnerConfirmationView({
  winnerName,
  frameLabel,
  colors,
  onConfirm,
  onCancel,
}: WinnerConfirmationViewProps) {
  return (
    <>
      <Text style={[styles.modalTitle, { color: colors.modalText }]}>
        Confirm Winner
      </Text>
      <Text
        style={[styles.confirmationText, { color: colors.modalTextSecondary }]}
      >
        Award the {frameLabel.toLowerCase()} to{" "}
        <Text
          style={{
            color: colors.primary,
            fontWeight: "700",
            fontFamily: typography.fonts.bold,
          }}
        >
          {winnerName}
        </Text>
        ?
      </Text>

      <View style={styles.confirmationButtons}>
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: colors.success }]}
          onPress={onConfirm}
          activeOpacity={0.7}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.undoButton, { borderColor: colors.border }]}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.undoButtonText,
              { color: colors.modalTextSecondary },
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
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
  confirmationText: {
    fontSize: 16,
    fontFamily: typography.fonts.regular,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  confirmationButtons: {
    width: "100%",
    gap: 12,
  },
  confirmButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    color: "#ffffff",
  },
  undoButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  undoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
  },
});
