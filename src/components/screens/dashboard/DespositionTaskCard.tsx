import { useTheme } from "@/src/contexts/ThemeContext";
import { useStatistics } from "@/src/hooks/useStatistics";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Gap, Text } from "../../ui";

const DespositionTaskCard = () => {
  const { theme } = useTheme();
  const { statistics, getStatistics } = useStatistics();

  useFocusEffect(
    useCallback(() => {
      getStatistics();
    }, [getStatistics])
  );

  const pending = statistics?.pendingDispositionTasks?.count ?? 0;

  const redirectTo = useCallback(() => {
    router.push("/(leader)/task");
  }, []);

  return pending > 0 ? (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.error,
        },
      ]}
      onPress={redirectTo}
    >
      <Ionicons name="alert-circle" color={theme.colors.error} size={24} />
      <Gap horizontal={8} />
      <View>
        <Text type="medium" size="sm">
          <Text type="bold">{pending}</Text>
          <Gap horizontal={4} />
          Tugas belum didisposisikan
        </Text>
      </View>
    </TouchableOpacity>
  ) : null;
};

export default DespositionTaskCard;

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginHorizontal: SPACING.md,
    borderWidth: 1.5,
    ...GlobalStyles.rowCenter,
    ...SHADOWS.md,
  },
});
