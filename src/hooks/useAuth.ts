import {
  AuthService,
  Role,
  SecureTokenManager,
  showMessageError,
} from "@/src/api";
import { useAuth as useAuthContext } from "@/src/contexts/AuthContext";
import { useAuthStore } from "@/src/stores";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Keyboard } from "react-native";

export function useAuth() {
  const { authState, updateAuthState, resetAuthState } = useAuthContext();
  const { setUser, setTokens, clearAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const { username, password } = authState;

      const payload = {
        username: username.trim(),
        password,
      };

      // Call login API
      const response = await AuthService.login(payload);

      const { tokens, user } = response.data;

      // Store tokens securely
      await SecureTokenManager.setTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });

      // Update auth store
      setTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });

      setUser(user);

      // Reset form state
      resetAuthState();

      // Navigate based on user role
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
    } catch (error) {
      showMessageError(error, "Login Gagal");
    } finally {
      setIsLoading(false);
    }
  }, [authState, setTokens, setUser, resetAuthState]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Clear tokens from secure storage
      await SecureTokenManager.clearTokens();

      // Clear auth store
      clearAuth();

      // Reset form state
      resetAuthState();

      // Navigate to login
      router.replace("/(auth)/login");
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth, resetAuthState]);

  return {
    // State
    authState,
    isLoading,

    // Actions
    updateAuthState,
    resetAuthState,

    // Auth operations
    login,
    logout,
  };
}
