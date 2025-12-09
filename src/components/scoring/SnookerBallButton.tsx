/**
 * SnookerBallButton - Button for scoring snooker ball values
 * Implements GH-009: Score snooker points
 *
 * Wrapper around SnookerBall component for game scoring functionality.
 */

import React, { useCallback } from "react";

import type { SnookerBallType } from "../../lib/constants/game";
import { SNOOKER_BALLS } from "../../lib/constants/game";
import { SnookerBall } from "../ui/SnookerBall";

interface SnookerBallButtonProps {
  readonly ballType: SnookerBallType;
  readonly onPress: (ballType: SnookerBallType, value: number) => void;
  readonly disabled?: boolean;
  readonly hapticEnabled?: boolean;
}

export function SnookerBallButton({
  ballType,
  onPress,
  disabled = false,
  hapticEnabled = true,
}: SnookerBallButtonProps) {
  const ball = SNOOKER_BALLS[ballType];

  const handlePress = useCallback(() => {
    onPress(ballType, ball.value);
  }, [onPress, ballType, ball.value]);

  return (
    <SnookerBall
      preset={ballType}
      size={40}
      onPress={handlePress}
      hapticEnabled={hapticEnabled}
      disabled={disabled}
    />
  );
}
