# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Flutter mobile application (Newstream) for streaming audio content, with features including:
- Google Sign-In authentication
- Home feed displaying available audio stories
- Audio player with background playback support
- System audio integration with proper focus handling

## Development Commands

### Setup and Running

```
# Get dependencies
flutter pub get

# Run the app
flutter run
```

### Testing

```
# Generate mocks (required before running tests)
dart run build_runner build

# Run unit tests
flutter test

# Run integration tests
flutter test integration_test
```

## Architecture

The app uses GetX for state management, dependency injection, and routing.

### Key Components

1. **API Layer**
   - `NewstreamApi` handles communication with the backend
   - Models in the `api/newstream` directory define data structures

2. **Authentication**
   - Google Sign-In implementation in `auth/google_auth_service.dart`
   - Auth state managed by `auth_controller.dart`

3. **Home Feed**
   - Displays a scrollable list of available stories
   - Handles loading more stories when scrolling (pagination)
   - Shows currently playing status

4. **Player**
   - Uses `just_audio` and `just_audio_background` for audio playback
   - Supports background audio and system notifications
   - Handles audio focus and interruptions
   - UI components:
     - Mini player bar (`player_navbar.dart`) displays at bottom of screen
     - Full player page as a modal bottom sheet
     - Playback controls and timeline indicators

5. **Theme**
   - Dark theme with blurred gradient background
   - Custom text styles defined in `common/theme/text_styles.dart`

## Navigation Flow

1. App starts with splash screen
2. Routes to authentication if needed
3. Shows home feed with stories
4. Player controls appear when a story is playing

## Current Development

The current branch (`player-notification`) is adding audio player notification features, with recent commits:
- Added track time indicators
- UI improvements to player components
- Network configuration for device testing