import { MMKV_CONFIG } from "@/src/constants/storage.constants";
import { MMKV } from "react-native-mmkv";

// Initialize MMKV instances
export const secureTokensMMKV = new MMKV(MMKV_CONFIG.SECURE_TOKENS);
export const appStorageMMKV = new MMKV(MMKV_CONFIG.APP_STORAGE);

// MMKV storage adapter for Zustand
export const createMMKVAdapter = (mmkvInstance: MMKV) => ({
  getItem: (name: string) => {
    const value = mmkvInstance.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    mmkvInstance.set(name, value);
  },
  removeItem: (name: string) => {
    mmkvInstance.delete(name);
  },
});

// Export adapters
export const secureStorageAdapter = createMMKVAdapter(secureTokensMMKV);
export const appStorageAdapter = createMMKVAdapter(appStorageMMKV);
