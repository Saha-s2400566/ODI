import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const learningTopics = [
  {
    id: '1',
    title: 'OSI Model',
    desc: '7-layer network model',
    content: `The OSI (Open Systems Interconnection) model describes 7 layers of network communication:\n\n1. Physical - cables, signals\n2. Data Link - MAC addresses, switches\n3. Network - IP addressing, routing\n4. Transport - TCP/UDP\n5. Session - connection management\n6. Presentation - encryption, compression\n7. Application - HTTP, FTP, DNS`,
  },
  {
    id: '2',
    title: 'TCP vs UDP',
    desc: 'Connection protocols',
    content: `TCP (Transmission Control Protocol):\n• Connection-oriented\n• Reliable delivery\n• Error checking\n• Slower\n• Used by: HTTP, SMTP, FTP\n\nUDP (User Datagram Protocol):\n• Connectionless\n• Fast delivery\n• No error checking\n• Faster\n• Used by: DNS, VoIP, streaming`,
  },
  {
    id: '3',
    title: 'Common Ports',
    desc: 'Services and their ports',
    content: `HTTP - 80: Web browsing\nHTTPS - 443: Secure web\nSSH - 22: Remote access\nFTP - 21: File transfer\nSMTP - 25: Email sending\nPOP3 - 110: Email receiving\nDNS - 53: Name resolution\nDHCP - 67/68: IP allocation\nMySQL - 3306: Database`,
  },
  {
    id: '4',
    title: 'HTTP Status Codes',
    desc: 'Response codes explained',
    content: `2xx Success:\n200 OK - Request succeeded\n201 Created - Resource created\n\n3xx Redirection:\n301 Moved Permanently\n302 Found\n304 Not Modified\n\n4xx Client Error:\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n\n5xx Server Error:\n500 Internal Server Error\n502 Bad Gateway\n503 Service Unavailable`,
  },
  {
    id: '5',
    title: 'Subnetting Basics',
    desc: 'Network segmentation',
    content: `Subnets divide networks into smaller segments.\n\nA /24 subnet (255.255.255.0) has:\n• 256 total addresses\n• 254 usable for hosts\n• 1 network address\n• 1 broadcast address\n\nCommon masks:\n/24 - 254 hosts\n/25 - 126 hosts\n/26 - 62 hosts\n/27 - 30 hosts\n/28 - 14 hosts\n/29 - 6 hosts\n/30 - 2 hosts`,
  },
];

export default function LearningHubScreen() {
  const { isDark } = useTheme();
  const colors = isDark
    ? { background: '#0b1020', card: '#0f172a', border: '#1e293b', text: '#fff', secondary: '#9ca3af', muted: '#dbeafe', icon: '#1e293b' }
    : { background: '#f8fafc', card: '#ffffff', border: '#dbeafe', text: '#0f172a', secondary: '#475569', muted: '#334155', icon: '#e2e8f0' };

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topic = learningTopics.find((t) => t.id === selectedTopic);

  if (selectedTopic && topic) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedTopic(null)}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#0ea5e9" />
          <Text style={[styles.backText, { color: '#0ea5e9' }]}>Back</Text>
        </TouchableOpacity>

        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.detailTitle, { color: colors.text }]}>{topic.title}</Text>
          <Text style={[styles.detailContent, { color: colors.muted }]}>{topic.content}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Learning Topics</Text>

      {learningTopics.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.topicCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setSelectedTopic(item.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.topicIcon, { backgroundColor: colors.icon }]}>
            <MaterialCommunityIcons name="school" size={24} color="#8b5cf6" />
          </View>
          <View style={styles.topicInfo}>
            <Text style={[styles.topicTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.topicDesc, { color: colors.secondary }]}>{item.desc}</Text>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: { fontWeight: '600', marginLeft: 4 },
  detailCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  detailTitle: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  detailContent: { fontSize: 14, lineHeight: 22 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 15, fontWeight: '600' },
  topicDesc: { fontSize: 12, marginTop: 2 },
});
