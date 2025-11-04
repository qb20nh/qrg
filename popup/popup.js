/**
 * Popup script for qrg extension
 * Handles QR code generation and display for the current tab URL
 */

import { generateQRCode } from '../shared/qr-loader.js';

// Theme constants
const THEME_STORAGE_KEY = 'theme-preference';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

// ============================================================================
// Theme Management
// ============================================================================

/**
 * Initialize theme from storage and apply it
 */
async function initializeTheme() {
  const stored = await chrome.storage.local.get(THEME_STORAGE_KEY);
  const theme = stored[THEME_STORAGE_KEY] || LIGHT_THEME;
  applyTheme(theme);
}

/**
 * Apply theme to the document and update extension icon
 */
function applyTheme(theme, useTransition = false) {
  const updateTheme = () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const qrCanvas = document.getElementById('qr-canvas');
    
    if (theme === DARK_THEME) {
      html.setAttribute('data-theme', DARK_THEME);
      themeIcon.textContent = '🌙';
      themeToggle.title = 'Toggle light mode';
      // Invert canvas colors for dark theme
      if (qrCanvas) {
        qrCanvas.style.filter = 'invert(1)';
      }
      // Update toolbar icon to dark theme
      chrome.action.setIcon({
        path: {
          16: '../icons/icon-16.dark.png',
          48: '../icons/icon-48.dark.png',
          128: '../icons/icon-128.dark.png'
        }
      });
    } else {
      html.removeAttribute('data-theme');
      themeIcon.textContent = '☀️';
      themeToggle.title = 'Toggle dark mode';
      // Remove filter for light theme
      if (qrCanvas) {
        qrCanvas.style.filter = '';
      }
      // Update toolbar icon to light theme
      chrome.action.setIcon({
        path: {
          16: '../icons/icon-16.png',
          48: '../icons/icon-48.png',
          128: '../icons/icon-128.png'
        }
      });
    }
  };

  // Use View Transitions API if supported and requested
  if (useTransition && document.startViewTransition) {
    document.startViewTransition(() => updateTheme());
  } else {
    updateTheme();
  }
}

/**
 * Toggle between themes
 */
async function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || LIGHT_THEME;
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  
  // Save preference
  await chrome.storage.local.set({ [THEME_STORAGE_KEY]: newTheme });
  
  // Apply new theme with transition (this will apply filter to canvas)
  applyTheme(newTheme, true);
}

// ============================================================================
// Canvas Scaling
// ============================================================================

/**
 * Recalculate and apply canvas scaling
 * Uses integer scaling for pixel-perfect rendering
 */
function updateCanvasScale() {
  const canvas = document.getElementById('qr-canvas');
  const qrDisplay = document.getElementById('qr-display');
  
  if (!canvas || !canvas.width || !qrDisplay) {
    return;
  }
  
  const containerWidth = qrDisplay.clientWidth;
  const containerHeight = qrDisplay.clientHeight;
  const canvasSize = canvas.width; // Canvas is square
  
  // Calculate maximum integer scale that fits
  const maxScale = Math.floor(Math.min(containerWidth, containerHeight) / canvasSize);
  const scale = Math.max(1, maxScale); // Ensure at least 1x scale
  
  // Apply pixel-perfect scaling
  const displaySize = canvasSize * scale;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;
}

// ============================================================================
// URL Validation
// ============================================================================

/**
 * Check if URL is a valid web URL (http or https)
 * @param {string} url - The URL to check
 * @returns {boolean} True if URL is valid for QR code generation
 */
function isValidWebUrl(url) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// ============================================================================
// QR Code Display
// ============================================================================

/**
 * Display an error message
 * @param {string} message - The error message to display
 */
function showError(message) {
  const qrDisplay = document.getElementById('qr-display');
  const errorMessage = document.getElementById('error-message');
  
  qrDisplay.style.display = 'none';
  errorMessage.style.display = 'block';
  errorMessage.textContent = message;
}

/**
 * Generate and display QR code on canvas
 * @param {string} data - The data to encode in QR code
 */
function displayQRCode(data) {
  try {
    const canvas = document.getElementById('qr-canvas');
    const qrDisplay = document.getElementById('qr-display');
    const errorMessage = document.getElementById('error-message');
    
    // Show QR display, hide error
    qrDisplay.style.display = 'flex';
    errorMessage.style.display = 'none';
    
    // Generate QR code (now synchronous)
    const qrCode = generateQRCode(data);
    
    // Render to canvas using library's built-in method
    // Always use black on transparent - theme filter will invert if needed
    qrCode.toCanvas(canvas, {
      on: [0x00, 0x00, 0x00, 0xFF],  // black modules
      off: [0x00, 0x00, 0x00, 0x00],  // transparent background
      pad: 4
    });
    
    // Calculate pixel-perfect scaling to fit available space
    // Wait for next frame to ensure layout is complete
    requestAnimationFrame(updateCanvasScale);
  } catch (error) {
    console.error('Error generating QR code:', error);
    showError('Failed to generate QR code. Please try again.');
  }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Setup event listeners
 */
function setupEventListeners() {
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', toggleTheme);
  window.addEventListener('resize', updateCanvasScale);
}

/**
 * Initialize the popup
 */
async function init() {
  await initializeTheme();
  setupEventListeners();
  
  // Get current tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = tabs[0].url;
      console.log('Current tab URL:', url);
      
      if (isValidWebUrl(url)) {
        displayQRCode(url);
      } else {
        showError('QR codes can only be generated for web pages (http:// or https://).');
      }
    } else {
      showError('No active tab found.');
    }
  });
}

// Start initialization when DOM is ready
init();