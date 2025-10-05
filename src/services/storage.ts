/**
 * Local storage utility service
 * Handles theme and other local storage operations
 */

const THEME_KEY = 'kb-theme';

export const storage = {
  // Theme management
  getTheme: (): 'light' | 'dark' | null => {
    return localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    localStorage.setItem(THEME_KEY, theme);
  },

  // Generic storage operations
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

