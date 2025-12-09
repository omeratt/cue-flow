/**
 * SettingsScreen - App settings including theme, sound, and haptic toggles
 * Implements GH-014: Toggle theme
 * Refactored in GH-019: Split into sub-components
 */

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../components/providers/ThemeProvider";
import { SettingRow } from "../components/settings/SettingRow";
import { SettingsHeader } from "../components/settings/SettingsHeader";
import {
  SettingsDivider,
  SettingsSection,
} from "../components/settings/SettingsSection";
import { ThemeOptionButton } from "../components/settings/ThemeOptionButton";
import { ToggleSwitch } from "../components/settings/ToggleSwitch";
import { ConfirmationModal } from "../components/ui/ConfirmationModal";
import { useSettings } from "../hooks/useSettings";

export function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    showClearDataModal,
    currentThemeOption,
    soundEnabled,
    hapticEnabled,
    handleThemeSelect,
    handleToggleSound,
    handleToggleHaptic,
    handleClearDataRequest,
    handleConfirmClearData,
    handleCancelClearData,
    handleBack,
  } = useSettings();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SettingsHeader onBack={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section */}
        <SettingsSection title="Appearance">
          <SettingRow icon={isDark ? "moon" : "sunny"} label="Theme" />
          <View style={styles.themeOptions}>
            <ThemeOptionButton
              label="Auto"
              icon="phone-portrait-outline"
              isSelected={currentThemeOption === "auto"}
              onPress={() => handleThemeSelect("auto")}
            />
            <ThemeOptionButton
              label="Light"
              icon="sunny-outline"
              isSelected={currentThemeOption === "light"}
              onPress={() => handleThemeSelect("light")}
            />
            <ThemeOptionButton
              label="Dark"
              icon="moon-outline"
              isSelected={currentThemeOption === "dark"}
              onPress={() => handleThemeSelect("dark")}
            />
          </View>
        </SettingsSection>

        {/* Audio Section */}
        <SettingsSection title="Audio & Haptics">
          <SettingRow
            icon={soundEnabled ? "volume-high" : "volume-mute"}
            label="Sound Effects"
            description="Timer beeps and alerts"
            rightElement={<ToggleSwitch value={soundEnabled} />}
            onPress={handleToggleSound}
          />
          <SettingsDivider />
          <SettingRow
            icon="pulse"
            label="Haptic Feedback"
            description="Vibration on timer events"
            rightElement={<ToggleSwitch value={hapticEnabled} />}
            onPress={handleToggleHaptic}
          />
        </SettingsSection>

        {/* Data Section */}
        <SettingsSection title="Data">
          <SettingRow
            icon="trash-outline"
            iconColor={theme.colors.error}
            iconBackground={`${theme.colors.error}15`}
            label="Clear All Data"
            labelColor={theme.colors.error}
            description="Delete all rivalries and reset settings"
            showChevron
            onPress={handleClearDataRequest}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <View style={styles.aboutRow}>
            <View
              style={[
                styles.appIconContainer,
                { backgroundColor: theme.colors.backgroundSecondary },
              ]}
            >
              <Text style={styles.appIcon}>🎱</Text>
            </View>
            <View>
              <Text style={[styles.appName, { color: theme.colors.text }]}>
                CueFlow
              </Text>
              <Text
                style={[
                  styles.appVersion,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Version 1.0.0
              </Text>
            </View>
          </View>
        </SettingsSection>
      </ScrollView>

      <ConfirmationModal
        visible={showClearDataModal}
        title="Clear All Data?"
        message="This will delete all your rivalries and reset all settings to defaults. This action cannot be undone."
        confirmLabel="Clear Data"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleConfirmClearData}
        onCancel={handleCancelClearData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  themeOptions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  aboutRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  appIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  appIcon: { fontSize: 20 },
  appName: { fontSize: 16, fontWeight: "500" },
  appVersion: { fontSize: 13, marginTop: 2 },
});
