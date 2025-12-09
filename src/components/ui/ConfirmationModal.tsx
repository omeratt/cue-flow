/**
 * ConfirmationModal - A reusable confirmation dialog component
 * Used for destructive actions like deleting rivalries (GH-013)
 * Refactored in GH-019: Condensed styles
 * Enhanced in GH-025: Spring-based modal animation
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";
import { AnimatedModal } from "./AnimatedModal";

interface ConfirmationModalProps {
  readonly visible: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly isDestructive?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <AnimatedModal
      visible={visible}
      onClose={onCancel}
      backgroundColor={colors.surface}
      backdropOpacity={0.5}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: `${
              isDestructive ? colors.error : colors.primary
            }15`,
          },
        ]}
      >
        <Ionicons
          name={isDestructive ? "warning-outline" : "help-circle-outline"}
          size={32}
          color={isDestructive ? colors.error : colors.primary}
        />
      </View>

      {/* Title & Message */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.divider }]}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {cancelLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isDestructive ? colors.error : colors.primary,
            },
          ]}
          onPress={onConfirm}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
            {confirmLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    fontFamily: typography.fonts.regular,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: { flexDirection: "row", gap: 12, width: "100%" },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
  },
});
