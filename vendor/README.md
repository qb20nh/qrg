# Vendored Dependencies

This directory contains third-party libraries bundled with the extension.

## lean-qr

- **File**: `lean-qr-nano.mjs`
- **Version**: 2.6.0
- **License**: MIT (see `lean-qr-LICENSE`)
- **Source**: https://github.com/davidje13/lean-qr
- **Author**: David Evans
- **Description**: Lightweight QR Code generation library

The nano variant is a minimal version of lean-qr that excludes message compression features to reduce bundle size (~3.7KB).

### Updates

To update the library:

```powershell
# Download the latest version
curl "https://cdn.jsdelivr.net/npm/lean-qr@2.6.0/nano.mjs" -O "lean-qr-nano.mjs"

# Download the license
curl "https://raw.githubusercontent.com/davidje13/lean-qr/main/LICENSE" -O "lean-qr-LICENSE"
```

After updating, remember to update the version number in `NOTICES` and this README.

