/**
 * GameModeCard - A card component for selecting game mode (Billiard/Snooker)
 * Updated in GH-021: Improved to use non-bouncy timing animation
 */

import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { GameMode } from "../../lib/constants/game";
import { GAME_MODES } from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { GameModeIcon } from "../icons/GameModeIcon";
import { useTheme } from "../providers/ThemeProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GameModeCardProps {
  readonly mode: GameMode;
  readonly onPress: (mode: GameMode) => void;
  readonly style?: ViewStyle;
}

// Smooth, non-bouncy animation config
const PRESS_IN_CONFIG = {
  duration: 100,
  easing: Easing.out(Easing.quad),
};

const PRESS_OUT_CONFIG = {
  duration: 150,
  easing: Easing.out(Easing.quad),
};

export function GameModeCard({ mode, onPress, style }: GameModeCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const hovered = useSharedValue(0);

  const modeConfig = GAME_MODES[mode];
  const modeColor =
    mode === "billiard" ? theme.colors.billiard : theme.colors.snooker;
  const modeColorLight =
    mode === "billiard"
      ? theme.colors.billiardLight
      : theme.colors.snookerLight;

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      hovered.value,
      [0, 1],
      [theme.colors.surface, theme.colors.surfaceElevated]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, PRESS_IN_CONFIG);
    hovered.value = withTiming(1, PRESS_IN_CONFIG);
  }, [scale, hovered]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, PRESS_OUT_CONFIG);
    hovered.value = withTiming(0, PRESS_OUT_CONFIG);
  }, [scale, hovered]);

  const styles = createStyles(theme.colors, modeColor, modeColorLight);

  return (
    <AnimatedPressable
      onPress={() => onPress(mode)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle, style]}
      accessibilityLabel={`${modeConfig.label} mode. ${modeConfig.description}`}
      accessibilityRole="button"
      accessibilityHint="Select this game mode to continue"
    >
      <View style={styles.iconContainer}>
        <GameModeIcon mode={mode} size="lg" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{modeConfig.label}</Text>
        <Text style={styles.description}>{modeConfig.description}</Text>
      </View>
      <View style={[styles.indicator, { backgroundColor: modeColor }]} />
    </AnimatedPressable>
  );
}

const createStyles = (
  colors: ReturnType<typeof useTheme>["theme"]["colors"],
  modeColor: string,
  modeColorLight: string
) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      overflow: "hidden",
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.text,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      fontFamily: typography.fonts.regular,
      color: colors.textSecondary,
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
