/**
 * Ball Constants - Snooker and Pool ball configurations
 */

// Preset ball configurations
export const BALL_PRESETS = {
  // Snooker balls
  red: { color: "#E74C3C", value: 1, darkColor: "#9B2C2C" },
  yellow: { color: "#F1C40F", value: 2, darkColor: "#B7950B" },
  green: { color: "#27AE60", value: 3, darkColor: "#1D7A43" },
  brown: { color: "#8B4513", value: 4, darkColor: "#5D2E0C" },
  blue: { color: "#3498DB", value: 5, darkColor: "#2471A3" },
  pink: { color: "#E91E63", value: 6, darkColor: "#AD1457" },
  black: { color: "#2C3E50", value: 7, darkColor: "#1A252F" },
  // Pool balls
  "8ball": { color: "#1a1a1a", value: 8, darkColor: "#000000" },
  // Cue ball
  cue: { color: "#F5F5F5", value: null, darkColor: "#D0D0D0" },
} as const;

export type BallPreset = keyof typeof BALL_PRESETS;
export type BallSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

export const SIZE_MAP: Record<Exclude<BallSize, number>, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80,
};

// Light balls that need dark text for contrast
export const LIGHT_BALL_PRESETS: readonly BallPreset[] = [
  "yellow",
  "green",
  "cue",
];

/**
 * Generate a darker shade of a color for shadows
 */
export function generateDarkColor(color: string): string {
  const hex = color.replace("#", "");
  const r = Math.max(0, Number.parseInt(hex.slice(0, 2), 16) - 40);
  const g = Math.max(0, Number.parseInt(hex.slice(2, 4), 16) - 40);
  const b = Math.max(0, Number.parseInt(hex.slice(4, 6), 16) - 40);
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Check if a color is light (for text contrast)
 */
export function isLightColor(color: string): boolean {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Get ball dimensions based on size
 */
export function getBallDimensions(size: BallSize): {
  ballSize: number;
  fontSize: number;
  specularWidth: number;
  specularHeight: number;
  specularTop: number;
  specularLeft: number;
} {
  const ballSize = typeof size === "number" ? size : SIZE_MAP[size];
  return {
    ballSize,
    fontSize: Math.max(10, Math.round(ballSize * 0.4)),
    specularWidth: Math.max(4, Math.round(ballSize * 0.25)),
    specularHeight: Math.max(2, Math.round(ballSize * 0.125)),
    specularTop: Math.max(2, Math.round(ballSize * 0.15)),
    specularLeft: Math.max(4, Math.round(ballSize * 0.25)),
  };
}

/**
 * Get ball colors based on preset and custom overrides
 */
export function getBallColors(
  preset: BallPreset,
  customColor?: string,
  customDarkColor?: string
): {
  ballColor: string;
  ballDarkColor: string;
  textColor: string;
} {
  const presetConfig = BALL_PRESETS[preset];
  const ballColor = customColor || presetConfig.color;
  const ballDarkColor =
    customDarkColor ||
    (customColor ? generateDarkColor(customColor) : presetConfig.darkColor);

  const isLight =
    LIGHT_BALL_PRESETS.includes(preset) ||
    (customColor && isLightColor(customColor));
  const textColor = isLight ? "#1a1a1a" : "#ffffff";

  return { ballColor, ballDarkColor, textColor };
}

/**
 * Get accessibility label for a ball
 */
export function getBallAccessibilityLabel(
  preset: BallPreset,
  displayValue: number | string | null
): string {
  let ballName = `${preset} ball`;
  if (preset === "8ball") {
    ballName = "8-ball";
  } else if (preset === "cue") {
    ballName = "cue ball";
  }

  if (displayValue !== null) {
    const pointsText = displayValue === 1 ? "point" : "points";
    return `${ballName}, ${displayValue} ${pointsText}`;
  }

  return ballName;
}
