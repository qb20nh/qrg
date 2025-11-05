/**
 * Theme management module for qrg extension
 * Handles all theme-related functionality including:
 * - Applying themes to the document
 * - Setting CSS variables for dynamic styling
 * - Managing theme preferences in storage
 * - UI icon and canvas updates
 */

import { 
  THEME_STORAGE_KEY, 
  DARK_THEME, 
  LIGHT_THEME,
  LIGHT_THEME_COLORS,
  DARK_THEME_COLORS
} from './config.js';

// ============================================================================
// CSS Variable Management
// ============================================================================

/**
 * Set CSS custom properties for the given theme and opposite theme
 * @param {string} theme - Current theme ('dark' or 'light')
 */
export function setCSSVariables(theme) {
  const root = document.documentElement;
  const currentColors = theme === DARK_THEME ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
  const oppositeColors = theme === DARK_THEME ? LIGHT_THEME_COLORS : DARK_THEME_COLORS;
  
  // Set current theme colors
  root.style.setProperty('--color-bg', currentColors.bg);
  root.style.setProperty('--color-text', currentColors.text);
  root.style.setProperty('--color-border', currentColors.border);
  root.style.setProperty('--color-button-bg', currentColors.buttonBg);
  root.style.setProperty('--color-button-hover', currentColors.buttonHover);
  root.style.setProperty('--color-button-border-hover', currentColors.buttonBorderHover);
  
  // Set opposite theme colors for preview states
  root.style.setProperty('--color-opposite-bg', oppositeColors.bg);
  root.style.setProperty('--color-opposite-text', oppositeColors.text);
  root.style.setProperty('--color-opposite-border', oppositeColors.border);
  root.style.setProperty('--color-opposite-button-bg', oppositeColors.buttonBg);
  root.style.setProperty('--color-opposite-button-hover', oppositeColors.buttonHover);
  root.style.setProperty('--color-opposite-button-border-hover', oppositeColors.buttonBorderHover);
}

// ============================================================================
// Theme Application
// ============================================================================

/**
 * Apply theme to the document and update UI elements
 * @param {string} theme - The theme to apply ('dark' or 'light')
 * @param {boolean} useTransition - Whether to use View Transitions API
 */
export function applyTheme(theme, useTransition = false) {
  const updateTheme = () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const qrCanvas = document.getElementById('qr-canvas');
    
    if (theme === DARK_THEME) {
      html.setAttribute('data-theme', DARK_THEME);
      setCSSVariables(DARK_THEME);
      themeIcon.src = '../icons/dark_mode.svg';
      themeToggle.title = 'Toggle light mode';
      // Invert canvas colors for dark theme
      if (qrCanvas) {
        qrCanvas.style.filter = 'invert(1)';
      }
    } else {
      html.removeAttribute('data-theme');
      setCSSVariables(LIGHT_THEME);
      themeIcon.src = '../icons/light_mode.svg';
      themeToggle.title = 'Toggle dark mode';
      // Remove filter for light theme
      if (qrCanvas) {
        qrCanvas.style.filter = '';
      }
    }
  };

  // Use View Transitions API if supported and requested
  if (useTransition && document.startViewTransition) {
    document.startViewTransition(() => updateTheme());
  } else {
    updateTheme();
  }
}

// ============================================================================
// Theme Initialization and Toggle
// ============================================================================

/**
 * Initialize theme from storage and apply it
 */
export async function initializeTheme() {
  const stored = await chrome.storage.local.get(THEME_STORAGE_KEY);
  const theme = stored[THEME_STORAGE_KEY] || LIGHT_THEME;
  applyTheme(theme);
}

/**
 * Toggle between light and dark themes
 * Saves preference to storage and applies with transition animation
 */
export async function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || LIGHT_THEME;
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  
  // Save preference
  await chrome.storage.local.set({ [THEME_STORAGE_KEY]: newTheme });
  
  // Apply new theme with transition
  applyTheme(newTheme, true);
}

