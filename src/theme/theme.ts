import { createThemeColors } from "./colors";
import { ClubColors, Theme } from "./types";

export const createTheme = (
  clubColors: ClubColors,
  mode: "light" | "dark" = "light"
): Theme => ({
  colors: createThemeColors(clubColors, mode),
});
