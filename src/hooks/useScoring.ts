/**
 * useScoring - Hook for managing game scoring
 * Implements GH-008, GH-009, GH-010, GH-024
 *
 * Features:
 * - Snooker ball point scoring with undo/redo
 * - Foul handling with points to opponent
 * - Frame/game win tracking
 * - Rivalry history updates
 * - Unified undo/redo for both points and wins
 * - Timer control callbacks for integration
 */

import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";

import type { FoulValue, SnookerBallType } from "../lib/constants/game";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { switchPlayer } from "../store/slices/gameSlice";
import { recordWin, undoWin } from "../store/slices/rivalrySlice";
import {
  addBallPoints,
  addFoulPoints,
  recordFrameWin,
  resetAllScores,
  subtractBallPoints,
  subtractFoulPoints,
  undoFrameWin,
} from "../store/slices/scoreSlice";

// Action types for undo/redo functionality
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
  onTimerStop?: () => void;
  onTimerReset?: () => void;
}

export function useScoring(options: UseScoringOptions = {}) {
  const { hapticEnabled = true, onTimerStop, onTimerReset } = options;
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

  // Undo/Redo stacks - keeps track of actions for both modes
  const [undoStack, setUndoStack] = useState<ScoringAction[]>([]);
  const [redoStack, setRedoStack] = useState<ScoringAction[]>([]);

  // Winner modal state
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);

  // Handle ball press (snooker scoring)
  const handleBallPress = useCallback(
    (ballType: SnookerBallType, value: number) => {
      // Stop and reset timer on ball scoring (BUG-002)
      onTimerReset?.();

      // Add points to current player
      dispatch(addBallPoints({ player: currentPlayer, ball: ballType }));

      // Add to undo stack, clear redo stack
      setUndoStack((prev) => [
        ...prev.slice(-9), // Keep last 10 actions
        { type: "ball", player: currentPlayer, ball: ballType, value },
      ]);
      setRedoStack([]); // Clear redo stack on new action

      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [currentPlayer, dispatch, hapticEnabled, onTimerReset]
  );

  // Handle foul (BUG-006: stop timer + switch player)
  const handleFoul = useCallback(
    (points: FoulValue) => {
      // Stop and reset timer on foul (BUG-006)
      onTimerReset?.();

      // Add foul points to opponent
      dispatch(addFoulPoints({ foulingPlayer: currentPlayer, points }));

      // Add to undo stack, clear redo stack
      setUndoStack((prev) => [
        ...prev.slice(-9),
        { type: "foul", foulingPlayer: currentPlayer, points },
      ]);
      setRedoStack([]);

      // Switch player after foul
      dispatch(switchPlayer());

      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    },
    [currentPlayer, dispatch, hapticEnabled, onTimerReset]
  );

  // Open winner modal
  const handleOpenWinnerModal = useCallback(() => {
    setWinnerModalVisible(true);
  }, []);

  // Close winner modal
  const handleCloseWinnerModal = useCallback(() => {
    setWinnerModalVisible(false);
  }, []);

  // Handle frame/game win (BUG-001: stop timer when winner marked)
  const handleSelectWinner = useCallback(
    (winner: "player1" | "player2") => {
      // Stop timer when winner is marked (BUG-001)
      onTimerStop?.();

      // Record frame win in score slice
      dispatch(recordFrameWin({ winner }));

      // Add to undo stack (unified for both modes - BUG-004)
      setUndoStack((prev) => [...prev.slice(-9), { type: "frameWin", winner }]);
      setRedoStack([]); // Clear redo stack on new action

      // Record win in rivalry if active
      if (activeRivalryId) {
        dispatch(recordWin({ id: activeRivalryId, winner }));
      }

      setWinnerModalVisible(false);

      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [activeRivalryId, dispatch, hapticEnabled, onTimerStop]
  );

  // Handle undo (BUG-003, BUG-004, BUG-005: unified undo for both modes)
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    // Stop timer on undo (BUG-005)
    onTimerStop?.();

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
        // Undo frame win (BUG-003, BUG-004: now works for both modes)
        dispatch(undoFrameWin({ winner: lastAction.winner }));
        // Undo rivalry win if active
        if (activeRivalryId) {
          dispatch(undoWin({ id: activeRivalryId, winner: lastAction.winner }));
        }
        break;
    }

    // Move action from undo stack to redo stack
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, lastAction]);

    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [undoStack, dispatch, hapticEnabled, activeRivalryId, onTimerStop]);

  // Handle redo (FEAT-001: new redo functionality)
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    // Stop timer on redo (BUG-005)
    onTimerStop?.();

    const lastUndoneAction = redoStack.at(-1);
    if (!lastUndoneAction) return;

    // Handle redo based on action type
    switch (lastUndoneAction.type) {
      case "ball":
        // Re-add points for ball
        dispatch(
          addBallPoints({
            player: lastUndoneAction.player,
            ball: lastUndoneAction.ball,
          })
        );
        break;

      case "foul":
        // Re-apply foul: add points to opponent and switch player
        dispatch(
          addFoulPoints({
            foulingPlayer: lastUndoneAction.foulingPlayer,
            points: lastUndoneAction.points,
          })
        );
        dispatch(switchPlayer());
        break;

      case "frameWin":
        // Re-record frame win
        dispatch(recordFrameWin({ winner: lastUndoneAction.winner }));
        // Re-record rivalry win if active
        if (activeRivalryId) {
          dispatch(
            recordWin({ id: activeRivalryId, winner: lastUndoneAction.winner })
          );
        }
        break;
    }

    // Move action from redo stack to undo stack
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, lastUndoneAction]);

    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [redoStack, dispatch, hapticEnabled, activeRivalryId, onTimerStop]);

  // Reset all scoring (for new game)
  const resetScoring = useCallback(() => {
    dispatch(resetAllScores());
    setUndoStack([]);
    setRedoStack([]);
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
    canRedo: redoStack.length > 0,

    // Actions
    handleBallPress,
    handleFoul,
    handleOpenWinnerModal,
    handleCloseWinnerModal,
    handleSelectWinner,
    handleUndo,
    handleRedo,
    resetScoring,
  };
}
