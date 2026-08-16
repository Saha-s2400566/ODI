import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DiagnosticResult {
  id: string;
  type: 'reachability' | 'dns' | 'port';
  target: string;
  timestamp: number;
  data: Record<string, any>;
}

interface SavedResultsContextType {
  results: DiagnosticResult[];
  addResult: (result: Omit<DiagnosticResult, 'id' | 'timestamp'>) => Promise<void>;
  removeResult: (id: string) => Promise<void>;
  getResult: (id: string) => DiagnosticResult | undefined;
}

const SavedResultsContext = createContext<SavedResultsContextType | undefined>(undefined);

const STORAGE_KEY = '@odi_saved_results';

export function SavedResultsProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setResults(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load saved results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addResult = async (result: Omit<DiagnosticResult, 'id' | 'timestamp'>) => {
    const newResult: DiagnosticResult = {
      ...result,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const updated = [newResult, ...results];
    setResults(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save result:', error);
    }
  };

  const removeResult = async (id: string) => {
    const updated = results.filter((r) => r.id !== id);
    setResults(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove result:', error);
    }
  };

  const getResult = (id: string) => results.find((r) => r.id === id);

  return (
    <SavedResultsContext.Provider value={{ results, addResult, removeResult, getResult }}>
      {children}
    </SavedResultsContext.Provider>
  );
}

export function useSavedResults() {
  const context = useContext(SavedResultsContext);
  if (!context) {
    throw new Error('useSavedResults must be used within SavedResultsProvider');
  }
  return context;
}
