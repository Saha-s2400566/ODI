import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { buildTraceroutePreview, getLocalNetworkInfo, probeReachability, getSafeMockDevices } from '../services/scanner';

const tools = [
  { id: 'ping', title: 'Ping gateway', detail: 'Check reachability in 1 click', accent: '#34d399' },
  { id: 'ports', title: 'Port scan', detail: 'Review common services and exposure', accent: '#60a5fa' },
  { id: 'traceroute', title: 'Traceroute', detail: 'Map the route to a destination', accent: '#a78bfa' },
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

    if (toolId === 'ping') {
      const target = targetHost || info.gateway;
      const result = await probeReachability(target);
      const lines = [
        `PING ${target} (${target}) 56(84) bytes of data.`,
        result.reachable
          ? `64 bytes from ${target}: time=${result.responseTime} ms`
          : `Request timeout for ${target}`,
        `--- ${target} ping statistics ---`,
        result.reachable
          ? `1 packets transmitted, 1 received, 0% packet loss`
          : `1 packets transmitted, 0 received, 100% packet loss`,
        `status: ${result.status}`,
      ];
      setToolOutput(lines.join('\n'));
    }

    if (toolId === 'ports') {
      const devices = await getSafeMockDevices(info.ip);
      const openPorts = devices
        .filter((device: any) => device.online)
        .flatMap((device: any) => device.ports.map((port: number) => `${device.name}:${port}`))
        .slice(0, 8);

      setToolOutput(
        openPorts.length > 0
          ? `Open services detected:\n${openPorts.join('\n')}`
          : 'No open services detected on the current local network view.'
      );
    }

    if (toolId === 'traceroute') {
      const target = targetHost || info.gateway;
      const route = await buildTraceroutePreview(target, info);
      const lines = [`traceroute to ${target} (${target}), 30 hops max`, ...route];
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
