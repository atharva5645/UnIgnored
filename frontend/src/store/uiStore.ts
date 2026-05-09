import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  icon: string;
  timestamp: string;
  read: boolean;
}

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notifications: AppNotification[];
  gdprAccepted: boolean;
  onboardingComplete: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  highContrast: boolean;
  dyslexicFont: boolean;
  rtl: boolean;
  speedMultiplier: number;

  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
  setCommandPalette: (open: boolean) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  clearNotifications: () => void;
  markAllRead: () => void;
  acceptGDPR: () => void;
  setLanguage: (rtl: boolean) => void;
  setAccessibility: (key: string, value: any) => void;
  setSpeedMultiplier: (speed: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: true,
      sidebarOpen: true,
      commandPaletteOpen: false,
      notifications: [],
      gdprAccepted: false,
      onboardingComplete: false,
      fontSize: 'md',
      highContrast: false,
      dyslexicFont: false,
      rtl: false,
      speedMultiplier: 1,

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setCommandPalette: (open) => set({ commandPaletteOpen: open }),
      addNotification: (n) => set((state) => ({
        notifications: [{
          ...n,
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          read: false,
        }, ...state.notifications].slice(0, 50) // Keep max 50
      })),
      clearNotifications: () => set({ notifications: [] }),
      markAllRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      acceptGDPR: () => set({ gdprAccepted: true }),
      setLanguage: (rtl) => set({ rtl }),
      setAccessibility: (key, value) => set({ [key]: value }),
      setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),
    }),
    { name: 'UnIgnored-ui' }
  )
);
