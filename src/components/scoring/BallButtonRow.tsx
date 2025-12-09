/**
 * BallButtonRow - Row of snooker ball buttons for scoring
 * Implements GH-009: Score snooker points
 *
 * Displays all snooker ball buttons in a horizontal row with
 * consistent spacing. Handles point scoring callbacks.
 */

import React from "react";
import { StyleSheet, View } from "react-native";

import type { SnookerBallType } from "../../lib/constants/game";
import { SnookerBallButton } from "./SnookerBallButton";

// Ball order for display (red first, then colored balls in value order)
const BALL_ORDER: SnookerBallType[] = [
  "red",
  "yellow",
  "green",
  "brown",
  "blue",
  "pink",
  "black",
];

interface BallButtonRowProps {
  readonly onBallPress: (ballType: SnookerBallType, value: number) => void;
  readonly disabled?: boolean;
  readonly hapticEnabled?: boolean;
}

export function BallButtonRow({
  onBallPress,
  disabled = false,
  hapticEnabled = true,
}: BallButtonRowProps) {
  return (
    <View style={styles.container}>
      {BALL_ORDER.map((ballType) => (
        <SnookerBallButton
          key={ballType}
          ballType={ballType}
          onPress={onBallPress}
          disabled={disabled}
          hapticEnabled={hapticEnabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
});
