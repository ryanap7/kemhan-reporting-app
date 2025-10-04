import { useTheme } from "@/src/contexts/ThemeContext";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { InputProps } from "@/src/types/component";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Gap } from "../ui";
import ErrorMessage from "./ErrorMessage";

const Input = ({ disabled, error, secureTextEntry, ...props }: InputProps) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const dynamicStyles = useMemo(
    () => ({
      borderColor: error
        ? theme.colors.error
        : disabled
        ? theme.colors.border
        : isFocused
        ? theme.colors.primary
        : theme.colors.border,
      backgroundColor: disabled ? theme.colors.border : theme.colors.background,
      color: disabled ? theme.colors.textSecondary : theme.colors.text,
    }),
    [disabled, isFocused, error, theme]
  );

  return (
    <View>
      <View style={[styles.inputContainer, dynamicStyles]}>
        <TextInput
          style={[styles.input, GlobalStyles.flex]}
          editable={!disabled}
          placeholderTextColor={theme.colors.border}
          onFocus={handleFocus}
          onBlur={handleBlur}
          textAlignVertical="center"
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePassword} activeOpacity={0.8}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <>
          <Gap vertical={4} />
          <ErrorMessage message={error} />
        </>
      )}
    </View>
  );
};

export default memo(Input);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === "ios" ? SPACING.md : SPACING.xs,
  },
  input: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
  },
});
