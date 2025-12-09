/**
 * WinnerModal - Modal for marking game/frame winner
 * Implements GH-008: Mark game winner
 * Refactored in GH-019: Split into sub-components
 * Enhanced in GH-025: Spring-based modal animation
 *
 * Acceptance Criteria:
 * - Two buttons to mark Player 1 or Player 2 as winner
 * - Win count increments for selected player
 * - Current win counts displayed on game screen
 * - Confirmation or undo option for accidental taps
 * - Win is saved to rivalry history
 */

import React from "react";

import { useWinnerModal } from "../../hooks/useWinnerModal";
import { AnimatedModal } from "../ui/AnimatedModal";
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
    <AnimatedModal
      visible={visible}
      onClose={handleClose}
      backgroundColor={colors.modalSurface}
      backdropOpacity={0.6}
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
    </AnimatedModal>
  );
}
