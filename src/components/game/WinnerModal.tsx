/**
 * WinnerModal - Modal for marking game/frame winner
 * Implements GH-008: Mark game winner
 *
 * Acceptance Criteria:
 * - Two buttons to mark Player 1 or Player 2 as winner
 * - Win count increments for selected player
 * - Current win counts displayed on game screen
 * - Confirmation or undo option for accidental taps
 * - Win is saved to rivalry history
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { typography } from "../../lib/theme";

interface WinnerModalColors {
  modalBackground: string;
  modalSurface: string;
  modalText: string;
  modalTextSecondary: string;
  success: string;
  primary: string;
  border: string;
}

interface WinnerModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSelectWinner: (winner: "player1" | "player2") => void;
  readonly player1Name: string;
  readonly player2Name: string;
  readonly player1Score?: number;
  readonly player2Score?: number;
  readonly frameLabel?: string;
  readonly colors: WinnerModalColors;
  readonly hapticEnabled?: boolean;
}

export function WinnerModal({
  visible,
  onClose,
  onSelectWinner,
  player1Name,
  player2Name,
  player1Score = 0,
  player2Score = 0,
  frameLabel = "Frame",
  colors,
  hapticEnabled = true,
}: WinnerModalProps) {
  const [selectedWinner, setSelectedWinner] = useState<
    "player1" | "player2" | null
  >(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelectPlayer = useCallback(
    (player: "player1" | "player2") => {
      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      setSelectedWinner(player);
      setShowConfirmation(true);
    },
    [hapticEnabled]
  );

  const handleConfirm = useCallback(() => {
    if (selectedWinner) {
      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSelectWinner(selectedWinner);
      setSelectedWinner(null);
      setShowConfirmation(false);
    }
  }, [selectedWinner, onSelectWinner, hapticEnabled]);

  const handleCancel = useCallback(() => {
    setSelectedWinner(null);
    setShowConfirmation(false);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedWinner(null);
    setShowConfirmation(false);
    onClose();
  }, [onClose]);

  const winnerName = selectedWinner === "player1" ? player1Name : player2Name;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable
          style={[
            styles.modalContent,
            { backgroundColor: colors.modalSurface },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {showConfirmation ? (
            // Confirmation view
            <>
              <Text style={[styles.modalTitle, { color: colors.modalText }]}>
                Confirm Winner
              </Text>
              <Text
                style={[
                  styles.confirmationText,
                  { color: colors.modalTextSecondary },
                ]}
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
                  style={[
                    styles.confirmButton,
                    { backgroundColor: colors.success },
                  ]}
                  onPress={handleConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.undoButton, { borderColor: colors.border }]}
                  onPress={handleCancel}
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
          ) : (
            // Selection view
            <>
              <Text style={[styles.modalTitle, { color: colors.modalText }]}>
                Who Won the {frameLabel}?
              </Text>

              {/* Current scores display */}
              <View style={styles.scoresContainer}>
                <View style={styles.scoreColumn}>
                  <Text
                    style={[
                      styles.scoreName,
                      { color: colors.modalTextSecondary },
                    ]}
                  >
                    {player1Name}
                  </Text>
                  <Text style={[styles.scoreValue, { color: colors.primary }]}>
                    {player1Score}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.scoreDivider,
                    { color: colors.modalTextSecondary },
                  ]}
                >
                  —
                </Text>
                <View style={styles.scoreColumn}>
                  <Text
                    style={[
                      styles.scoreName,
                      { color: colors.modalTextSecondary },
                    ]}
                  >
                    {player2Name}
                  </Text>
                  <Text style={[styles.scoreValue, { color: colors.primary }]}>
                    {player2Score}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.playerButton,
                    { backgroundColor: colors.success },
                  ]}
                  onPress={() => handleSelectPlayer("player1")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.playerButtonText}>{player1Name}</Text>
                  <Text style={styles.playerButtonSubtext}>Wins</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.playerButton,
                    { backgroundColor: colors.success },
                  ]}
                  onPress={() => handleSelectPlayer("player2")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.playerButtonText}>{player2Name}</Text>
                  <Text style={styles.playerButtonSubtext}>Wins</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={handleClose}
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
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
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
  scoreColumn: {
    flex: 1,
    alignItems: "center",
  },
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
