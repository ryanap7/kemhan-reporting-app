import Logo from "@/assets/images/logo.png";
import { Role } from "@/src/api";
import { Gap } from "@/src/components";
import Text from "@/src/components/ui/Text";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuthStore } from "@/src/stores";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { GlobalStyles } from "@/src/theme/common";
import { SHADOWS } from "@/src/theme/shadows";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const LOGO_WIDTH = 120;
const LOGO_HEIGHT = 120;

const SplashScreen = () => {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuthStore();

  // Shared values for animations
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // Text animation
    textOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    textTranslateY.value = withDelay(
      400,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    // Navigate after 2.5 seconds
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        switch (user.role) {
          case Role.PIMPINAN:
            router.replace("/(leader)/dashboard");
            break;
          case Role.SUBDIT_HANMIL:
          case Role.SUBDIT_HANNIRMIL:
          case Role.SUBDIT_MPP:
          case Role.SUBDIT_ANSTRA:
          default:
            router.replace("/(staff)/dashboard");
            break;
        }
      } else {
        router.replace("/(auth)/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    logoOpacity,
    logoScale,
    textOpacity,
    textTranslateY,
    isAuthenticated,
    user,
  ]);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value * pulseScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Animated Logo */}
      <Animated.View style={logoAnimatedStyle}>
        <View
          style={[
            styles.logoWrapper,
            {
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary,
            },
          ]}
        >
          <Image source={Logo} style={styles.logo} contentFit="cover" />
        </View>
      </Animated.View>

      <Gap vertical={28} />

      {/* Animated Text */}
      <Animated.View style={[GlobalStyles.center, textAnimatedStyle]}>
        <Text type="bold" size="xl">
          Direktorat Pengerahan
        </Text>
        <Gap vertical={8} />
        <Text type="regular" size="sm" color={theme.colors.textSecondary}>
          Kementerian Pertahanan RI
        </Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...GlobalStyles.center,
  },
  logoWrapper: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    borderRadius: BORDER_RADIUS.full,
    ...GlobalStyles.center,
    ...SHADOWS.md,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    borderRadius: BORDER_RADIUS.full,
  },
});
