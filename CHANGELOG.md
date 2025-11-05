# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [1.1.0] - 2025-11-05

### Added

- QR code download functionality

### Changed

- Replaced emoji for SVG icons for theme toggle and download buttons

### Fixed

- Download button now properly disables when no QR code is available

### Removed

## [1.0.2] - 2025-11-04

### Fixed

- Fixed theme icon initialization on extension load

## [1.0.1] - 2025-11-04

### Added

- Automated release workflow

## [1.0.0] - 2025-11-04

### Added

- Initial release of qrg Chrome extension (Manifest V3)
- QR code generation for web pages (http/https URLs)
- Dark and light theme support with icon toggle
- Pixel-perfect QR code rendering
- Privacy-focused implementation (no external requests)

### Changed

- Updated project structure documentation in README
- Reorganized popup.js with clear section separators
- Enhanced CSS organization with section headers
- Improved file headers and documentation consistency
- Added GitHub Actions workflow for automatic releases
  - Automatically creates releases on version tags (v*.*.*)
  - Packages extension as ZIP file
  - Generates release notes with installation instructions
  - Attaches packaged extension to release

### Fixed

- Cleaned up trailing whitespace and blank lines

## [0.1.0] - 2025-11-04

### Added

- Initial project setup and structure
