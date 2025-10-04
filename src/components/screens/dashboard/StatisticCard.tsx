import { useTheme } from "@/src/contexts/ThemeContext";
import { useStatistics } from "@/src/hooks/useStatistics";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Gap, Text } from "../../ui";

interface StatItem {
  icon: string;
  iconFamily: "materialcommunity" | "ionicons";
  title: string;
  value: number | undefined;
  subtitle: string;
  color: string;
}

const StatCard = () => {
  const { theme } = useTheme();
  const { statistics, getStatistics } = useStatistics();

  useFocusEffect(
    useCallback(() => {
      getStatistics();
    }, [getStatistics])
  );

  const DATA: StatItem[] = [
    {
      icon: "clipboard-text",
      iconFamily: "materialcommunity" as const,
      title: "Total Tugas",
      value: statistics?.totalTasks.count,
      subtitle: `+${statistics?.totalTasks.thisMonth} bulan ini`,
      color: theme.colors.info,
    },
    {
      icon: "checkmark-done-circle",
      iconFamily: "ionicons" as const,
      title: "Selesai",
      value: statistics?.completedTasks.count,
      subtitle: "75% completion",
      color: theme.colors.success,
    },
    {
      icon: "time",
      iconFamily: "ionicons" as const,
      title: "Dalam Progress",
      value: statistics?.inProgressTasks.count,
      subtitle: "17% ongoing",
      color: theme.colors.warning,
    },
    {
      icon: "alert-circle",
      iconFamily: "ionicons" as const,
      title: "Perlu Perhatian",
      value: statistics?.stuckTasks.count,
      subtitle: ">1 bulan stagnan",
      color: theme.colors.error,
    },
  ];

  const renderItem = useCallback(
    ({ item, index }: { item: StatItem; index: number }) => {
      return (
        <Animated.View
          entering={FadeInDown.delay(index * 100)
            .duration(500)
            .springify()}
          style={styles.cardWrapper}
        >
          <View
            style={[
              styles.statCard,
              { backgroundColor: theme.colors.surface },
              SHADOWS.sm,
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.color + "15" },
              ]}
            >
              {item.iconFamily === "ionicons" ? (
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              ) : (
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              )}
            </View>
            <Text type="regular" size="xs" color={theme.colors.textSecondary}>
              {item.title}
            </Text>
            <Gap vertical={4} />
            <Text type="bold" size="xxl">
              {item.value}
            </Text>
            <Gap vertical={4} />
            <Text type="regular" size="xs" color={theme.colors.textSecondary}>
              {item.subtitle}
            </Text>
          </View>
        </Animated.View>
      );
    },
    [theme.colors]
  );

  return (
    <FlatList
      scrollEnabled={false}
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.icon}
      numColumns={2}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      removeClippedSubviews={true}
      maxToRenderPerBatch={4}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      initialNumToRender={4}
    />
  );
};

export default StatCard;

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  cardWrapper: {
    width: "48%",
  },
  statCard: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    ...GlobalStyles.center,
  },
});
