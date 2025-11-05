/**
 * Popup script for qrg extension
 * Handles QR code generation and display for the current tab URL
 */

import { generateQRCode } from '../shared/qr.js';
import { initializeTheme, toggleTheme } from '../shared/theme.js';
import { DARK_THEME, LIGHT_THEME, LIGHT_THEME_COLORS, DARK_THEME_COLORS } from '../shared/config.js';

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
 * Set download button enabled/disabled state
 * @param {boolean} enabled - Whether the button should be enabled
 */
function setDownloadButtonEnabled(enabled) {
  const downloadBtn = document.getElementById('download-btn');
  downloadBtn.disabled = !enabled;
}

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
  
  setDownloadButtonEnabled(false);
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
    
    setDownloadButtonEnabled(true);
  } catch (error) {
    console.error('Error generating QR code:', error);
    showError('Failed to generate QR code. Please try again.');
  }
}

/**
 * Download the QR code as a PNG image
 */
function downloadQRCode() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || !canvas.width) {
    console.warn('QR code canvas not available for download');
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    
    try {
      // Get current theme and corresponding colors from config
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme') || LIGHT_THEME;
      const themeColors = currentTheme === DARK_THEME ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
      const bgColor = themeColors.bg;
      
      // Get the QR code data and scale settings
      const qrSize = canvas.width;
      const scale = 4;
      const padding = (qrSize / 8) * scale; // Padding scaled 4x
      const downloadSize = (qrSize * scale) + (padding * 2);
      
      // Prepare download canvas with padding and solid background
      downloadCanvas.width = downloadSize;
      downloadCanvas.height = downloadSize;
      const ctx = downloadCanvasCtx;
      
      // Fill with background color from config
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, downloadSize, downloadSize);
      
      if (currentTheme === DARK_THEME) {
        // Prepare temporary canvas for inversion
        invertCanvas.width = qrSize;
        invertCanvas.height = qrSize;
        const tempCtx = invertCanvasCtx;
        
        // Draw original QR code
        tempCtx.drawImage(canvas, 0, 0);
        
        // Invert only the QR code pixels
        const imageData = tempCtx.getImageData(0, 0, qrSize, qrSize);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];     // R
          data[i + 1] = 255 - data[i + 1]; // G
          data[i + 2] = 255 - data[i + 2]; // B
          // Keep alpha as is
        }
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw the inverted QR code scaled and positioned with padding
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(invertCanvas, padding, padding, qrSize * scale, qrSize * scale);
      } else {
        // Draw the QR code scaled and positioned with padding (light mode)
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, padding, padding, qrSize * scale, qrSize * scale);
      }
      
      // Convert to blob and download
      downloadCanvas.toBlob((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Create filename from current URL and full timestamp
        const url = new URL(tabs[0].url);
        const hostname = url.hostname.replace(/www\./, '');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `qrg-${hostname}-${timestamp}.png`;
        
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  });
}

// ============================================================================
// Initialization
// ============================================================================

// Reusable canvas elements for download operations
let downloadCanvas = null;
let downloadCanvasCtx = null;
let invertCanvas = null;
let invertCanvasCtx = null;

/**
 * Initialize reusable canvas elements for download operations
 */
function initializeDownloadCanvases() {
  downloadCanvas = document.createElement('canvas');
  downloadCanvasCtx = downloadCanvas.getContext('2d');
  
  invertCanvas = document.createElement('canvas');
  invertCanvasCtx = invertCanvas.getContext('2d');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  const themeToggle = document.getElementById('theme-toggle');
  const downloadBtn = document.getElementById('download-btn');
  themeToggle.addEventListener('click', toggleTheme);
  downloadBtn.addEventListener('click', downloadQRCode);
  window.addEventListener('resize', updateCanvasScale);
  
  // Show the icon for the mode we're changing TO on hover
  themeToggle.addEventListener('mouseenter', () => {
    themeToggle.classList.add('preview');
  });
  
  // Restore the current theme icon on mouse leave
  themeToggle.addEventListener('mouseleave', () => {
    themeToggle.classList.remove('preview');
  });
}

/**
 * Initialize the popup
 */
async function init() {
  await initializeTheme();
  initializeDownloadCanvases();
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