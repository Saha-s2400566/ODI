import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const tools = [
  { id: 'ping', title: 'Ping gateway', detail: 'Check reachability in 1 click', accent: '#34d399' },
  { id: 'ports', title: 'Port scan', detail: 'Review common services and exposure', accent: '#60a5fa' },
  { id: 'traceroute', title: 'Traceroute', detail: 'Map the route to a destination', accent: '#a78bfa' },
  { id: 'wifi', title: 'Wi‑Fi check', detail: 'Inspect current network context', accent: '#fbbf24' },
];

export default function ToolsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Network Tools</Text>
      <Text style={styles.subtitle}>Safe diagnostic actions for local network review.</Text>

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
