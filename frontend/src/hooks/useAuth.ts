import { useCallback } from 'react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/user';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, setError, clearError, setLoading } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    clearError();
    try {
      await authService.login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  }, [setLoading, clearError, setError]);

  const register = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    clearError();
    try {
      await authService.register(email, password, name, role);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  }, [setLoading, clearError, setError]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      throw err;
    }
  }, [setLoading, clearError, setError]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    clearError
  };
};
