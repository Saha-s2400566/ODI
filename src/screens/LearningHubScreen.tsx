import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topic = learningTopics.find((t) => t.id === selectedTopic);

  if (selectedTopic && topic) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedTopic(null)}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#0ea5e9" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{topic.title}</Text>
          <Text style={styles.detailContent}>{topic.content}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Learning Topics</Text>

      {learningTopics.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.topicCard}
          onPress={() => setSelectedTopic(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.topicIcon}>
            <MaterialCommunityIcons name="school" size={24} color="#8b5cf6" />
          </View>
          <View style={styles.topicInfo}>
            <Text style={styles.topicTitle}>{item.title}</Text>
            <Text style={styles.topicDesc}>{item.desc}</Text>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: { color: '#0ea5e9', fontWeight: '600', marginLeft: 4 },
  detailCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  detailTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12 },
  detailContent: { fontSize: 14, color: '#dbeafe', lineHeight: 22 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  topicDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
});
