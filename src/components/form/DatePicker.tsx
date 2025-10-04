import { useTheme } from "@/src/contexts/ThemeContext";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { DatePickerProps } from "@/src/types/component";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/locale/id";
import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { Button, Gap, Text } from "../ui";
import ErrorMessage from "./ErrorMessage";

const DatePicker: FC<DatePickerProps> = ({
  label = "Tanggal Lahir",
  value,
  error,
  disabled = false,
  placeholder = "DD/MM/YYYY",
  minimumDate,
  maximumDate = new Date(),
  mode = "date",
  locale = "id-ID",
  dateFormat = "DD/MM/YYYY",
  onChangeText,
  onDateChange,
}) => {
  const { theme } = useTheme();
  const { show, hide } = useBottomSheet();

  // Memoize initial date conversion
  const initialDate = useMemo(() => {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value);
  }, [value]);

  const [date, setDate] = useState<Date | null>(initialDate);
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  // Memoize formatted value to avoid recalculation
  const displayText = useMemo(() => {
    if (!date) return placeholder;

    try {
      return moment(date).format(dateFormat);
    } catch (error) {
      console.warn("DatePicker: Invalid date format", error);
      return placeholder;
    }
  }, [date, dateFormat, placeholder]);

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

  // Optimize date change handler
  const handleDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      const { type } = event;

      if (Platform.OS === "android") {
        setShowAndroidPicker(false);
      }

      if (type === "dismissed") {
        return;
      }

      if (selectedDate) {
        setDate(selectedDate);
        onChangeText?.(selectedDate.toISOString());
        onDateChange?.(selectedDate);
      }
    },
    [onChangeText, onDateChange]
  );

  // Optimize picker opening
  const openPicker = useCallback(() => {
    if (disabled) return;

    if (Platform.OS === "ios") {
      show(
        <>
          <Text type="extra-bold" style={GlobalStyles.center}>
            {label.toUpperCase()}
          </Text>
          <Gap vertical={16} />
          <View style={styles.datepicker}>
            <DateTimePicker
              locale={locale}
              mode={mode}
              display="spinner"
              value={date || new Date()}
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          </View>
          <Gap vertical={4} />
          <Button
            title="Atur"
            onPress={() => hide()}
            style={styles.confirmButton}
          />
        </>
      );
    } else {
      setShowAndroidPicker(true);
    }
  }, [
    disabled,
    date,
    show,
    label,
    mode,
    locale,
    handleDateChange,
    minimumDate,
    maximumDate,
    hide,
  ]);

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

      {/* Android Date Picker */}
      {Platform.OS === "android" && showAndroidPicker && (
        <DateTimePicker
          mode={mode}
          display="default"
          value={date || new Date()}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale={locale}
        />
      )}

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
  datepicker: {
    width: "100%",
    ...GlobalStyles.center,
  },
  confirmButton: {
    ...GlobalStyles.flex,
  },
});

export default memo(DatePicker);
