import { useTheme } from "@/src/contexts/ThemeContext";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { ButtonProps } from "@/src/types/component";
import React, { FC, memo, useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Text from "./Text";

const Button: FC<ButtonProps> = ({
  title,
  variant = "primary",
  icon,
  loading,
  disabled,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const isLoading = loading;
  const isDisabled = disabled;
  const isPressable = isLoading || isDisabled;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const backgroundColor = useMemo(() => {
    if (isDisabled) return theme.colors.border;

    switch (variant) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.accent;
      case "tertiary":
        return "transparent";
      default:
        return theme.colors.primary;
    }
  }, [isDisabled, variant, theme]);

  const borderColor = useMemo(() => {
    if (variant === "tertiary") {
      return theme.colors.border;
    }
    return "transparent";
  }, [variant, theme]);

  const textColor = useMemo(() => {
    if (isDisabled) return theme.colors.textSecondary;

    switch (variant) {
      case "primary":
        return theme.colors.textInverse;
      case "secondary":
      case "tertiary":
        return theme.colors.text;
      default:
        return theme.colors.text;
    }
  }, [isDisabled, variant, theme]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isPressable}
      {...rest}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor,
            borderWidth: variant === "tertiary" ? 1 : 0,
            borderColor,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text type="bold" color={textColor}>
              {title}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 52,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...GlobalStyles.rowCenter,
    ...GlobalStyles.center,
  },
  content: {
    ...GlobalStyles.rowCenter,
  },
  icon: {
    marginRight: SPACING.sm,
  },
});

export default memo(Button);
