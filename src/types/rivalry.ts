/**
 * Rivalry-related TypeScript types for CueFlow
 */

import type { GameMode } from "../lib/constants/game";

// A rivalry between two players
export interface Rivalry {
  id: string;
  player1Name: string;
  player2Name: string;
  gameMode: GameMode;
  wins: {
    player1: number;
    player2: number;
  };
  createdAt: string; // ISO date string
  lastPlayedAt: string; // ISO date string
  totalGamesPlayed: number;
}

// State for managing rivalries
export interface RivalryState {
  rivalries: Rivalry[];
  activeRivalryId: string | null;
}

// Create rivalry payload
export interface CreateRivalryPayload {
  player1Name: string;
  player2Name: string;
  gameMode: GameMode;
}

// Update rivalry payload
export interface UpdateRivalryPayload {
  id: string;
  winner: "player1" | "player2";
}
