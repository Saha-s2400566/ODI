import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getLocalNetworkInfo } from '../services/scanner';

const tools = [
  { id: 'ping', title: 'Ping gateway', detail: 'Check reachability in 1 click', accent: '#34d399' },
  { id: 'ports', title: 'Port scan', detail: 'Review common services and exposure', accent: '#60a5fa' },
  { id: 'traceroute', title: 'Traceroute', detail: 'Map the route to a destination', accent: '#a78bfa' },
  { id: 'wifi', title: 'Wi‑Fi check', detail: 'Inspect current network context', accent: '#fbbf24' },
];

export default function ToolsScreen() {
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  useEffect(() => {
    getLocalNetworkInfo().then((info) => setNetworkInfo(info));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Network Tools</Text>
      <Text style={styles.subtitle}>Safe diagnostic actions for local network review.</Text>

      {networkInfo ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Current network</Text>
          <Text style={styles.summaryValue}>{networkInfo.ip}</Text>
          <Text style={styles.summaryMeta}>Gateway: {networkInfo.gateway} • Mask: {networkInfo.mask}</Text>
        </View>
      ) : null}

      {tools.map((tool) => (
        <TouchableOpacity key={tool.id} activeOpacity={0.8} style={styles.card}>
          <View style={[styles.badge, { backgroundColor: tool.accent }]} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{tool.title}</Text>
            <Text style={styles.cardDetail}>{tool.detail}</Text>
          </View>
          <Text style={styles.run}>Run</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingTop: 24 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#9aa3c7', marginBottom: 20 },
  summaryCard: {
    backgroundColor: '#101827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  summaryLabel: { color: '#9aa3c7', fontSize: 12 },
  summaryValue: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 4 },
  summaryMeta: { color: '#cbd5e1', marginTop: 4 },
  card: {
    backgroundColor: '#0f1724',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  badge: { width: 12, height: 12, borderRadius: 999, marginRight: 12 },
  cardText: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cardDetail: { color: '#9aa3c7', fontSize: 12, marginTop: 4 },
  run: { color: '#5eead4', fontWeight: '700' }
});
