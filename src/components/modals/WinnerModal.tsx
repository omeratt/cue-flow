/**
 * WinnerModal - Modal for marking game/frame winner
 * Implements GH-008: Mark game winner
 * Refactored in GH-019: Split into sub-components
 *
 * Acceptance Criteria:
 * - Two buttons to mark Player 1 or Player 2 as winner
 * - Win count increments for selected player
 * - Current win counts displayed on game screen
 * - Confirmation or undo option for accidental taps
 * - Win is saved to rivalry history
 */

import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

import { useWinnerModal } from "../../hooks/useWinnerModal";
import { WinnerConfirmationView } from "./WinnerConfirmationView";
import { WinnerSelectionView } from "./WinnerSelectionView";

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
  const {
    selectedWinner,
    showConfirmation,
    handleSelectPlayer,
    handleConfirm,
    handleCancel,
    handleClose,
  } = useWinnerModal({ onSelectWinner, onClose, hapticEnabled });

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
            <WinnerConfirmationView
              winnerName={winnerName}
              frameLabel={frameLabel}
              colors={colors}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          ) : (
            <WinnerSelectionView
              player1Name={player1Name}
              player2Name={player2Name}
              player1Score={player1Score}
              player2Score={player2Score}
              frameLabel={frameLabel}
              colors={colors}
              onSelectPlayer={handleSelectPlayer}
              onClose={handleClose}
            />
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
});
