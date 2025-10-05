import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get API base URL from window config (injected by Laravel) or fallback
const getApiBaseUrl = (): string => {
  // In production, Laravel will inject this config
  if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) {
    return (window as any).__APP_CONFIG__.apiBaseUrl;
  }
  // In development, use relative path (Vite proxy handles it)
  return import.meta.env.VITE_API_BASE_URL || '';
};

// Create axios instance
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for SPA cookie authentication
});

// CSRF token management
let csrfTokenPromise: Promise<void> | null = null;

export const fetchCsrfToken = async (): Promise<void> => {
  if (!csrfTokenPromise) {
    csrfTokenPromise = axios.get('/sanctum/csrf-cookie', {
      baseURL: getApiBaseUrl(),
      withCredentials: true,
    }).then(() => {
      csrfTokenPromise = null;
    }).catch((error) => {
      csrfTokenPromise = null;
      throw error;
    });
  }
  return csrfTokenPromise;
};

// Get CSRF token from cookie
const getCsrfToken = (): string | null => {
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  return null;
};

// Request interceptor - add CSRF token for state-changing requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token for state-changing requests
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken && config.headers) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    // Handle 419 (CSRF token mismatch) - refetch CSRF and retry
    if (status === 419) {
      try {
        await fetchCsrfToken();
        // Retry the original request
        if (error.config) {
          return api.request(error.config);
        }
      } catch (csrfError) {
        return Promise.reject(csrfError);
      }
    }

    // Handle 401 (Unauthenticated) - redirect to login
    if (status === 401) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle 403 (Forbidden) - show error
    if (status === 403) {
      console.error('Access forbidden:', error.response?.data);
    }

    // Normalize error structure
    const normalizedError = {
      status: status || 500,
      message: (error.response?.data as any)?.message || error.message || 'An error occurred',
      errors: (error.response?.data as any)?.errors || {},
    };

    return Promise.reject(normalizedError);
  }
);

// Initialize CSRF token on app boot
export const initializeAuth = async (): Promise<void> => {
  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
  }
};

export default api;

