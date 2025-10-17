/**
 * Authentication utility functions
 */

/**
 * Clear all authentication-related data from browser storage
 */
export const clearAuthStorage = (): void => {
  // Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("userProfile");
  localStorage.removeItem("authProvider");

  // Clear sessionStorage
  sessionStorage.clear();

  console.log("Authentication storage cleared");
};

/**
 * Check if user is authenticated by checking for access token
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

/**
 * Get the stored access token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

/**
 * Store the access token
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
};

/**
 * Get stored user data
 */
export const getStoredUser = (): any | null => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      return null;
    }
  }
  return null;
};

/**
 * Store user data
 */
export const setStoredUser = (user: any): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Store authentication provider (local, github, google)
 */
export const setAuthProvider = (provider: string): void => {
  localStorage.setItem("authProvider", provider);
};

/**
 * Get authentication provider
 */
export const getAuthProvider = (): string | null => {
  return localStorage.getItem("authProvider");
};

/**
 * Check if user logged in with GitHub
 */
export const isGithubAuth = (): boolean => {
  return getAuthProvider() === "github";
};
