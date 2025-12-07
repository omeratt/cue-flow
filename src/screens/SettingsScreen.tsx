/**
 * SettingsScreen - App settings including theme, sound, and haptic toggles
 * Implements GH-014: Toggle theme
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../components/providers/ThemeProvider";
import { typography } from "../lib/theme";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setTheme,
  setUseSystemTheme,
  toggleHaptic,
  toggleSound,
} from "../store/slices/settingsSlice";

type ThemeOption = "auto" | "light" | "dark";

export function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    useSystemTheme,
    theme: savedTheme,
    soundEnabled,
    hapticEnabled,
  } = useAppSelector((state) => state.settings);

  // Determine current theme option
  const currentThemeOption: ThemeOption = useSystemTheme ? "auto" : savedTheme;

  const handleThemeSelect = (option: ThemeOption) => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (option === "auto") {
      dispatch(setUseSystemTheme(true));
    } else {
      dispatch(setTheme(option));
    }
  };

  const handleToggleSound = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch(toggleSound());
  };

  const handleToggleHaptic = () => {
    // Provide haptic feedback before toggling off
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch(toggleHaptic());
  };

  const handleBack = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const styles = createStyles(theme.colors, insets);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section - GH-014 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={isDark ? "moon" : "sunny"}
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.settingLabel}>Theme</Text>
              </View>
            </View>

            <View style={styles.themeOptions}>
              <ThemeOptionButton
                label="Auto"
                icon="phone-portrait-outline"
                isSelected={currentThemeOption === "auto"}
                onPress={() => handleThemeSelect("auto")}
                colors={theme.colors}
              />
              <ThemeOptionButton
                label="Light"
                icon="sunny-outline"
                isSelected={currentThemeOption === "light"}
                onPress={() => handleThemeSelect("light")}
                colors={theme.colors}
              />
              <ThemeOptionButton
                label="Dark"
                icon="moon-outline"
                isSelected={currentThemeOption === "dark"}
                onPress={() => handleThemeSelect("dark")}
                colors={theme.colors}
              />
            </View>
          </View>
        </View>

        {/* Audio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio & Haptics</Text>
          <View style={styles.card}>
            {/* Sound Toggle */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleToggleSound}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={soundEnabled ? "volume-high" : "volume-mute"}
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>
                    Timer beeps and alerts
                  </Text>
                </View>
              </View>
              <ToggleSwitch value={soundEnabled} colors={theme.colors} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Haptic Toggle */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleToggleHaptic}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="pulse"
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Vibration on timer events
                  </Text>
                </View>
              </View>
              <ToggleSwitch value={hapticEnabled} colors={theme.colors} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Text style={styles.appIcon}>🎱</Text>
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>CueFlow</Text>
                  <Text style={styles.settingDescription}>Version 1.0.0</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Theme Option Button Component
interface ThemeOptionButtonProps {
  readonly label: string;
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly isSelected: boolean;
  readonly onPress: () => void;
  readonly colors: ReturnType<typeof useTheme>["theme"]["colors"];
}

function ThemeOptionButton({
  label,
  icon,
  isSelected,
  onPress,
  colors,
}: ThemeOptionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        themeOptionStyles.button,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isSelected ? colors.buttonText : colors.textSecondary}
      />
      <Text
        style={[
          themeOptionStyles.label,
          {
            color: isSelected ? colors.buttonText : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const themeOptionStyles = StyleSheet.create({
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

// Toggle Switch Component
interface ToggleSwitchProps {
  readonly value: boolean;
  readonly colors: ReturnType<typeof useTheme>["theme"]["colors"];
}

function ToggleSwitch({ value, colors }: ToggleSwitchProps) {
  return (
    <View
      style={[
        toggleStyles.track,
        {
          backgroundColor: value ? colors.primary : colors.border,
        },
      ]}
    >
      <View
        style={[
          toggleStyles.thumb,
          {
            backgroundColor: colors.buttonText,
            transform: [{ translateX: value ? 18 : 0 }],
          },
        ]}
      />
    </View>
  );
}

const toggleStyles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});

const createStyles = (
  colors: ReturnType<typeof useTheme>["theme"]["colors"],
  insets: ReturnType<typeof useSafeAreaInsets>
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: insets.top + 8,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.text,
    },
    headerSpacer: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: insets.bottom + 32,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: "hidden",
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    settingInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    settingTextContainer: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: "500",
      fontFamily: typography.fonts.medium,
      color: colors.text,
    },
    settingDescription: {
      fontSize: 13,
      fontFamily: typography.fonts.regular,
      color: colors.textSecondary,
      marginTop: 2,
    },
    themeOptions: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: 16,
    },
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginLeft: 64,
    },
    appIcon: {
      fontSize: 20,
    },
  });
