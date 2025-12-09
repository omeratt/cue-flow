/**
 * Game routes layout
 * GH-025: Screen transition animations
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
      }}
    >
      {/* Setup screen - slide from right */}
      <Stack.Screen
        name="setup"
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      {/* Play screen - fade transition for smooth game start feel */}
      <Stack.Screen
        name="play"
        options={{
          animation: "fade",
          animationDuration: 400,
        }}
      />
    </Stack>
  );
}
