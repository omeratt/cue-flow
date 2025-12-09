/**
 * useSnookerBallAnimation - Animation hook for SnookerBall component
 *
 * Handles press animations with haptic feedback
 */

import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface UseSnookerBallAnimationProps {
  readonly disabled: boolean;
  readonly isPressable: boolean;
  readonly hapticEnabled: boolean;
  readonly onPress?: () => void;
}

interface UseSnookerBallAnimationReturn {
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  handlePressIn: () => void;
  handlePressOut: () => void;
  handlePress: () => void;
}

const SPRING_CONFIG_PRESS_IN = {
  damping: 15,
  stiffness: 400,
};

const SPRING_CONFIG_PRESS_OUT = {
  damping: 12,
  stiffness: 300,
};

const SCALE_PRESSED = 0.9;
const SCALE_NORMAL = 1;

export function useSnookerBallAnimation({
  disabled,
  isPressable,
  hapticEnabled,
  onPress,
}: UseSnookerBallAnimationProps): UseSnookerBallAnimationReturn {
  const scale = useSharedValue(SCALE_NORMAL);

  const handlePressIn = useCallback(() => {
    if (disabled || !isPressable) return;
    scale.value = withSpring(SCALE_PRESSED, SPRING_CONFIG_PRESS_IN);
  }, [disabled, isPressable, scale]);

  const handlePressOut = useCallback(() => {
    if (disabled || !isPressable) return;
    scale.value = withSpring(SCALE_NORMAL, SPRING_CONFIG_PRESS_OUT);
  }, [disabled, isPressable, scale]);

  const handlePress = useCallback(() => {
    if (disabled || !onPress) return;
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [disabled, hapticEnabled, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    handlePress,
  };
}
