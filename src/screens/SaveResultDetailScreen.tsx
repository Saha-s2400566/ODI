import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSavedResults } from '../context/SavedResultsContext';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<{ SaveResultDetail: { resultId: string } }, 'SaveResultDetail'>

export default function SaveResultDetailScreen({ route, navigation }: Props) {
  const { isDark } = useTheme();
  const colors = isDark
    ? {
        background: '#0b1020',
        card: '#0f172a',
        border: '#1e293b',
        text: '#fff',
        secondary: '#9ca3af',
        muted: '#dbeafe',
      }
    : {
        background: '#f8fafc',
        card: '#ffffff',
        border: '#dbeafe',
        text: '#0f172a',
        secondary: '#475569',
        muted: '#334155',
      };

  const { resultId } = route.params;
  const { getResult } = useSavedResults();
  const result = getResult(resultId);

  if (!result) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={[styles.errorText, { color: '#ef4444' }]}>Result not found</Text>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderResultContent = () => {
    if (result.type === 'reachability') {
      return (
        <>
          <DetailRow label="Target" value={result.data.target} />
          <DetailRow label="Status" value={result.data.reachable ? 'Reachable' : 'Unreachable'} />
          <DetailRow label="Response Time" value={`${result.data.responseTime} ms`} />
          <DetailRow label="Status Code" value={result.data.status} />
          <DetailRow label="Method" value={result.data.method} />
        </>
      );
    }

    if (result.type === 'dns') {
      return (
        <>
          <DetailRow label="Hostname" value={result.data.hostname} />
          {result.data.error ? (
            <DetailRow label="Error" value={result.data.error} />
          ) : (
            <>
              {result.data.ipv4.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>IPv4 Addresses</Text>
                  {result.data.ipv4.map((ip: string, idx: number) => (
                    <DetailRow key={idx} label={`A`} value={ip} />
                  ))}
                </>
              )}
              {result.data.ipv6.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>IPv6 Addresses</Text>
                  {result.data.ipv6.map((ip: string, idx: number) => (
                    <DetailRow key={idx} label={`AAAA`} value={ip} />
                  ))}
                </>
              )}
            </>
          )}
        </>
      );
    }

    if (result.type === 'port') {
      return (
        <>
          <DetailRow label="Host" value={result.data.host} />
          <DetailRow label="Port" value={result.data.port.toString()} />
          <DetailRow label="Status" value={result.data.open ? 'OPEN' : 'CLOSED'} />
          <DetailRow label="Service" value={result.data.service || 'Unknown'} />
          <DetailRow label="Response Time" value={`${result.data.responseTime} ms`} />
        </>
      );
    }

    return <Text style={styles.errorText}>Unknown result type</Text>;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}> 
          {result.type === 'reachability'
            ? 'Reachability Check'
            : result.type === 'dns'
            ? 'DNS Lookup'
            : 'Port Check'}
        </Text>
        <Text style={[styles.cardDate, { color: colors.secondary }]}>{formatDate(result.timestamp)}</Text>

        <View style={styles.details}>{renderResultContent()}</View>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <View style={[styles.detailRow, { borderBottomColor: isDark ? '#1e293b' : '#dbeafe' }]}> 
      <Text style={[styles.detailLabel, { color: isDark ? '#9ca3af' : '#475569' }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: isDark ? '#dbeafe' : '#334155' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 22, fontWeight: '700' },
  cardDate: { fontSize: 12, marginTop: 4 },
  details: { marginTop: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#0ea5e9', marginTop: 12, marginBottom: 8 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600', maxWidth: '50%', textAlign: 'right' },
  errorText: { color: '#ef4444', fontSize: 16, textAlign: 'center', marginTop: 32 },
});
