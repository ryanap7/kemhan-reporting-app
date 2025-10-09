import { SubditStatistics } from "@/src/api";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useStatistics } from "@/src/hooks/useStatistics";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import moment from "moment";
import "moment/locale/id";
import React, { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";
import { Gap, Text } from "../../ui";

const SubditTaskCard = () => {
  const { theme } = useTheme();
  const { statistics, getStatistics } = useStatistics();

  useFocusEffect(
    useCallback(() => {
      getStatistics();
    }, [getStatistics])
  );

  const DATA = statistics?.bySubdit;

  const renderItem = useCallback(
    ({ item, index }: { item: SubditStatistics; index: number }) => {
      return (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.colors.background }]}
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: "/(leader)/task/by-subdit",
              params: {
                subditId: item.subdit,
              },
            });
          }}
        >
          <Animated.View
            entering={FadeInLeft.delay(index * 100)
              .duration(500)
              .springify()}
          >
            <View style={styles.cardHeader}>
              <Text type="bold" size="md">
                {item.name}
              </Text>
              <Text type="regular" size="xs" color={theme.colors.textSecondary}>
                {item.subdit}
              </Text>
            </View>

            <View style={styles.statistics}>
              <View style={styles.statisticItem}>
                <Text
                  type="regular"
                  size="xs"
                  color={theme.colors.textSecondary}
                >
                  Total
                </Text>
                <Text type="bold" size="lg">
                  {item.total}
                </Text>
              </View>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <View style={styles.statisticItem}>
                <Text type="regular" size="xs" color={theme.colors.success}>
                  Selesai
                </Text>
                <Text type="bold" size="lg" color={theme.colors.success}>
                  {item.completed}
                </Text>
              </View>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <View style={styles.statisticItem}>
                <Text type="regular" size="xs" color={theme.colors.warning}>
                  Progress
                </Text>
                <Text type="bold" size="lg" color={theme.colors.warning}>
                  {item.inProgress}
                </Text>
              </View>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <View style={styles.statisticItem}>
                <Text type="regular" size="xs" color={theme.colors.error}>
                  Stagnan
                </Text>
                <Text type="bold" size="lg" color={theme.colors.error}>
                  {item.stuck}
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text type="regular" size="xs" color={theme.colors.textSecondary}>
                Update terakhir:{" "}
                {moment(item.lastUpdate).format("DD MMMM YYYY")}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [theme.colors]
  );

  return (
    <View>
      <Animated.View
        entering={FadeInUp.delay(600).duration(500).springify()}
        style={[styles.header, { backgroundColor: theme.colors.surface }]}
      >
        <Text type="bold" size="md">
          Status Subdirektorat
        </Text>
        <Text type="regular" size="xs" color={theme.colors.textSecondary}>
          Monitoring real-time 4 subdirektorat
        </Text>
      </Animated.View>
      <FlatList
        scrollEnabled={false}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Gap vertical={12} />}
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

export default SubditTaskCard;

const styles = StyleSheet.create({
  header: {
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  content: {
    padding: SPACING.md,
  },
  card: {
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  cardHeader: {
    gap: SPACING.xs,
  },
  statistics: {
    ...GlobalStyles.rowBetween,
  },
  statisticItem: {
    width: Dimensions.get("window").width * 0.2,
    gap: SPACING.xs,
    ...GlobalStyles.center,
  },
  divider: {
    width: 1,
    height: 40,
  },
  footer: {
    gap: SPACING.sm,
    ...GlobalStyles.rowCenter,
  },
});
