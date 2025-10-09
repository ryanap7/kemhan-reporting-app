import { StuckTask } from "@/src/api";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useStatistics } from "@/src/hooks/useStatistics";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Gap, Text } from "../../ui";

const CriticalTaskItem = () => {
  const { theme } = useTheme();
  const { stucks, getStuckTasks } = useStatistics();

  useFocusEffect(
    useCallback(() => {
      getStuckTasks();
    }, [getStuckTasks])
  );

  const renderItem = useCallback(
    ({ item, index }: { item: StuckTask; index: number }) => {
      return (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.colors.background }]}
          activeOpacity={0.7}
        >
          <Animated.View
            entering={FadeInDown.delay(index * 100)
              .duration(500)
              .springify()}
          >
            <View style={styles.taskContent}>
              <Text type="medium" size="sm" numberOfLines={2}>
                {item.title}
              </Text>
              <Gap vertical={8} />

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="folder"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    type="regular"
                    size="xs"
                    color={theme.colors.textSecondary}
                  >
                    {item.subdit}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="person"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    type="regular"
                    size="xs"
                    color={theme.colors.textSecondary}
                  >
                    {item.assignee}
                  </Text>
                </View>
              </View>

              <Gap vertical={12} />

              <View style={styles.stuckInfo}>
                <View
                  style={[
                    styles.stuckBadge,
                    { backgroundColor: theme.colors.error + "15" },
                  ]}
                >
                  <Ionicons
                    name="pause-circle"
                    size={16}
                    color={theme.colors.error}
                  />
                  <Text type="bold" size="xs" color={theme.colors.error}>
                    Stuck di {item.stuckProgress} dari {item.totalProgress}{" "}
                    Progress
                  </Text>
                </View>
              </View>

              <Gap vertical={8} />

              <View style={styles.timelineInfo}>
                <View style={styles.timelineItem}>
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
                    Mulai stuck: {item.stuckSince}
                  </Text>
                </View>
                <View style={styles.timelineItem}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={theme.colors.error}
                  />
                  <Text type="medium" size="xs" color={theme.colors.error}>
                    Sudah {item.stuckDays} hari tidak ada progress
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [theme.colors]
  );

  const renderEmptyState = useCallback(() => {
    return (
      <View
        style={[
          GlobalStyles.flex,
          GlobalStyles.center,
          { height: Dimensions.get("window").height * 0.25 },
        ]}
      >
        <Text>Tidak ada data</Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.delay(600).duration(500).springify()}
        style={[styles.header, { backgroundColor: theme.colors.surface }]}
      >
        <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
        <Gap horizontal={8} />
        <Text type="bold" size="md">
          Tugas Memerlukan Perhatian Khusus
        </Text>
      </Animated.View>

      <FlatList
        scrollEnabled={false}
        data={stucks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Gap vertical={12} />}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.content}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        initialNumToRender={5}
      />
    </View>
  );
};

export default CriticalTaskItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xxl,
  },
  header: {
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    ...GlobalStyles.rowCenter,
    ...SHADOWS.md,
  },
  content: {
    margin: SPACING.md,
  },
  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  taskContent: {
    ...GlobalStyles.flex,
  },
  metaRow: {
    gap: SPACING.md,
    ...GlobalStyles.row,
  },
  metaItem: {
    gap: SPACING.xs,
    ...GlobalStyles.rowCenter,
  },
  stuckInfo: {
    ...GlobalStyles.row,
  },
  stuckBadge: {
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    ...GlobalStyles.rowCenter,
  },
  timelineInfo: {
    gap: SPACING.xs,
  },
  timelineItem: {
    gap: SPACING.xs,
    ...GlobalStyles.rowCenter,
  },
});
