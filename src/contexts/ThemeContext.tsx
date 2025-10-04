import React, { createContext, ReactNode, useContext } from "react";
import { DEFAULT_COLORS } from "../theme/colors";
import { createTheme } from "../theme/theme";
import { ClubColors } from "../theme/types";
import { ThemeContextType } from "../types/context";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialClubColors?: ClubColors;
  initialMode?: "light" | "dark";
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialClubColors = DEFAULT_COLORS,
  initialMode = "light",
}) => {
  const [clubColors, setClubColors] =
    React.useState<ClubColors>(initialClubColors);
  const [isDark, setIsDark] = React.useState(initialMode === "dark");

  const theme = React.useMemo(
    () => createTheme(clubColors, isDark ? "dark" : "light"),
    [clubColors, isDark]
  );

  const toggleTheme = React.useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const updateClubColors = React.useCallback((colors: ClubColors) => {
    setClubColors(colors);
  }, []);

  const value = React.useMemo(
    () => ({
      theme,
      clubColors,
      isDark,
      toggleTheme,
      updateClubColors,
    }),
    [theme, clubColors, isDark, toggleTheme, updateClubColors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
