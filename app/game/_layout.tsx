/**
 * Game routes layout
 */

import { Stack } from "expo-router";
import { useTheme } from "../../src/components/providers/ThemeProvider";

export default function GameLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: "slide_from_right",
      }}
    />
  );
}
