// Auth utility functions

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getStoredUser = (): string | null => {
  return localStorage.getItem('username');
};

export const storeAuthData = (username: string): void => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('username', username);
};

export const clearAuthData = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
};

// Handle storage events to sync auth state across tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'isAuthenticated' && !event.newValue) {
      // If isAuthenticated is removed in another tab, clear all auth data
      clearAuthData();
    }
  });
}
