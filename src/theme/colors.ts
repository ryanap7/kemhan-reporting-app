import { ClubColors, ThemeColors } from "./types";

// Base semantic colors
const SEMANTIC_COLORS = {
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};

// Light theme neutrals
const LIGHT_NEUTRALS = {
  background: "#FFFFFF",
  surface: "#F8FAFC",
  border: "#CBD5E1",
  text: "#1E293B",
  textSecondary: "#64748B",
  textInverse: "#FFFFFF",
};

// Dark theme neutrals
const DARK_NEUTRALS = {
  background: "#0F172A",
  surface: "#1E293B",
  border: "#475569",
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  textInverse: "#0F172A",
};

// Color utilities
const adjustColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * amount);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

export const lighten = (color: string, amount: number = 20): string =>
  adjustColor(color, amount);

export const darken = (color: string, amount: number = 20): string =>
  adjustColor(color, -amount);

export const createThemeColors = (
  clubColors: ClubColors,
  mode: "light" | "dark" = "light"
): ThemeColors => {
  const neutrals = mode === "light" ? LIGHT_NEUTRALS : DARK_NEUTRALS;

  return {
    // Club signature colors from logo
    primary: clubColors.primary,
    primaryLight: lighten(clubColors.primary),
    primaryDark: darken(clubColors.primary),

    secondary: clubColors.secondary,
    accent: clubColors.accent,

    // Semantic
    ...SEMANTIC_COLORS,

    // Neutral
    ...neutrals,
  };
};

export const DEFAULT_COLORS: ClubColors = {
  primary: "#1B4332",
  secondary: "#8B0000",
  accent: "#DAA520",
};
