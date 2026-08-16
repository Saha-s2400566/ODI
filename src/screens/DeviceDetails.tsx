import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DeviceDetails({ route }: any) {
  const { device } = route.params || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{device?.name || 'Device Details'}</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Overview</Text>
        <Text style={styles.row}>IP: {device?.ip || '—'}</Text>
        <Text style={styles.row}>Type: {device?.type || 'Unknown'}</Text>
        <Text style={styles.row}>Status: {device?.online ? 'Online' : 'Offline'}</Text>
        <Text style={styles.row}>Health: {device?.health || 'Unknown'}</Text>
        <Text style={styles.row}>Risk: {device?.risk || 'Unknown'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Connectivity</Text>
        <Text style={styles.row}>Latency: 8–24 ms</Text>
        <Text style={styles.row}>Signal: Stable</Text>
        <Text style={styles.row}>Last seen: {device?.lastSeen || '—'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Services</Text>
        <Text style={styles.row}>Open ports: {(device?.ports || []).join(', ') || 'None reported'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Notes</Text>
        <Text style={styles.row}>{device?.notes || 'No additional diagnostics recorded.'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  section: { backgroundColor: '#0f1724', padding: 12, borderRadius: 10, marginBottom: 12 },
  heading: { color: '#60a5fa', fontWeight: '700', marginBottom: 6 },
  row: { color: '#cbd5e1', marginBottom: 4 }
});
