import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { commonPorts, httpStatusCodes } from '../utils/ports';
import { decimalToBinary, decimalToHex, hexToDecimal, portRangeSummary } from '../utils/converters';

export default function ReferenceScreen() {
  const [query, setQuery] = useState('');
  const [numericValue, setNumericValue] = useState('443');

  const filteredPorts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commonPorts;
    return commonPorts.filter(
      (entry) =>
        String(entry.port).includes(q) ||
        entry.name.toLowerCase().includes(q) ||
        entry.protocol.toLowerCase().includes(q)
    );
  }, [query]);

  const statusCodes = Object.entries(httpStatusCodes)
    .slice(0, 12)
    .map(([code, label]) => ({ code: Number(code), label }));

  const numeric = Number(numericValue) || 0;

  const troubleshooting = [
    'Check whether the device is on the same subnet before assuming it is offline.',
    'Confirm the default gateway and subnet mask are consistent across the LAN.',
    'Review service exposures and open ports before opening management interfaces to external networks.',
    'Use a clean baseline: check Wi‑Fi signal, DHCP lease state, and device reachability first.'
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Network Reference</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search port or service"
        placeholderTextColor="#718096"
        style={styles.search}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common ports</Text>
        {filteredPorts.map((entry) => (
          <View key={entry.port} style={styles.row}>
            <Text style={styles.port}>{entry.port}</Text>
            <Text style={styles.name}>{entry.name}</Text>
            <Text style={styles.protocol}>{entry.protocol}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HTTP status codes</Text>
        {statusCodes.map((entry) => (
          <View key={entry.code} style={styles.row}>
            <Text style={styles.port}>{entry.code}</Text>
            <Text style={styles.name}>{entry.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Number converter</Text>
        <TextInput
          value={numericValue}
          onChangeText={setNumericValue}
          placeholder="Enter decimal"
          placeholderTextColor="#718096"
          keyboardType="numeric"
          style={styles.search}
        />
        <View style={styles.row}>
          <Text style={styles.port}>HEX</Text>
          <Text style={styles.name}>{decimalToHex(numeric)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.port}>BIN</Text>
          <Text style={styles.name}>{decimalToBinary(numeric)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.port}>Type</Text>
          <Text style={styles.name}>{portRangeSummary(numeric)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.port}>0x1F</Text>
          <Text style={styles.name}>{hexToDecimal('1F')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Troubleshooting checklist</Text>
        {troubleshooting.map((item, index) => (
          <View key={item} style={styles.tipRow}>
            <Text style={styles.tipNumber}>{index + 1}.</Text>
            <Text style={styles.name}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingTop: 24 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 18 },
  search: {
    backgroundColor: '#0f1724',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  section: {
    backgroundColor: '#0f1724',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#1f2937' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#1f2937' },
  port: { color: '#60a5fa', fontWeight: '700', width: 54 },
  name: { color: '#e2e8f0', flex: 1 },
  protocol: { color: '#9aa3c7' },
  tipNumber: { color: '#fbbf24', fontWeight: '700', width: 24 }
});
