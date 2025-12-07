/**
 * Settings-related TypeScript types for CueFlow
 */

import type { ThemeMode } from "../lib/theme";

// App settings state
export interface SettingsState {
  theme: ThemeMode;
  useSystemTheme: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

// Default settings
export const DEFAULT_SETTINGS: SettingsState = {
  theme: "dark",
  useSystemTheme: true,
  soundEnabled: true,
  hapticEnabled: true,
};
