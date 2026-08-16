import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { validateIPv4, cidrToMask, networkRangeFromCidr } from '../utils/ip';
import { useTheme } from '../context/ThemeContext';

export default function SubnetCalculatorScreen() {
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.label, { color: colors.text }]}>IP Address</Text>
        <TextInput
          value={ip}
          onChangeText={setIp}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          placeholder="192.168.1.10"
          placeholderTextColor={colors.secondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>CIDR Prefix</Text>
        <TextInput
          value={cidr}
          onChangeText={setCidr}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          placeholder="24"
          placeholderTextColor={colors.secondary}
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <MaterialCommunityIcons name="calculator" size={20} color="#fff" />
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.resultTitle, { color: colors.text }]}>Results</Text>

          <ResultRow label="Network Address" value={result.network} isDark={isDark} />
          <ResultRow label="Subnet Mask" value={result.mask} isDark={isDark} />
          <ResultRow label="Broadcast Address" value={result.broadcast} isDark={isDark} />
          <ResultRow label="First Usable" value={result.firstUsable} isDark={isDark} />
          <ResultRow label="Last Usable" value={result.lastUsable} isDark={isDark} />
          <ResultRow label="Usable Hosts" value={result.usableHosts.toString()} isDark={isDark} />
          <ResultRow label="CIDR Notation" value={`${result.ip}/${result.cidr}`} isDark={isDark} />
        </View>
      )}
    </ScrollView>
  );
}

function ResultRow({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <View style={[styles.resultRow, { borderBottomColor: isDark ? '#1e293b' : '#dbeafe' }]}> 
      <Text style={[styles.resultLabel, { color: isDark ? '#9ca3af' : '#475569' }]}>{label}</Text>
      <Text style={[styles.resultValue, { color: isDark ? '#dbeafe' : '#334155' }]}>{value}</Text>
    </View>
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
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  resultTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  resultLabel: { fontSize: 14 },
  resultValue: { fontSize: 14, fontWeight: '600', textAlign: 'right', flex: 1 },
});
