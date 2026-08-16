import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { validateIPv4, cidrToMask, networkRangeFromCidr } from '../utils/ip';

export default function SubnetCalculatorScreen() {
  const [ip, setIp] = useState('192.168.1.10');
  const [cidr, setCidr] = useState('24');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!validateIPv4(ip)) {
      alert('Invalid IP address');
      return;
    }

    const cidrNum = parseInt(cidr);
    if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      alert('CIDR must be between 0 and 32');
      return;
    }

    const mask = cidrToMask(cidrNum);
    const range = networkRangeFromCidr(ip, cidrNum);

    setResult({
      ip,
      cidr: cidrNum,
      mask,
      network: range.network,
      broadcast: range.broadcast,
      usableHosts: range.usable,
      firstUsable: range.first,
      lastUsable: range.last,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>IP Address</Text>
        <TextInput
          value={ip}
          onChangeText={setIp}
          style={styles.input}
          placeholder="192.168.1.10"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>CIDR Prefix</Text>
        <TextInput
          value={cidr}
          onChangeText={setCidr}
          style={styles.input}
          placeholder="24"
          placeholderTextColor="#9ca3af"
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <MaterialCommunityIcons name="calculator" size={20} color="#fff" />
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Results</Text>

          <ResultRow label="Network Address" value={result.network} />
          <ResultRow label="Subnet Mask" value={result.mask} />
          <ResultRow label="Broadcast Address" value={result.broadcast} />
          <ResultRow label="First Usable" value={result.firstUsable} />
          <ResultRow label="Last Usable" value={result.lastUsable} />
          <ResultRow label="Usable Hosts" value={result.usableHosts.toString()} />
          <ResultRow label="CIDR Notation" value={`${result.ip}/${result.cidr}`} />
        </View>
      )}
    </ScrollView>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
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
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#06b6d4',
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
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  resultLabel: { fontSize: 14, color: '#9ca3af' },
  resultValue: { fontSize: 14, fontWeight: '600', color: '#dbeafe', textAlign: 'right', flex: 1 },
});
