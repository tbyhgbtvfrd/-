# VPNUL - Telegram Mini App

## Overview

VPNUL is a Telegram Mini App (TMA) built as a Single Page Application. It provides VPN-related services with a task/profile system, designed specifically to run within the Telegram platform. The application uses client-side routing to enable seamless navigation without page reloads.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **SPA Pattern**: Custom client-side router implementation (`spa.js`) using History API for URL management and Fetch API for dynamic content loading
- **Page Structure**: Multiple HTML pages (`index.html`, `talks/talks.html`, `profile/profile.html`) that share content dynamically via the SPA router
- **Content Caching**: Pages are preloaded and cached in memory for instant navigation
- **CSS Architecture**: Scoped CSS classes with hash suffixes (e.g., `_home_ltdi1_1`) suggesting a CSS modules or build-tool-generated approach

### Backend Architecture
- **Express.js Server**: Minimal Node.js server (`index.js`) serving static files on port 5000
- **Static File Serving**: Direct file serving from project root with specific `/media` directory handling
- **Cache Control**: Disabled caching headers (`no-cache, no-store, must-revalidate`) for development

### Telegram Integration
- **Telegram WebApp SDK**: Integrated via `telegram-web-app.js` for native Telegram features
- **Platform Features Used**:
  - Fullscreen mode (iOS/Android, version 8+)
  - Write access requests
  - Vertical swipes disabled
  - Theme variables from Telegram (dark theme with purple accents)

### Routing System
- **Routes**: 
  - `/` - Home page (VPN)
  - `/tasks` - Tasks page (loads from `/talks/talks.html`)
  - `/profile` - Profile page (loads from `/profile/profile.html`)
- **Navigation**: Bottom tab navigation with active state management
- **History Support**: Browser back/forward buttons work via popstate event handling

### UI/Styling
- **Typography**: SF Pro Display and SF Rounded custom fonts
- **Theme**: Dark mode with Telegram-provided CSS variables
- **Layout**: Mobile-first, max-width 500px, respecting Telegram safe areas

## External Dependencies

### NPM Packages
- **express** (^5.2.1): Web server framework for serving static files
- **@types/node** (^22.13.11): TypeScript definitions for Node.js

### External Services
- **Telegram WebApp SDK**: `https://telegram.org/js/telegram-web-app.js` - Required for Telegram Mini App functionality
- **vpnul.codes**: Production domain with DNS prefetch and preconnect configured

### Fonts
- SF Pro Display (multiple weights: 200-900, regular and italic)
- SF Rounded (Medium weight)