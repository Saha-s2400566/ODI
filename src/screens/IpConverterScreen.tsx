import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function IpConverterScreen() {
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
      }
    : {
        background: '#f8fafc',
        card: '#ffffff',
        border: '#dbeafe',
        input: '#f1f5f9',
        text: '#0f172a',
        secondary: '#475569',
        muted: '#334155',
      };

  const [decimal, setDecimal] = useState('192.168.1.10');
  const [result, setResult] = useState<any>(null);

  const handleConvert = () => {
    if (!decimal.trim()) {
      alert('Please enter an IP address');
      return;
    }

    const octets = decimal.split('.').map(Number);
    if (octets.length !== 4 || octets.some(isNaN)) {
      alert('Invalid IP address format');
      return;
    }

    const binary = octets.map((octet) => octet.toString(2).padStart(8, '0')).join('.');
    const hex = octets.map((octet) => octet.toString(16).padStart(2, '0').toUpperCase()).join('.');
    const integer = octets[0] * 16777216 + octets[1] * 65536 + octets[2] * 256 + octets[3];

    setResult({ decimal, binary, hex, integer });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.label, { color: colors.text }]}>Decimal IP</Text>
        <TextInput
          value={decimal}
          onChangeText={setDecimal}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          placeholder="192.168.1.10"
          placeholderTextColor={colors.secondary}
        />

        <TouchableOpacity style={styles.button} onPress={handleConvert}>
          <MaterialCommunityIcons name="swap-horizontal" size={20} color="#fff" />
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.resultTitle, { color: colors.text }]}>Conversions</Text>

          <View style={[styles.conversionBox, { backgroundColor: colors.input, borderColor: colors.border }]}> 
            <Text style={[styles.conversionLabel, { color: colors.secondary }]}>Decimal</Text>
            <Text style={[styles.conversionValue, { color: colors.muted }]}>{result.decimal}</Text>
          </View>

          <View style={[styles.conversionBox, { backgroundColor: colors.input, borderColor: colors.border }]}> 
            <Text style={[styles.conversionLabel, { color: colors.secondary }]}>Binary</Text>
            <Text style={[styles.conversionValue, { color: colors.muted }]}>{result.binary}</Text>
          </View>

          <View style={[styles.conversionBox, { backgroundColor: colors.input, borderColor: colors.border }]}> 
            <Text style={[styles.conversionLabel, { color: colors.secondary }]}>Hexadecimal</Text>
            <Text style={[styles.conversionValue, { color: colors.muted }]}>{result.hex}</Text>
          </View>

          <View style={[styles.conversionBox, { backgroundColor: colors.input, borderColor: colors.border }]}> 
            <Text style={[styles.conversionLabel, { color: colors.secondary }]}>Integer</Text>
            <Text style={[styles.conversionValue, { color: colors.muted }]}>{result.integer}</Text>
          </View>
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
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  resultTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  conversionBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  conversionLabel: { fontSize: 12, marginBottom: 6 },
  conversionValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});
