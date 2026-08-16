import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

interface HomeScreenProps
  extends BottomTabScreenProps<any, 'Home'> {}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const tools = [
    {
      id: 'reachability',
      title: 'Reachability Check',
      icon: 'network-check',
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
      icon: 'port',
      desc: 'Check if a port is open and accessible',
      color: '#ec4899',
    },
  ];

  const moreItems = [
    {
      id: 'subnet',
      title: 'Subnet Calculator',
      icon: 'calculator',
      desc: 'Calculate network ranges',
    },
    {
      id: 'converter',
      title: 'IP Converter',
      icon: 'swap-horizontal',
      desc: 'Convert IP formats',
    },
    {
      id: 'learning',
      title: 'Learning Hub',
      icon: 'school',
      desc: 'Network fundamentals',
    },
  ];

  const handleToolPress = (id: string) => {
    if (navigation.getState().routeNames.includes('Tools')) {
      navigation.navigate('Tools', {
        screen: id === 'reachability' ? 'Reachability' : id === 'dns' ? 'DnsLookup' : 'PortCheck',
      });
    }
  };

  const handleMorePress = (id: string) => {
    if (navigation.getState().routeNames.includes('More')) {
      const screenMap: Record<string, any> = {
        subnet: 'SubnetCalculator',
        converter: 'IpConverter',
        learning: 'LearningHub',
      };
      navigation.navigate('More', {
        screen: screenMap[id],
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="network" size={40} color="#0ea5e9" />
        <Text style={styles.title}>ODI</Text>
        <Text style={styles.subtitle}>Navigate your network</Text>
      </View>

      <Text style={styles.sectionTitle}>Quick Diagnostics</Text>
      {tools.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          style={styles.toolCard}
          onPress={() => handleToolPress(tool.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.toolIcon, { backgroundColor: `${tool.color}20` }]}>
            <MaterialCommunityIcons name={tool.icon as any} size={28} color={tool.color} />
          </View>
          <View style={styles.toolInfo}>
            <Text style={styles.toolTitle}>{tool.title}</Text>
            <Text style={styles.toolDesc}>{tool.desc}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>More</Text>
      {moreItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.moreCard}
          onPress={() => handleMorePress(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.moreIcon}>
            <MaterialCommunityIcons name={item.icon as any} size={24} color="#0ea5e9" />
          </View>
          <View style={styles.moreInfo}>
            <Text style={styles.moreTitle}>{item.title}</Text>
            <Text style={styles.moreDesc}>{item.desc}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingBottom: 32 },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#9ca3af', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12, marginTop: 20 },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  toolIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  toolInfo: { flex: 1, marginLeft: 12 },
  toolTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  toolDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  moreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  moreIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e293b' },
  moreInfo: { flex: 1, marginLeft: 12 },
  moreTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  moreDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
});
