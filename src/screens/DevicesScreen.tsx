import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput } from 'react-native';
import DeviceCard from '../components/DeviceCard';
import { scanNetworkSafe } from '../services/scanner';

export default function DevicesScreen() {
  const [devices, setDevices] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const load = async () => {
    setRefreshing(true);
    try {
      const res = await scanNetworkSafe();
      setDevices(res);
    } catch (e) {
      setDevices([]);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = devices.filter((d) =>
    `${d.name} ${d.ip}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Devices</Text>
        <TextInput
          placeholder="Search by name or IP"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeviceCard device={item} />}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={<Text style={styles.empty}>No devices found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  header: { padding: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  search: {
    backgroundColor: '#121424',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8
  },
  empty: { color: '#9aa3c7', textAlign: 'center', marginTop: 40 }
});
