/**
 * Score slice - manages current game/frame scores
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FoulValue, SnookerBallType } from "../../lib/constants/game";
import { SNOOKER_BALLS } from "../../lib/constants/game";

interface ScoreState {
  // Current frame/game score (primarily for snooker)
  currentFrameScore: {
    player1: number;
    player2: number;
  };
  // Frame/game number in current session
  frameNumber: number;
  // Wins in current session (before saving to rivalry)
  sessionWins: {
    player1: number;
    player2: number;
  };
}

const initialState: ScoreState = {
  currentFrameScore: {
    player1: 0,
    player2: 0,
  },
  frameNumber: 1,
  sessionWins: {
    player1: 0,
    player2: 0,
  },
};

const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {
    // Add points for snooker ball
    addBallPoints: (
      state,
      action: PayloadAction<{
        player: "player1" | "player2";
        ball: SnookerBallType;
      }>
    ) => {
      const { player, ball } = action.payload;
      const points = SNOOKER_BALLS[ball].value;
      state.currentFrameScore[player] += points;
    },

    // Add custom points
    addPoints: (
      state,
      action: PayloadAction<{
        player: "player1" | "player2";
        points: number;
      }>
    ) => {
      const { player, points } = action.payload;
      state.currentFrameScore[player] += points;
    },

    // Handle foul - add points to opponent
    addFoulPoints: (
      state,
      action: PayloadAction<{
        foulingPlayer: "player1" | "player2";
        points: FoulValue;
      }>
    ) => {
      const { foulingPlayer, points } = action.payload;
      const opponent = foulingPlayer === "player1" ? "player2" : "player1";
      state.currentFrameScore[opponent] += points;
    },

    // Record frame/game win
    recordFrameWin: (
      state,
      action: PayloadAction<{ winner: "player1" | "player2" }>
    ) => {
      const { winner } = action.payload;
      state.sessionWins[winner] += 1;
      // Reset frame score for next frame
      state.currentFrameScore = { player1: 0, player2: 0 };
      state.frameNumber += 1;
    },

    // Reset current frame score (for new frame)
    resetFrameScore: (state) => {
      state.currentFrameScore = { player1: 0, player2: 0 };
    },

    // Reset all scores (for new session)
    resetAllScores: () => initialState,
  },
});

export const {
  addBallPoints,
  addPoints,
  addFoulPoints,
  recordFrameWin,
  resetFrameScore,
  resetAllScores,
} = scoreSlice.actions;

export default scoreSlice.reducer;
