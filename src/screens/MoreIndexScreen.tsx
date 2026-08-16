import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<any, 'MoreList'>;

export default function MoreIndexScreen({ navigation }: Props) {
  const { isDark } = useTheme();
  const colors = isDark
    ? { background: '#0b1020', card: '#0f172a', border: '#1e293b', text: '#fff', secondary: '#9ca3af', icon: '#1e293b' }
    : { background: '#f8fafc', card: '#ffffff', border: '#dbeafe', text: '#0f172a', secondary: '#475569', icon: '#e2e8f0' };

  const items = [
    {
      id: 'settings',
      title: 'Settings',
      icon: 'cog',
      desc: 'App preferences',
    },
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>More</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderLeftWidth: item.id === 'settings' ? 3 : 1,
              borderLeftColor: item.id === 'settings' ? '#0ea5e9' : colors.border,
            },
          ]}
          onPress={() => handlePress(item.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.icon, { backgroundColor: colors.icon }]}>
            <MaterialCommunityIcons name={item.icon as any} size={24} color="#0ea5e9" />
          </View>
          <View style={styles.info}>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.desc, { color: colors.secondary }]}>{item.desc}</Text>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  icon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: '600' },
  desc: { fontSize: 12, marginTop: 2 },
});
