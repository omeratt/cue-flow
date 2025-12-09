/**
 * GameHeader - Game screen header with back button, mode info, mute, and pause buttons
 * Extracted from GamePlayScreen for better component organization
 *
 * Implements partial GH-016: Mute sounds (quick mute button)
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { useSharedValue } from "react-native-reanimated";
import { useAnimatedReaction } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import type { TimerState } from "../../hooks/useGameTimer";
import type { GameMode } from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { GameModeIcon } from "./GameModeIcon";
import { PauseResumeIcon } from "./PauseResumeIcon";

interface GameModeConfig {
  label: string;
}

interface GameHeaderProps {
  readonly gameMode: GameMode | null;
  readonly modeConfig: GameModeConfig | null;
  readonly timerState: ReturnType<typeof useSharedValue<TimerState>>;
  readonly textColor: string;
  readonly onBack: () => void;
  readonly onPauseResume: () => void;
  readonly soundEnabled?: boolean;
  readonly onToggleSound?: () => void;
}

export function GameHeader({
  gameMode,
  modeConfig,
  timerState,
  textColor,
  onBack,
  onPauseResume,
  soundEnabled = true,
  onToggleSound,
}: Readonly<GameHeaderProps>) {
  const insets = useSafeAreaInsets();

  // Sync timer state to React state for accessibility label
  const [currentTimerState, setCurrentTimerState] =
    useState<TimerState>("idle");

  useAnimatedReaction(
    () => timerState.value,
    (newState) => {
      scheduleOnRN(setCurrentTimerState, newState);
    },
    []
  );

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.iconButton}
        accessibilityLabel="Close game"
        accessibilityRole="button"
        accessibilityHint="Returns to game setup"
      >
        <Ionicons name="close" size={28} color={textColor} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        {gameMode && modeConfig && (
          <>
            <GameModeIcon mode={gameMode} size="md" />
            <Text style={[styles.modeLabel, { color: textColor }]}>
              {modeConfig.label}
            </Text>
          </>
        )}
      </View>

      <View style={styles.headerRight}>
        {onToggleSound && (
          <TouchableOpacity
            onPress={onToggleSound}
            style={styles.iconButton}
            accessibilityLabel={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            accessibilityRole="button"
            accessibilityState={{ selected: soundEnabled }}
          >
            <Ionicons
              name={soundEnabled ? "volume-high" : "volume-mute"}
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onPauseResume}
          style={styles.iconButton}
          accessibilityLabel={
            currentTimerState === "running" ? "Pause timer" : "Resume timer"
          }
          accessibilityRole="button"
        >
          <PauseResumeIcon timerState={timerState} color={textColor} />
        </TouchableOpacity>
      </View>
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
  },
});
