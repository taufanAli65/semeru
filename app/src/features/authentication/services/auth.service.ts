import api from '@/lib/axios';
import { LoginRequest, RegisterRequest, LoginResponse, ApiResponse } from '@/types/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  async register(userData: RegisterRequest): Promise<{ user: any; message: string }> {
    const response = await api.post<ApiResponse<{ user: any; message: string }>>('/auth/register', userData);
    return response.data.data!;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    return response.data.data!;
  },

  async getCurrentUser(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/auth/me');
    return response.data.data!;
  },
};