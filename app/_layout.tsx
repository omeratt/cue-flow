/**
 * Root layout for CueFlow app
 * Sets up providers and navigation
 */

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  ThemeProvider,
  useTheme,
} from "../src/components/providers/ThemeProvider";
import { persistor, store } from "../src/store";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#22D3EE" />
    </View>
  );
}

function RootLayoutNav() {
  const { isDark, theme } = useTheme();

  useEffect(() => {
    // Hide splash screen after app is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: "slide_from_right",
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F0F1A",
  },
});
