// Popup script for qrg extension
// This will handle getting the current tab URL and generating QR code

// Placeholder for future implementation
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    console.log('Current tab URL:', tabs[0].url);
    // TODO: Generate and display QR code
  }
});

