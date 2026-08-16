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
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<any, 'DnsLookup'>;

const quickExamples = ['google.com', 'example.org', 'github.com'];

export default function DnsLookupScreen({ navigation }: Props) {
  const { isDark } = useTheme();
  const colors = isDark
    ? {
        background: '#0b1020',
        card: '#0f172a',
        border: '#1e293b',
        input: '#050f1b',
        text: '#fff',
        secondary: '#9ca3af',
        muted: '#dbeafe',
        errorBg: '#2a0d12',
      }
    : {
        background: '#f8fafc',
        card: '#ffffff',
        border: '#dbeafe',
        input: '#f1f5f9',
        text: '#0f172a',
        secondary: '#475569',
        muted: '#334155',
        errorBg: '#fff1f2',
      };

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.label, { color: colors.text }]}>Hostname</Text>
        <TextInput
          value={hostname}
          onChangeText={setHostname}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. google.com or example.org"
          placeholderTextColor={colors.secondary}
          editable={!loading}
        />

        <View style={styles.chipRow}>
          {quickExamples.map((example) => (
            <TouchableOpacity
              key={example}
              style={[styles.chip, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0', borderColor: colors.border }]}
              onPress={() => setHostname(example)}
            >
              <Text style={[styles.chipText, { color: colors.secondary }]}>{example}</Text>
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
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          {result.error ? (
            <View style={[styles.errorCard, { backgroundColor: colors.errorBg, borderColor: '#7f1d1d' }]}> 
              <Text style={styles.errorTitle}>Lookup Failed</Text>
              <Text style={styles.errorText}>{result.error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.resultTitle, { color: colors.text }]}>DNS Result</Text>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Hostname</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{result.hostname}</Text>
              </View>

              {result.ipv4.length > 0 && (
                <View>
                  <Text style={[styles.recordTitle, { color: '#0ea5e9' }]}>IPv4 Addresses</Text>
                  {result.ipv4.map((ip: string, idx: number) => (
                    <View key={idx} style={styles.recordItem}>
                      <View style={[styles.recordBadge, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                        <Text style={[styles.recordBadgeText, { color: '#0ea5e9' }]}>A</Text>
                      </View>
                      <Text style={[styles.recordValue, { color: colors.muted }]}>{ip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {result.ipv6.length > 0 && (
                <View>
                  <Text style={[styles.recordTitle, { color: '#0ea5e9' }]}>IPv6 Addresses</Text>
                  {result.ipv6.map((ip: string, idx: number) => (
                    <View key={idx} style={styles.recordItem}>
                      <View style={[styles.recordBadge, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                        <Text style={[styles.recordBadgeText, { color: '#0ea5e9' }]}>AAAA</Text>
                      </View>
                      <Text style={[styles.recordValue, { color: colors.muted }]}>{ip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {result.ipv4.length === 0 && result.ipv6.length === 0 && (
                <Text style={[styles.noResultsText, { color: colors.secondary }]}>No DNS records found</Text>
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
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
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
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  resultTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  resultLabel: { fontSize: 14 },
  resultValue: { fontSize: 14, fontWeight: '600' },
  recordTitle: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  recordItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  recordBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  recordBadgeText: { fontSize: 11, fontWeight: '700' },
  recordValue: { fontSize: 13, fontWeight: '500', flex: 1 },
  noResultsText: { fontStyle: 'italic', marginVertical: 16 },
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
    borderRadius: 10,
    borderWidth: 1,
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
