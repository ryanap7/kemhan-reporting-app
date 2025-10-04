import React, { ReactNode } from "react";
import {
  TextProps as RNTextProps,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { TYPOGRAPHY } from "../theme/typography";

export interface GapProps {
  vertical?: number;
  horizontal?: number;
}

export interface TextProps extends RNTextProps {
  children: React.ReactNode;
  type?: keyof (typeof TYPOGRAPHY)["fontFamily"];
  size?: keyof (typeof TYPOGRAPHY)["fontSize"];
  color?: string;
  lineHeightType?: keyof (typeof TYPOGRAPHY)["lineHeight"];
  style?: StyleProp<TextStyle>;
}

export interface ButtonProps {
  title: string;
  variant?: "primary" | "secondary" | "tertiary";
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  onPress?: () => void;
}

export interface KeyboardAvoidingProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface InputProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}

export type HeaderProps = {
  title: string;
};

export interface ErrorMessageProps {
  message?: string;
}

export type SelectProps = {
  label?: string;
  value?: string;
  options: Option[];
  error?: string;
  type?: "full" | "content";
  disabled?: boolean;
  onChange?: (option: Option) => void;
};

export interface DatePickerProps {
  label?: string;
  value?: string | Date | null;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: "date" | "time" | "datetime";
  locale?: string;
  dateFormat?: string;
  onChangeText?: (dateString: string) => void;
  onDateChange?: (date: Date | null) => void;
}
