/**
 * SettingsSection - A section container for settings
 * Part of GH-019: Refactor large components
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../components/providers/ThemeProvider";
import { typography } from "../../lib/theme";

interface SettingsSectionProps {
  readonly title: string;
  readonly children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
        {title}
      </Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        {children}
      </View>
    </View>
  );
}

export function SettingsDivider() {
  const { theme } = useTheme();
  return (
    <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: { borderRadius: 16, overflow: "hidden" },
  divider: { height: 1, marginLeft: 64 },
});
