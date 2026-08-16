import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { isDark, setTheme } = useTheme();

  const handleToggleDarkMode = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const colors = isDark
    ? {
        background: '#0b1020',
        card: '#0f172a',
        input: '#050f1b',
        border: '#1e293b',
        text: '#fff',
        secondary: '#9ca3af',
        muted: '#dbeafe',
      }
    : {
        background: '#f8fafc',
        card: '#ffffff',
        input: '#f1f5f9',
        border: '#dbeafe',
        text: '#0f172a',
        secondary: '#475569',
        muted: '#334155',
      };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
      <View
        style={[
          styles.settingRow,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.settingInfo}>
          <MaterialCommunityIcons name="moon-waning-crescent" size={24} color="#0ea5e9" />
          <View style={styles.settingText}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Text style={[styles.settingDesc, { color: colors.secondary }]}>Use dark theme for reduced eye strain</Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={handleToggleDarkMode}
          trackColor={{ false: '#ccc', true: '#0ea5e9' }}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
          <Text style={[styles.infoLabel, { color: colors.secondary }]}>App Name</Text>
          <Text style={[styles.infoValue, { color: colors.muted }]}>ODI</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
          <Text style={[styles.infoLabel, { color: colors.secondary }]}>Version</Text>
          <Text style={[styles.infoValue, { color: colors.muted }]}>1.0.0</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
          <Text style={[styles.infoLabel, { color: colors.secondary }]}>Framework</Text>
          <Text style={[styles.infoValue, { color: colors.muted }]}>React Native + Expo</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Information</Text>
      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.infoText, { color: colors.muted }]}>
          ODI is a network utility companion for diagnosing connectivity, resolving hostnames, and checking port availability.
        </Text>
        <Text style={[styles.infoText, { color: colors.muted }]}>
          Save your diagnostics for later reference and learn about networking fundamentals.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 20 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingText: { marginLeft: 12, flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  infoText: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
});
