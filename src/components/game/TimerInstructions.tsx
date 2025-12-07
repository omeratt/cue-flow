/**
 * TimerInstructions - Displays contextual instructions based on timer state
 * Extracted from GamePlayScreen for better component organization
 */

import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import type { TimerState } from "../../hooks/useGameTimer";
import { typography } from "../../lib/theme";

interface TimerInstructionsProps {
  readonly timerState: ReturnType<typeof useSharedValue<TimerState>>;
  readonly textColor: string;
}

export function TimerInstructions({
  timerState,
  textColor,
}: Readonly<TimerInstructionsProps>) {
  const [state, setState] = useState<TimerState>("idle");

  useAnimatedReaction(
    () => timerState.value,
    (newState) => {
      scheduleOnRN(setState, newState);
    },
    []
  );

  const getInstructionText = (): string => {
    switch (state) {
      case "idle":
        return "Tap the timer to start your turn";
      case "running":
        return "Tap to end turn and switch player";
      case "paused":
        return "Timer paused - tap resume to continue";
      case "expired":
        return "Time's up! Tap to start next turn";
      default:
        return "";
    }
  };

  return (
    <Text style={[styles.instructionText, { color: textColor }]}>
      {getInstructionText()}
    </Text>
  );
}

const styles = StyleSheet.create({
  instructionText: {
    fontSize: 14,
    fontFamily: typography.fonts.regular,
    textAlign: "center",
  },
});
