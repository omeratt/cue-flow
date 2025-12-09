/**
 * useWinnerModal - Hook for winner modal logic
 * Implements GH-020: Extract logic from UI components to hooks
 *
 * Responsibilities:
 * - Selection state management
 * - Confirmation flow
 * - Haptic feedback
 */

import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";

type WinnerSelection = "player1" | "player2" | null;

interface UseWinnerModalProps {
  readonly onSelectWinner: (winner: "player1" | "player2") => void;
  readonly onClose: () => void;
  readonly hapticEnabled?: boolean;
}

interface UseWinnerModalReturn {
  readonly selectedWinner: WinnerSelection;
  readonly showConfirmation: boolean;
  readonly handleSelectPlayer: (player: "player1" | "player2") => void;
  readonly handleConfirm: () => void;
  readonly handleCancel: () => void;
  readonly handleClose: () => void;
}

export function useWinnerModal({
  onSelectWinner,
  onClose,
  hapticEnabled = true,
}: UseWinnerModalProps): UseWinnerModalReturn {
  const [selectedWinner, setSelectedWinner] = useState<WinnerSelection>(null);
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

  return {
    selectedWinner,
    showConfirmation,
    handleSelectPlayer,
    handleConfirm,
    handleCancel,
    handleClose,
  };
}
