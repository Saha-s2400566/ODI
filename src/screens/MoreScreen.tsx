import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const sections = [
  { title: 'Learning Hub', detail: 'Diagnostics, subnetting, security basics', route: 'Learning' },
  { title: 'Reference', detail: 'Common ports, IPv4, troubleshooting guides', route: 'Reference' },
  { title: 'Preferences', detail: 'Theme, notifications, default scan settings', route: null },
  { title: 'Data safety', detail: 'Local-only handling and policy overview', route: null }
];

export default function MoreScreen() {
  const navigation: any = useNavigation();
  const { theme, setTheme, isDark } = useTheme();

  return (
    <ScrollView style={[styles.container, isDark ? styles.dark : styles.light]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, !isDark && styles.lightText]}>More</Text>
      <Text style={[styles.subtitle, !isDark && styles.mutedLight]}>Learning, references and settings.</Text>

      <View style={[styles.card, !isDark && styles.lightCard]}>
        <Text style={[styles.cardTitle, !isDark && styles.lightText]}>Appearance</Text>
        <Text style={[styles.cardDetail, !isDark && styles.mutedLight]}>Current theme: {theme}</Text>
        <TouchableOpacity
          style={[styles.toggle, isDark ? styles.toggleDark : styles.toggleLight]}
          onPress={() => setTheme(isDark ? 'light' : 'dark')}
        >
          <Text style={styles.toggleText}>{isDark ? 'Switch to light' : 'Switch to dark'}</Text>
        </TouchableOpacity>
      </View>

      {sections.map((section) => (
        <TouchableOpacity
          key={section.title}
          style={[styles.card, !isDark && styles.lightCard]}
          activeOpacity={0.85}
          onPress={() => {
            if (section.route) navigation.navigate(section.route);
          }}
        >
          <Text style={[styles.cardTitle, !isDark && styles.lightText]}>{section.title}</Text>
          <Text style={[styles.cardDetail, !isDark && styles.mutedLight]}>{section.detail}</Text>
        </TouchableOpacity>
      ))}

      <View style={[styles.card, !isDark && styles.lightCard]}>
        <Text style={[styles.cardTitle, !isDark && styles.lightText]}>Quick learning</Text>
        <Text style={[styles.cardDetail, !isDark && styles.mutedLight]}>Practice subnetting and port basics with the built-in quiz.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dark: { backgroundColor: '#0b1020' },
  light: { backgroundColor: '#eef3ff' },
  content: { padding: 16, paddingTop: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 6, color: '#fff' },
  subtitle: { marginBottom: 18, color: '#9aa3c7' },
  lightText: { color: '#0f172a' },
  mutedLight: { color: '#475569' },
  card: {
    backgroundColor: '#0f1724',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12
  },
  lightCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe5ff'
  },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardDetail: { color: '#9aa3c7' },
  toggle: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  toggleDark: {
    backgroundColor: '#1d4ed8'
  },
  toggleLight: {
    backgroundColor: '#93c5fd'
  },
  toggleText: { color: '#fff', fontWeight: '700' }
});
