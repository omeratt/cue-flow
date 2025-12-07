/**
 * PauseResumeIcon - Icon that toggles between pause and play based on timer state
 * Extracted from GamePlayScreen for better component organization
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import type { TimerState } from "../../hooks/useGameTimer";

interface PauseResumeIconProps {
  readonly timerState: ReturnType<typeof useSharedValue<TimerState>>;
  readonly color: string;
  readonly size?: number;
}

export function PauseResumeIcon({
  timerState,
  color,
  size = 24,
}: Readonly<PauseResumeIconProps>) {
  const [isPaused, setIsPaused] = useState(false);

  useAnimatedReaction(
    () => timerState.value,
    (state) => {
      scheduleOnRN(setIsPaused, state === "paused");
    },
    []
  );

  return (
    <Ionicons name={isPaused ? "play" : "pause"} size={size} color={color} />
  );
}
