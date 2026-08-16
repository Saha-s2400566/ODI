import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
  const { isDark } = useTheme();
  const colors = isDark
    ? {
        background: '#0b1020',
        card: '#0f172a',
        border: '#1e293b',
        text: '#fff',
        secondary: '#9ca3af',
        muted: '#cbd5e1',
      }
    : {
        background: '#f8fafc',
        card: '#ffffff',
        border: '#dbeafe',
        text: '#0f172a',
        secondary: '#475569',
        muted: '#334155',
      };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <MaterialCommunityIcons name="network" size={56} color="#0ea5e9" />
        <Text style={[styles.appName, { color: colors.text }]}>ODI</Text>
        <Text style={[styles.tagline, { color: colors.secondary }]}>Navigate your network</Text>
        <Text style={[styles.version, { color: isDark ? '#64748b' : '#475569' }]}>Version 1.0.0</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>About ODI</Text>
        <Text style={[styles.cardText, { color: colors.muted }]}>ODI (Network Utility Companion) is a mobile application designed to help you diagnose and understand your network connectivity.</Text>
        <Text style={[styles.cardText, { color: colors.muted }]}>Whether you're troubleshooting a connection, looking up DNS records, or checking port availability, ODI provides quick and reliable diagnostics.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Features</Text>
        <FeatureItem title="Reachability Check" desc="Test HTTP/HTTPS access to any host" isDark={isDark} />
        <FeatureItem title="DNS Lookup" desc="Resolve hostnames to IPv4 and IPv6 addresses" isDark={isDark} />
        <FeatureItem title="Port Check" desc="Verify if ports are open and accessible" isDark={isDark} />
        <FeatureItem title="Saved Results" desc="Persist your diagnostics with AsyncStorage" isDark={isDark} />
        <FeatureItem title="Calculators" desc="Subnet calculator and IP converter" isDark={isDark} />
        <FeatureItem title="Learning Hub" desc="Educational content on networking basics" isDark={isDark} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Technology</Text>
        <InfoRow label="Framework" value="React Native" isDark={isDark} />
        <InfoRow label="Platform" value="Expo SDK 54" isDark={isDark} />
        <InfoRow label="Language" value="TypeScript" isDark={isDark} />
        <InfoRow label="Storage" value="AsyncStorage" isDark={isDark} />
      </View>

      <View style={styles.footerCard}>
        <Text style={[styles.footerText, { color: colors.muted }]}>Built with ♥ for network diagnostics and learning</Text>
        <Text style={[styles.footerMeta, { color: isDark ? '#64748b' : '#475569' }]}>© 2026 ODI Project</Text>
      </View>
    </ScrollView>
  );
}

function FeatureItem({ title, desc, isDark }: { title: string; desc: string; isDark: boolean }) {
  return (
    <View style={styles.featureRow}>
      <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: isDark ? '#fff' : '#0f172a' }]}>{title}</Text>
        <Text style={[styles.featureDesc, { color: isDark ? '#9ca3af' : '#475569' }]}>{desc}</Text>
      </View>
    </View>
  );
}

function InfoRow({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <View style={[styles.infoRow, { borderTopColor: isDark ? '#1e293b' : '#dbeafe' }]}> 
      <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#475569' }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: isDark ? '#dbeafe' : '#334155' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  headerCard: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  appName: { fontSize: 36, fontWeight: '800', marginTop: 12 },
  tagline: { fontSize: 14, marginTop: 4 },
  version: { fontSize: 12, marginTop: 8 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  cardText: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: 12,
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600' },
  featureDesc: { fontSize: 12, marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  footerCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: { fontSize: 13, textAlign: 'center' },
  footerMeta: { fontSize: 11, marginTop: 8 },
});
