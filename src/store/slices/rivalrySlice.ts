/**
 * Rivalry slice - manages rivalry history between players
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CreateRivalryPayload,
  Rivalry,
  UpdateRivalryPayload,
} from "../../types/rivalry";

interface RivalryState {
  rivalries: Rivalry[];
  activeRivalryId: string | null;
}

const initialState: RivalryState = {
  rivalries: [],
  activeRivalryId: null,
};

// Helper to generate unique ID
const generateId = (): string => {
  return `rivalry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Helper to normalize player names for matching (case-insensitive, trimmed)
const normalizePlayerName = (name: string): string => {
  return name.trim().toLowerCase();
};

// Helper to find existing rivalry between two players
const findExistingRivalry = (
  rivalries: Rivalry[],
  player1: string,
  player2: string,
  gameMode: string
): Rivalry | undefined => {
  const p1 = normalizePlayerName(player1);
  const p2 = normalizePlayerName(player2);

  return rivalries.find((r) => {
    const rp1 = normalizePlayerName(r.player1Name);
    const rp2 = normalizePlayerName(r.player2Name);
    const sameMode = r.gameMode === gameMode;
    const samePlayers =
      (rp1 === p1 && rp2 === p2) || (rp1 === p2 && rp2 === p1);
    return sameMode && samePlayers;
  });
};

const rivalrySlice = createSlice({
  name: "rivalry",
  initialState,
  reducers: {
    createOrFindRivalry: (
      state,
      action: PayloadAction<CreateRivalryPayload>
    ) => {
      const { player1Name, player2Name, gameMode } = action.payload;

      // Check if rivalry already exists
      const existing = findExistingRivalry(
        state.rivalries,
        player1Name,
        player2Name,
        gameMode
      );

      if (existing) {
        // Update last played time and set as active
        existing.lastPlayedAt = new Date().toISOString();
        state.activeRivalryId = existing.id;
      } else {
        // Create new rivalry
        const now = new Date().toISOString();
        const newRivalry: Rivalry = {
          id: generateId(),
          player1Name: player1Name.trim(),
          player2Name: player2Name.trim(),
          gameMode,
          wins: { player1: 0, player2: 0 },
          createdAt: now,
          lastPlayedAt: now,
          totalGamesPlayed: 0,
        };
        state.rivalries.push(newRivalry);
        state.activeRivalryId = newRivalry.id;
      }
    },

    setActiveRivalry: (state, action: PayloadAction<string | null>) => {
      state.activeRivalryId = action.payload;
    },

    recordWin: (state, action: PayloadAction<UpdateRivalryPayload>) => {
      const { id, winner } = action.payload;
      const rivalry = state.rivalries.find((r) => r.id === id);

      if (rivalry) {
        rivalry.wins[winner] += 1;
        rivalry.totalGamesPlayed += 1;
        rivalry.lastPlayedAt = new Date().toISOString();
      }
    },

    deleteRivalry: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.rivalries = state.rivalries.filter((r) => r.id !== id);
      if (state.activeRivalryId === id) {
        state.activeRivalryId = null;
      }
    },

    clearAllRivalries: (state) => {
      state.rivalries = [];
      state.activeRivalryId = null;
    },
  },
});

export const {
  createOrFindRivalry,
  setActiveRivalry,
  recordWin,
  deleteRivalry,
  clearAllRivalries,
} = rivalrySlice.actions;

export default rivalrySlice.reducer;
