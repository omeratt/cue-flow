/**
 * HomeScreen - Main screen with game mode selection and rivalry list
 * Implements GH-001: Select game mode
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GameModeCard } from "../components/game/GameModeCard";
import { RivalryCard } from "../components/game/RivalryCard";
import { useTheme } from "../components/providers/ThemeProvider";
import { EmptyState } from "../components/ui/EmptyState";
import type { GameMode } from "../lib/constants/game";
import { typography } from "../lib/theme";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setGameMode } from "../store/slices/gameSlice";
import { setActiveRivalry } from "../store/slices/rivalrySlice";
import type { Rivalry } from "../types/rivalry";

export function HomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const rivalries = useAppSelector((state) => state.rivalry.rivalries);
  const hapticEnabled = useAppSelector((state) => state.settings.hapticEnabled);

  // Sort rivalries by most recently played
  const sortedRivalries = useMemo(() => {
    return [...rivalries].sort(
      (a, b) =>
        new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime()
    );
  }, [rivalries]);

  const handleGameModeSelect = (mode: GameMode) => {
    dispatch(setGameMode(mode));
    dispatch(setActiveRivalry(null));
    router.push("/game/setup");
  };

  const handleRivalryPress = (rivalry: Rivalry) => {
    dispatch(setGameMode(rivalry.gameMode));
    dispatch(setActiveRivalry(rivalry.id));
    router.push("/game/setup");
  };

  const handleSettingsPress = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/settings");
  };

  const styles = createStyles(theme.colors, insets);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>CueFlow</Text>
              <Text style={styles.subtitle}>Choose your game</Text>
            </View>
            <TouchableOpacity
              onPress={handleSettingsPress}
              style={styles.settingsButton}
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

        {/* Game Mode Selection - GH-001 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Game</Text>
          <GameModeCard mode="billiard" onPress={handleGameModeSelect} />
          <GameModeCard mode="snooker" onPress={handleGameModeSelect} />
        </View>

        {/* Rivalries Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rivalries</Text>
          {sortedRivalries.length > 0 ? (
            sortedRivalries.map((rivalry) => (
              <RivalryCard
                key={rivalry.id}
                rivalry={rivalry}
                onPress={handleRivalryPress}
              />
            ))
          ) : (
            <EmptyState
              icon="🎯"
              title="No Rivalries Yet"
              message="Start a game with a friend to begin tracking your rivalry!"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (
  colors: ReturnType<typeof useTheme>["theme"]["colors"],
  insets: ReturnType<typeof useSafeAreaInsets>
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 32,
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 32,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerTitleContainer: {
      flex: 1,
    },
    settingsButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      backgroundColor: colors.surface,
    },
    title: {
      fontSize: 36,
      fontWeight: "700",
      fontFamily: typography.fonts.bold,
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 18,
      fontFamily: typography.fonts.regular,
      color: colors.textSecondary,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 16,
    },
  });
