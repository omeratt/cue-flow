/**
 * FoulButton - Button for recording snooker fouls with point selection
 * Implements GH-010: Handle snooker fouls
 * Refactored in GH-019: Extracted modal to FoulPointModal
 * Updated in GH-021: Added shake animation on press
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { FoulValue } from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { FoulPointModal } from "../modals/FoulPointModal";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FoulButtonColors {
  buttonText: string;
  modalSurface: string;
  modalText: string;
  modalTextSecondary: string;
  error: string;
}

interface FoulButtonProps {
  readonly onFoul: (points: FoulValue) => void;
  readonly colors: FoulButtonColors;
  readonly disabled?: boolean;
  readonly hapticEnabled?: boolean;
}

// Smooth animation config for shake effect
const SHAKE_CONFIG = {
  duration: 40,
  easing: Easing.inOut(Easing.quad),
};

const RESET_CONFIG = {
  duration: 50,
  easing: Easing.out(Easing.quad),
};

const PRESS_CONFIG = {
  duration: 80,
  easing: Easing.out(Easing.quad),
};

export function FoulButton({
  onFoul,
  colors,
  disabled = false,
  hapticEnabled = true,
}: FoulButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleOpenModal = useCallback(() => {
    if (disabled) return;
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Subtle shake animation (non-bouncy)
    translateX.value = withSequence(
      withTiming(-3, SHAKE_CONFIG),
      withTiming(3, SHAKE_CONFIG),
      withTiming(-2, SHAKE_CONFIG),
      withTiming(2, SHAKE_CONFIG),
      withTiming(0, RESET_CONFIG)
    );
    setModalVisible(true);
  }, [disabled, hapticEnabled, translateX]);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withTiming(0.95, PRESS_CONFIG);
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, PRESS_CONFIG);
  }, [scale]);

  const handleSelectFoul = useCallback(
    (points: FoulValue) => {
      if (hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      onFoul(points);
      setModalVisible(false);
    },
    [onFoul, hapticEnabled]
  );

  const handleCancel = useCallback(() => {
    setModalVisible(false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <>
      <AnimatedPressable
        style={[
          styles.foulButton,
          { backgroundColor: colors.error },
          disabled && styles.disabled,
          animatedStyle,
        ]}
        onPress={handleOpenModal}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityLabel="Foul"
        accessibilityRole="button"
        accessibilityHint="Opens foul point selection. Points will be awarded to opponent"
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.foulButtonText, { color: colors.buttonText }]}>
          FOUL
        </Text>
      </AnimatedPressable>

      <FoulPointModal
        visible={modalVisible}
        onSelectFoul={handleSelectFoul}
        onCancel={handleCancel}
        colors={colors}
      />
    </>
  );
}

const styles = StyleSheet.create({
  foulButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 85,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  disabled: { opacity: 0.4 },
  foulButtonText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    letterSpacing: 1.5,
  },
});
