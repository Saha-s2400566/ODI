import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'MoreList'>;

export default function MoreIndexScreen({ navigation }: Props) {
  const items = [
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
    {
      id: 'settings',
      title: 'Settings',
      icon: 'cog',
      desc: 'App preferences',
    },
    {
      id: 'about',
      title: 'About ODI',
      icon: 'information',
      desc: 'App information',
    },
  ];

  const handlePress = (id: string) => {
    const screenMap: Record<string, any> = {
      subnet: 'SubnetCalculator',
      converter: 'IpConverter',
      learning: 'LearningHub',
      settings: 'Settings',
      about: 'About',
    };
    navigation.push(screenMap[id]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>More</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => handlePress(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons name={item.icon as any} size={24} color="#0ea5e9" />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  icon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e293b' },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: '600', color: '#fff' },
  desc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
});
