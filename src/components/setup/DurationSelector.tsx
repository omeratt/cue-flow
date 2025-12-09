/**
 * DurationSelector - Timer duration selection for game setup
 * Part of GH-019: Refactor large components
 */

import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../../components/providers/ThemeProvider";
import { TIMER_PRESETS } from "../../lib/constants/game";
import { typography } from "../../lib/theme";
import { DurationButton } from "./DurationButton";

interface DurationSelectorProps {
  readonly selectedDuration: number;
  readonly customDuration: string;
  readonly isCustom: boolean;
  readonly onDurationSelect: (duration: number) => void;
  readonly onCustomDurationChange: (text: string) => void;
}

export function DurationSelector({
  selectedDuration,
  customDuration,
  isCustom,
  onDurationSelect,
  onCustomDurationChange,
}: DurationSelectorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Turn Duration</Text>

      <View style={styles.durationGrid}>
        {TIMER_PRESETS.map((duration) => (
          <DurationButton
            key={duration}
            duration={duration}
            isSelected={!isCustom && selectedDuration === duration}
            onPress={() => onDurationSelect(duration)}
          />
        ))}
      </View>

      <View style={styles.customDurationContainer}>
        <Text style={styles.inputLabel}>Custom (seconds)</Text>
        <TextInput
          style={[styles.input, isCustom && styles.inputActive]}
          value={customDuration}
          onChangeText={onCustomDurationChange}
          placeholder="e.g. 25"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="number-pad"
          returnKeyType="done"
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["theme"]["colors"]) =>
  StyleSheet.create({
    section: { marginBottom: 32 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 16,
    },
    durationGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
    customDurationContainer: { marginTop: 8 },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      fontFamily: typography.fonts.medium,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      fontFamily: typography.fonts.regular,
      color: colors.text,
    },
    inputActive: { borderColor: colors.primary, borderWidth: 2 },
  });
