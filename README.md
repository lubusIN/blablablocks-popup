# BlaBlaBlocks Popup

[![Documentation](https://img.shields.io/badge/Documentation-000?style=for-the-badge&logo=googledocs&logoColor=fff)](https://github.com/lubusIN/blablablocks-popup)
[![GitHub Repository](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=fff)](https://github.com/lubusIN/blablablocks-popup)

## Overview

BlaBlaBlocks Popup is a WordPress plugin for creating popups with the native Block Editor and managing them through a modern DataViews admin experience.

Popup content is designed with blocks, while popup behavior, display rules, triggers, and design settings are managed through purpose-built React interfaces. The plugin avoids the classic custom post type list table as the primary UI and gives popup management its own focused admin screen.

## Features

- Native Block Editor popup content editing.
- Custom post type powered popup storage with revisions and REST-visible meta.
- Modern admin table built with WordPress DataViews.
- DataForm-powered popup settings modal.
- Starter variation chooser after creating a popup.
- Popup types: Modal Popup, Slide-in Popup, Floating Bar, Fullscreen Popup, and Toast / Small Notification.
- Editor sidebar for layout, style, dimensions, border, color, and animation controls.
- Frontend rendering with WordPress Interactivity API.
- Elementor-inspired conditions, triggers, and advanced rules.
- Trash workflow with restore and permanent delete actions.

## Requirements

- WordPress 6.9+
- PHP 7.4+
- Node.js 20+ for development
- npm for dependency management

## Installation

### Manual

1. Download or clone this repository.
2. Place the plugin folder in `wp-content/plugins/blablablocks-popup`.
3. If installing from source, run `npm install` and `npm run build`.
4. Activate `BlaBlaBlocks Popup` from `Plugins` in the WordPress dashboard.

### Git

```bash
cd wp-content/plugins
git clone git@github.com:lubusIN/blablablocks-popup.git
cd blablablocks-popup
npm install
npm run build
```

## Usage

1. Go to `BlaBlaBlocks Popup` in the WordPress admin menu.
2. Click `Add Popup`.
3. Enter a popup title.
4. Choose a starter popup type in the editor.
5. Design the popup content with blocks.
6. Configure popup layout and styles from the popup editor sidebar.
7. Return to the popup admin page to configure settings, triggers, conditions, and rules.
8. Publish the popup when it is ready.

## Popup Management

The admin screen uses DataViews for searching, sorting, filtering, pagination, and actions.

Available row actions include:

- Edit
- Edit settings
- Duplicate
- Trash
- Restore
- Permanently delete

Trash is hidden from the default table view. Use the Status filter and select `Trash` to view trashed popups.

## Popup Settings

Popup behavior is stored as REST-exposed post meta under `_popup_block_settings`.

Settings are grouped by:

- Layout: width, height, position, overlay, close button, and animations.
- Style: colors, spacing, border, radius, and close button styling.
- Advanced: close behavior, scroll locking, multiple popup handling, and manual selectors.
- Conditions: entire site, front page, singular content, archives, and selected IDs.
- Triggers: page load, scroll, scroll-to-selector, click count, inactivity, and exit intent.
- Rules: page views, sessions, display limits, referrers, logged-in users, roles, and devices.

## Frontend Runtime

Published popups are filtered server-side by conditions before output. Frontend behavior is handled with the WordPress Interactivity API and evaluates triggers, display limits, browser state, close behavior, scroll locking, and manual open selectors.

Manual selector openings bypass automatic trigger and rule checks so links or buttons can intentionally open a popup.

## Development

### Install Dependencies

```bash
npm install
```

### Build Assets

```bash
npm run build
```

### Watch Assets

```bash
npm run start
```

## Project Structure

```text
assets/             Static images and variation previews
build/              Compiled plugin assets
includes/           PHP plugin classes
src/admin/          DataViews admin app
src/editor/         Block Editor sidebar and variation chooser
src/frontend/       Frontend runtime and Interactivity API module
src/shared/         Shared JavaScript utilities
```

## Release Checklist

Before publishing a release:

1. Run `npm install`.
2. Run `npm run build`.
3. Check PHP syntax for files in `includes/`.
4. Activate the plugin in a local WordPress install.
5. Create, edit, publish, trash, restore, and permanently delete a popup.
6. Test frontend triggers, conditions, and manual selectors.
7. Confirm `build/` assets are committed for installable ZIP usage.

## Meet Your Artisans

[LUBUS](https://lubus.in/?utm_source=github&utm_medium=open-source&utm_campaign=blablablocks-popup) is a web design agency based in Mumbai.

<a href="https://cal.com/lubus">
<img src="https://raw.githubusercontent.com/lubusIN/.github/refs/heads/main/profile/banner.png" />
</a>

## License

BlaBlaBlocks Popup is open-sourced software. See [LICENSE](LICENSE) for license details.
