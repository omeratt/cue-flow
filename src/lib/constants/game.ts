/**
 * Game-related constants for CueFlow
 */

// Game modes
export type GameMode = "billiard" | "snooker";

export const GAME_MODES: Record<
  GameMode,
  { label: string; icon: string; description: string }
> = {
  billiard: {
    label: "Billiard",
    icon: "🎱",
    description: "Timer + Win Tracking",
  },
  snooker: {
    label: "Snooker",
    icon: "🔴",
    description: "Timer + Scoring + Win Tracking",
  },
} as const;

// Timer duration presets (in seconds)
export const TIMER_PRESETS = [10, 15, 20, 30, 45, 60] as const;

export type TimerPreset = (typeof TIMER_PRESETS)[number];

// Default timer duration
export const DEFAULT_TIMER_DURATION = 30;

// Snooker ball values
export const SNOOKER_BALLS = {
  red: { value: 1, color: "#DC2626", label: "Red" },
  yellow: { value: 2, color: "#EAB308", label: "Yellow" },
  green: { value: 3, color: "#22C55E", label: "Green" },
  brown: { value: 4, color: "#92400E", label: "Brown" },
  blue: { value: 5, color: "#3B82F6", label: "Blue" },
  pink: { value: 6, color: "#EC4899", label: "Pink" },
  black: { value: 7, color: "#1F2937", label: "Black" },
} as const;

export type SnookerBallType = keyof typeof SNOOKER_BALLS;

// Foul point values in snooker
export const SNOOKER_FOUL_VALUES = [4, 5, 6, 7] as const;

export type FoulValue = (typeof SNOOKER_FOUL_VALUES)[number];

// Minimum foul value
export const MIN_FOUL_VALUE = 4;

// Timer warning threshold (fraction of time remaining)
export const TIMER_WARNING_THRESHOLD = 1 / 3; // Last third of time
