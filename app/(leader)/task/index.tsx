import { Task } from "@/src/api";
import { Header } from "@/src/components";
import { Button, Gap, Text } from "@/src/components/ui";
import {
  PRIORITY_OPTIONS,
  STATUS_CONFIG,
} from "@/src/constants/data.constants";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useTask } from "@/src/hooks/useTask";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import moment from "moment";
import "moment/locale/id";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DispositionTaskScreen = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { tasks, getDraftTasks } = useTask();

  useFocusEffect(
    useCallback(() => {
      getDraftTasks();
    }, [getDraftTasks])
  );

  const getPriorityConfig = (priority: number) => {
    return PRIORITY_OPTIONS.find((opt) => opt.value === priority);
  };

  const renderTaskItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => {
      const statusConfig = STATUS_CONFIG[item.status];
      const priorityConfig = getPriorityConfig(item.priority);

      return (
        <Animated.View
          entering={FadeInDown.delay(index * 100)
            .duration(500)
            .springify()}
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
                { backgroundColor: statusConfig.color + "15" },
              ]}
            >
              <Ionicons
                name={statusConfig.icon as any}
                size={12}
                color={statusConfig.color}
              />
              <Text type="medium" size="xs" color={statusConfig.color}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          <Gap vertical={8} />

          <Text type="bold" size="md" numberOfLines={2}>
            {item.title}
          </Text>
          <Gap vertical={4} />
          <Text
            type="regular"
            size="xs"
            color={theme.colors.textSecondary}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <Gap vertical={12} />

          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Ionicons
                name="list-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text type="medium" size="xs" color={theme.colors.textSecondary}>
                Progress {item.progress.completed} / {item.progress.total}
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
                    backgroundColor: statusConfig.color,
                    width: `${
                      (item.progress.completed / item.progress.total) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>

          <Gap vertical={12} />

          <View style={styles.taskFooter}>
            <View style={styles.footerItem}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text type="regular" size="xs" color={theme.colors.textSecondary}>
                Due: {moment(item.dueDate).format("DD MMM YYYY")}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text type="regular" size="xs" color={theme.colors.textSecondary}>
                Dibuat: {moment(item.createdAt).format("DD MMM YYYY")}
              </Text>
            </View>
          </View>

          <Gap vertical={12} />

          <Button
            title="Disposisikan"
            style={{ height: 48 }}
            onPress={() =>
              router.push({
                pathname: "/(leader)/task/disposition",
                params: {
                  taskId: item.id,
                },
              })
            }
          />
        </Animated.View>
      );
    },
    [theme.colors]
  );

  const renderEmptyState = useCallback(() => {
    return (
      <View
        style={[GlobalStyles.flex, GlobalStyles.center, { paddingTop: "70%" }]}
      >
        <Text type="medium" size="lg">
          Tidak ada data
        </Text>
      </View>
    );
  }, []);

  return (
    <View
      style={[
        GlobalStyles.flex,
        { paddingTop: top, backgroundColor: theme.colors.background },
      ]}
    >
      <Header title="Tugas Belum Didisposisikan" />

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Gap vertical={12} />}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

export default DispositionTaskScreen;

const styles = StyleSheet.create({
  content: {
    margin: SPACING.md,
    paddingBottom: SPACING.xxl + SPACING.xxl + SPACING.xxl,
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
});
