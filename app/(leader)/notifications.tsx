import { Notification } from "@/src/api";
import { Header } from "@/src/components";
import Text from "@/src/components/ui/Text";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useNotification } from "@/src/hooks/useNotification";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotificationsScreen = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();

  const {
    notifications,
    pagination,
    isLoading,
    getNotifications,
    readNotification,
  } = useNotification();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Initial load
  useFocusEffect(
    useCallback(() => {
      getNotifications(1);
    }, [getNotifications])
  );

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Baru saja";
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    return date.toLocaleDateString("id-ID");
  };

  const handleNotificationPress = useCallback(
    async (notif: Notification) => {
      await readNotification(notif.id);

      router.push(`/(leader)/task/${notif.task.id}`);
    },
    [readNotification]
  );

  const loadMore = useCallback(async () => {
    if (!pagination || loadingMore || isLoading) return;

    // Check if there are more pages
    const hasMore = pagination.page < pagination.totalPages;
    if (!hasMore) return;

    setLoadingMore(true);
    const nextPage = pagination.page + 1;

    try {
      await getNotifications(nextPage);
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [pagination, loadingMore, isLoading, getNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await getNotifications(1);
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  }, [getNotifications]);

  const renderItem = useCallback(
    ({ item, index }: { item: Notification; index: number }) => {
      return (
        <Animated.View
          entering={FadeInDown.delay(index * 50)
            .duration(400)
            .springify()}
        >
          <TouchableOpacity
            style={[
              styles.notificationItem,
              {
                backgroundColor: item.isRead
                  ? theme.colors.background
                  : theme.colors.primary + "15",
                borderColor: item.isRead
                  ? theme.colors.border
                  : theme.colors.primary + "40",
              },
            ]}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme.colors.primary + "20",
                },
              ]}
            >
              <Ionicons
                name="notifications"
                size={24}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.headerRow}>
                <Text
                  type="semibold"
                  size="sm"
                  color={
                    item.isRead ? theme.colors.textSecondary : theme.colors.text
                  }
                  style={styles.title}
                >
                  {item.title}
                </Text>
                {!item.isRead && (
                  <View
                    style={[
                      styles.unreadDot,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                )}
              </View>

              <Text
                type="regular"
                size="xs"
                color={theme.colors.textSecondary}
                numberOfLines={2}
                style={styles.message}
              >
                {item.subtitle}
              </Text>

              <Text
                type="regular"
                size="xxs"
                color={theme.colors.textSecondary}
                style={styles.time}
              >
                {getTimeAgo(item.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [theme, handleNotificationPress]
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text
          type="regular"
          size="sm"
          color={theme.colors.textSecondary}
          style={styles.loadingText}
        >
          Memuat lebih banyak...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="notifications-off-outline"
          size={64}
          color={theme.colors.textSecondary}
        />
        <Text
          type="semibold"
          size="lg"
          color={theme.colors.textSecondary}
          style={styles.emptyText}
        >
          Tidak ada notifikasi
        </Text>
      </View>
    );
  };

  const keyExtractor = useCallback(
    (item: Notification, index: number) => `${item.id}-${index}`,
    []
  );

  return (
    <View
      style={[
        GlobalStyles.flex,
        { paddingTop: top, backgroundColor: theme.colors.background },
      ]}
    >
      {/* Header */}
      <Header title="Notifikasi" />

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: SPACING.lg,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  notificationItem: {
    ...GlobalStyles.row,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    ...GlobalStyles.center,
    marginRight: SPACING.md,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    ...GlobalStyles.rowBetween,
    marginBottom: 4,
  },
  title: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING.xs,
  },
  message: {
    marginBottom: 4,
  },
  time: {
    marginTop: 2,
  },
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    ...GlobalStyles.center,
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    marginTop: SPACING.md,
  },
});
