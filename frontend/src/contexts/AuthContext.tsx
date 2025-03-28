
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthState, AuthMethod } from "@/types/auth";
import { WalletInterface } from "@bsv/sdk";

interface AuthContextType {
  auth: AuthState;
  login: (method: AuthMethod, wallet?: WalletInterface) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    return { isAuthenticated: false }
  });

  const login = (method: AuthMethod, wallet?: WalletInterface) => {
    setAuth({
      isAuthenticated: true,
      method,
      wallet
    });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
