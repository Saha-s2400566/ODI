import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DeviceCard({ device }: { device: any }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.left}>
        <View style={styles.icon} />
        <View>
          <Text style={styles.name}>{device.name}</Text>
          <Text style={styles.ip}>{device.ip}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.status, device.online ? styles.online : styles.offline]}>
          {device.online ? 'Online' : 'Offline'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f1724',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#1f2a44', marginRight: 12 },
  name: { color: '#fff', fontSize: 16, fontWeight: '600' },
  ip: { color: '#9aa3c7', marginTop: 4 },
  right: {},
  status: { fontWeight: '700' },
  online: { color: '#4ade80' },
  offline: { color: '#f87171' }
});
