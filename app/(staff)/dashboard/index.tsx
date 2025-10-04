import { Task } from "@/src/api";
import { Gap, Text } from "@/src/components/ui";
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
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StaffDashboard = () => {
  const { theme } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { tasks, getTasks } = useTask();

  useFocusEffect(
    useCallback(() => {
      getTasks();
    }, [getTasks])
  );

  const getPriorityConfig = (priority: number) => {
    return PRIORITY_OPTIONS.find((opt) => opt.value === priority);
  };

  const handleCreateTask = () => {
    router.push("/(staff)/task/create");
  };

  const handleTaskPress = (taskId: string) => {
    router.push(`/(staff)/task/${taskId}`);
  };

  const handleLogout = useCallback(() => {
    router.replace("/(auth)/login");
  }, []);

  const renderTaskItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => {
      const statusConfig = STATUS_CONFIG[item.status];
      const priorityConfig = getPriorityConfig(item.priority);

      return (
        <Animated.View
          entering={FadeInDown.delay(index * 100)
            .duration(500)
            .springify()}
        >
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleTaskPress(item.id)}
            activeOpacity={0.7}
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
                <Text
                  type="medium"
                  size="xs"
                  color={theme.colors.textSecondary}
                >
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
                <Text
                  type="regular"
                  size="xs"
                  color={theme.colors.textSecondary}
                >
                  Due: {moment(item.dueDate).format("DD MMM YYYY")}
                </Text>
              </View>
              <View style={styles.footerItem}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text
                  type="regular"
                  size="xs"
                  color={theme.colors.textSecondary}
                >
                  Dibuat: {moment(item.createdAt).format("DD MMM YYYY")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [theme.colors]
  );

  return (
    <View
      style={[
        GlobalStyles.flex,
        { paddingTop: top, backgroundColor: theme.colors.background },
      ]}
    >
      <Animated.View
        entering={FadeInDown.duration(600).springify()}
        style={styles.header}
      >
        <View>
          <Text type="bold" size="xxl">
            Tugas Saya
          </Text>
          <Gap vertical={4} />
          <Text type="regular" size="sm" color={theme.colors.textSecondary}>
            {tasks.length} tugas aktif
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: theme.colors.error + "15" },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.colors.error}
          />
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Gap vertical={12} />}
      />

      {/* FAB Button */}
      <Animated.View
        entering={FadeInRight.delay(300).duration(500).springify()}
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            bottom: bottom + 20,
          },
          SHADOWS.lg,
        ]}
      >
        <TouchableOpacity
          onPress={handleCreateTask}
          activeOpacity={0.8}
          style={styles.fabTouchable}
        >
          <Ionicons name="add" size={28} color={theme.colors.textInverse} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default StaffDashboard;

const styles = StyleSheet.create({
  header: {
    padding: SPACING.lg,
    ...GlobalStyles.rowBetween,
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    ...GlobalStyles.center,
  },
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
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fabTouchable: {
    width: "100%",
    height: "100%",
    ...GlobalStyles.center,
  },
});
