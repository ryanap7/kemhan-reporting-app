import { User } from "@/src/api";
import { Header, Input, KeyboardAvoiding, Select } from "@/src/components";
import { Button, Gap, Text } from "@/src/components/ui";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useTask } from "@/src/hooks/useTask";
import { useUsers } from "@/src/hooks/useUsers";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DispositionForm {
  assignee: {
    label: string;
    value: User | null;
  };
  note: string;
  ccUsers: string[];
}

const AssignDispositionTaskScreen = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { isLoading, dispositionTask } = useTask();
  const { users, isLoading: loadingUsers, getUsers } = useUsers();
  const { taskId }: { taskId: string } = useLocalSearchParams();

  const [form, setForm] = useState<DispositionForm>({
    assignee: {
      label: "",
      value: null,
    },
    note: "",
    ccUsers: [],
  });

  const [touched, setTouched] = useState({
    assignee: false,
    note: false,
  });

  const [showCCSelector, setShowCCSelector] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const availableCCUsers = useMemo(() => {
    if (!users || !form.assignee.value) return [];

    return users.filter(
      (user: User) =>
        user.role !== "PIMPINAN" && user.role !== form.assignee.value?.role
    );
  }, [users, form.assignee.value]);

  const selectedCCUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user: User) => form.ccUsers.includes(user.id));
  }, [users, form.ccUsers]);

  const validation = useMemo(() => {
    const assigneeError = !form.assignee.value
      ? "Penerima disposisi harus dipilih"
      : "";
    const noteError = !form.note.trim() ? "Catatan harus diisi" : "";

    // CC validation: max 20 users
    const ccError =
      form.ccUsers.length > 20
        ? "Maksimal 20 user dapat ditambahkan ke CC"
        : "";

    const isValid =
      form.assignee.value !== null &&
      form.note.trim() !== "" &&
      form.ccUsers.length <= 20;

    return {
      errors: {
        assignee: assigneeError,
        note: noteError,
        cc: ccError,
      },
      isValid,
    };
  }, [form]);

  const handleToggleCCUser = useCallback((userId: string) => {
    setForm((prev) => ({
      ...prev,
      ccUsers: prev.ccUsers.includes(userId)
        ? prev.ccUsers.filter((id) => id !== userId)
        : [...prev.ccUsers, userId],
    }));
  }, []);

  const handleSelectAllCC = useCallback(() => {
    if (form.ccUsers.length === availableCCUsers.length) {
      // Deselect all
      setForm((prev) => ({ ...prev, ccUsers: [] }));
    } else {
      // Select all (max 20)
      const allIds = availableCCUsers.slice(0, 20).map((user: User) => user.id);
      setForm((prev) => ({ ...prev, ccUsers: allIds }));
    }
  }, [availableCCUsers, form.ccUsers.length]);

  const handleRemoveCCUser = useCallback((userId: string) => {
    setForm((prev) => ({
      ...prev,
      ccUsers: prev.ccUsers.filter((id) => id !== userId),
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setTouched({ assignee: true, note: true });
    if (!validation.isValid) {
      Alert.alert("Validasi Gagal", "Mohon periksa kembali form Anda");
      return;
    }

    const payload: any = {
      assignedToRole: form.assignee.value?.role,
      assignedToId: form.assignee.value?.id,
      dispositionNote: form.note,
    };

    // Add CC users if any
    if (form.ccUsers.length > 0) {
      payload.ccUserIds = form.ccUsers;
    }

    await dispositionTask(taskId, payload);
  }, [dispositionTask, form, taskId, validation.isValid]);

  const getRoleLabel = (role: string) => {
    const roleMap: { [key: string]: string } = {
      DITJAKSTRA: "Direktorat Jakstra",
      DITRAH: "Direktorat Trah",
      DITKERSIN: "Direktorat Kersin",
      DITWILHAN: "Direktorat Wilhan",
      BAGUM: "Bagian Umum",
      BAGPROGLAP: "Bagian Proglap",
      BAGDATIN: "Bagian Datin",
    };
    return roleMap[role] || role;
  };

  const options =
    users
      ?.filter((user) => user.role !== "PIMPINAN")
      .map((user) => ({
        label: user.name,
        value: user,
      })) ?? [];

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
                Disposisi Kepada<Text color={theme.colors.error}>*</Text>
              </Text>
              <Select
                value={form.assignee.value}
                options={options}
                onChange={(value: { label: string; value: User }) => {
                  setForm({ ...form, assignee: value, ccUsers: [] });
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
                Catatan Disposisi<Text color={theme.colors.error}>*</Text>
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

          <Gap vertical={SPACING.lg} />

          {/* CC Section */}
          {form.assignee.value && (
            <Animated.View
              entering={FadeInDown.delay(300).duration(500).springify()}
            >
              <View style={styles.fieldContainer}>
                <View style={styles.ccHeader}>
                  <View style={GlobalStyles.flex}>
                    <Text type="semibold" size="sm" style={styles.label}>
                      Tembusan (CC)
                    </Text>
                    <Text
                      size="xs"
                      color={theme.colors.textSecondary}
                      style={styles.ccSubtext}
                    >
                      {form.ccUsers.length > 0
                        ? `${form.ccUsers.length} user dipilih`
                        : "Opsional - User yang perlu mengetahui"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowCCSelector(!showCCSelector)}
                    style={[
                      styles.ccToggleButton,
                      { backgroundColor: theme.colors.primary },
                    ]}
                    disabled={isLoading || loadingUsers}
                  >
                    <Ionicons
                      name={showCCSelector ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={theme.colors.textInverse}
                    />
                  </TouchableOpacity>
                </View>

                {validation.errors.cc && (
                  <Text
                    size="xs"
                    color={theme.colors.error}
                    style={styles.errorText}
                  >
                    {validation.errors.cc}
                  </Text>
                )}

                {/* Selected CC Users Preview */}
                {!showCCSelector && selectedCCUsers.length > 0 && (
                  <View style={styles.selectedCCContainer}>
                    {selectedCCUsers.map((user: User) => (
                      <View
                        key={user.id}
                        style={[
                          styles.selectedCCChip,
                          {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                          },
                        ]}
                      >
                        <Text
                          size="xs"
                          numberOfLines={1}
                          style={GlobalStyles.flex}
                        >
                          {user.name}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleRemoveCCUser(user.id)}
                          style={styles.removeChipButton}
                          disabled={isLoading}
                        >
                          <Ionicons
                            name="close-circle"
                            size={16}
                            color={theme.colors.error}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* CC User Selector */}
                {showCCSelector && (
                  <View
                    style={[
                      styles.ccSelectorContainer,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    {loadingUsers ? (
                      <View style={styles.loadingContainer}>
                        <Text
                          size="sm"
                          color={theme.colors.textSecondary}
                          style={styles.centerText}
                        >
                          Memuat user...
                        </Text>
                      </View>
                    ) : availableCCUsers.length === 0 ? (
                      <View style={styles.emptyContainer}>
                        <Text
                          size="sm"
                          color={theme.colors.textSecondary}
                          style={styles.centerText}
                        >
                          Tidak ada user yang tersedia untuk CC
                        </Text>
                      </View>
                    ) : (
                      <>
                        {/* Select All Button */}
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={handleSelectAllCC}
                          style={[
                            styles.selectAllButton,
                            { borderBottomColor: theme.colors.border },
                          ]}
                          disabled={isLoading}
                        >
                          <Ionicons
                            name={
                              form.ccUsers.length === availableCCUsers.length
                                ? "checkbox"
                                : "square-outline"
                            }
                            size={24}
                            color={theme.colors.primary}
                          />
                          <Text
                            type="semibold"
                            size="sm"
                            style={styles.selectAllText}
                          >
                            {form.ccUsers.length === availableCCUsers.length
                              ? "Batalkan Semua"
                              : "Pilih Semua"}
                          </Text>
                          <Text size="xs" color={theme.colors.textSecondary}>
                            ({availableCCUsers.length} user)
                          </Text>
                        </TouchableOpacity>

                        {/* User List */}
                        <ScrollView
                          style={styles.userList}
                          nestedScrollEnabled
                          showsVerticalScrollIndicator={true}
                        >
                          {availableCCUsers.map((user: User) => (
                            <TouchableOpacity
                              key={user.id}
                              activeOpacity={0.8}
                              onPress={() => handleToggleCCUser(user.id)}
                              style={[
                                styles.userItem,
                                { borderBottomColor: theme.colors.border },
                              ]}
                              disabled={isLoading}
                            >
                              <Ionicons
                                name={
                                  form.ccUsers.includes(user.id)
                                    ? "checkbox"
                                    : "square-outline"
                                }
                                size={24}
                                color={
                                  form.ccUsers.includes(user.id)
                                    ? theme.colors.primary
                                    : theme.colors.textSecondary
                                }
                              />
                              <View style={styles.userInfo}>
                                <Text type="medium" size="sm">
                                  {user.name}
                                </Text>
                                <Text
                                  size="xs"
                                  color={theme.colors.textSecondary}
                                >
                                  {getRoleLabel(user.role)} • {user.email}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </>
                    )}
                  </View>
                )}
              </View>
            </Animated.View>
          )}

          <Gap vertical={SPACING.xl} />

          {/* Submit */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(500).springify()}
          >
            <Button
              title={isLoading ? "Mengirim Disposisi..." : "Kirim Disposisi"}
              loading={isLoading}
              disabled={!validation.isValid || isLoading}
              onPress={handleSubmit}
            />
          </Animated.View>

          <Gap vertical={SPACING.md} />
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
  ccHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  ccSubtext: {
    marginTop: 2,
  },
  ccToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  ccSelectorContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: 400,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    gap: SPACING.sm,
  },
  selectAllText: {
    flex: 1,
  },
  userList: {
    maxHeight: 300,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    gap: SPACING.sm,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  selectedCCContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  selectedCCChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1,
    gap: SPACING.xs,
    maxWidth: "48%",
  },
  removeChipButton: {
    padding: 2,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    textAlign: "center",
  },
  errorText: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  ccPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    gap: SPACING.md,
  },
});
