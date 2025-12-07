/**
 * useScoring - Hook for managing game scoring
 * Implements GH-008, GH-009, GH-010
 *
 * Features:
 * - Snooker ball point scoring with undo
 * - Foul handling with points to opponent
 * - Frame/game win tracking
 * - Rivalry history updates
 */

import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";

import type { FoulValue, SnookerBallType } from "../lib/constants/game";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { switchPlayer } from "../store/slices/gameSlice";
import { recordWin } from "../store/slices/rivalrySlice";
import {
  addBallPoints,
  addFoulPoints,
  recordFrameWin,
  resetAllScores,
  subtractBallPoints,
  subtractFoulPoints,
} from "../store/slices/scoreSlice";

// Action types for undo functionality
type ScoringAction =
  | {
      type: "ball";
      player: "player1" | "player2";
      ball: SnookerBallType;
      value: number;
    }
  | { type: "foul"; foulingPlayer: "player1" | "player2"; points: FoulValue }
  | { type: "frameWin"; winner: "player1" | "player2" };

interface UseScoringOptions {
  hapticEnabled?: boolean;
}

export function useScoring(options: UseScoringOptions = {}) {
  const { hapticEnabled = true } = options;
  const dispatch = useAppDispatch();

  // Get current state from Redux
  const gameMode = useAppSelector((state) => state.game.mode);
  const currentPlayer = useAppSelector((state) => state.game.currentPlayer);
  const player1Name = useAppSelector((state) => state.game.player1Name);
  const player2Name = useAppSelector((state) => state.game.player2Name);
  const activeRivalryId = useAppSelector(
    (state) => state.rivalry.activeRivalryId
  );

  // Get score state
  const player1FrameScore = useAppSelector(
    (state) => state.score.currentFrameScore.player1
  );
  const player2FrameScore = useAppSelector(
    (state) => state.score.currentFrameScore.player2
  );
  const player1SessionWins = useAppSelector(
    (state) => state.score.sessionWins.player1
  );
  const player2SessionWins = useAppSelector(
    (state) => state.score.sessionWins.player2
  );
  const frameNumber = useAppSelector((state) => state.score.frameNumber);

  // Undo stack - keeps track of recent actions
  const [undoStack, setUndoStack] = useState<ScoringAction[]>([]);

  // Winner modal state
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);

  // Handle ball press (snooker scoring)
  const handleBallPress = useCallback(
    (ballType: SnookerBallType, value: number) => {
      // Add points to current player
      dispatch(addBallPoints({ player: currentPlayer, ball: ballType }));

      // Add to undo stack
      setUndoStack((prev) => [
        ...prev.slice(-9), // Keep last 10 actions
        { type: "ball", player: currentPlayer, ball: ballType, value },
      ]);

      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [currentPlayer, dispatch, hapticEnabled]
  );

  // Handle foul
  const handleFoul = useCallback(
    (points: FoulValue) => {
      // Add foul points to opponent
      dispatch(addFoulPoints({ foulingPlayer: currentPlayer, points }));

      // Add to undo stack
      setUndoStack((prev) => [
        ...prev.slice(-9),
        { type: "foul", foulingPlayer: currentPlayer, points },
      ]);

      // Switch player after foul
      dispatch(switchPlayer());

      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    },
    [currentPlayer, dispatch, hapticEnabled]
  );

  // Open winner modal
  const handleOpenWinnerModal = useCallback(() => {
    setWinnerModalVisible(true);
  }, []);

  // Close winner modal
  const handleCloseWinnerModal = useCallback(() => {
    setWinnerModalVisible(false);
  }, []);

  // Handle frame/game win
  const handleSelectWinner = useCallback(
    (winner: "player1" | "player2") => {
      // Record frame win in score slice
      dispatch(recordFrameWin({ winner }));

      // Add to undo stack
      setUndoStack((prev) => [...prev.slice(-9), { type: "frameWin", winner }]);

      // Record win in rivalry if active
      if (activeRivalryId) {
        dispatch(recordWin({ id: activeRivalryId, winner }));
      }

      setWinnerModalVisible(false);

      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [activeRivalryId, dispatch, hapticEnabled]
  );

  // Handle undo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    const lastAction = undoStack.at(-1);
    if (!lastAction) return;

    // Handle undo based on action type
    switch (lastAction.type) {
      case "ball":
        // Subtract points for ball
        dispatch(
          subtractBallPoints({
            player: lastAction.player,
            ball: lastAction.ball,
          })
        );
        break;

      case "foul":
        // Revert foul: subtract points from opponent and switch back
        dispatch(
          subtractFoulPoints({
            foulingPlayer: lastAction.foulingPlayer,
            points: lastAction.points,
          })
        );
        // Switch player back (undo the automatic switch after foul)
        dispatch(switchPlayer());
        break;

      case "frameWin":
        // Can't undo frame win for now (would need to revert rivalry too)
        // Just skip this action type
        break;
    }

    // Remove from undo stack
    setUndoStack((prev) => prev.slice(0, -1));

    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [undoStack, dispatch, hapticEnabled]);

  // Reset all scoring (for new game)
  const resetScoring = useCallback(() => {
    dispatch(resetAllScores());
    setUndoStack([]);
  }, [dispatch]);

  return {
    // State
    gameMode,
    currentPlayer,
    player1Name,
    player2Name,
    player1FrameScore,
    player2FrameScore,
    player1SessionWins,
    player2SessionWins,
    frameNumber,
    winnerModalVisible,
    canUndo: undoStack.length > 0,

    // Actions
    handleBallPress,
    handleFoul,
    handleOpenWinnerModal,
    handleCloseWinnerModal,
    handleSelectWinner,
    handleUndo,
    resetScoring,
  };
}
