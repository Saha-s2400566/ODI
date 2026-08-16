import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const sections = [
  { title: 'Learning Hub', detail: 'Diagnostics, subnetting, security basics', route: 'Learning' },
  { title: 'Reference', detail: 'Common ports, IPv4, troubleshooting guides', route: 'Reference' },
  { title: 'Preferences', detail: 'Theme, notifications, default scan settings', route: null },
  { title: 'Data safety', detail: 'Local-only handling and policy overview', route: null }
];

export default function MoreScreen() {
  const navigation: any = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.subtitle}>Learning, references and settings.</Text>

      {sections.map((section) => (
        <TouchableOpacity
          key={section.title}
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => {
            if (section.route) navigation.navigate(section.route);
          }}
        >
          <Text style={styles.cardTitle}>{section.title}</Text>
          <Text style={styles.cardDetail}>{section.detail}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick learning</Text>
        <Text style={styles.cardDetail}>Practice subnetting and port basics with the built-in quiz.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingTop: 24 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#9aa3c7', marginBottom: 18 },
  card: {
    backgroundColor: '#0f1724',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12
  },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardDetail: { color: '#9aa3c7' }
});
