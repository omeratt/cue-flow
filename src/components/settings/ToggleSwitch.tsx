/**
 * ToggleSwitch - Toggle switch component for settings
 * Part of GH-019: Refactor large components
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../components/providers/ThemeProvider";

interface ToggleSwitchProps {
  readonly value: boolean;
}

export function ToggleSwitch({ value }: ToggleSwitchProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: value ? theme.colors.primary : theme.colors.border },
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: theme.colors.buttonText,
            transform: [{ translateX: value ? 18 : 0 }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: 44, height: 26, borderRadius: 13, padding: 2 },
  thumb: { width: 22, height: 22, borderRadius: 11 },
});
