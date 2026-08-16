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
import { checkReachability } from '../services/diagnostics';
import { useSavedResults } from '../context/SavedResultsContext';

type Props = NativeStackScreenProps<any, 'Reachability'>;

export default function ReachabilityScreen({ navigation }: Props) {
  const [target, setTarget] = useState('google.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { addResult } = useSavedResults();

  const handleCheck = async () => {
    if (!target.trim()) {
      alert('Please enter a target hostname or IP');
      return;
    }

    setLoading(true);
    try {
      const checkResult = await checkReachability(target);
      setResult(checkResult);
    } catch (error) {
      setResult({ error: 'Failed to check reachability' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (result) {
      await addResult({
        type: 'reachability',
        target: result.target,
        data: result,
      });
      alert('Result saved!');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Target Host</Text>
        <TextInput
          value={target}
          onChangeText={setTarget}
          style={styles.input}
          placeholder="e.g. google.com or 8.8.8.8"
          placeholderTextColor="#9ca3af"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCheck}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="wifi-check" size={20} color="#fff" />
              <Text style={styles.buttonText}>Check Reachability</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Result</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Target</Text>
            <Text style={styles.resultValue}>{result.target}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: result.reachable ? '#10b98120' : '#ef444420' }]}>
              <Text style={[styles.statusText, { color: result.reachable ? '#10b981' : '#ef4444' }]}>
                {result.reachable ? 'Reachable' : 'Unreachable'}
              </Text>
            </View>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Response Time</Text>
            <Text style={styles.resultValue}>{result.responseTime} ms</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Status Code</Text>
            <Text style={styles.resultValue}>{result.status}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Method</Text>
            <Text style={styles.resultValue}>{result.method}</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <MaterialCommunityIcons name="content-save" size={18} color="#fff" />
            <Text style={styles.saveButtonText}>Save Result</Text>
          </TouchableOpacity>
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
    backgroundColor: '#0ea5e9',
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
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontWeight: '600', fontSize: 12 },
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
