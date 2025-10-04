import { useTheme } from "@/src/contexts/ThemeContext";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { HeaderProps } from "@/src/types/component";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Gap, Text } from "../ui";

const Header = ({ title }: HeaderProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.header}
      onPress={() => router.back()}
    >
      <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
      <Gap horizontal={12} />
      <Text type="extra-bold" size="lg">
        {title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...GlobalStyles.rowCenter,
  },
});
