# qrg

A Chrome extension (Manifest V3) for generating QR codes for the current active tab.

## Project Structure

```
qrg/
├── manifest.json              # Extension manifest (MV3)
├── popup/                     # Popup interface
│   ├── popup.html             # Popup HTML
│   ├── popup.js               # Popup script
│   └── popup.css              # Popup styles
├── icons/                     # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md
```

## Development

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `qrg` directory

### Requirements

- Chrome browser (supports Manifest V3)
- Extension icons in `icons/` directory (16x16, 48x48, 128x128 pixels)

## Status

This project is currently bootstrapped and ready for feature implementation.

