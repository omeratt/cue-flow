/**
 * ConfirmationModal - A reusable confirmation dialog component
 * Used for destructive actions like deleting rivalries (GH-013)
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
  const styles = createStyles(theme.colors, isDestructive);

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
          {/* Prevent backdrop press from closing when tapping content */}
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.content}>
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  isDestructive && styles.iconContainerDestructive,
                ]}
              >
                <Ionicons
                  name={
                    isDestructive ? "warning-outline" : "help-circle-outline"
                  }
                  size={32}
                  color={
                    isDestructive ? theme.colors.error : theme.colors.primary
                  }
                />
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Message */}
              <Text style={styles.message}>{message}</Text>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    isDestructive && styles.confirmButtonDestructive,
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </AnimatedPressable>
    </Modal>
  );
}

const createStyles = (
  colors: ReturnType<typeof useTheme>["theme"]["colors"],
  isDestructive: boolean
) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    container: {
      width: "100%",
      maxWidth: 340,
    },
    content: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    iconContainerDestructive: {
      backgroundColor: `${colors.error}15`,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      fontFamily: typography.fonts.bold,
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    message: {
      fontSize: 15,
      fontFamily: typography.fonts.regular,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 24,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
      width: "100%",
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.divider,
      alignItems: "center",
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.text,
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
    },
    confirmButtonDestructive: {
      backgroundColor: colors.error,
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: "#FFFFFF",
    },
  });
