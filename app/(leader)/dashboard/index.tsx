import { Gap } from "@/src/components";
import CriticalTaskItem from "@/src/components/screens/dashboard/CriticalTaskItem";
import StatisticCard from "@/src/components/screens/dashboard/StatisticCard";
import SubditTaskCard from "@/src/components/screens/dashboard/SubditTaskCard";
import Text from "@/src/components/ui/Text";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuth } from "@/src/hooks/useAuth";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LeaderDashboard = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

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
        <StatisticCard />
        <SubditTaskCard />
        <CriticalTaskItem />
      </ScrollView>
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
});
