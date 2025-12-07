/**
 * GameHeader - Game screen header with back button, mode info, and pause button
 * Extracted from GamePlayScreen for better component organization
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TimerState } from "../../hooks/useGameTimer";
import { PauseResumeIcon } from "./PauseResumeIcon";

interface GameModeConfig {
  icon: string;
  label: string;
}

interface GameHeaderProps {
  readonly modeConfig: GameModeConfig | null;
  readonly timerState: ReturnType<typeof useSharedValue<TimerState>>;
  readonly textColor: string;
  readonly onBack: () => void;
  readonly onPauseResume: () => void;
}

export function GameHeader({
  modeConfig,
  timerState,
  textColor,
  onBack,
  onPauseResume,
}: Readonly<GameHeaderProps>) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <TouchableOpacity onPress={onBack} style={styles.iconButton}>
        <Ionicons name="close" size={28} color={textColor} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        {modeConfig && (
          <>
            <Text style={styles.modeIcon}>{modeConfig.icon}</Text>
            <Text style={[styles.modeLabel, { color: textColor }]}>
              {modeConfig.label}
            </Text>
          </>
        )}
      </View>

      <TouchableOpacity onPress={onPauseResume} style={styles.iconButton}>
        <PauseResumeIcon timerState={timerState} color={textColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeIcon: {
    fontSize: 24,
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
});
