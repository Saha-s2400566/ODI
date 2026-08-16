import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { isDark, setTheme } = useTheme();

  const handleToggleDarkMode = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <MaterialCommunityIcons name="moon-waning-crescent" size={24} color="#0ea5e9" />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDesc}>Use dark theme for reduced eye strain</Text>
          </View>
        </View>
        <Switch value={isDark} onValueChange={handleToggleDarkMode} trackColor={{ false: '#ccc', true: '#0ea5e9' }} />
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Name</Text>
          <Text style={styles.infoValue}>ODI</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Framework</Text>
          <Text style={styles.infoValue}>React Native + Expo</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Information</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          ODI is a network utility companion for diagnosing connectivity, resolving hostnames, and checking port availability.
        </Text>
        <Text style={styles.infoText}>
          Save your diagnostics for later reference and learn about networking fundamentals.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12, marginTop: 20 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingText: { marginLeft: 12, flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: '#fff' },
  settingDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  infoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  infoLabel: { fontSize: 14, color: '#9ca3af' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#dbeafe' },
  infoText: { fontSize: 13, color: '#cbd5e1', lineHeight: 20, marginBottom: 12 },
});
