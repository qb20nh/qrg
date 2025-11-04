/**
 * Background service worker for qrg extension
 * Handles extension lifecycle events and icon theme management
 */

// Theme constants
const THEME_STORAGE_KEY = 'theme-preference';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

/**
 * Update extension icon based on theme
 * @param {string} theme - The theme ('dark' or 'light')
 */
function updateIcon(theme) {
  if (theme === DARK_THEME) {
    chrome.action.setIcon({
      path: {
        16: '../icons/icon-16.dark.png',
        48: '../icons/icon-48.dark.png',
        128: '../icons/icon-128.dark.png'
      }
    });
  } else {
    chrome.action.setIcon({
      path: {
        16: '../icons/icon-16.png',
        48: '../icons/icon-48.png',
        128: '../icons/icon-128.png'
      }
    });
  }
}

/**
 * Initialize icon based on stored theme preference
 */
async function initializeIcon() {
  const stored = await chrome.storage.local.get(THEME_STORAGE_KEY);
  const theme = stored[THEME_STORAGE_KEY] || LIGHT_THEME;
  updateIcon(theme);
}

// Initialize icon when extension starts
chrome.runtime.onStartup.addListener(() => {
  initializeIcon();
});

// Initialize icon when extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('qrg extension installed');
  } else if (details.reason === 'update') {
    console.log('qrg extension updated');
  }
  initializeIcon();
});

// Listen for theme changes in storage and update icon
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[THEME_STORAGE_KEY]) {
    updateIcon(changes[THEME_STORAGE_KEY].newValue);
  }
});
