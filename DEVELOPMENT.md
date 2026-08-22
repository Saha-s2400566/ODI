# ODI Development Guide

This guide explains ODI's architecture, key design patterns, directory structure, and instructions for extending the app.

## Project Overview

ODI is a **React Native + Expo** mobile application built with **TypeScript** and **Context API** for state management.

- **Core Purpose**: Three reliable network diagnostic tools + persistent storage + educational content + network utilities.
- **Key Principle**: Simplicity, responsiveness, and absolute technical honesty over simulated complexity.

---

## Directory Structure

```
ODI/
├── src/
│   ├── screens/                  # 11 active screen components
│   │   ├── HomeScreen.tsx        # Main screen with quick diagnostic tools
│   │   ├── ToolsIndexScreen.tsx   # Network tools list screen
│   │   ├── ReachabilityScreen.tsx # HTTP/HTTPS host reachability check
│   │   ├── DnsLookupScreen.tsx    # Domain DNS resolution tool
│   │   ├── PortCheckScreen.tsx    # Port accessibility testing tool
│   │   ├── SavedResultsScreen.tsx # Persisted diagnostic history screen
│   │   ├── SaveResultDetailScreen.tsx # Detail breakdown of a saved result
│   │   ├── SubnetCalculatorScreen.tsx # IPv4 Subnet calculator tool
│   │   ├── IpConverterScreen.tsx  # Format converter (hex, binary, int)
│   │   ├── LearningHubScreen.tsx  # Networking reference topics & lessons
│   │   ├── SettingsScreen.tsx     # Theme toggle & app settings
│   │   └── AboutScreen.tsx        # App & project info
│   │
│   ├── services/
│   │   └── diagnostics.ts        # Diagnostic tool logic
│   │       ├── checkReachability()
│   │       ├── performDnsLookup()
│   │       └── checkPort()
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx       # Dark/light mode theme provider + storage
│   │   └── SavedResultsContext.tsx# Diagnostic history provider + AsyncStorage
│   │
│   ├── navigation/
│   │   └── index.tsx              # Bottom tab & native stack navigators
│   │
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces & types
│   │
│   └── utils/
│       ├── converters.ts          # Hex, binary, & integer converters
│       ├── ip.ts                  # Subnet calculation & IP validation math
│       ├── network.ts             # CIDR network summary helpers
│       └── ports.ts               # Port reference definitions & HTTP status maps
│
├── scripts/
│   └── apply-patches.js           # Post-install script for node_modules patches
├── App.tsx                        # Root application entry with context providers
├── app.json                       # Expo configuration
├── package.json                   # Dependencies & npm scripts
├── tsconfig.json                  # TypeScript compiler configuration
├── USER_TESTING.md                # Task scenarios, observations & metrics
└── README.md                      # General overview & assessment summary
```

---

## Key Architectural Patterns

### 1. Context API for Global State

**ThemeContext** (Dark/Light mode management)
```typescript
const { isDark, toggleTheme } = useTheme();
```

**SavedResultsContext** (Diagnostic history persistence)
```typescript
const { results, addResult, removeResult, getResult } = useSavedResults();
```

Both providers wrap `MainNavigator` in `App.tsx`:
```typescript
<ThemeProvider>
  <SavedResultsProvider>
    <AppContent />
  </SavedResultsProvider>
</ThemeProvider>
```

### 2. AsyncStorage Persistence

Data is persisted locally on the device using key-value storage:
- `@odi_theme` → Theme preference (`dark` | `light`)
- `@odi_saved_results` → Diagnostic history items JSON array

**Pattern**:
```typescript
const STORAGE_KEY = '@odi_saved_results';

// Load on initial mount
useEffect(() => {
  AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
    if (stored) setResults(JSON.parse(stored));
  });
}, []);

// Save on state change
const updateResults = async (newData: SavedResult[]) => {
  setResults(newData);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
};
```

### 3. Navigation Hierarchy

- **RootStack** (Native Stack)
  - `Root` → `TabNavigator`
  - `SaveResultDetail` → Modal/Detail stack screen
- **TabNavigator** (Bottom Tabs: Home, Tools, Saved, More)
  - `Home` → `HomeScreen`
  - `Tools` → `ToolsNavigator` (`ToolsList`, `Reachability`, `DnsLookup`, `PortCheck`)
  - `Saved` → `SavedResultsScreen`
  - `More` → `MoreNavigator` (`MoreList`, `SubnetCalculator`, `IpConverter`, `LearningHub`, `Settings`, `About`)

### 4. Diagnostic Services (`src/services/diagnostics.ts`)

- **Reachability Check**:
  Sends fetch requests with configurable timeouts to measure HTTP/HTTPS host reachability and latency.
- **DNS Lookup**:
  Queries public DNS-over-HTTPS APIs to return A (IPv4) and AAAA (IPv6) records for hostnames.
- **Port Check**:
  Probes specific target ports and reports accessibility status (`OPEN` / `CLOSED`) and response time.

---

## Development Scripts

```bash
# Start standard Metro dev server
npm start

# Start dev server with tunnel mode (Ngrok tunnel for testing across external networks/mobile data)
npm run tunnel

# Run postinstall patches manually
npm run postinstall

# Validate TypeScript types without building
npx tsc --noEmit
```

---

## Styling & Design System

The application uses dynamic color palettes based on the active theme:

```typescript
const colors = isDark
  ? {
      background: '#0b1020',
      card: '#0f172a',
      border: '#1e293b',
      text: '#ffffff',
      secondary: '#9ca3af',
      muted: '#cbd5e1',
    }
  : {
      background: '#f8fafc',
      card: '#ffffff',
      border: '#dbeafe',
      text: '#0f172a',
      secondary: '#475569',
      muted: '#334155',
    };
```

All icons use **MaterialCommunityIcons** from `@expo/vector-icons`.

---

## Adding a New Tool or Screen

To add a new tool (e.g., "Ping Tool" or "MAC Address Finder"):

1. **Add logic to services**: Create helper functions in `src/services/diagnostics.ts` or `src/utils/`.
2. **Create Screen Component**: Add `src/screens/NewToolScreen.tsx` using `useTheme()` for styling and `useSavedResults()` if the tool output can be saved.
3. **Register in Navigator**: Add the route to `ToolsStackParamList` or `MoreStackParamList` in `src/navigation/index.tsx`.
4. **Update Tool Index**: Add the tool definition and icon to `ToolsIndexScreen.tsx` or `HomeScreen.tsx`.

---

## Verification & Testing

- **Type Check**: Run `npx tsc --noEmit` to ensure there are no compilation errors.
- **Testing Script**: Execute the user testing task scenarios documented in `USER_TESTING.md`.
- **Tunnel Mode**: Use `npm run tunnel` to test external network connectivity.

---

End of Development Guide