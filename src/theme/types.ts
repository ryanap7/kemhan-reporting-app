export interface ClubColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ThemeColors {
  // Club colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Neutral colors
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  textInverse: string;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface Typography {
  fontSize: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  fontFamily: {
    light: "Montserrat-Light";
    regular: "Montserrat-Regular";
    medium: "Montserrat-Medium";
    semibold: "Montserrat-SemiBold";
    bold: "Montserrat-Bold";
    "extra-bold": "Montserrat-ExtraBold";
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface BorderRadius {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  full: number;
}

export interface Theme {
  colors: ThemeColors;
}
