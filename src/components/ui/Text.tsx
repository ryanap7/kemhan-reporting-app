import { useTheme } from "@/src/contexts/ThemeContext";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { TextProps } from "@/src/types/component";
import React, { FC, memo } from "react";
import { Text as RNText } from "react-native";

const Text: FC<TextProps> = ({
  children,
  type = "regular",
  size = "md",
  color,
  lineHeightType = "normal",
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  const selectedFontSize = TYPOGRAPHY.fontSize[size];

  return (
    <RNText
      {...rest}
      style={[
        {
          fontSize: selectedFontSize,
          lineHeight: Math.round(selectedFontSize * 1.4),
          fontFamily: TYPOGRAPHY.fontFamily[type],
          color: color || theme.colors.text,
        },
        ...(Array.isArray(style) ? style : [style]),
      ]}
    >
      {children}
    </RNText>
  );
};

export default memo(Text);
