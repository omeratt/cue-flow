/**
 * Root layout for CueFlow app
 * Sets up providers, navigation, and custom fonts
 */

import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  useFonts,
} from "@expo-google-fonts/space-grotesk";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import {
  ThemeProvider,
  useTheme,
} from "../src/components/providers/ThemeProvider";
import { ErrorBoundary } from "../src/components/ui/ErrorBoundary";
import { persistor, store } from "../src/store";

// Configure Reanimated logger to disable strict mode warnings
// These warnings occur when reading SharedValue.value in callbacks,
// which is intentional in our timer logic for checking state before actions
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

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
          animationDuration: 300,
        }}
      >
        {/* Home screen - default entry point */}
        <Stack.Screen name="index" options={{ animation: "fade" }} />
        {/* Settings - slide up as modal-like experience */}
        <Stack.Screen
          name="settings"
          options={{
            animation: "slide_from_bottom",
            animationDuration: 350,
            gestureDirection: "vertical",
            gestureEnabled: true,
          }}
        />
        {/* Game routes - slide from right with smooth transition */}
        <Stack.Screen
          name="game"
          options={{
            animation: "slide_from_right",
            animationDuration: 300,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsError) {
      console.error("Error loading fonts:", fontsError);
    }
  }, [fontsError]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontsError) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <ThemeProvider>
              <RootLayoutNav />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F0F1A",
  },
});
