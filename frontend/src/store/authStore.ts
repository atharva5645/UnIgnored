import { create } from 'zustand';
import { User } from '../types/user';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading while we check the listener
  error: null,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user, 
    isLoading: false,
    error: null 
  }),

  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),

  clearError: () => set({ error: null }),

  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, error: null });
    } catch (error) {
      console.error("Logout failed:", error);
      set({ error: "Logout failed" });
    }
  }
}));
