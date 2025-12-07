/**
 * PlayerIndicator - Shows current player's turn with animated name
 * Extracted from GamePlayScreen for better component organization
 */

import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
    playerNameScale.value = withSpring(1.1, { damping: 10 });
    const timeoutId = setTimeout(() => {
      playerNameScale.value = withSpring(1, { damping: 10 });
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [currentPlayerName, playerNameScale]);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: labelColor }]}>Current Turn</Text>
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
    marginBottom: 4,
  },
  playerName: {
    fontSize: 28,
    fontWeight: "700",
  },
});
