# qrg

A Chrome extension (Manifest V3) for generating QR codes for the current active tab.

## Features

- 🔗 Generate QR codes for web pages (http/https URLs)
- 🌓 Dark and light theme support
- 🎨 Pixel-perfect QR code rendering
- ⚡ Fast and lightweight (~4KB QR library)
- 🔒 Privacy-focused (no external requests)

## Project Structure

```
qrg/
├── manifest.json              # Extension manifest (MV3)
├── background/                # Background service worker
│   └── background.js          # Extension lifecycle events
├── popup/                     # Popup interface
│   ├── popup.html             # Popup HTML
│   ├── popup.js               # Popup script
│   └── popup.css              # Popup styles
├── shared/                    # Shared modules
│   └── qr-loader.js           # QR code generation wrapper
├── vendor/                    # Third-party dependencies
│   ├── lean-qr-nano.mjs       # QR code library (v2.6.0)
│   ├── lean-qr-LICENSE        # Library license
│   └── README.md              # Vendor documentation
├── icons/                     # Extension icons
│   ├── icon-16.png            # Light and dark theme variants
│   ├── icon-48.png
│   └── icon-128.png
├── LICENSE                    # MIT License
├── NOTICES                    # Third-party attributions
└── README.md
```

## Development

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `qrg` directory

### Requirements

- Chrome browser (or Chromium-based browser with Manifest V3 support)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

Third-party components are licensed under their respective licenses. See [NOTICES](NOTICES) for attribution details.