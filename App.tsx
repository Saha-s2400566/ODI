import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SavedResultsProvider } from './src/context/SavedResultsContext';
import MainNavigator from './src/navigation';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <MainNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SavedResultsProvider>
        <AppContent />
      </SavedResultsProvider>
    </ThemeProvider>
  );
}
