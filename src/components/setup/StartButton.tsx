/**
 * StartButton - Start game button for game setup
 * Part of GH-019: Refactor large components
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

interface StartButtonProps {
  readonly isValid: boolean;
  readonly onPress: () => void;
}

export function StartButton({ isValid, onPress }: StartButtonProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.divider,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.startButton,
          { backgroundColor: theme.colors.primary },
          !isValid && styles.startButtonDisabled,
        ]}
        onPress={onPress}
        disabled={!isValid}
      >
        <Text
          style={[styles.startButtonText, { color: theme.colors.buttonText }]}
        >
          Start Game
        </Text>
        <Ionicons name="play" size={20} color={theme.colors.buttonText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  startButtonDisabled: { opacity: 0.5 },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
    marginRight: 8,
  },
});
