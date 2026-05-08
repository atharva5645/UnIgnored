import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types/user';
import { MOCK_USER } from '../utils/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpSent: boolean;
  
  login: (emailOrPhone: string, role: UserRole) => Promise<void>;
  logout: () => void;
  sendOTP: (emailOrPhone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      otpSent: false,

      login: async (emailOrPhone, role) => {
        set({ isLoading: true });
        // Simulation
        await new Promise(r => setTimeout(r, 1000));
        set({ 
          user: { ...MOCK_USER, email: emailOrPhone, role }, 
          isAuthenticated: true, 
          isLoading: false 
        });
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      sendOTP: async (emailOrPhone) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 1000));
        set({ otpSent: true, isLoading: false });
      },

      verifyOTP: async (otp) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 800));
        set({ isLoading: false });
        return otp === '123456'; // Mock OTP
      },

      updateProfile: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
    }),
    { name: 'civiceye-auth' }
  )
);
