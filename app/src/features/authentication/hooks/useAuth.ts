import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { authService } from '../services/auth.service';
import { LoginFormData, RegisterFormData, UseAuthReturn } from '../types';

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(data);
      storeLogin(response.user, response.tokens.accessToken);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await authService.register(data);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    authService.logout().catch(console.error);
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
};