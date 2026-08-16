import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <MaterialCommunityIcons name="network" size={56} color="#0ea5e9" />
        <Text style={styles.appName}>ODI</Text>
        <Text style={styles.tagline}>Navigate your network</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About ODI</Text>
        <Text style={styles.cardText}>
          ODI (Network Utility Companion) is a mobile application designed to help you diagnose and understand your network connectivity.
        </Text>
        <Text style={styles.cardText}>
          Whether you're troubleshooting a connection, looking up DNS records, or checking port availability, ODI provides quick and reliable diagnostics.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Features</Text>
        <FeatureItem title="Reachability Check" desc="Test HTTP/HTTPS access to any host" />
        <FeatureItem title="DNS Lookup" desc="Resolve hostnames to IPv4 and IPv6 addresses" />
        <FeatureItem title="Port Check" desc="Verify if ports are open and accessible" />
        <FeatureItem title="Saved Results" desc="Persist your diagnostics with AsyncStorage" />
        <FeatureItem title="Calculators" desc="Subnet calculator and IP converter" />
        <FeatureItem title="Learning Hub" desc="Educational content on networking basics" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Technology</Text>
        <InfoRow label="Framework" value="React Native" />
        <InfoRow label="Platform" value="Expo SDK 54" />
        <InfoRow label="Language" value="TypeScript" />
        <InfoRow label="Storage" value="AsyncStorage" />
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerText}>Built with ♥ for network diagnostics and learning</Text>
        <Text style={styles.footerMeta}>© 2026 ODI Project</Text>
      </View>
    </ScrollView>
  );
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <View style={styles.featureRow}>
      <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingBottom: 32 },
  headerCard: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  appName: { fontSize: 36, fontWeight: '800', color: '#fff', marginTop: 12 },
  tagline: { fontSize: 14, color: '#9ca3af', marginTop: 4 },
  version: { fontSize: 12, color: '#64748b', marginTop: 8 },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 10 },
  cardText: { fontSize: 13, color: '#cbd5e1', lineHeight: 20, marginBottom: 10 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: 12,
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600', color: '#fff' },
  featureDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  infoLabel: { fontSize: 14, color: '#9ca3af' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#dbeafe' },
  footerCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: { fontSize: 13, color: '#cbd5e1', textAlign: 'center' },
  footerMeta: { fontSize: 11, color: '#64748b', marginTop: 8 },
});
