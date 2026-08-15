import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ToolsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tools</Text>
      <Text style={styles.note}>Ping, Port Scanner, Traceroute and more.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1020' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  note: { color: '#9aa3c7', marginTop: 8 }
});
