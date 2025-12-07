/**
 * Game-related TypeScript types for CueFlow
 */

import type { GameMode } from "../lib/constants/game";

// Player information
export interface Player {
  id: "player1" | "player2";
  name: string;
}

// Timer settings
export interface TimerSettings {
  duration: number; // in seconds
  isCustom: boolean;
}

// Current game state
export interface GameState {
  mode: GameMode | null;
  players: {
    player1: Player;
    player2: Player;
  };
  timerSettings: TimerSettings;
  currentPlayer: "player1" | "player2";
  isGameActive: boolean;
  isPaused: boolean;
}

// Score state for the current frame/game
export interface ScoreState {
  // Win counts for the session/rivalry
  wins: {
    player1: number;
    player2: number;
  };
  // Current frame/game score (for snooker)
  currentFrameScore: {
    player1: number;
    player2: number;
  };
  // Frame number
  frameNumber: number;
}

// Game setup form data
export interface GameSetupData {
  mode: GameMode;
  player1Name: string;
  player2Name: string;
  timerDuration: number;
}
