import React, { createContext, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const AuthContext = createContext<null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Safety timeout to prevent infinite loading if Firebase hangs
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Subscribe to Firebase Auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      clearTimeout(timeout);
      // PROTOTYPE BYPASS: Prevent Firebase from overwriting the hardcoded prototype admin/officer session
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.email === 'admin@gmail.com') {
        // If we are locally logged in as prototype, but Firebase doesn't recognize an auth token yet,
        // force an anonymous sign-in so Firestore reads don't fail silently on refresh.
        if (!user) {
          try {
            const { signInAnonymously } = await import('firebase/auth');
            const { auth } = await import('../firebase/config');
            await signInAnonymously(auth);
          } catch (err) {
            console.error("Auto anonymous auth failed:", err);
          }
        }
        setLoading(false);
        return;
      }
      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [setUser, setLoading]);

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
