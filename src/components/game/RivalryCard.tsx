/**
 * RivalryCard - Displays a rivalry between two players
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { GAME_MODES } from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import type { Rivalry } from "../../types/rivalry";
import { useTheme } from "../providers/ThemeProvider";
import { GameModeIcon } from "./GameModeIcon";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface RivalryCardProps {
  readonly rivalry: Rivalry;
  readonly onPress: (rivalry: Rivalry) => void;
}

export function RivalryCard({ rivalry, onPress }: RivalryCardProps) {
  const { theme } = useTheme();
  const pressed = useSharedValue(0);

  const modeConfig = GAME_MODES[rivalry.gameMode];
  const modeColor =
    rivalry.gameMode === "billiard"
      ? theme.colors.billiard
      : theme.colors.snooker;

  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(1 - pressed.value * 0.02, {
      damping: 15,
      stiffness: 400,
    });
    return { transform: [{ scale }] };
  });

  const handlePressIn = () => {
    pressed.value = 1;
  };

  const handlePressOut = () => {
    pressed.value = 0;
  };

  // Format last played date
  const formatLastPlayed = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const styles = createStyles(theme.colors, modeColor);

  return (
    <AnimatedTouchable
      onPress={() => onPress(rivalry)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.card, animatedStyle]}
    >
      <View style={styles.header}>
        <View style={styles.modeTag}>
          <GameModeIcon mode={rivalry.gameMode} size="sm" />
          <Text style={[styles.modeText, { color: modeColor }]}>
            {modeConfig.label}
          </Text>
        </View>
        <Text style={styles.lastPlayed}>
          {formatLastPlayed(rivalry.lastPlayedAt)}
        </Text>
      </View>

      <View style={styles.players}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName} numberOfLines={1}>
            {rivalry.player1Name}
          </Text>
          <Text style={styles.wins}>{rivalry.wins.player1} wins</Text>
        </View>

        <Text style={styles.vs}>vs</Text>

        <View style={[styles.playerInfo, styles.playerInfoRight]}>
          <Text style={styles.playerName} numberOfLines={1}>
            {rivalry.player2Name}
          </Text>
          <Text style={styles.wins}>{rivalry.wins.player2} wins</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalGames}>
          {rivalry.totalGamesPlayed} games played
        </Text>
      </View>

      <View style={[styles.indicator, { backgroundColor: modeColor }]} />
    </AnimatedTouchable>
  );
}

const createStyles = (
  colors: ReturnType<typeof useTheme>["theme"]["colors"],
  modeColor: string
) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
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
    modeTag: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    modeText: {
      fontSize: 14,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
    },
    lastPlayed: {
      fontSize: 12,
      fontFamily: typography.fonts.regular,
      color: colors.textMuted,
    },
    players: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    playerInfo: {
      flex: 1,
    },
    playerInfoRight: {
      alignItems: "flex-end",
    },
    playerName: {
      fontSize: 18,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.text,
      marginBottom: 2,
    },
    wins: {
      fontSize: 14,
      fontFamily: typography.fonts.regular,
      color: colors.textSecondary,
    },
    vs: {
      fontSize: 14,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.textMuted,
      marginHorizontal: 12,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: 12,
    },
    totalGames: {
      fontSize: 12,
      fontFamily: typography.fonts.regular,
      color: colors.textMuted,
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
