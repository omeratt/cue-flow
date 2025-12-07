/**
 * Theme configuration for CueFlow
 * Supports both light and dark modes
 */

import { FontFamily } from "./fonts";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;

  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;

  // Brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Game mode colors
  billiard: string;
  billiardLight: string;
  snooker: string;
  snookerLight: string;

  // Status colors
  success: string;
  warning: string;
  error: string;

  // Timer colors
  timerActive: string;
  timerWarning: string;
  timerDanger: string;

  // Border and divider
  border: string;
  divider: string;

  // Button colors
  buttonText: string;
  buttonBackground: string;

  // Shadows colors
  shadows: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation?: number;
  };
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
}

// Spacing scale (4px base)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radius scale
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

// Typography scale
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  // Font families - Space Grotesk from Google Fonts
  fonts: FontFamily,
} as const;

// Light mode colors
const lightColors: ThemeColors = {
  // Background colors
  background: "#F8F9FA",
  backgroundSecondary: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",

  // Text colors
  text: "#1A1A2E",
  textSecondary: "#4A4A68",
  textMuted: "#8E8EA9",

  // Brand colors - Teal/Cyan for a fresh billiard feel
  primary: "#0891B2",
  primaryLight: "#22D3EE",
  primaryDark: "#0E7490",

  // Game mode colors
  billiard: "#059669", // Emerald green for pool
  billiardLight: "#34D399",
  snooker: "#DC2626", // Red for snooker
  snookerLight: "#F87171",

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  // Timer colors
  timerActive: "#0891B2",
  timerWarning: "#F59E0B",
  timerDanger: "#EF4444",

  // Border and divider
  border: "#E2E8F0",
  divider: "#E2E8F0",

  // Button colors
  buttonText: "#FFFFFF",
  buttonBackground: "#0891B2",

  // Shadows colors
  shadows: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};

// Dark mode colors
const darkColors: ThemeColors = {
  // Background colors
  background: "#0F0F1A",
  backgroundSecondary: "#1A1A2E",
  surface: "#1A1A2E",
  surfaceElevated: "#252540",

  // Text colors
  text: "#F8F9FA",
  textSecondary: "#B8B8D1",
  textMuted: "#6B6B8D",

  // Brand colors
  primary: "#22D3EE",
  primaryLight: "#67E8F9",
  primaryDark: "#0891B2",

  // Game mode colors
  billiard: "#34D399", // Lighter emerald for dark mode
  billiardLight: "#6EE7B7",
  snooker: "#F87171", // Lighter red for dark mode
  snookerLight: "#FCA5A5",

  // Status colors
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",

  // Timer colors
  timerActive: "#22D3EE",
  timerWarning: "#FBBF24",
  timerDanger: "#F87171",

  // Border and divider
  border: "#2D2D4A",
  divider: "#2D2D4A",

  // Button colors
  buttonText: "#0F0F1A",
  buttonBackground: "#22D3EE",

  // Shadows colors
  shadows: {
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
};

// Create theme object
export const createTheme = (mode: ThemeMode): Theme => ({
  mode,
  colors: mode === "light" ? lightColors : darkColors,
  spacing,
  borderRadius,
  typography,
});

// Default themes
export const lightTheme = createTheme("light");
export const darkTheme = createTheme("dark");

// Get theme by mode
export const getTheme = (mode: ThemeMode): Theme => {
  return mode === "light" ? lightTheme : darkTheme;
};
