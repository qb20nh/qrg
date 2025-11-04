/**
 * Background service worker for qrg extension
 * Handles extension lifecycle events
 */

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('qrg extension installed');
  } else if (details.reason === 'update') {
    console.log('qrg extension updated');
  }
});

