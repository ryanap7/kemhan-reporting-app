import { ChecklistItem } from "@/src/api";
import { Header } from "@/src/components";
import { Gap, Text } from "@/src/components/ui";
import {
  PRIORITY_OPTIONS,
  STATUS_CONFIG,
} from "@/src/constants/data.constants";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useTask } from "@/src/hooks/useTask";
import { useAuthStore } from "@/src/stores";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import moment from "moment";
import "moment/locale/id";
import React, { useCallback, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getPriorityConfig = (priority: number) => {
  return PRIORITY_OPTIONS.find((opt) => opt.value === priority);
};

const DetailTaskScreen = () => {
  const { id }: { id: string } = useLocalSearchParams();

  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();

  const { user } = useAuthStore();
  const { task, getTaskById, updateProgress, isLoading } = useTask();

  useFocusEffect(
    useCallback(() => {
      getTaskById(id);
    }, [getTaskById, id])
  );

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [blockNote, setBlockNote] = useState("");

  const handleChecklistAction = useCallback(
    async (item: ChecklistItem, action: "complete" | "start" | "block") => {
      if (action === "complete") {
        const payload = {
          status: "COMPLETED",
        };
        if (task?.id) {
          await updateProgress(task.id, item.id, payload);
        }
      } else if (action === "start") {
        const payload = {
          status: "IN_PROGRESS",
        };
        if (task?.id) {
          await updateProgress(task.id, item.id, payload);
        }
      } else if (action === "block") {
        setSelectedItem(item);
        setShowBlockModal(true);
      }
    },
    [task, updateProgress]
  );

  const handleBlockSubmit = useCallback(async () => {
    if (!blockNote.trim() || !selectedItem) return;

    setShowBlockModal(false);
    setBlockNote("");
    setSelectedItem(null);

    const payload = {
      status: "BLOCKED",
    };
    if (task?.id && selectedItem?.id) {
      await updateProgress(task.id, selectedItem.id, payload);
    }
  }, [blockNote, selectedItem, task?.id, updateProgress]);

  if (isLoading || !task) {
    return (
      <View
        style={[
          GlobalStyles.flex,
          { paddingTop: top, backgroundColor: theme.colors.background },
        ]}
      >
        <Header title="Detail Tugas" />
        <View style={[GlobalStyles.flex, GlobalStyles.center]}>
          <Ionicons
            name="hourglass-outline"
            size={48}
            color={theme.colors.textSecondary}
          />
          <Gap vertical={12} />
          <Text type="medium" size="md" color={theme.colors.textSecondary}>
            Memuat data...
          </Text>
        </View>
      </View>
    );
  }

  const statusConfig = STATUS_CONFIG[task.status];
  const priorityConfig = getPriorityConfig(task?.priority);

  // Find the first non-completed task (can start)
  const getNextActionableTask = () => {
    return task?.checklistItems.find((item) => item.status !== "COMPLETED");
  };

  const nextActionableTask = getNextActionableTask();

  const isAssignedTo = task.assignedTo?.id === user?.id;

  return (
    <View
      style={[
        GlobalStyles.flex,
        { paddingTop: top, backgroundColor: theme.colors.background },
      ]}
    >
      {/* Header */}
      <Header title="Detail Tugas" />

      <ScrollView
        style={GlobalStyles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Header Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500).springify()}
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.taskHeader}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: priorityConfig?.color + "15" },
              ]}
            >
              <Text type="bold" size="xs" color={priorityConfig?.color}>
                {priorityConfig?.label}
              </Text>
            </View>
            <Gap horizontal={8} />
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig?.color + "15" },
              ]}
            >
              <Ionicons
                name={statusConfig?.icon as any}
                size={12}
                color={statusConfig?.color}
              />
              <Text type="medium" size="xs" color={statusConfig?.color}>
                {statusConfig?.label}
              </Text>
            </View>
          </View>

          <Gap vertical={12} />

          <Text type="bold" size="xl" numberOfLines={2}>
            {task.title}
          </Text>
          <Gap vertical={4} />
          <Text
            type="regular"
            size="xs"
            color={theme.colors.textSecondary}
            numberOfLines={2}
          >
            {task.description}
          </Text>

          <Gap vertical={16} />

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Ionicons
                name="list-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text type="medium" size="xs" color={theme.colors.textSecondary}>
                Progress {task.progress.completed} / {task.progress.total}
              </Text>
              <Text type="bold" size="xs" color={theme.colors.primary}>
                ({task.progress.percentage}%)
              </Text>
            </View>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: theme.colors.border },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${task.progress.percentage}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
          </View>

          <Gap vertical={16} />

          {/* Meta Info */}
          <View style={styles.taskFooter}>
            <View style={styles.footerItem}>
              <Ionicons
                name="person-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text type="regular" size="xs" color={theme.colors.textSecondary}>
                {task.creator.name}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text type="regular" size="xs" color={theme.colors.textSecondary}>
                Due: {moment(task.dueDate).format("DD MMM YYYY")}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Gap vertical={20} />

        {/* Section Header */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color={theme.colors.text} />
            <Text type="bold" size="md">
              Tahapan Pekerjaan
            </Text>
          </View>
        </Animated.View>

        <Gap vertical={12} />

        {/* Checklist Items */}
        {task.checklistItems.map((item, index) => {
          const statusConfig = STATUS_CONFIG[item.status];
          const isCompleted = item.status === "COMPLETED";
          const isBlocked = item.status === "BLOCKED";
          const isInProgress = item.status === "IN_PROGRESS";
          const isNotStarted = item.status === "NOT_STARTED";

          // Only show start button for the next actionable task
          const canStart = isNotStarted && item.id === nextActionableTask?.id;
          const canContinue = isBlocked && item.id === nextActionableTask?.id;

          return (
            <View key={item.id}>
              <Animated.View
                entering={FadeInDown.delay((index + 3) * 100)
                  .duration(500)
                  .springify()}
                style={[
                  styles.card,
                  { backgroundColor: theme.colors.surface },
                  { borderLeftWidth: 4, borderLeftColor: statusConfig.color },
                ]}
              >
                {/* Header */}
                <View style={styles.checklistTitleRow}>
                  <View
                    style={[
                      styles.checklistNumber,
                      {
                        backgroundColor: isCompleted
                          ? statusConfig.color
                          : statusConfig.bgColor,
                      },
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.colors.textInverse}
                      />
                    ) : (
                      <Text type="bold" size="sm" color={statusConfig.color}>
                        {item.order}
                      </Text>
                    )}
                  </View>
                  <View style={GlobalStyles.flex}>
                    <Text type="bold" size="md">
                      {item.title}
                    </Text>
                    <Gap vertical={4} />
                    <Text
                      type="regular"
                      size="xs"
                      color={theme.colors.textSecondary}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>

                <Gap vertical={8} />

                {/* Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusConfig.bgColor },
                  ]}
                >
                  <Ionicons
                    name={statusConfig.icon}
                    size={12}
                    color={statusConfig.color}
                  />
                  <Text type="medium" size="xs" color={statusConfig.color}>
                    {statusConfig.label}
                  </Text>
                </View>

                {/* Blocked Note */}
                {isBlocked && item.blockedNote && (
                  <>
                    <Gap vertical={8} />
                    <View style={styles.blockedNote}>
                      <Ionicons
                        name="information-circle"
                        size={16}
                        color={theme.colors.error}
                      />
                      <Text
                        type="regular"
                        size="xs"
                        color={theme.colors.error}
                        style={{ flex: 1 }}
                      >
                        {item.blockedNote}
                      </Text>
                    </View>
                  </>
                )}

                {/* Dates */}
                {(item.startedAt || item.completedAt) && (
                  <>
                    <Gap vertical={8} />
                    <View style={styles.dateInfo}>
                      {item.startedAt && (
                        <View style={styles.footerItem}>
                          <Ionicons
                            name="play-circle-outline"
                            size={14}
                            color={theme.colors.textSecondary}
                          />
                          <Text
                            type="regular"
                            size="xs"
                            color={theme.colors.textSecondary}
                          >
                            Dimulai:{" "}
                            {moment(item.startedAt).format("DD MMM YYYY")}
                          </Text>
                        </View>
                      )}
                      {item.completedAt && (
                        <View style={styles.footerItem}>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={14}
                            color={theme.colors.success}
                          />
                          <Text
                            type="regular"
                            size="xs"
                            color={theme.colors.success}
                          >
                            Selesai:{" "}
                            {moment(item.completedAt).format("DD MMM YYYY")}
                          </Text>
                        </View>
                      )}
                    </View>
                  </>
                )}

                {/* Action Buttons */}
                {!isCompleted &&
                  isAssignedTo &&
                  (canStart || canContinue || isInProgress) && (
                    <>
                      <Gap vertical={12} />
                      <View style={styles.actionButtons}>
                        {canStart && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={[
                              styles.actionButton,
                              { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={() => handleChecklistAction(item, "start")}
                          >
                            <Ionicons
                              name="play"
                              size={16}
                              color={theme.colors.textInverse}
                            />
                            <Text
                              type="bold"
                              size="sm"
                              color={theme.colors.textInverse}
                            >
                              Mulai Tahapan
                            </Text>
                          </TouchableOpacity>
                        )}

                        {isInProgress && (
                          <>
                            <TouchableOpacity
                              style={[
                                styles.actionButton,
                                { backgroundColor: theme.colors.success },
                              ]}
                              onPress={() =>
                                handleChecklistAction(item, "complete")
                              }
                              activeOpacity={0.7}
                            >
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color={theme.colors.textInverse}
                              />
                              <Text
                                type="bold"
                                size="sm"
                                color={theme.colors.textInverse}
                              >
                                Selesaikan
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.actionButtonOutline,
                                {
                                  backgroundColor: theme.colors.surface,
                                  borderColor: theme.colors.error,
                                },
                              ]}
                              onPress={() =>
                                handleChecklistAction(item, "block")
                              }
                              activeOpacity={0.7}
                            >
                              <Ionicons
                                name="alert-circle-outline"
                                size={16}
                                color={theme.colors.error}
                              />
                              <Text
                                type="bold"
                                size="sm"
                                color={theme.colors.error}
                              >
                                Hambatan
                              </Text>
                            </TouchableOpacity>
                          </>
                        )}

                        {canContinue && (
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              { backgroundColor: theme.colors.primary },
                              SHADOWS.sm,
                            ]}
                            onPress={() => handleChecklistAction(item, "start")}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="play"
                              size={16}
                              color={theme.colors.textInverse}
                            />
                            <Text
                              type="bold"
                              size="sm"
                              color={theme.colors.textInverse}
                            >
                              Lanjutkan
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
              </Animated.View>

              {/* Connector */}
              {index < task.checklistItems.length - 1 && (
                <>
                  <Gap vertical={8} />
                  <View style={styles.connector}>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={theme.colors.border}
                    />
                  </View>
                  <Gap vertical={8} />
                </>
              )}
            </View>
          );
        })}

        <Gap vertical={32} />
      </ScrollView>

      {/* Block Modal */}
      <Modal
        visible={showBlockModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowBlockModal(false);
          setBlockNote("");
          setSelectedItem(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text type="bold" size="lg">
                Catat Hambatan
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowBlockModal(false);
                  setBlockNote("");
                  setSelectedItem(null);
                }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Gap vertical={12} />

            <Text type="regular" size="sm" color={theme.colors.textSecondary}>
              Jelaskan hambatan yang dialami pada tahapan ini
            </Text>

            <Gap vertical={12} />

            <TextInput
              style={[
                styles.textarea,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Contoh: Menunggu approval dari bagian keuangan"
              placeholderTextColor={theme.colors.textSecondary}
              value={blockNote}
              onChangeText={setBlockNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Gap vertical={20} />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.colors.border },
                ]}
                onPress={() => {
                  setShowBlockModal(false);
                  setBlockNote("");
                  setSelectedItem(null);
                }}
                activeOpacity={0.7}
              >
                <Text type="bold" size="sm" color={theme.colors.text}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: theme.colors.error,
                    opacity: !blockNote.trim() ? 0.5 : 1,
                  },
                ]}
                onPress={handleBlockSubmit}
                disabled={!blockNote.trim()}
                activeOpacity={0.7}
              >
                <Text type="bold" size="sm" color={theme.colors.textInverse}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DetailTaskScreen;

