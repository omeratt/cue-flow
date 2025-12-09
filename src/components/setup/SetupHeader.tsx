/**
 * SetupHeader - Header component for game setup screen
 * Part of GH-019: Refactor large components
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GAME_MODES, type GameMode } from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { GameModeIcon } from "../icons/GameModeIcon";
import { useTheme } from "../providers/ThemeProvider";

interface SetupHeaderProps {
  readonly gameMode: GameMode;
  readonly onBack: () => void;
}

export function SetupHeader({ gameMode, onBack }: SetupHeaderProps) {
  const { theme } = useTheme();
  const modeConfig = GAME_MODES[gameMode];

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <GameModeIcon mode={gameMode} size="md" />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {modeConfig.label} Setup
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
  },
});
