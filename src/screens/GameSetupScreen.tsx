/**
 * GameSetupScreen - Player names and timer duration selection
 * Implements:
 * - GH-002: Enter player names
 * - GH-003: Select timer duration
 */

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GameModeIcon } from "../components/game/GameModeIcon";
import { useTheme } from "../components/providers/ThemeProvider";
import {
  DEFAULT_TIMER_DURATION,
  GAME_MODES,
  TIMER_PRESETS,
} from "../lib/constants/game";
import { typography } from "../lib/theme";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPlayers, setTimerDuration } from "../store/slices/gameSlice";
import { createOrFindRivalry } from "../store/slices/rivalrySlice";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function GameSetupScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const gameMode = useAppSelector((state) => state.game.mode);
  const activeRivalryId = useAppSelector(
    (state) => state.rivalry.activeRivalryId
  );
  const rivalries = useAppSelector((state) => state.rivalry.rivalries);

  // Find active rivalry if exists
  const activeRivalry = activeRivalryId
    ? rivalries.find((r) => r.id === activeRivalryId)
    : null;

  // Form state
  const [player1Name, setPlayer1Name] = useState(
    activeRivalry?.player1Name ?? ""
  );
  const [player2Name, setPlayer2Name] = useState(
    activeRivalry?.player2Name ?? ""
  );
  const [selectedDuration, setSelectedDuration] = useState(
    DEFAULT_TIMER_DURATION
  );
  const [customDuration, setCustomDuration] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  // Validation
  const isValid =
    player1Name.trim().length > 0 &&
    player2Name.trim().length > 0 &&
    (isCustom ? Number.parseInt(customDuration, 10) > 0 : selectedDuration > 0);

  const modeConfig = gameMode ? GAME_MODES[gameMode] : null;

  const handleBack = () => {
    router.back();
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setIsCustom(false);
    setCustomDuration("");
  };

  const handleCustomDurationChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replaceAll(/\D/g, "");
    setCustomDuration(numericText);
    setIsCustom(true);
  };

  const handleStartGame = () => {
    if (!isValid || !gameMode) return;

    const duration = isCustom
      ? Number.parseInt(customDuration, 10)
      : selectedDuration;

    // Set players and timer in game state
    dispatch(
      setPlayers({
        player1Name: player1Name.trim(),
        player2Name: player2Name.trim(),
      })
    );
    dispatch(setTimerDuration(duration));

    // Create or find rivalry
    dispatch(
      createOrFindRivalry({
        player1Name: player1Name.trim(),
        player2Name: player2Name.trim(),
        gameMode,
      })
    );

    // Navigate to game screen
    router.push("/game/play");
  };

  const styles = createStyles(theme.colors, insets);

  if (!gameMode) {
    // Redirect back if no game mode selected
    router.replace("/");
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              {gameMode && <GameModeIcon mode={gameMode} size="md" />}
              <Text style={styles.title}>{modeConfig?.label} Setup</Text>
            </View>
          </View>

          {/* Active Rivalry Badge */}
          {activeRivalry && (
            <View style={styles.rivalryBadge}>
              <Ionicons
                name="trophy-outline"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.rivalryBadgeText}>
                Continuing rivalry: {activeRivalry.wins.player1} -{" "}
                {activeRivalry.wins.player2}
              </Text>
            </View>
          )}

          {/* Player Names Section - GH-002 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Players</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Player 1</Text>
              <TextInput
                style={styles.input}
                value={player1Name}
                onChangeText={setPlayer1Name}
                placeholder="Enter name"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Player 2</Text>
              <TextInput
                style={styles.input}
                value={player2Name}
                onChangeText={setPlayer2Name}
                placeholder="Enter name"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Timer Duration Section - GH-003 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Turn Duration</Text>

            <View style={styles.durationGrid}>
              {TIMER_PRESETS.map((duration) => (
                <DurationButton
                  key={duration}
                  duration={duration}
                  isSelected={!isCustom && selectedDuration === duration}
                  onPress={() => handleDurationSelect(duration)}
                  colors={theme.colors}
                />
              ))}
            </View>

            <View style={styles.customDurationContainer}>
              <Text style={styles.inputLabel}>Custom (seconds)</Text>
              <TextInput
                style={[styles.input, isCustom && styles.inputActive]}
                value={customDuration}
                onChangeText={handleCustomDurationChange}
                placeholder="e.g. 25"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
          </View>
        </ScrollView>

        {/* Start Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.startButton, !isValid && styles.startButtonDisabled]}
            onPress={handleStartGame}
            disabled={!isValid}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
            <Ionicons name="play" size={20} color={theme.colors.buttonText} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// Duration button component
interface DurationButtonProps {
  readonly duration: number;
  readonly isSelected: boolean;
  readonly onPress: () => void;
  readonly colors: ReturnType<typeof useTheme>["theme"]["colors"];
}

function DurationButton({
  duration,
  isSelected,
  onPress,
  colors,
}: DurationButtonProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1 - pressed.value * 0.05) }],
    };
  });

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      activeOpacity={1}
      style={[
        {
          flex: 1,
          minWidth: "30%",
          paddingVertical: 16,
          paddingHorizontal: 12,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isSelected ? colors.primary : colors.border,
          backgroundColor: isSelected ? `${colors.primary}15` : colors.surface,
          alignItems: "center",
          marginRight: 8,
          marginBottom: 8,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          fontFamily: typography.fonts.semiBold,
          color: isSelected ? colors.primary : colors.text,
        }}
      >
        {duration}s
      </Text>
    </AnimatedTouchable>
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
      paddingHorizontal: 20,
      paddingBottom: 120,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      fontFamily: typography.fonts.bold,
      color: colors.text,
    },
    rivalryBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.primary}15`,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 24,
    },
    rivalryBadgeText: {
      fontSize: 14,
      color: colors.primary,
      marginLeft: 8,
      fontWeight: "500",
      fontFamily: typography.fonts.medium,
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
    inputContainer: {
      marginBottom: 16,
    },
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
    inputActive: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    durationGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
    },
    customDurationContainer: {
      marginTop: 8,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: insets.bottom + 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    startButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 16,
    },
    startButtonDisabled: {
      opacity: 0.5,
    },
    startButtonText: {
      fontSize: 18,
      fontWeight: "600",
      fontFamily: typography.fonts.semiBold,
      color: colors.buttonText,
      marginRight: 8,
    },
  });
