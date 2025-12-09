/**
 * FoulPointModal - Modal for selecting foul point values
 * Extracted from FoulButton as part of GH-019
 */

import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { FoulValue } from "../../lib/constants/game";
import { SNOOKER_FOUL_VALUES } from "../../lib/constants/game";
import { typography } from "../../lib/theme";

interface FoulPointModalColors {
  modalSurface: string;
  modalText: string;
  modalTextSecondary: string;
  error: string;
}

interface FoulPointModalProps {
  readonly visible: boolean;
  readonly onSelectFoul: (points: FoulValue) => void;
  readonly onCancel: () => void;
  readonly colors: FoulPointModalColors;
}

export function FoulPointModal({
  visible,
  onSelectFoul,
  onCancel,
  colors,
}: FoulPointModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={[styles.content, { backgroundColor: colors.modalSurface }]}
          onPress={(e) => e.stopPropagation()}
          accessibilityLabel="Foul point selection"
          accessibilityRole="menu"
        >
          <Text style={[styles.title, { color: colors.modalText }]}>
            Select Foul Points
          </Text>
          <Text style={[styles.subtitle, { color: colors.modalTextSecondary }]}>
            Points will be awarded to opponent
          </Text>

          <View style={styles.optionsContainer}>
            {SNOOKER_FOUL_VALUES.map((points) => (
              <TouchableOpacity
                key={points}
                style={[styles.option, { backgroundColor: colors.error }]}
                onPress={() => onSelectFoul(points)}
                activeOpacity={0.7}
                accessibilityLabel={`${points} points foul`}
                accessibilityRole="button"
                accessibilityHint={`Award ${points} points to opponent`}
              >
                <Text style={styles.optionText}>{points}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.cancelButton,
              { borderColor: colors.modalTextSecondary },
            ]}
            onPress={onCancel}
            activeOpacity={0.7}
            accessibilityLabel="Cancel"
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.cancelButtonText,
                { color: colors.modalTextSecondary },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.fonts.regular,
    marginBottom: 24,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
    gap: 12,
  },
  option: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 64,
  },
  optionText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    color: "#ffffff",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
  },
});
