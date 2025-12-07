/**
 * Theme Provider - provides theme context to the app
 */

import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { getTheme, Theme, ThemeMode } from "../../lib/theme";
import { useAppSelector } from "../../store/hooks";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  readonly children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const { theme: savedTheme, useSystemTheme } = useAppSelector(
    (state) => state.settings
  );

  // Determine the actual theme mode
  const mode: ThemeMode = useMemo(() => {
    if (useSystemTheme) {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return savedTheme;
  }, [useSystemTheme, systemColorScheme, savedTheme]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      isDark: mode === "dark",
      mode,
    }),
    [theme, mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
