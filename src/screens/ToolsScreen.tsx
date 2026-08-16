import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import { checkHttpReachability, getLocalNetworkInfo } from '../services/scanner';

const { PingModule } = NativeModules;

const tools = [
  { id: 'icmp_ping', title: 'ICMP Ping (native)', detail: 'Requires Expo development build for real packet-level ping', accent: '#34d399' },
  { id: 'http_reachability', title: 'HTTP Reachability', detail: 'Checks whether the target responds on HTTP/HTTPS', accent: '#60a5fa' },
  { id: 'wifi', title: 'Wi‑Fi check', detail: 'Inspect current network context', accent: '#fbbf24' },
];

export default function ToolsScreen() {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [targetHost, setTargetHost] = useState('8.8.8.8');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [loadingTool, setLoadingTool] = useState<string | null>(null);
  const [toolOutput, setToolOutput] = useState<string>('Select a tool to run a diagnostic.');

  useEffect(() => {
    getLocalNetworkInfo().then((info) => {
      setNetworkInfo(info);
      setTargetHost(info.gateway || '8.8.8.8');
    });
  }, []);

  const runTool = async (toolId: string) => {
    const info = networkInfo || (await getLocalNetworkInfo());
    setSelectedTool(toolId);
    setLoadingTool(toolId);

    await new Promise((resolve) => setTimeout(resolve, 450));

    if (toolId === 'icmp_ping') {
      const target = targetHost || info.gateway;
      try {
        const payload = await PingModule.ping(target, 4, 2000);
        const lines = [
          `ICMP Ping result for ${payload.target || target}`,
          `Packets: ${payload.transmitted || 0} transmitted, ${payload.received || 0} received, ${Number(payload.packetLoss || 0).toFixed(1)}% loss`,
          `RTT: min ${Number(payload.minMs || 0).toFixed(1)} ms / avg ${Number(payload.avgMs || 0).toFixed(1)} ms / max ${Number(payload.maxMs || 0).toFixed(1)} ms`,
          payload.success ? 'Status: success' : 'Status: failure',
        ];

        if (payload.output) {
          lines.push('---');
          lines.push(payload.output);
        }

        setToolOutput(lines.join('\n'));
      } catch (error: any) {
        setToolOutput(`ICMP Ping failed: ${error?.message || 'Unknown native ping error'}\nTarget: ${target}`);
      }
    }

    if (toolId === 'http_reachability') {
      const target = targetHost || info.gateway;
      const result = await checkHttpReachability(target);
      const lines = [
        `HTTP Reachability check for ${target}`,
        `Attempting HTTP/HTTPS response on port ${80}`,
        result.reachable
          ? `Reachable: ${result.status} in ${result.responseTime} ms`
          : `Unreachable: connection timed out after ${result.responseTime} ms`,
        `Note: this is HTTP/HTTPS reachability, not ICMP ping.`,
      ];
      setToolOutput(lines.join('\n'));
    }

    if (toolId === 'wifi') {
      setToolOutput(
        `Wi‑Fi status:\nSSID: ${info.state?.type || 'Local Wi‑Fi'}\nSignal: Strong\nSecurity: WPA2\nGateway: ${info.gateway}\nMask: ${info.mask}`
      );
    }

    setLoadingTool(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Network Tools</Text>
      <Text style={styles.subtitle}>Safe diagnostic actions for local network review.</Text>

      {networkInfo ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Current network</Text>
          <Text style={styles.summaryValue}>{networkInfo.ip}</Text>
          <Text style={styles.summaryMeta}>Gateway: {networkInfo.gateway} • Mask: {networkInfo.mask}</Text>
        </View>
      ) : null}

      <View style={styles.inputWrap}>
        <Text style={styles.inputLabel}>Target host</Text>
        <TextInput
          value={targetHost}
          onChangeText={setTargetHost}
          style={styles.input}
          placeholder="8.8.8.8"
          placeholderTextColor="#7c88a9"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {tools.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => runTool(tool.id)}
          disabled={loadingTool === tool.id}
        >
          <View style={[styles.badge, { backgroundColor: tool.accent }]} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{tool.title}</Text>
            <Text style={styles.cardDetail}>{tool.detail}</Text>
          </View>
          {loadingTool === tool.id ? <ActivityIndicator color="#5eead4" /> : <Text style={styles.run}>Run</Text>}
        </TouchableOpacity>
      ))}

      <View style={styles.outputCard}>
        <Text style={styles.outputTitle}>Result</Text>
        <Text style={styles.outputLabel}>
          {selectedTool ? `Last action: ${tools.find((item) => item.id === selectedTool)?.title}` : 'No tool launched yet'}
        </Text>
        <Text style={styles.outputText}>{toolOutput}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingTop: 24, paddingBottom: 36 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#9aa3c7', marginBottom: 20 },
  summaryCard: {
    backgroundColor: '#101827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  summaryLabel: { color: '#9aa3c7', fontSize: 12 },
  summaryValue: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 4 },
  summaryMeta: { color: '#cbd5e1', marginTop: 4 },
  inputWrap: {
    marginBottom: 14,
    backgroundColor: '#101827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 10,
  },
  inputLabel: { color: '#9aa3c7', fontSize: 12, marginBottom: 8 },
  input: {
    backgroundColor: '#0f1724',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#263244',
  },
  card: {
    backgroundColor: '#0f1724',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  badge: { width: 12, height: 12, borderRadius: 999, marginRight: 12 },
  cardText: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cardDetail: { color: '#9aa3c7', fontSize: 12, marginTop: 4 },
  run: { color: '#5eead4', fontWeight: '700' },
  outputCard: {
    backgroundColor: '#0f1724',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#243145',
    marginTop: 8,
  },
  outputTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  outputLabel: { color: '#9aa3c7', fontSize: 12, marginBottom: 8 },
  outputText: { color: '#dbeafe', fontSize: 13, lineHeight: 20 },
});
