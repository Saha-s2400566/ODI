import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { performDnsLookup } from '../services/diagnostics';
import { useSavedResults } from '../context/SavedResultsContext';

type Props = NativeStackScreenProps<any, 'DnsLookup'>;

const quickExamples = ['google.com', 'example.org', 'github.com'];

export default function DnsLookupScreen({ navigation }: Props) {
  const [hostname, setHostname] = useState('google.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { addResult } = useSavedResults();

  const handleLookup = async () => {
    const trimmed = hostname.trim();

    if (!trimmed) {
      setErrorMessage('Please enter a hostname before looking up DNS records.');
      setResult(null);
      return;
    }

    setErrorMessage('');
    setLoading(true);
    try {
      const lookupResult = await performDnsLookup(trimmed);
      setResult(lookupResult);
    } catch (error) {
      setResult({ error: 'Failed to perform DNS lookup. Please retry.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setErrorMessage('');
    handleLookup();
  };

  const handleSave = async () => {
    if (result && !result.error) {
      await addResult({
        type: 'dns',
        target: result.hostname,
        data: result,
      });
      setErrorMessage('DNS result saved successfully.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Hostname</Text>
        <TextInput
          value={hostname}
          onChangeText={setHostname}
          style={styles.input}
          placeholder="e.g. google.com or example.org"
          placeholderTextColor="#9ca3af"
          editable={!loading}
        />

        <View style={styles.chipRow}>
          {quickExamples.map((example) => (
            <TouchableOpacity
              key={example}
              style={styles.chip}
              onPress={() => setHostname(example)}
            >
              <Text style={styles.chipText}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {errorMessage ? <Text style={styles.inlineError}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLookup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="dns" size={20} color="#fff" />
              <Text style={styles.buttonText}>Lookup</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          {result.error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Lookup Failed</Text>
              <Text style={styles.errorText}>{result.error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.resultTitle}>DNS Result</Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Hostname</Text>
                <Text style={styles.resultValue}>{result.hostname}</Text>
              </View>

              {result.ipv4.length > 0 && (
                <View>
                  <Text style={styles.recordTitle}>IPv4 Addresses</Text>
                  {result.ipv4.map((ip: string, idx: number) => (
                    <View key={idx} style={styles.recordItem}>
                      <View style={styles.recordBadge}>
                        <Text style={styles.recordBadgeText}>A</Text>
                      </View>
                      <Text style={styles.recordValue}>{ip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {result.ipv6.length > 0 && (
                <View>
                  <Text style={styles.recordTitle}>IPv6 Addresses</Text>
                  {result.ipv6.map((ip: string, idx: number) => (
                    <View key={idx} style={styles.recordItem}>
                      <View style={styles.recordBadge}>
                        <Text style={styles.recordBadgeText}>AAAA</Text>
                      </View>
                      <Text style={styles.recordValue}>{ip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {result.ipv4.length === 0 && result.ipv6.length === 0 && (
                <Text style={styles.noResultsText}>No DNS records found</Text>
              )}

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <MaterialCommunityIcons name="content-save" size={18} color="#fff" />
                <Text style={styles.saveButtonText}>Save Result</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 8 },
  input: {
    backgroundColor: '#050f1b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#1e293b',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  inlineError: {
    color: '#fca5a5',
    fontSize: 12,
    marginBottom: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  resultCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  resultTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  resultLabel: { fontSize: 14, color: '#9ca3af' },
  resultValue: { fontSize: 14, fontWeight: '600', color: '#fff' },
  recordTitle: { fontSize: 14, fontWeight: '600', color: '#0ea5e9', marginTop: 12, marginBottom: 8 },
  recordItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  recordBadge: { backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  recordBadgeText: { fontSize: 11, fontWeight: '700', color: '#0ea5e9' },
  recordValue: { fontSize: 13, fontWeight: '500', color: '#dbeafe', flex: 1 },
  noResultsText: { color: '#9ca3af', fontStyle: 'italic', marginVertical: 16 },
  saveButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  errorCard: {
    backgroundColor: '#2a0d12',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7f1d1d',
    padding: 14,
  },
  errorTitle: { color: '#fca5a5', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  errorText: { color: '#fecaca', fontSize: 13, lineHeight: 20 },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  retryButtonText: { color: '#fff', fontWeight: '700' },
});
