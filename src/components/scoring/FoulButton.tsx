/**
 * FoulButton - Button for recording snooker fouls with point selection
 * Implements GH-010: Handle snooker fouls
 * Refactored in GH-019: Extracted modal to FoulPointModal
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import type { FoulValue } from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { FoulPointModal } from "../modals/FoulPointModal";

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

export function FoulButton({
  onFoul,
  colors,
  disabled = false,
  hapticEnabled = true,
}: FoulButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = useCallback(() => {
    if (disabled) return;
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setModalVisible(true);
  }, [disabled, hapticEnabled]);

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

  return (
    <>
      <TouchableOpacity
        style={[
          styles.foulButton,
          { backgroundColor: colors.error },
          disabled && styles.disabled,
        ]}
        onPress={handleOpenModal}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityLabel="Foul"
        accessibilityRole="button"
        accessibilityHint="Opens foul point selection. Points will be awarded to opponent"
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.foulButtonText, { color: colors.buttonText }]}>
          FOUL
        </Text>
      </TouchableOpacity>

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
