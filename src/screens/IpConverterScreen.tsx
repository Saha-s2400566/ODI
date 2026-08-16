import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function IpConverterScreen() {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Decimal IP</Text>
        <TextInput
          value={decimal}
          onChangeText={setDecimal}
          style={styles.input}
          placeholder="192.168.1.10"
          placeholderTextColor="#9ca3af"
        />

        <TouchableOpacity style={styles.button} onPress={handleConvert}>
          <MaterialCommunityIcons name="swap-horizontal" size={20} color="#fff" />
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Conversions</Text>

          <View style={styles.conversionBox}>
            <Text style={styles.conversionLabel}>Decimal</Text>
            <Text style={styles.conversionValue}>{result.decimal}</Text>
          </View>

          <View style={styles.conversionBox}>
            <Text style={styles.conversionLabel}>Binary</Text>
            <Text style={styles.conversionValue}>{result.binary}</Text>
          </View>

          <View style={styles.conversionBox}>
            <Text style={styles.conversionLabel}>Hexadecimal</Text>
            <Text style={styles.conversionValue}>{result.hex}</Text>
          </View>

          <View style={styles.conversionBox}>
            <Text style={styles.conversionLabel}>Integer</Text>
            <Text style={styles.conversionValue}>{result.integer}</Text>
          </View>
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
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  resultTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
  conversionBox: {
    backgroundColor: '#050f1b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  conversionLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 6 },
  conversionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dbeafe',
    fontFamily: 'monospace',
  },
});
