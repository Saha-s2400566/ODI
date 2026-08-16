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

export default function DnsLookupScreen({ navigation }: Props) {
  const [hostname, setHostname] = useState('google.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { addResult } = useSavedResults();

  const handleLookup = async () => {
    if (!hostname.trim()) {
      alert('Please enter a hostname');
      return;
    }

    setLoading(true);
    try {
      const lookupResult = await performDnsLookup(hostname);
      setResult(lookupResult);
    } catch (error) {
      setResult({ error: 'Failed to perform DNS lookup' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (result && !result.error) {
      await addResult({
        type: 'dns',
        target: result.hostname,
        data: result,
      });
      alert('Result saved!');
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
          <Text style={styles.resultTitle}>DNS Result</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Hostname</Text>
            <Text style={styles.resultValue}>{result.hostname}</Text>
          </View>

          {result.error ? (
            <View style={[styles.resultRow, styles.errorRow]}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{result.error}</Text>
            </View>
          ) : (
            <>
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
    marginBottom: 14,
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
  errorRow: { backgroundColor: '#ef444420', borderRadius: 8, padding: 12, borderBottomWidth: 0, gap: 8 },
  resultLabel: { fontSize: 14, color: '#9ca3af' },
  resultValue: { fontSize: 14, fontWeight: '600', color: '#fff' },
  errorText: { color: '#ef4444', fontWeight: '600', flex: 1 },
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
});
