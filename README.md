<!-- @format -->

<p align="center">
  <img width="160" src=".github/logo.svg" alt="BlaBlaBlocks Logo">
</p>

![BlaBlaBlocks Popup](.github/banner-image.png)

## Overview

**BlaBlaBlocks Popup** is a powerful yet lightweight WordPress plugin that empowers you to create and manage dynamic popups seamlessly using the native Block Editor (Gutenberg). No third-party page builders needed!

## Features

- **Block Editor Integration**: Design your popup content entirely within the native WordPress Block Editor.
- **Dedicated Management**: Easily manage all your popups from a clean, dedicated admin screen.
- **Starter Templates**: Jumpstart your design with pre-built variations: 
  - Modal Popup
  - Slide-in Popup
  - Floating Bar
  - Fullscreen Popup
  - Toast / Small Notification
- **Extensive Styling**: Fine-tune layout, position, size, spacing, colors, borders, border radius, and entrance/exit animations.
- **Smart Triggers**: Control exactly *when* popups appear (e.g., page load, scroll depth, inactivity, click count, exit intent).
- **Targeted Display Conditions**: Control *where* popups appear (e.g., entire site, front page, specific posts/pages, archives).
- **Advanced Rules**: Add conditional logic based on page views, sessions, max displays, referrers, login status, user roles, and device types.
- **Popup Lifecycle**: Duplicate, trash, restore, and permanently delete popups with ease.

## Requirements

### Minimum Requirements
- **WordPress**: 6.9 or higher
- **PHP**: 7.4 or higher

### For Development
- **Node.js**: 20.x or higher
- **npm**: for dependency management

## Installation

### Via GitHub (Development / Bleeding Edge)

Clone the repository directly into your WordPress plugins directory:

```bash
cd wp-content/plugins
git clone git@github.com:lubusIN/blablablocks-popup.git
cd blablablocks-popup
npm install
npm run build
```

Then, activate **BlaBlaBlocks Popup** from your WordPress plugins screen.

### Manual Installation

1. Download the latest release or plugin source.
2. Extract and place the plugin folder inside `wp-content/plugins/blablablocks-popup`.
3. If build files are not included, run `npm install` and `npm run build`.
4. Activate **BlaBlaBlocks Popup** from your WordPress plugins screen.

## Usage Guide

1. Navigate to **BlaBlaBlocks Popup** in the WordPress admin sidebar.
2. Click **Add Popup** to create a new one.
3. Enter a descriptive title for your popup.
4. Choose a **starter popup type** to get a base layout.
5. Design the content using your favorite blocks.
6. Use the popup editor sidebar to configure layout, styles, and behavior.
7. Return to the popup admin page to fine-tune settings, triggers, conditions, and display rules.
8. **Publish** the popup when you're ready for it to go live!

## Development

We welcome contributions! Here are the commands you'll need to get started:

Install dependencies:
```bash
npm install
```

Build the plugin assets for production:
```bash
npm run build
```

Watch files and re-compile during development:
```bash
npm run start
```

Start a local WordPress playground environment:
```bash
npm run playground
```

## Meet Your Artisans

[LUBUS](https://lubus.in/?utm_source=github&utm_medium=open-source&utm_campaign=blablablocks-popup) is a web design agency based in Mumbai.

<a href="https://cal.com/lubus">
  <img src="https://raw.githubusercontent.com/lubusIN/.github/refs/heads/main/profile/banner.png" alt="Book a call with LUBUS" />
</a>

## License

BlaBlaBlocks Popup is open-source software licensed under the terms in the [LICENSE](LICENSE) file.
