/**
 * PlayerIndicator - Shows both players with switch button in the middle
 * Redesigned in GH-024 (FEAT-003): New layout with Player1 --- Switch --- Player2
 * Updated in GH-024 (FEAT-004): Professional transition animation when switching
 *
 * Features:
 * - Active player: Primary color, larger font, slight glow
 * - Inactive player: Dimmed/muted color
 * - Smooth transition animation when players switch
 * - Switch button in the center
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { typography } from "../../lib/theme";

interface PlayerIndicatorProps {
  readonly player1Name: string;
  readonly player2Name: string;
  readonly currentPlayer: "player1" | "player2";
  readonly onSwitchPlayer: () => void;
  readonly primaryColor: string;
  readonly mutedColor: string;
  readonly switchButtonColor: string;
}

// Smooth animation configs
const SWITCH_ANIMATION_CONFIG = {
  duration: 300,
  easing: Easing.out(Easing.cubic),
};

const SCALE_PULSE_CONFIG = {
  duration: 150,
  easing: Easing.out(Easing.quad),
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlayerIndicator({
  player1Name,
  player2Name,
  currentPlayer,
  onSwitchPlayer,
  primaryColor,
  mutedColor,
  switchButtonColor,
}: Readonly<PlayerIndicatorProps>) {
  // Animation values
  const player1Scale = useSharedValue(currentPlayer === "player1" ? 1.1 : 1);
  const player2Scale = useSharedValue(currentPlayer === "player2" ? 1.1 : 1);
  const player1Opacity = useSharedValue(currentPlayer === "player1" ? 1 : 0.5);
  const player2Opacity = useSharedValue(currentPlayer === "player2" ? 1 : 0.5);
  const switchButtonRotation = useSharedValue(0);

  // Animate when current player changes
  useEffect(() => {
    const isPlayer1Active = currentPlayer === "player1";

    // Animate player 1
    player1Scale.value = withTiming(
      isPlayer1Active ? 1.1 : 1,
      SWITCH_ANIMATION_CONFIG
    );
    player1Opacity.value = withTiming(
      isPlayer1Active ? 1 : 0.5,
      SWITCH_ANIMATION_CONFIG
    );

    // Animate player 2
    player2Scale.value = withTiming(
      isPlayer1Active ? 1 : 1.1,
      SWITCH_ANIMATION_CONFIG
    );
    player2Opacity.value = withTiming(
      isPlayer1Active ? 0.5 : 1,
      SWITCH_ANIMATION_CONFIG
    );

    // Rotate switch button
    switchButtonRotation.value = withSequence(
      withTiming(180, SCALE_PULSE_CONFIG),
      withTiming(0, { duration: 0 })
    );
  }, [
    currentPlayer,
    player1Scale,
    player1Opacity,
    player2Scale,
    player2Opacity,
    switchButtonRotation,
  ]);

  // Animated styles
  const player1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: player1Scale.value }],
    opacity: player1Opacity.value,
  }));

  const player2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: player2Scale.value }],
    opacity: player2Opacity.value,
  }));

  const switchButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${switchButtonRotation.value}deg` },
      {
        scale: interpolate(
          switchButtonRotation.value,
          [0, 90, 180],
          [1, 1.1, 1]
        ),
      },
    ],
  }));

  // Get colors based on active state
  const player1Color = currentPlayer === "player1" ? primaryColor : mutedColor;
  const player2Color = currentPlayer === "player2" ? primaryColor : mutedColor;

  return (
    <View style={styles.container}>
      {/* Player 1 */}
      <Animated.Text
        style={[
          styles.playerName,
          { color: player1Color },
          player1AnimatedStyle,
        ]}
        numberOfLines={1}
      >
        {player1Name}
      </Animated.Text>

      {/* Switch Button */}
      <AnimatedPressable
        style={[styles.switchButton, switchButtonAnimatedStyle]}
        onPress={onSwitchPlayer}
        accessibilityLabel="Switch player turn"
        accessibilityRole="button"
      >
        <Ionicons name="swap-horizontal" size={24} color={switchButtonColor} />
      </AnimatedPressable>

      {/* Player 2 */}
      <Animated.Text
        style={[
          styles.playerName,
          { color: player2Color },
          player2AnimatedStyle,
        ]}
        numberOfLines={1}
      >
        {player2Name}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  playerName: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
    flex: 1,
    textAlign: "center",
  },
  switchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
});
