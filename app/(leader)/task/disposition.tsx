import { Header, Input, KeyboardAvoiding, Select } from "@/src/components";
import { Button, Gap, Text } from "@/src/components/ui";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useTask } from "@/src/hooks/useTask";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DispositionForm {
  assignee: {
    label: string;
    value: string;
  };
  note: string;
}

const AssignDispositionTaskScreen = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { isLoading, dispositionTask } = useTask();
  const { taskId }: { taskId: string } = useLocalSearchParams();

  const [form, setForm] = useState<DispositionForm>({
    assignee: {
      label: "",
      value: "",
    },
    note: "",
  });

  const [touched, setTouched] = useState({
    assignee: false,
    note: false,
  });

  const validation = useMemo(() => {
    const assigneeError = !form.assignee
      ? "Penerima disposisi harus dipilih"
      : "";
    const noteError = !form.note.trim() ? "Catatan harus diisi" : "";

    const isValid = form.assignee.value !== "" && form.note.trim() !== "";

    return {
      errors: {
        assignee: assigneeError,
        note: noteError,
      },
      isValid,
    };
  }, [form]);

  const handleSubmit = useCallback(async () => {
    setTouched({ assignee: true, note: true });
    if (!validation.isValid) return;

    const payload = {
      assignedToRole: form.assignee.value,
      dispositionNote: form.note,
    };
    await dispositionTask(taskId, payload);
  }, [dispositionTask, form, taskId, validation.isValid]);

  return (
    <View
      style={[
        GlobalStyles.flex,
        { paddingTop: top, backgroundColor: theme.colors.background },
      ]}
    >
      <Header title="Disposisikan Tugas" />

      <KeyboardAvoiding>
        <ScrollView
          style={GlobalStyles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Select Assignee */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(500).springify()}
          >
            <View style={styles.fieldContainer}>
              <Text type="semibold" size="sm" style={styles.label}>
                Ke Siapa<Text color={theme.colors.error}>*</Text>
              </Text>
              <Select
                value={form.assignee.value}
                options={[
                  { label: "Subdit Hanmil", value: "SUBDIT_HANMIL" },
                  { label: "Subdit Hannirmil", value: "SUBDIT_HANNIRMIL" },
                  { label: "Subdit MPP", value: "SUBDIT_MPP" },
                  { label: "Subdit Anstra", value: "SUBDIT_ANSTRA" },
                ]}
                onChange={(value: { label: string; value: string }) => {
                  setForm({ ...form, assignee: value });
                  setTouched((prev) => ({ ...prev, assignee: true }));
                }}
                disabled={isLoading}
                error={
                  touched.assignee ? validation.errors.assignee : undefined
                }
              />
            </View>
          </Animated.View>

          <Gap vertical={SPACING.lg} />

          {/* Note */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500).springify()}
          >
            <View style={styles.fieldContainer}>
              <Text type="semibold" size="sm" style={styles.label}>
                Catatan<Text color={theme.colors.error}>*</Text>
              </Text>
              <Input
                placeholder="Masukkan catatan disposisi"
                value={form.note}
                onChangeText={(value: string) => {
                  setForm({ ...form, note: value });
                  setTouched((prev) => ({ ...prev, note: true }));
                }}
                editable={!isLoading}
                multiline
                numberOfLines={4}
                error={touched.note ? validation.errors.note : undefined}
              />
            </View>
          </Animated.View>

          <Gap vertical={SPACING.xl} />

          {/* Submit */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500).springify()}
          >
            <Button
              title={isLoading ? "Mengirim Disposisi..." : "Kirim Disposisi"}
              loading={isLoading}
              disabled={!validation.isValid || isLoading}
              onPress={handleSubmit}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoiding>
    </View>
  );
};

export default AssignDispositionTaskScreen;

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
});
