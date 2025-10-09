import { Task } from "@/src/api";
import { Header, Input } from "@/src/components";
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
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import moment from "moment";
import "moment/locale/id";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TaskBySubditScreen = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { tasks, getTasksBySubdit } = useTask();
  const { subditId }: { subditId: string } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      getTasksBySubdit(subditId);
    }, [getTasksBySubdit, subditId])
  );

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tasks;
    }

    const query = searchQuery.toLowerCase().trim();

    return tasks.filter((task) => {
      // Search by title
      const matchTitle = task.title.toLowerCase().includes(query);

      // Search by description
      const matchDescription = task.description?.toLowerCase().includes(query);

      // Search by status
      const statusLabel = STATUS_CONFIG[task.status]?.label.toLowerCase();
      const matchStatus = statusLabel?.includes(query);

      // Search by priority
      const priorityLabel = PRIORITY_OPTIONS.find(
        (opt) => opt.value === task.priority
      )?.label.toLowerCase();
      const matchPriority = priorityLabel?.includes(query);

      return matchTitle || matchDescription || matchStatus || matchPriority;
    });
  }, [tasks, searchQuery]);

  const getPriorityConfig = (priority: number) => {
    return PRIORITY_OPTIONS.find((opt) => opt.value === priority);
  };

  const handleTaskPress = (taskId: string) => {
    router.push(`/(leader)/task/${taskId}`);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const renderTaskItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => {
      const statusConfig = STATUS_CONFIG[item.status];
      const priorityConfig = getPriorityConfig(item.priority);

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          onPress={() => handleTaskPress(item.id)}
        >
          <Animated.View
            entering={FadeInDown.delay(index * 100)
              .duration(500)
              .springify()}
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
                  Progress {item?.progress?.completed} / {item?.progress?.total}
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
                        (item?.progress?.completed / item?.progress?.total) *
                        100
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
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [theme.colors]
  );

  const renderEmptyState = useCallback(() => {
    const isSearching = searchQuery.trim().length > 0;

    return (
      <View
        style={[GlobalStyles.flex, GlobalStyles.center, { paddingTop: "80%" }]}
      >
        <Ionicons
          name={isSearching ? "search-outline" : "document-text-outline"}
          size={64}
          color={theme.colors.textSecondary}
          style={{ marginBottom: SPACING.md }}
        />
        <Text type="medium" size="lg" color={theme.colors.textSecondary}>
          {isSearching
            ? `Tidak ada hasil untuk "${searchQuery}"`
            : "Tidak ada data"}
        </Text>
        {isSearching && (
          <>
            <Gap vertical={8} />
            <Text type="regular" size="sm" color={theme.colors.textSecondary}>
              Coba kata kunci lain
            </Text>
          </>
        )}
      </View>
    );
  }, [searchQuery, theme.colors]);

  return (
    <View
      style={[
        GlobalStyles.flex,
        { paddingTop: top, backgroundColor: theme.colors.background },
      ]}
    >
      <Header title={`Tugas ${subditId}`} />

      <View style={styles.spacing}>
        <Input
          placeholder="Cari judul, deskripsi, status, atau prioritas..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searchQuery.trim().length > 0 && (
          <>
            <Gap vertical={8} />
            <Text type="medium" size="xs" color={theme.colors.textSecondary}>
              Ditemukan {filteredTasks.length} tugas
            </Text>
          </>
        )}
      </View>

      <FlatList
        data={filteredTasks}
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

export default TaskBySubditScreen;

const styles = StyleSheet.create({
  content: {
    marginHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl + SPACING.xxl + SPACING.xxl,
  },
  spacing: {
    padding: SPACING.md,
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
