import { AuthTokens, User } from "@/src/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { appStorageAdapter } from "../storage/mmkv.adapter";

interface AuthStore {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,

      // Actions
      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
        }),

      setTokens: (tokens) =>
        set((state) => {
          state.tokens = tokens;
          state.isAuthenticated = true;
        }),

      clearAuth: () =>
        set((state) => {
          state.user = null;
          state.tokens = null;
          state.isAuthenticated = false;
        }),
    })),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => appStorageAdapter),
    }
  )
);
