/**
 * Font configuration for CueFlow
 * Uses Space Grotesk from Google Fonts for a modern, sporty look
 */

// Font family names as used after loading
export const FontFamily = {
  regular: "SpaceGrotesk_400Regular",
  medium: "SpaceGrotesk_500Medium",
  semiBold: "SpaceGrotesk_600SemiBold",
  bold: "SpaceGrotesk_700Bold",
} as const;

// Map fontWeight values to actual font families
// This is needed because React Native doesn't support fontWeight with custom fonts
export const getFontFamily = (
  weight:
    | "400"
    | "500"
    | "600"
    | "700"
    | "regular"
    | "medium"
    | "semibold"
    | "bold"
): string => {
  switch (weight) {
    case "400":
    case "regular":
      return FontFamily.regular;
    case "500":
    case "medium":
      return FontFamily.medium;
    case "600":
    case "semibold":
      return FontFamily.semiBold;
    case "700":
    case "bold":
      return FontFamily.bold;
    default:
      return FontFamily.regular;
  }
};

// Font styles for common use cases
export const fontStyles = {
  // Regular text
  regular: {
    fontFamily: FontFamily.regular,
  },
  // Medium weight
  medium: {
    fontFamily: FontFamily.medium,
  },
  // Semi-bold weight
  semiBold: {
    fontFamily: FontFamily.semiBold,
  },
  // Bold weight
  bold: {
    fontFamily: FontFamily.bold,
  },
  // Display/Timer numbers - bold for impact
  display: {
    fontFamily: FontFamily.bold,
  },
  // Headings
  heading: {
    fontFamily: FontFamily.bold,
  },
  // Subheadings
  subheading: {
    fontFamily: FontFamily.semiBold,
  },
  // Body text
  body: {
    fontFamily: FontFamily.regular,
  },
  // Button text
  button: {
    fontFamily: FontFamily.semiBold,
  },
  // Labels
  label: {
    fontFamily: FontFamily.medium,
  },
} as const;
