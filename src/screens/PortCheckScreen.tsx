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
import { checkPort, getCommonPorts } from '../services/diagnostics';
import { useSavedResults } from '../context/SavedResultsContext';

type Props = NativeStackScreenProps<any, 'PortCheck'>;

const quickExamples = ['192.168.1.1', '8.8.8.8', 'example.com'];

export default function PortCheckScreen({ navigation }: Props) {
  const [host, setHost] = useState('192.168.1.1');
  const [port, setPort] = useState('80');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { addResult } = useSavedResults();
  const commonPorts = getCommonPorts();

  const handleCheck = async () => {
    const trimmedHost = host.trim();
    const trimmedPort = port.trim();

    if (!trimmedHost || !trimmedPort) {
      setErrorMessage('Please enter both a host and a port value.');
      setResult(null);
      return;
    }

    const portNum = parseInt(trimmedPort, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      setErrorMessage('Port must be between 1 and 65535.');
      setResult(null);
      return;
    }

    setErrorMessage('');
    setLoading(true);
    try {
      const checkResult = await checkPort(trimmedHost, portNum);
      setResult(checkResult);
      setShowPresets(false);
    } catch (error) {
      setResult({ error: 'Failed to check port. Please retry.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setErrorMessage('');
    handleCheck();
  };

  const handlePresetSelect = (selectedPort: number) => {
    setPort(selectedPort.toString());
  };

  const handleSave = async () => {
    if (result && !result.error) {
      await addResult({
        type: 'port',
        target: `${result.host}:${result.port}`,
        data: result,
      });
      setErrorMessage('Port result saved successfully.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Host</Text>
        <TextInput
          value={host}
          onChangeText={setHost}
          style={styles.input}
          placeholder="e.g. 192.168.1.1 or example.com"
          placeholderTextColor="#9ca3af"
          editable={!loading}
        />

        <View style={styles.chipRow}>
          {quickExamples.map((example) => (
            <TouchableOpacity
              key={example}
              style={styles.chip}
              onPress={() => setHost(example)}
            >
              <Text style={styles.chipText}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Port</Text>
        <View style={styles.portInputRow}>
          <TextInput
            value={port}
            onChangeText={setPort}
            style={[styles.input, styles.portInput]}
            placeholder="80"
            placeholderTextColor="#9ca3af"
            editable={!loading}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.presetsButton}
            onPress={() => setShowPresets(!showPresets)}
          >
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {errorMessage ? <Text style={styles.inlineError}>{errorMessage}</Text> : null}

        {showPresets && (
          <View style={styles.presetsContainer}>
            <Text style={styles.presetsTitle}>Common Ports</Text>
            {commonPorts.map((item) => (
              <TouchableOpacity
                key={item.port}
                style={styles.presetItem}
                onPress={() => handlePresetSelect(item.port)}
              >
                <View style={styles.presetContent}>
                  <Text style={styles.presetPort}>{item.port}</Text>
                  <Text style={styles.presetService}>{item.service}</Text>
                </View>
                {port === item.port.toString() && (
                  <MaterialCommunityIcons name="check" size={20} color="#0ea5e9" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCheck}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="lan" size={20} color="#fff" />
              <Text style={styles.buttonText}>Check Port</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          {result.error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Check Failed</Text>
              <Text style={styles.errorText}>{result.error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.resultTitle}>Result</Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Host:Port</Text>
                <Text style={styles.resultValue}>
                  {result.host}:{result.port}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: result.open ? '#10b98120' : '#ef444420' }]}>
                  <Text style={[styles.statusText, { color: result.open ? '#10b981' : '#ef4444' }]}>
                    {result.open ? 'OPEN' : 'CLOSED'}
                  </Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Service</Text>
                <Text style={styles.resultValue}>{result.service || 'Unknown'}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Response Time</Text>
                <Text style={styles.resultValue}>{result.responseTime} ms</Text>
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
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 8, marginTop: 12 },
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
  portInputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  portInput: { flex: 1, marginBottom: 0 },
  presetsButton: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  presetsContainer: {
    backgroundColor: '#050f1b',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  presetsTitle: { fontSize: 12, fontWeight: '600', color: '#9ca3af', padding: 10, paddingBottom: 6 },
  presetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  presetContent: { flex: 1 },
  presetPort: { fontSize: 14, fontWeight: '600', color: '#fff' },
  presetService: { fontSize: 12, color: '#9ca3af' },
  button: {
    backgroundColor: '#ec4899',
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
