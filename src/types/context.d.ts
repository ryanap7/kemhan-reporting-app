import { ClubColors, Theme } from "../theme/types";

export interface ThemeContextType {
  theme: Theme;
  clubColors: ClubColors;
  isDark: boolean;
  toggleTheme: () => void;
  updateClubColors: (colors: ClubColors) => void;
}
