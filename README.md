# ODI — Navigate your network

ODI is a diagnostic-first mobile app for exploring local network health, device visibility, common service ports, and troubleshooting guidance.

## Features

- Device dashboard with search and device detail views
- Topology-style network map
- Tool shortcuts for connectivity and network health checks
- Safe local network summary using Expo network APIs
- Reference section for port mapping, HTTP status codes, and quick converters
- Learning quiz for subnetting and network fundamentals
- Theme persistence and settings panel

## Quick start

1. Install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Start Metro and scan the QR in Expo Go:

```bash
npm start
```

Or run in LAN mode:

```bash
npx expo start --clear --lan
```

3. Open the app in Expo Go on a mobile device connected to the same Wi‑Fi network.

## Important notes

- The project targets Expo SDK 54 and React Native 0.81.5.
- This app intentionally avoids invasive network probing. The discovery layer is safe and local-only by design.
- Android emulator support requires Android Studio and SDK installation; Expo Go is the recommended route for phone testing.

## Useful commands

```bash
npx tsc --noEmit
npx expo start --clear --lan
```
