import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSavedResults } from '../context/SavedResultsContext';

type Props = NativeStackScreenProps<{ SaveResultDetail: { resultId: string } }, 'SaveResultDetail'>

export default function SaveResultDetailScreen({ route, navigation }: Props) {
  const { resultId } = route.params;
  const { getResult } = useSavedResults();
  const result = getResult(resultId);

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Result not found</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {result.type === 'reachability'
            ? 'Reachability Check'
            : result.type === 'dns'
            ? 'DNS Lookup'
            : 'Port Check'}
        </Text>
        <Text style={styles.cardDate}>{formatDate(result.timestamp)}</Text>

        <View style={styles.details}>{renderResultContent()}</View>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  cardDate: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  details: { marginTop: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#0ea5e9', marginTop: 12, marginBottom: 8 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  detailLabel: { fontSize: 14, color: '#9ca3af' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#dbeafe', maxWidth: '50%', textAlign: 'right' },
  errorText: { color: '#ef4444', fontSize: 16, textAlign: 'center', marginTop: 32 },
});
