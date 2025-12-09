/**
 * RivalryBadge - Badge showing active rivalry status
 * Part of GH-019: Refactor large components
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { typography } from "../../lib/theme";
import type { Rivalry } from "../../types/rivalry";
import { useTheme } from "../providers/ThemeProvider";

interface RivalryBadgeProps {
  readonly rivalry: Rivalry;
}

export function RivalryBadge({ rivalry }: RivalryBadgeProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.rivalryBadge,
        { backgroundColor: `${theme.colors.primary}15` },
      ]}
    >
      <Ionicons name="trophy-outline" size={16} color={theme.colors.primary} />
      <Text style={[styles.rivalryBadgeText, { color: theme.colors.primary }]}>
        Continuing rivalry: {rivalry.wins.player1} - {rivalry.wins.player2}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rivalryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  rivalryBadgeText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
  },
});
