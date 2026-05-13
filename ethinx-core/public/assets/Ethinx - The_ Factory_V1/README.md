# PromptForge Income Builder

A production-ready Chrome extension and mobile app (Expo) designed to generate intelligent, context-aware prompts for income-producing digital assets.

## Core Features
- **Income-First Logic**: Automatically detects revenue intent and infuses prompts with monetization, scaling, and automation strategies.
- **Cross-Platform**: Chrome Extension (Manifest v3) and Mobile (React Native/Expo).
- **Offline-First**: Uses local logic for template matching and prompt assembly.
- **Passive Score**: Each template includes a "Passive Score" to help users prioritize low-maintenance revenue streams.

## Structure
- `/chrome-extension`: Source code for the Chrome browser extension.
- `/mobile-app`: Source code for the React Native/Expo mobile application.
- `/shared-logic`: Core engine shared between platforms.

## Setup Instructions

### Chrome Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right.
3. Click "Load unpacked" and select the `/chrome-extension` directory.
4. Click the extension icon to start generating prompts.

### Mobile App (Expo)
1. Ensure you have Node.js and the Expo CLI installed.
2. Navigate to `/mobile-app`.
3. Run `npm install`.
4. Run `npx expo start` to launch the development server.

## Test Cases
- **Case 1**: "fitness tracking app passive income" -> Should trigger the SaaS/App template with income enhancers.
- **Case 2**: "sellable Notion template" -> Should trigger the Digital Products template.
- **Case 3**: "automated affiliate site" -> Should trigger the Content System template with automation focus.
