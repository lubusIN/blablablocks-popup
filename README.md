<!-- @format -->

<p align="center"><img width="160" src=".github/logo.svg"></p>

![BlaBlaBlocks Popup](.github/banner-image.png)

## Overview

BlaBlaBlocks Popup is a WordPress plugin for creating and managing popups with the native Block Editor.

## Features

- Design popup content with the native WordPress Block Editor.
- Manage popups from a dedicated admin screen.
- Start quickly with popup variations: Modal Popup, Slide-in Popup, Floating Bar, Fullscreen Popup, and Toast / Small Notification.
- Configure layout, position, size, spacing, colors, borders, radius, and animations.
- Control when popups appear with triggers such as page load, scroll, inactivity, click count, and exit intent.
- Choose where popups appear with site, front page, singular content, archive, and selected ID conditions.
- Add display rules for page views, sessions, max displays, referrers, logged-in users, roles, and devices.
- Duplicate, trash, restore, and permanently delete popups.

## Requirements

- WordPress 6.9+
- PHP 7.4+
- Node.js 20+ for development
- npm for dependency management

## Installation

### From GitHub

Clone the repository into your WordPress plugins directory:

```bash
cd wp-content/plugins
git clone git@github.com:lubusIN/blablablocks-popup.git
cd blablablocks-popup
npm install
npm run build
```

Then activate `BlaBlaBlocks Popup` from the WordPress plugins screen.

### Manual

1. Download the plugin source.
2. Place the plugin folder in `wp-content/plugins/blablablocks-popup`.
3. Run `npm install` and `npm run build` if the build files are not already included.
4. Activate `BlaBlaBlocks Popup` from the WordPress plugins screen.

## Usage

1. Go to `BlaBlaBlocks Popup` in the WordPress admin menu.
2. Click `Add Popup`.
3. Enter a popup title.
4. Choose a starter popup type in the editor.
5. Design the popup content with blocks.
6. Configure popup layout and styles from the popup editor sidebar.
7. Return to the popup admin page to configure settings, triggers, conditions, and rules.
8. Publish the popup when it is ready.

## Development

Install dependencies:

```bash
npm install
```

Build the plugin assets:

```bash
npm run build
```

Watch files during development:

```bash
npm run start
```
Start WordPress playground:

```bash
npm run playground
```

## Meet Your Artisans

[LUBUS](https://lubus.in/?utm_source=github&utm_medium=open-source&utm_campaign=blablablocks-popup) is a web design agency based in Mumbai.

<a href="https://cal.com/lubus">
<img src="https://raw.githubusercontent.com/lubusIN/.github/refs/heads/main/profile/banner.png" />
</a>

## License

BlaBlaBlocks Popup is open-sourced software. See [LICENSE](LICENSE) for license details.
