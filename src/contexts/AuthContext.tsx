import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type AuthState = {
  username: string;
  password: string;
};

type AuthContextType = {
  authState: AuthState;
  updateAuthState: (updates: Partial<AuthState>) => void;
  resetAuthState: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const initialState: AuthState = {
  username: "",
  password: "",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState((prev) => {
      const newState = { ...prev, ...updates };
      return newState;
    });
  }, []);

  const resetAuthState = () => {
    setAuthState(initialState);
  };

  return (
    <AuthContext.Provider
      value={{ authState, updateAuthState, resetAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
