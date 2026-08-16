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
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<any, 'PortCheck'>;

const quickExamples = ['192.168.1.1', '8.8.8.8', 'example.com'];

export default function PortCheckScreen({ navigation }: Props) {
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.label, { color: colors.text }]}>Host</Text>
        <TextInput
          value={host}
          onChangeText={setHost}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. 192.168.1.1 or example.com"
          placeholderTextColor={colors.secondary}
          editable={!loading}
        />

        <View style={styles.chipRow}>
          {quickExamples.map((example) => (
            <TouchableOpacity
              key={example}
              style={[styles.chip, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0', borderColor: colors.border }]}
              onPress={() => setHost(example)}
            >
              <Text style={[styles.chipText, { color: colors.secondary }]}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Port</Text>
        <View style={styles.portInputRow}>
          <TextInput
            value={port}
            onChangeText={setPort}
            style={[styles.input, styles.portInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
            placeholder="80"
            placeholderTextColor={colors.secondary}
            editable={!loading}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={[styles.presetsButton, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0', borderColor: colors.border }]}
            onPress={() => setShowPresets(!showPresets)}
          >
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {errorMessage ? <Text style={styles.inlineError}>{errorMessage}</Text> : null}

        {showPresets && (
          <View style={[styles.presetsContainer, { backgroundColor: colors.input, borderColor: colors.border }]}> 
            <Text style={[styles.presetsTitle, { color: colors.secondary }]}>Common Ports</Text>
            {commonPorts.map((item) => (
              <TouchableOpacity
                key={item.port}
                style={[styles.presetItem, { borderTopColor: colors.border }]}
                onPress={() => handlePresetSelect(item.port)}
              >
                <View style={styles.presetContent}>
                  <Text style={[styles.presetPort, { color: colors.text }]}>{item.port}</Text>
                  <Text style={[styles.presetService, { color: colors.secondary }]}>{item.service}</Text>
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
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Host:Port</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{result.host}:{result.port}</Text>
              </View>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: result.open ? '#10b98120' : '#ef444420' }]}>
                  <Text style={[styles.statusText, { color: result.open ? '#10b981' : '#ef4444' }]}>
                    {result.open ? 'OPEN' : 'CLOSED'}
                  </Text>
                </View>
              </View>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Service</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{result.service || 'Unknown'}</Text>
              </View>

              <View style={[styles.resultRow, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.resultLabel, { color: colors.secondary }]}>Response Time</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{result.responseTime} ms</Text>
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
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    marginBottom: 14,
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
  portInputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  portInput: { flex: 1, marginBottom: 0 },
  presetsButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  presetsContainer: {
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  presetsTitle: { fontSize: 12, fontWeight: '600', padding: 10, paddingBottom: 6 },
  presetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  presetContent: { flex: 1 },
  presetPort: { fontSize: 14, fontWeight: '600' },
  presetService: { fontSize: 12 },
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
