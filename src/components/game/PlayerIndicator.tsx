/**
 * PlayerIndicator - Shows current player's turn with animated name
 * Extracted from GamePlayScreen for better component organization
 */

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { typography } from "../../lib/theme";

interface PlayerIndicatorProps {
  readonly currentPlayerName: string;
  readonly labelColor: string;
  readonly nameColor: string;
}

export function PlayerIndicator({
  currentPlayerName,
  labelColor,
  nameColor,
}: Readonly<PlayerIndicatorProps>) {
  const playerNameScale = useSharedValue(1);

  const playerNameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playerNameScale.value }],
  }));

  // Animate player name on change
  useEffect(() => {
    playerNameScale.value = withSpring(1.1, { damping: 55 });
    const timeoutId = setTimeout(() => {
      playerNameScale.value = withSpring(1, { damping: 55 });
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [currentPlayerName, playerNameScale]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.playerName, { color: nameColor }, playerNameStyle]}
      >
        {currentPlayerName}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fonts.regular,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
  },
});
