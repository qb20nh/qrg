# Version Bumping and Changelog Guide

This document provides step-by-step instructions for properly bumping the version and maintaining the changelog.

## Prerequisites

Before starting:
1. All feature work must be **committed** to git
2. No uncommitted changes except changelog and manifest modifications
3. Verify current version in `manifest.json`

```bash
git status  # Should show clean working directory or only expected changes
```

## Steps to Bump Version

### 1. Gather Changes Since Last Release

Before determining the version, review all changes made since the last version tag:

```bash
# View commits since the last tag
git log <LAST_TAG>..HEAD --oneline

# Example: to see changes since v1.1.0
git log v1.1.0..HEAD --oneline

# View detailed diff since last tag
git diff <LAST_TAG>..HEAD
```

Use this information to determine what type of version bump is needed.

### 2. Determine New Version

Identify the new version number following [Semantic Versioning](https://semver.org/):
- **PATCH** (1.1.0 → 1.1.1): Bug fixes, minor improvements
- **MINOR** (1.1.0 → 1.2.0): New features, backwards compatible
- **MAJOR** (1.1.0 → 2.0.0): Breaking changes

**Example:** Bumping from 1.1.0 to 1.1.1

### 3. Update CHANGELOG.md

Follow [Keep a Changelog](https://keepachangelog.com/) conventions when updating the changelog.

#### 3a. Create New Version Section

Add a new dated section at the top (below `[Unreleased]`):

1. Open `CHANGELOG.md`
2. Below the `[Unreleased]` section, add:
   - `## [X.Y.Z] - YYYY-MM-DD` (new version section header)
   - Category subsections (only include those with content): `### Added`, `### Changed`, `### Fixed`, `### Removed`, `### Deprecated`, `### Security`
3. Fill in the changes that apply to this version
4. Move any entries from `[Unreleased]` to the new version section

**Changelog Format Rules:**
- Add version sections as `## [X.Y.Z] - YYYY-MM-DD` (use current date in `YYYY-MM-DD` format)
- Use categories: `### Added`, `### Changed`, `### Fixed`, `### Removed`, `### Deprecated`, `### Security`
- Only include category sections that contain content
- Keep `[Unreleased]` at the top for in-progress work
- Only document **user-facing changes**, and omit internal refactorings (unless behavior changes)
- **CRITICAL:** At least one category section must contain content. Do not create a version bump with all empty categories.

#### 3b. Move Unreleased Changes

If there were entries in `[Unreleased]`, move them to the new version section.

### 4. Update manifest.json

Change the version field to match:

```diff
{
  "manifest_version": 3,
  "name": "qrg - Simple QR Code Generator",
- "version": "1.1.0",
+ "version": "1.1.1",
  ...
}
```

### 5. Commit Changes

**Rule:** Commit message must describe what changed, not just "bump version"

Examples:
- ✅ `Rename package name for SEO`
- ✅ `Add QR code download feature`
- ❌ `Bump version to 1.1.1`
- ❌ `Update version`

```bash
git add CHANGELOG.md manifest.json
git commit -m "Rename package name for SEO"
```

### 6. Create Git Tag

**Critical:** Tag must be on the commit that has the version change, not before or after.

```bash
git tag -a v1.1.1 -m "Release version 1.1.1"
```

**Rules:**
- Tag format: `v<VERSION>` (lowercase 'v', exact version number)
- Use annotated tags (`-a`), not lightweight tags
- Message format: `Release version X.Y.Z`

### 7. Verification Checklist

Run these commands to verify everything is correct:

```bash
# 1. Check tag exists
git tag -l v1.1.1 -n

# 2. Verify tag points to correct commit
git log --oneline --all --decorate -5

# 3. Expected output:
# abc1234 (HEAD -> main, tag: v1.1.1) Rename package name for SEO
# def5678 (tag: v1.1.0) Update version to 1.1.0
# ...

# 4. Verify manifest version matches tag
grep '"version"' manifest.json  # Unix/Linux/WSL
# or on Windows PowerShell:
# Select-String '"version"' manifest.json
# Should show: "version": "1.1.1",

# 5. Verify changelog has the version
grep "## \[1.1.1\]" CHANGELOG.md  # Unix/Linux/WSL
# or on Windows PowerShell:
# Select-String '## \[1.1.1\]' CHANGELOG.md
# Should find the section
```

## Fixing Common Mistakes

### Mistake: Tag on Wrong Commit

**Problem:** Tag v1.1.0 is on the wrong commit
**Solution:**
```bash
git tag -d v1.1.0                              # Delete wrong tag
git tag -a v1.1.0 -m "Release version 1.1.0" <COMMIT_HASH>  # Create on correct commit
```

### Mistake: Amended Commit After Tagging

**Problem:** Created commit, tagged it, then amended the commit (SHA changed)
**Solution:**
```bash
git tag -d v1.1.1                              # Delete old tag
git tag -a v1.1.1 -m "Release version 1.1.1"  # Create tag on current HEAD
```

### Mistake: Uncommitted Changes When Tagging

**Problem:** Tag created but changelog/manifest changes not committed
**Solution:**
```bash
git add CHANGELOG.md manifest.json
git commit -m "Descriptive message (vX.Y.Z)"
git tag -d vX.Y.Z
git tag -a vX.Y.Z -m "Release version X.Y.Z"
```

## GitHub Release Automation

After pushing tags to GitHub:
```bash
git push origin main --tags
```

The GitHub Actions workflow (`.github/workflows/release.yml`) will:
1. Detect the new tag
2. Extract the corresponding CHANGELOG section
3. Automatically create a GitHub release with:
   - Release name: `qrg v1.1.1`
   - Release body: Changelog content + installation instructions
   - Attached: Packaged extension ZIP file

## Quick Reference

| Step | Command | Notes |
|------|---------|-------|
| Prerequisites | `git status` | Should show clean working directory |
| 1. Gather changes | `git log v<LAST_VERSION>..HEAD --oneline` | Review changes since last release |
| 2. Determine version | Manual | Use Semantic Versioning rules |
| 3. Update changelog | Edit `CHANGELOG.md` | Add new version section with user-facing changes |
| 4. Update manifest | Edit `manifest.json` | Update version field |
| 5. Commit | `git commit -m "Descriptive message"` | Describe what changed, not "bump version" |
| 6. Tag | `git tag -a vX.Y.Z -m "Release version X.Y.Z"` | Annotated tag, exact format required |
| 7. Verify | `git log --oneline --all --decorate -5` | Confirm tag on correct commit |
| Push | `git push origin main --tags` | Triggers GitHub Actions automation |
