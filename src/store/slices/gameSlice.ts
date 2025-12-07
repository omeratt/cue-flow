/**
 * Game slice - manages current game state
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GameMode } from "../../lib/constants/game";
import { DEFAULT_TIMER_DURATION } from "../../lib/constants/game";

interface GameState {
  mode: GameMode | null;
  player1Name: string;
  player2Name: string;
  timerDuration: number;
  currentPlayer: "player1" | "player2";
  isGameActive: boolean;
  isPaused: boolean;
}

const initialState: GameState = {
  mode: null,
  player1Name: "",
  player2Name: "",
  timerDuration: DEFAULT_TIMER_DURATION,
  currentPlayer: "player1",
  isGameActive: false,
  isPaused: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.mode = action.payload;
    },
    setPlayers: (
      state,
      action: PayloadAction<{ player1Name: string; player2Name: string }>
    ) => {
      state.player1Name = action.payload.player1Name;
      state.player2Name = action.payload.player2Name;
    },
    setTimerDuration: (state, action: PayloadAction<number>) => {
      state.timerDuration = action.payload;
    },
    startGame: (state) => {
      state.isGameActive = true;
      state.isPaused = false;
      state.currentPlayer = "player1";
    },
    pauseGame: (state) => {
      state.isPaused = true;
    },
    resumeGame: (state) => {
      state.isPaused = false;
    },
    switchPlayer: (state) => {
      state.currentPlayer =
        state.currentPlayer === "player1" ? "player2" : "player1";
    },
    endGame: (state) => {
      state.isGameActive = false;
      state.isPaused = false;
    },
    resetGame: () => initialState,
  },
});

export const {
  setGameMode,
  setPlayers,
  setTimerDuration,
  startGame,
  pauseGame,
  resumeGame,
  switchPlayer,
  endGame,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
