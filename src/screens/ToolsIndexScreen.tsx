import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<any, 'ToolsList'>;

export default function ToolsIndexScreen({ navigation }: Props) {
  const { isDark } = useTheme();
  const colors = isDark
    ? { background: '#0b1020', card: '#0f172a', border: '#1e293b', text: '#fff', secondary: '#9ca3af' }
    : { background: '#f8fafc', card: '#ffffff', border: '#dbeafe', text: '#0f172a', secondary: '#475569' };

  const tools = [
    {
      id: 'reachability',
      title: 'Reachability Check',
      icon: 'wifi-check',
      desc: 'Test HTTP/HTTPS access to a host',
      color: '#3b82f6',
    },
    {
      id: 'dns',
      title: 'DNS Lookup',
      icon: 'dns',
      desc: 'Resolve hostname to IP address',
      color: '#8b5cf6',
    },
    {
      id: 'port',
      title: 'Port Check',
      icon: 'lan',
      desc: 'Check if a port is open and accessible',
      color: '#ec4899',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Network Tools</Text>
      {tools.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          style={[styles.toolCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => {
            if (tool.id === 'reachability') navigation.push('Reachability');
            else if (tool.id === 'dns') navigation.push('DnsLookup');
            else if (tool.id === 'port') navigation.push('PortCheck');
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.toolIcon, { backgroundColor: `${tool.color}20` }]}>
            <MaterialCommunityIcons name={tool.icon as any} size={28} color={tool.color} />
          </View>
          <View style={styles.toolInfo}>
            <Text style={[styles.toolTitle, { color: colors.text }]}>{tool.title}</Text>
            <Text style={[styles.toolDesc, { color: colors.secondary }]}>{tool.desc}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.secondary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  toolIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  toolInfo: { flex: 1, marginLeft: 12 },
  toolTitle: { fontSize: 16, fontWeight: '600' },
  toolDesc: { fontSize: 12, marginTop: 2 },
});
