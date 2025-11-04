/**
 * QR code generation wrapper
 * 
 * This module provides a simple interface to the lean-qr library,
 * making it easy to swap implementations if needed.
 */

import { generate } from '../vendor/lean-qr-nano.mjs';

/**
 * Generates a QR code for the given data
 * @param {string} data - The data to encode in the QR code
 * @param {Object} options - Optional configuration for QR code generation
 * @returns {Object} QR code Bitmap2D object with rendering methods
 */
export function generateQRCode(data, options = {}) {
  return generate(data, options);
}
