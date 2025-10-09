import { Gap } from "@/src/components";
import CriticalTaskItem from "@/src/components/screens/dashboard/CriticalTaskItem";
import DespositionTaskCard from "@/src/components/screens/dashboard/DespositionTaskCard";
import StatisticCard from "@/src/components/screens/dashboard/StatisticCard";
import SubditTaskCard from "@/src/components/screens/dashboard/SubditTaskCard";
import Text from "@/src/components/ui/Text";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuth } from "@/src/hooks/useAuth";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LeaderDashboard = () => {
  const { theme } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleCreateTask = () => {
    router.push("/(leader)/task/create");
  };

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
            Dashboard
          </Text>
          <Gap vertical={4} />
          <Text type="regular" size="sm" color={theme.colors.textSecondary}>
            Monitoring Tugas Subdirektorat
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <DespositionTaskCard />
        <StatisticCard />
        <SubditTaskCard />
        <CriticalTaskItem />
      </ScrollView>

      {/* FAB Button */}
      <Animated.View
        entering={FadeInRight.delay(300).duration(500).springify()}
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            bottom: bottom + 20,
          },
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

export default LeaderDashboard;

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
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    ...SHADOWS.md,
  },
  fabTouchable: {
    width: "100%",
    height: "100%",
    ...GlobalStyles.center,
  },
});
