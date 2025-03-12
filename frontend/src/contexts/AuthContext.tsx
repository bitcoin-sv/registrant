
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthState, AuthMethod } from "@/types/auth";

interface AuthContextType {
  auth: AuthState;
  login: (method: AuthMethod, privateKey?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const login = (method: AuthMethod, privateKey?: string) => {
    setAuth({
      isAuthenticated: true,
      method,
      privateKey,
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
