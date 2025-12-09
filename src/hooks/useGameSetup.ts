/**
 * useGameSetup - Hook for game setup screen logic
 * Implements GH-020: Extract logic from UI components to hooks
 *
 * Responsibilities:
 * - Form state management (player names, duration)
 * - Validation
 * - Duration selection logic
 * - Game initialization
 */

import { useRouter } from "expo-router";
import { useState } from "react";

import { DEFAULT_TIMER_DURATION, type GameMode } from "../lib/constants/game";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPlayers, setTimerDuration } from "../store/slices/gameSlice";
import { createOrFindRivalry } from "../store/slices/rivalrySlice";
import type { Rivalry } from "../types/rivalry";

interface UseGameSetupReturn {
  // Form state
  readonly player1Name: string;
  readonly player2Name: string;
  readonly selectedDuration: number;
  readonly customDuration: string;
  readonly isCustom: boolean;
  // Derived state
  readonly isValid: boolean;
  readonly gameMode: GameMode | null;
  readonly activeRivalry: Rivalry | undefined;
  // Handlers
  readonly setPlayer1Name: (name: string) => void;
  readonly setPlayer2Name: (name: string) => void;
  readonly handleDurationSelect: (duration: number) => void;
  readonly handleCustomDurationChange: (text: string) => void;
  readonly handleStartGame: () => void;
  readonly handleBack: () => void;
}

export function useGameSetup(): UseGameSetupReturn {
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
    : undefined;

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

  return {
    // Form state
    player1Name,
    player2Name,
    selectedDuration,
    customDuration,
    isCustom,
    // Derived state
    isValid,
    gameMode,
    activeRivalry,
    // Handlers
    setPlayer1Name,
    setPlayer2Name,
    handleDurationSelect,
    handleCustomDurationChange,
    handleStartGame,
    handleBack,
  };
}
