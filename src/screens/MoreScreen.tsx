import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.note}>Settings, Learning Hub, References.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1020' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  note: { color: '#9aa3c7', marginTop: 8 }
});
