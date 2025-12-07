/**
 * Game Play Screen route (placeholder for now)
 * GH-004: Start and stop timer
 * GH-005: View animated countdown
 */

import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../src/components/providers/ThemeProvider";

export default function GamePlay() {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.text, { color: theme.colors.text }]}>
        Game Screen - Coming in Phase 1 (continued)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});
