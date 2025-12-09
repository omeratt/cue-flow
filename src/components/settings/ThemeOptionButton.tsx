/**
 * ThemeOptionButton - Theme selection button for settings
 * Part of GH-019: Refactor large components
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../components/providers/ThemeProvider";
import { typography } from "../../lib/theme";

interface ThemeOptionButtonProps {
  readonly label: string;
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly isSelected: boolean;
  readonly onPress: () => void;
}

export function ThemeOptionButton({
  label,
  icon,
  isSelected,
  onPress,
}: ThemeOptionButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: isSelected
            ? theme.colors.primary
            : theme.colors.surface,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={
          isSelected ? theme.colors.buttonText : theme.colors.textSecondary
        }
      />
      <Text
        style={[
          styles.label,
          { color: isSelected ? theme.colors.buttonText : theme.colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
  },
});
