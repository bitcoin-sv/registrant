
export type AuthMethod = 'wallet' | 'privateKey';

export interface AuthState {
  isAuthenticated: boolean;
  method?: AuthMethod;
  privateKey?: string;
}
