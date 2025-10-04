import { useBottomSheet } from "@/src/contexts/BottomSheetContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { SelectProps } from "@/src/types/component";
import { Option } from "@/src/types/data";
import { Ionicons } from "@expo/vector-icons";
import React, { FC, memo, useCallback, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Gap, Text } from "../ui";
import ErrorMessage from "./ErrorMessage";

const Select: FC<SelectProps> = ({
  label = "Pilih Data",
  value,
  options,
  error,
  type,
  disabled = false,
  onChange,
}) => {
  const { theme } = useTheme();
  const { show, hide } = useBottomSheet();

  // Memoize selected option to avoid recalculation on every render
  const selectedOption = useMemo(
    () => options.find((item) => item.value === value),
    [options, value]
  );

  // Memoize display text
  const displayText = useMemo(() => {
    if (selectedOption) {
      return selectedOption.label;
    }
    return label || "";
  }, [selectedOption, label]);

  // Memoize text color calculation
  const textColor = useMemo(() => {
    if (!value) {
      return disabled ? theme.colors.textSecondary : theme.colors.text;
    }
    return theme.colors.text;
  }, [value, disabled, theme]);

  // Memoize wrapper style
  const dynamicStyles = useMemo(
    () => [
      styles.wrapper,
      {
        borderColor: error
          ? theme.colors.error
          : disabled
          ? theme.colors.border
          : theme.colors.border,
        backgroundColor: disabled
          ? theme.colors.border
          : theme.colors.background,
        color: disabled ? theme.colors.textSecondary : theme.colors.text,
      },
    ],
    [disabled, error, theme]
  );

  const handleSelect = useCallback(
    (option: Option) => {
      onChange?.(option);
      hide();
    },
    [onChange, hide]
  );

  // Optimize keyExtractor
  const keyExtractor = useCallback((item: Option) => item.value, []);

  // Optimize item renderer with useCallback
  const renderItem = useCallback(
    ({ item }: { item: Option }) => {
      const isSelected = item.value === value;

      return (
        <Pressable
          style={[
            styles.item,
            GlobalStyles.rowBetween,
            { borderColor: theme.colors.border },
          ]}
          onPress={() => handleSelect(item)}
        >
          <Text
            type={isSelected ? "medium" : "regular"}
            size="sm"
            color={theme.colors.text}
          >
            {item.label}
          </Text>
          {isSelected && (
            <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
          )}
        </Pressable>
      );
    },
    [value, handleSelect, theme]
  );

  // Optimize callbacks with useCallback
  const openPicker = useCallback(() => {
    if (disabled) return;

    show(
      <View>
        <Text type="extra-bold" style={GlobalStyles.center}>
          {label.toUpperCase()}
        </Text>
        <Gap vertical={16} />
        <FlatList
          data={options}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          contentContainerStyle={[
            styles.list,
            { backgroundColor: theme.colors.background },
          ]}
        />
      </View>,
      type
    );
  }, [disabled, label, type, options, theme, renderItem, keyExtractor, show]);

  return (
    <>
      <Pressable style={dynamicStyles} onPress={openPicker}>
        <Text type="medium" size="sm" color={textColor}>
          {displayText}
        </Text>

        <Ionicons
          name="chevron-down"
          size={16}
          color={disabled ? theme.colors.textSecondary : theme.colors.text}
        />
      </Pressable>

      {error && (
        <>
          <Gap vertical={4} />
          <ErrorMessage message={error} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md - 1,
    ...GlobalStyles.rowBetween,
  },
  list: {
    borderRadius: BORDER_RADIUS.lg,
  },
  item: {
    padding: SPACING.md,
    borderBottomWidth: 0.4,
  },
});

export default memo(Select);
