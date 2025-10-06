import { api, fetchCsrfToken } from '../axios';
import { User, LoginCredentials, RegisterData, ApiResponse } from '@/types';

/**
 * Authentication API endpoints
 * Uses Sanctum SPA cookie-based authentication
 */

export const authApi = {
  // Get current authenticated user
  me: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/api/me');
    return response.data.data!;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<User> => {
    await fetchCsrfToken();
    const response = await api.post<ApiResponse<User>>('/api/login', credentials);
    return response.data.data!;
  },

  // Register
  register: async (data: RegisterData): Promise<User> => {
    await fetchCsrfToken();
    const response = await api.post<ApiResponse<User>>('/api/register', data);
    return response.data.data!;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/api/logout');
  },
};


