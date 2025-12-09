/**
 * SettingRow - A single setting row with icon and content
 * Part of GH-019: Refactor large components
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../components/providers/ThemeProvider";
import { typography } from "../../lib/theme";

interface SettingRowProps {
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly iconColor?: string;
  readonly iconBackground?: string;
  readonly label: string;
  readonly labelColor?: string;
  readonly description?: string;
  readonly rightElement?: React.ReactNode;
  readonly onPress?: () => void;
  readonly showChevron?: boolean;
}

export function SettingRow({
  icon,
  iconColor,
  iconBackground,
  label,
  labelColor,
  description,
  rightElement,
  onPress,
  showChevron,
}: SettingRowProps) {
  const { theme } = useTheme();

  const content = (
    <>
      <View style={styles.settingInfo}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                iconBackground ?? theme.colors.backgroundSecondary,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={22}
            color={iconColor ?? theme.colors.primary}
          />
        </View>
        <View style={styles.settingTextContainer}>
          <Text
            style={[
              styles.settingLabel,
              { color: labelColor ?? theme.colors.text },
            ]}
          >
            {label}
          </Text>
          {description && (
            <Text
              style={[
                styles.settingDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textMuted}
        />
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.settingRow}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.settingRow}>{content}</View>;
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingTextContainer: { flex: 1 },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: typography.fonts.medium,
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    marginTop: 2,
  },
});
