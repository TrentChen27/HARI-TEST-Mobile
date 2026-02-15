# Exercise Daily

A cross-platform mobile application for tracking and managing daily exercises, built with Ionic Framework and Angular.

## Overview

Exercise Daily is a mobile app that helps users log, track, and analyze their daily exercise routines. The app provides an intuitive interface for recording workout sessions, viewing exercise history, and monitoring fitness progress over time.

## Key Features

- **User Authentication**: Secure login system to protect user data
- **Exercise Tracking**: Log exercises with duration and details
- **Exercise History**: View past workouts with sorting and pagination
- **Statistics Dashboard**: Analyze workout trends and progress
- **Dark/Light Theme**: Toggle between dark and light modes for comfortable viewing
- **Responsive Design**: Optimized for both iOS and Android devices
- **Pull-to-Refresh**: Easily refresh data with intuitive gestures
- **Persistent Storage**: Local data storage using Ionic Storage

## Tech Stack

- **Framework**: [Ionic](https://ionicframework.com/) v8.0.0
- **Frontend**: [Angular](https://angular.io/) v20.0.0
- **Mobile Runtime**: [Capacitor](https://capacitorjs.com/) v7.4.4
- **Language**: TypeScript v5.8.0
- **UI Components**: Ionic Components & Ionicons
- **State Management**: RxJS v7.8.0
- **Testing**: Jasmine & Karma

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`

For mobile development:
- **Android**: [Android Studio](https://developer.android.com/studio) with Android SDK
- **iOS**: [Xcode](https://developer.apple.com/xcode/) (macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/TrentChen27/HARI-TEST-Mobile.git
cd HARI-TEST-Mobile
```

2. Install dependencies:
```bash
npm install
```

## Development

### Running in Browser

Start the development server:
```bash
npm start
# or
ionic serve
```

The app will open in your browser at `http://localhost:8100`

### Running on Mobile Devices

#### Android

1. Add Android platform:
```bash
ionic capacitor add android
```

2. Build the app:
```bash
npm run build
```

3. Sync with Capacitor:
```bash
ionic capacitor sync android
```

4. Open in Android Studio:
```bash
ionic capacitor open android
```

5. Run the app from Android Studio or use:
```bash
ionic capacitor run android
```

#### iOS (macOS only)

1. Add iOS platform:
```bash
ionic capacitor add ios
```

2. Build the app:
```bash
npm run build
```

3. Sync with Capacitor:
```bash
ionic capacitor sync ios
```

4. Open in Xcode:
```bash
ionic capacitor open ios
```

5. Run the app from Xcode

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build the application for production
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint to check code quality
- `npm run watch` - Build in watch mode for development

## Project Structure

```
HARI-TEST-Mobile/
├── src/
│   ├── app/
│   │   ├── guards/          # Route guards (authentication)
│   │   ├── history/         # Exercise history page
│   │   ├── home/            # Home/main page
│   │   ├── modals/          # Modal components (stats, etc.)
│   │   ├── models/          # Data models (User, Exercise)
│   │   ├── pages/           # Additional pages (login)
│   │   ├── services/        # Core services (auth, exercise, theme)
│   │   ├── tabs/            # Tab navigation
│   │   └── utils/           # Utility functions
│   ├── assets/              # Static assets (images, icons)
│   ├── theme/               # Global styles and theming
│   └── environments/        # Environment configurations
├── resources/               # App icons and splash screens
├── capacitor.config.ts      # Capacitor configuration
├── ionic.config.json        # Ionic configuration
├── angular.json             # Angular configuration
└── package.json             # Project dependencies and scripts
```

## Testing

Run the test suite:
```bash
npm test
```

This will execute unit tests using Karma test runner with Jasmine framework.

## Code Quality

Lint your code:
```bash
npm run lint
```

The project uses ESLint with Angular and TypeScript plugins for maintaining code quality.

## Building for Production

Build the optimized production bundle:
```bash
npm run build
```

The build artifacts will be stored in the `www/` directory.

## Configuration

- **App Name**: Exercise Daily
- **App ID**: io.ionic.starter _(Note: Should be customized for production)_
- **Web Directory**: www/
- **Android Scheme**: http

Configuration files:
- `capacitor.config.ts` - Capacitor settings
- `ionic.config.json` - Ionic settings
- `angular.json` - Angular build configuration

## Acknowledgments

Built with the [Ionic Framework](https://ionicframework.com/)
