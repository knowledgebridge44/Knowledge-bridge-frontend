import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) {
    return (window as any).__APP_CONFIG__.apiBaseUrl;
  }
  return import.meta.env.VITE_API_BASE_URL || '';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

let csrfTokenPromise: Promise<void> | null = null;

export const fetchCsrfToken = async (): Promise<void> => {
  if (!csrfTokenPromise) {
    csrfTokenPromise = api.get('/sanctum/csrf-cookie').then((response) => {
      csrfTokenPromise = null;
    }).catch((error) => {
      csrfTokenPromise = null;
      throw error;
    });
  }
  return csrfTokenPromise;
};

const getCsrfToken = (): string | null => {
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  return null;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken && config.headers) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const config = error.config;

    if (status === 419) {
      try {
        await fetchCsrfToken();
        if (error.config) {
          return api.request(error.config);
        }
      } catch (csrfError) {
        return Promise.reject(csrfError);
      }
    }

    // Only redirect to login if 401 and NOT on auth-related pages
    const isAuthEndpoint = config?.url?.includes('/login') || config?.url?.includes('/register');
    if (status === 401 && !window.location.pathname.includes('/login') && !isAuthEndpoint) {
      window.location.href = '/login';
    }

    const normalizedError = {
      status: status || 500,
      message: (error.response?.data as any)?.message || error.message || 'An error occurred',
      errors: (error.response?.data as any)?.errors || {},
    };

    return Promise.reject(normalizedError);
  }
);

export const initializeAuth = async (): Promise<void> => {
  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
  }
};

export default api;

