import { DatePicker, Header, KeyboardAvoiding } from "@/src/components";
import Input from "@/src/components/form/Input";
import { Button, Gap, Text } from "@/src/components/ui";
import { PRIORITY_OPTIONS } from "@/src/constants/data.constants";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useTask } from "@/src/hooks/useTask";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TaskForm {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
}

const CreateTaskScreen = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { isLoading, createTask } = useTask();

  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    priority: 2,
    dueDate: "",
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    dueDate: false,
  });

  const validation = useMemo(() => {
    const titleError = !form.title.trim() ? "Judul Tugas harus diisi" : "";
    const descriptionError = !form.description ? "Deskripsi harus diisi" : "";
    const dueDateError = !form.dueDate ? "Tanggal Deadline harus diisi" : "";

    const isValid =
      form.title.trim() !== "" &&
      form.description !== "" &&
      form.dueDate !== "";

    return {
      errors: {
        title: titleError,
        description: descriptionError,
        dueDate: dueDateError,
      },
      isValid,
    };
  }, [form]);

  const handleSubmit = useCallback(async () => {
    setTouched({ title: true, description: true, dueDate: true });

    await createTask(form);
  }, [createTask, form]);

  return (
    <View
      style={[
        GlobalStyles.flex,
        { paddingTop: top, backgroundColor: theme.colors.background },
      ]}
    >
      <Header title="Buat Tugas" />

      <KeyboardAvoiding>
        <ScrollView
          style={GlobalStyles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInDown.delay(100).duration(500).springify()}
          >
            {/* Title Field */}
            <View style={styles.fieldContainer}>
              <Text type="semibold" size="sm" style={styles.label}>
                Judul Tugas <Text color={theme.colors.error}>*</Text>
              </Text>
              <Input
                placeholder="Masukkan judul tugas"
                value={form.title}
                onChangeText={(value: string) => {
                  setForm({ ...form, title: value });
                  setTouched((prev) => ({ ...prev, title: true }));
                }}
                editable={!isLoading}
                error={touched.title ? validation.errors.title : undefined}
              />
            </View>
          </Animated.View>

          <Gap vertical={SPACING.lg} />

          <Animated.View
            entering={FadeInDown.delay(150).duration(500).springify()}
          >
            {/* Description Field */}
            <View style={styles.fieldContainer}>
              <Text type="semibold" size="sm" style={styles.label}>
                Deskripsi
              </Text>
              <Input
                placeholder="Masukkan deskripsi tugas (opsional)"
                value={form.description}
                onChangeText={(value: string) =>
                  setForm({ ...form, description: value })
                }
                multiline
                numberOfLines={4}
                editable={!isLoading}
                error={
                  touched.description
                    ? validation.errors.description
                    : undefined
                }
              />
            </View>
          </Animated.View>

          <Gap vertical={SPACING.lg} />

          <Animated.View
            entering={FadeInDown.delay(200).duration(500).springify()}
          >
            {/* Priority Field */}
            <View style={styles.fieldContainer}>
              <Text type="semibold" size="sm" style={styles.label}>
                Prioritas <Text color={theme.colors.error}>*</Text>
              </Text>
              <View style={styles.priorityContainer}>
                {PRIORITY_OPTIONS.map((option) => {
                  const isSelected = form.priority === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.priorityButton,
                        {
                          backgroundColor: isSelected
                            ? option.color + "15"
                            : theme.colors.surface,
                          borderColor: isSelected
                            ? option.color
                            : theme.colors.border,
                        },
                        SHADOWS.sm,
                      ]}
                      onPress={() =>
                        setForm({ ...form, priority: option.value })
                      }
                      activeOpacity={0.7}
                      disabled={isLoading}
                    >
                      <View
                        style={[
                          styles.priorityRadio,
                          {
                            borderColor: isSelected
                              ? option.color
                              : theme.colors.border,
                            backgroundColor: isSelected
                              ? option.color
                              : "transparent",
                          },
                        ]}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color={theme.colors.textInverse}
                          />
                        )}
                      </View>
                      <Text
                        type={isSelected ? "bold" : "regular"}
                        size="sm"
                        color={isSelected ? option.color : theme.colors.text}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Animated.View>

          <Gap vertical={SPACING.lg} />

          <Animated.View
            entering={FadeInDown.delay(300).duration(500).springify()}
          >
            {/* Due Date Field */}
            <View style={styles.fieldContainer}>
              <Text type="semibold" size="sm" style={styles.label}>
                Tanggal Deadline <Text color={theme.colors.error}>*</Text>
              </Text>
              <DatePicker
                label="Tanggal Deadline"
                value={form.dueDate}
                placeholder="Pilih tanggal deadline"
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 10000)}
                onChangeText={(isoString) => {
                  setForm({ ...form, dueDate: isoString });
                  setTouched((prev) => ({ ...prev, dueDate: true }));
                }}
                disabled={isLoading}
                error={touched.dueDate ? validation.errors.dueDate : undefined}
              />
            </View>
          </Animated.View>

          <Gap vertical={SPACING.xxl} />

          <Animated.View
            entering={FadeInDown.delay(400).duration(500).springify()}
          >
            {/* Submit Button */}
            <Button
              title={isLoading ? "Membuat Tugas..." : "Buat Tugas"}
              loading={isLoading}
              disabled={!validation.isValid || isLoading}
              onPress={handleSubmit}
            />
          </Animated.View>

          <Gap vertical={SPACING.xl} />
        </ScrollView>
      </KeyboardAvoiding>
    </View>
  );
};

export default CreateTaskScreen;

const styles = StyleSheet.create({
  content: {
    padding: SPACING.lg,
  },
  fieldContainer: {
    width: "100%",
  },
  label: {
    marginBottom: SPACING.xs,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  priorityButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
  },
  priorityRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
