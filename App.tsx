import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { SavedResultsProvider } from './src/context/SavedResultsContext';
import MainNavigator from './src/navigation';

export default function App() {
  return (
    <ThemeProvider>
      <SavedResultsProvider>
        <MainNavigator />
        <StatusBar style="auto" />
      </SavedResultsProvider>
    </ThemeProvider>
  );
}
