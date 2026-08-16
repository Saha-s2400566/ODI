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
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<any, 'Reachability'>;

const quickExamples = ['google.com', '8.8.8.8', 'example.com'];

export default function ReachabilityScreen({ navigation }: Props) {
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

  const [target, setTarget] = useState('google.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { addResult } = useSavedResults();

  const handleCheck = async () => {
    const trimmed = target.trim();

    if (!trimmed) {
      setErrorMessage('Please enter a target hostname or IP to continue.');
      setResult(null);
      return;
    }

    setErrorMessage('');
    setLoading(true);
    try {
      const checkResult = await checkReachability(trimmed);
      setResult(checkResult);
    } catch (error) {
      setResult({ error: 'Unable to check reachability right now. Please retry.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setErrorMessage('');
    handleCheck();
  };

  const handleSave = async () => {
    if (result && !result.error) {
      await addResult({
        type: 'reachability',
        target: result.target,
        data: result,
      });
      setErrorMessage('Result saved successfully.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.label, { color: colors.text }]}>Target Host</Text>
        <TextInput
          value={target}
          onChangeText={setTarget}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. google.com or 8.8.8.8"
          placeholderTextColor={colors.secondary}
          editable={!loading}
        />

        <View style={styles.chipRow}>
          {quickExamples.map((example) => (
            <TouchableOpacity
              key={example}
              style={[styles.chip, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0', borderColor: colors.border }]}
              onPress={() => setTarget(example)}
            >
              <Text style={[styles.chipText, { color: colors.secondary }]}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {errorMessage ? <Text style={styles.inlineError}>{errorMessage}</Text> : null}

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
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          {result.error ? (
            <View style={[styles.errorCard, { backgroundColor: colors.errorBg, borderColor: '#7f1d1d' }]}> 
              <Text style={styles.errorTitle}>Check Failed</Text>
              <Text style={styles.errorText}>{result.error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.resultTitle, { color: colors.text }]}>Result</Text>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Target</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{result.target}</Text>
              </View>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: result.reachable ? '#10b98120' : '#ef444420' }]}>
                  <Text style={[styles.statusText, { color: result.reachable ? '#10b981' : '#ef4444' }]}>
                    {result.reachable ? 'Reachable' : 'Unreachable'}
                  </Text>
                </View>
              </View>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Response Time</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{result.responseTime} ms</Text>
              </View>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Status Code</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{result.status}</Text>
              </View>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Method</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{result.method}</Text>
              </View>

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
