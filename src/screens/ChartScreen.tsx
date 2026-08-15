import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Topology Chart</Text>
      <Text style={styles.note}>Interactive topology will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1020' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  note: { color: '#9aa3c7', marginTop: 8 }
});
