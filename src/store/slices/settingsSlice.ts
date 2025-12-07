/**
 * Settings slice - manages app settings
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode } from "../../lib/theme";

interface SettingsState {
  theme: ThemeMode;
  useSystemTheme: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

const initialState: SettingsState = {
  theme: "dark",
  useSystemTheme: true,
  soundEnabled: true,
  hapticEnabled: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      state.useSystemTheme = false;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      state.useSystemTheme = false;
    },
    setUseSystemTheme: (state, action: PayloadAction<boolean>) => {
      state.useSystemTheme = action.payload;
    },
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setHapticEnabled: (state, action: PayloadAction<boolean>) => {
      state.hapticEnabled = action.payload;
    },
    toggleHaptic: (state) => {
      state.hapticEnabled = !state.hapticEnabled;
    },
    resetSettings: () => initialState,
  },
});

export const {
  setTheme,
  toggleTheme,
  setUseSystemTheme,
  setSoundEnabled,
  toggleSound,
  setHapticEnabled,
  toggleHaptic,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
