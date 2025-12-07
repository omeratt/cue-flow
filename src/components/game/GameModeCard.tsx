/**
 * GameModeCard - A card component for selecting game mode (Billiard/Snooker)
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { GameMode } from "../../lib/constants/game";
import { GAME_MODES } from "../../lib/constants/game";
import { useTheme } from "../providers/ThemeProvider";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface GameModeCardProps {
  readonly mode: GameMode;
  readonly onPress: (mode: GameMode) => void;
  readonly style?: ViewStyle;
}

export function GameModeCard({ mode, onPress, style }: GameModeCardProps) {
  const { theme } = useTheme();
  const pressed = useSharedValue(0);
  const hovered = useSharedValue(0);

  const modeConfig = GAME_MODES[mode];
  const modeColor =
    mode === "billiard" ? theme.colors.billiard : theme.colors.snooker;
  const modeColorLight =
    mode === "billiard"
      ? theme.colors.billiardLight
      : theme.colors.snookerLight;

  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(1 - pressed.value * 0.03, {
      damping: 15,
      stiffness: 400,
    });

    const backgroundColor = interpolateColor(
      hovered.value,
      [0, 1],
      [theme.colors.surface, theme.colors.surfaceElevated]
    );

    return {
      transform: [{ scale }],
      backgroundColor,
    };
  });

  const handlePressIn = () => {
    pressed.value = 1;
    hovered.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    pressed.value = 0;
    hovered.value = withTiming(0, { duration: 150 });
  };

  const styles = createStyles(theme.colors, modeColor, modeColorLight);

  return (
    <AnimatedTouchable
      onPress={() => onPress(mode)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.card, animatedStyle, style]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{modeConfig.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{modeConfig.label}</Text>
        <Text style={styles.description}>{modeConfig.description}</Text>
      </View>
      <View style={[styles.indicator, { backgroundColor: modeColor }]} />
    </AnimatedTouchable>
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
      backgroundColor: `${modeColor}15`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    icon: {
      fontSize: 28,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
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
