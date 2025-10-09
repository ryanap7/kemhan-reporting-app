import Logo from "@/assets/images/logo.png";
import { KeyboardAvoiding } from "@/src/components";
import Input from "@/src/components/form/Input";
import { Button, Gap } from "@/src/components/ui";
import Text from "@/src/components/ui/Text";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuth } from "@/src/hooks/useAuth";
import { GlobalStyles } from "@/src/theme/common";
import { SPACING } from "@/src/theme/spacing";
import { Image } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { authState, updateAuthState, login, isLoading } = useAuth();
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  const validation = useMemo(() => {
    const usernameError = !authState.username.trim()
      ? "Username harus diisi"
      : "";

    const passwordError = !authState.password
      ? "Password harus diisi"
      : authState.password.length < 6
      ? "Password minimal 6 karakter"
      : "";

    const isValid =
      authState.username.trim() !== "" &&
      authState.password !== "" &&
      authState.password.length >= 6;

    return {
      errors: {
        username: usernameError,
        password: passwordError,
      },
      isValid,
    };
  }, [authState.username, authState.password]);

  const handleLogin = useCallback(async () => {
    setTouched({ username: true, password: true });

    if (!validation.isValid) return;

    await login();
  }, [login, validation.isValid]);

  return (
    <ScrollView
      style={{
        paddingTop: top + SPACING.xxl,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoiding>
        {/* Header */}
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} contentFit="cover" />

          <Gap vertical={SPACING.md} />

          <Text type="bold" size="xl">
            Direktorat Pengerahan
          </Text>

          <Gap vertical={SPACING.xs} />

          <Text type="regular" size="sm" color={theme.colors.textSecondary}>
            Kementerian Pertahanan RI
          </Text>
        </View>

        <Gap vertical={SPACING.xxl} />

        {/* Form Login */}
        <View>
          <Text type="bold" size="xl" style={GlobalStyles.center}>
            Login
          </Text>

          <Gap vertical={SPACING.xl} />

          {/* Input Username */}
          <View>
            <Text
              type="semibold"
              size="sm"
              style={{ marginBottom: SPACING.xs }}
            >
              Username
            </Text>
            <Input
              placeholder="Masukkan username"
              value={authState.username}
              onChangeText={(value: string) => {
                updateAuthState({ username: value });
                setTouched((prev) => ({ ...prev, username: true }));
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              error={touched.username ? validation.errors.username : undefined}
            />
          </View>

          <Gap vertical={SPACING.lg} />

          {/* Input Password */}
          <View>
            <Text
              type="semibold"
              size="sm"
              style={{ marginBottom: SPACING.xs }}
            >
              Password
            </Text>
            <Input
              placeholder="Masukkan password"
              value={authState.password}
              onChangeText={(value: string) => {
                updateAuthState({ password: value });
                setTouched((prev) => ({ ...prev, password: true }));
              }}
              secureTextEntry
              autoCapitalize="none"
              editable={!isLoading}
              error={touched.password ? validation.errors.password : undefined}
            />
          </View>

          <Gap vertical={SPACING.xl} />

          {/* Tombol Login */}
          <Button
            title={isLoading ? "Memproses..." : "Masuk"}
            loading={isLoading}
            disabled={!validation.isValid || isLoading}
            onPress={handleLogin}
          />
        </View>
      </KeyboardAvoiding>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 400,
  },
  header: {
    ...GlobalStyles.center,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    ...GlobalStyles.center,
  },
});
