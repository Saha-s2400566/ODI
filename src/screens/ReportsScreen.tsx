import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const summary = [
  { label: 'Scans', value: '12' },
  { label: 'Hosts', value: '38' },
  { label: 'Alerts', value: '3' },
  { label: 'Uptime', value: '98%' }
];

const reports = [
  { title: 'Daily network health', time: 'Today, 08:30' },
  { title: 'Firewall exposure review', time: 'Yesterday' },
  { title: 'Wireless segment summary', time: 'Last 7 days' },
  { title: 'Asset discovery report', time: 'Last 30 days' }
];

export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reports</Text>
      <View style={styles.grid}>
        {summary.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Recent reports</Text>
        {reports.map((report) => (
          <View key={report.title} style={styles.reportRow}>
            <View>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportTime}>{report.time}</Text>
            </View>
            <Text style={styles.export}>Export</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingTop: 24 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statCard: {
    width: '48%',
    backgroundColor: '#0f1724',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12
  },
  statValue: { color: '#fff', fontSize: 24, fontWeight: '700' },
  statLabel: { color: '#9aa3c7', marginTop: 6 },
  listCard: {
    backgroundColor: '#0f1724',
    borderRadius: 14,
    padding: 16
  },
  listTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b'
  },
  reportTitle: { color: '#fff', fontWeight: '600' },
  reportTime: { color: '#9aa3c7', marginTop: 4 },
  export: { color: '#60a5fa', fontWeight: '700' }
});
