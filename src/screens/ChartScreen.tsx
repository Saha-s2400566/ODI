import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const nodes = [
  { id: 'router', label: 'Router', top: 28, left: 42 },
  { id: 'switch', label: 'Switch', top: 36, left: 58 },
  { id: 'pc1', label: 'PC 01', top: 60, left: 18 },
  { id: 'pc2', label: 'PC 02', top: 66, left: 68 },
  { id: 'printer', label: 'Printer', top: 84, left: 45 },
];

export default function ChartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Topology</Text>
      <View style={styles.map}>
        <View style={[styles.line, { top: '38%', left: '42%', width: '24%', transform: [{ rotate: '-22deg' }] }]} />
        <View style={[styles.line, { top: '38%', left: '42%', width: '24%', transform: [{ rotate: '22deg' }] }]} />
        <View style={[styles.line, { top: '48%', left: '30%', width: '18%', transform: [{ rotate: '90deg' }] }]} />
        <View style={[styles.line, { top: '58%', left: '49%', width: '18%', transform: [{ rotate: '90deg' }] }]} />

        {nodes.map((node) => (
          <View
            key={node.id}
            style={[styles.node, { top: `${node.top}%` as any, left: `${node.left}%` as any }]}
          >
            <Text style={styles.nodeText}>{node.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020', padding: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  map: {
    flex: 1,
    backgroundColor: '#0f1724',
    borderRadius: 18,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  node: {
    position: 'absolute',
    minWidth: 72,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38bdf8',
    alignItems: 'center',
    transform: [{ translateX: -36 }, { translateY: -16 }]
  },
  nodeText: { color: '#e2e8f0', fontWeight: '600', fontSize: 12 },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#34d399',
    borderRadius: 999,
    opacity: 0.8
  }
});
