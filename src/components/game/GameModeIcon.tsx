/**
 * GameModeIcon - Renders the appropriate icon for each game mode
 *
 * Uses SnookerBall component for snooker mode and emoji for billiard mode
 */

import React from "react";
import { StyleSheet, Text } from "react-native";

import type { GameMode } from "../../lib/constants/game";
import { useTheme } from "../providers/ThemeProvider";
import { SnookerBall } from "../ui/SnookerBall";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

interface GameModeIconProps {
  readonly mode: GameMode;
  readonly size?: IconSize;
}

// Map size names to pixel values for emoji
const EMOJI_SIZE_MAP: Record<IconSize, number> = {
  xs: 14,
  sm: 20,
  md: 28,
  lg: 36,
  xl: 48,
};

// Map size names to SnookerBall sizes
const BALL_SIZE_MAP: Record<IconSize, number> = {
  xs: 14,
  sm: 20,
  md: 28,
  lg: 36,
  xl: 48,
};

export function GameModeIcon({ mode, size = "md" }: GameModeIconProps) {
  const { theme } = useTheme();

  if (mode === "snooker") {
    return (
      <SnookerBall preset="red" size={BALL_SIZE_MAP[size]} showValue={false} />
    );
  }

  // Billiard mode - use 8ball emoji
  return (
    <Text
      style={[
        styles.emoji,
        {
          fontSize: EMOJI_SIZE_MAP[size],
          ...theme.colors.shadows,
        },
      ]}
    >
      🎱
    </Text>
  );
}

const styles = StyleSheet.create({
  emoji: {
    textAlign: "center",
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
});
