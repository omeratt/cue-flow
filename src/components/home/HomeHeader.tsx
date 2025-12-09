/**
 * HomeHeader - Header component for HomeScreen
 * Extracted from HomeScreen as part of GH-019
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { typography } from "../../lib/theme";
import { useTheme } from "../providers/ThemeProvider";

interface HomeHeaderProps {
  readonly onSettingsPress: () => void;
}

export function HomeHeader({ onSettingsPress }: HomeHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            CueFlow
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Choose your game
          </Text>
        </View>
        <TouchableOpacity
          onPress={onSettingsPress}
          style={[
            styles.settingsButton,
            { backgroundColor: theme.colors.surface },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 32 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitleContainer: { flex: 1 },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    fontFamily: typography.fonts.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: typography.fonts.regular,
  },
});
