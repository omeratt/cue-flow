/**
 * RivalryCard - Displays a rivalry between two players
 * Memoized for performance when rendering in lists
 * Refactored in GH-019: Extracted formatting utils
 * Updated in GH-021: Improved to use non-bouncy timing animation
 */

import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GAME_MODES } from "../../lib/constants/game";
import { formatLastPlayed } from "../../lib/dateUtils";
import { typography } from "../../lib/theme";
import type { Rivalry } from "../../types/rivalry";
import { GameModeIcon } from "../icons/GameModeIcon";
import { useTheme } from "../providers/ThemeProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RivalryCardProps {
  readonly rivalry: Rivalry;
  readonly onPress: (rivalry: Rivalry) => void;
}

// Smooth, non-bouncy animation config
const PRESS_IN_CONFIG = {
  duration: 80,
  easing: Easing.out(Easing.quad),
};

const PRESS_OUT_CONFIG = {
  duration: 120,
  easing: Easing.out(Easing.quad),
};

function RivalryCardComponent({ rivalry, onPress }: RivalryCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const modeConfig = GAME_MODES[rivalry.gameMode];
  const modeColor =
    rivalry.gameMode === "billiard"
      ? theme.colors.billiard
      : theme.colors.snooker;

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.98, PRESS_IN_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, PRESS_OUT_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => onPress(rivalry)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.modeTag}>
          <GameModeIcon mode={rivalry.gameMode} size="sm" />
          <Text style={[styles.modeText, { color: modeColor }]}>
            {modeConfig.label}
          </Text>
        </View>
        <Text style={[styles.lastPlayed, { color: theme.colors.textMuted }]}>
          {formatLastPlayed(rivalry.lastPlayedAt)}
        </Text>
      </View>

      <View style={styles.players}>
        <View style={styles.playerInfo}>
          <Text
            style={[styles.playerName, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {rivalry.player1Name}
          </Text>
          <Text style={[styles.wins, { color: theme.colors.textSecondary }]}>
            {rivalry.wins.player1} wins
          </Text>
        </View>
        <Text style={[styles.vs, { color: theme.colors.textMuted }]}>vs</Text>
        <View style={[styles.playerInfo, styles.playerInfoRight]}>
          <Text
            style={[styles.playerName, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {rivalry.player2Name}
          </Text>
          <Text style={[styles.wins, { color: theme.colors.textSecondary }]}>
            {rivalry.wins.player2} wins
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.colors.divider }]}>
        <Text style={[styles.totalGames, { color: theme.colors.textMuted }]}>
          {rivalry.totalGamesPlayed} games played
        </Text>
      </View>

      <View style={[styles.indicator, { backgroundColor: modeColor }]} />
    </AnimatedPressable>
  );
}

export const RivalryCard = memo(RivalryCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modeTag: { flexDirection: "row", alignItems: "center", gap: 6 },
  modeText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
  },
  lastPlayed: { fontSize: 12, fontFamily: typography.fonts.regular },
  players: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  playerInfo: { flex: 1 },
  playerInfoRight: { alignItems: "flex-end" },
  playerName: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
    marginBottom: 2,
  },
  wins: { fontSize: 14, fontFamily: typography.fonts.regular },
  vs: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
    marginHorizontal: 12,
  },
  footer: { borderTopWidth: 1, paddingTop: 12 },
  totalGames: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    textAlign: "center",
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
});
