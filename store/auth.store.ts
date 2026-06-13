import { create } from 'zustand';
import { UserResponse } from '../types/auth.types';

interface AuthState {
  accessToken: string | null;
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (accessToken: string, user: UserResponse) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts loading while checking token refresh on mount
  setAuth: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isLoading: false,
    }),
  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
}));
