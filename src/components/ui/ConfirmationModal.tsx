/**
 * ConfirmationModal - A reusable confirmation dialog component
 * Used for destructive actions like deleting rivalries (GH-013)
 * Refactored in GH-019: Condensed styles
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <AnimatedPressable style={styles.backdrop} onPress={onCancel}>
        <Animated.View style={styles.container}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={[styles.content, { backgroundColor: colors.surface }]}>
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
                  name={
                    isDestructive ? "warning-outline" : "help-circle-outline"
                  }
                  size={32}
                  color={isDestructive ? colors.error : colors.primary}
                />
              </View>

              {/* Title & Message */}
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
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
                      backgroundColor: isDestructive
                        ? colors.error
                        : colors.primary,
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
            </View>
          </Pressable>
        </Animated.View>
      </AnimatedPressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: { width: "100%", maxWidth: 340 },
  content: { borderRadius: 20, padding: 24, alignItems: "center" },
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