const styles = StyleSheet.create({
  header: {
    ...GlobalStyles.rowBetween,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerButton: {
    padding: SPACING.sm,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  taskHeader: {
    ...GlobalStyles.rowCenter,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusBadge: {
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    ...GlobalStyles.rowCenter,
  },
  progressSection: {
    gap: SPACING.xs,
  },
  progressInfo: {
    gap: SPACING.xs,
    ...GlobalStyles.rowCenter,
  },
  progressBar: {
    height: 6,
    borderRadius: BORDER_RADIUS.sm,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: BORDER_RADIUS.sm,
  },
  taskFooter: {
    flexWrap: "wrap",
    gap: SPACING.sm,
    ...GlobalStyles.rowBetween,
  },
  footerItem: {
    gap: SPACING.xs,
    ...GlobalStyles.rowCenter,
  },
  sectionHeader: {
    gap: SPACING.sm,
    ...GlobalStyles.rowCenter,
  },
  checklistTitleRow: {
    gap: SPACING.md,
    ...GlobalStyles.rowCenter,
    alignItems: "flex-start",
  },
  checklistNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    ...GlobalStyles.center,
  },
  blockedNote: {
    gap: SPACING.xs,
    padding: SPACING.sm,
    backgroundColor: "#EF444410",
    borderRadius: BORDER_RADIUS.md,
    ...GlobalStyles.rowCenter,
    alignItems: "flex-start",
  },
  dateInfo: {
    gap: SPACING.xs,
  },
  actionButtons: {
    gap: SPACING.sm,
    ...GlobalStyles.rowCenter,
    ...SHADOWS.sm,
  },
  actionButton: {
    flex: 1,
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...GlobalStyles.rowCenter,
  },
  actionButtonOutline: {
    flex: 1,
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    ...GlobalStyles.rowCenter,
  },
  connector: {
    ...GlobalStyles.center,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    ...GlobalStyles.center,
    ...SHADOWS.md,
  },
  modalContent: {
    width: "90%",
    maxWidth: 500,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
  },
  modalHeader: {
    ...GlobalStyles.rowBetween,
  },
  textarea: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 100,
  },
  modalActions: {
    gap: SPACING.sm,
    ...GlobalStyles.rowCenter,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...GlobalStyles.center,
  },
});
