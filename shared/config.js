/**
 * Centralized configuration for qrg extension
 * Single source of truth for theme and color constants
 */

// ============================================================================
// Theme Identifiers
// ============================================================================

export const THEME_STORAGE_KEY = 'theme-preference';
export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';

// ============================================================================
// Color Palette - Light Theme
// ============================================================================

export const LIGHT_THEME_COLORS = {
  bg: '#ffffff',
  text: '#333333',
  border: '#e0e0e0',
  buttonBg: '#f5f5f5',
  buttonHover: '#e8e8e8',
  buttonBorderHover: '#b8b8b8',
};

// ============================================================================
// Color Palette - Dark Theme
// ============================================================================

export const DARK_THEME_COLORS = {
  bg: '#1e1e1e',
  text: '#e0e0e0',
  border: '#555555',
  buttonBg: '#333333',
  buttonHover: '#3f3f3f',
  buttonBorderHover: '#777777',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get colors for the given theme
 * @param {string} theme - 'dark' or 'light'
 * @returns {Object} Color palette for the theme
 */
export function getThemeColors(theme) {
  return theme === DARK_THEME ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
}

/**
 * Get the opposite theme
 * @param {string} theme - 'dark' or 'light'
 * @returns {string} The opposite theme
 */
export function getOppositeTheme(theme) {
  return theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
}

