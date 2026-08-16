import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useSavedResults } from '../context/SavedResultsContext';

interface SavedResultsScreenProps
  extends BottomTabScreenProps<any, 'Saved'> {}

export default function SavedResultsScreen({ navigation }: SavedResultsScreenProps) {
  const { results, removeResult } = useSavedResults();

  const getIcon = (type: string) => {
    switch (type) {
      case 'reachability':
        return 'wifi-check';
      case 'dns':
        return 'dns';
      case 'port':
        return 'lan';
      default:
        return 'help-circle';
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'reachability':
        return 'Reachability Check';
      case 'dns':
        return 'DNS Lookup';
      case 'port':
        return 'Port Check';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getResultSummary = (result: any) => {
    if (result.type === 'reachability') {
      return `${result.data.reachable ? 'Reachable' : 'Unreachable'} • ${result.data.responseTime}ms`;
    }
    if (result.type === 'dns') {
      const totalIps = (result.data.ipv4?.length || 0) + (result.data.ipv6?.length || 0);
      return `${totalIps} IP addresses found`;
    }
    if (result.type === 'port') {
      return `${result.data.open ? 'OPEN' : 'CLOSED'} • ${result.data.responseTime}ms`;
    }
    return 'Unknown result';
  };

  const handleDelete = (id: string) => {
    removeResult(id);
  };

  const handleViewDetail = (resultId: string) => {
    navigation.navigate('SaveResultDetail', { resultId });
  };

  if (results.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <MaterialCommunityIcons name="content-save-outline" size={48} color="#475569" />
        <Text style={styles.emptyTitle}>No Saved Results</Text>
        <Text style={styles.emptyText}>Run a diagnostic and save the result to see it here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultCard}
            onPress={() => handleViewDetail(item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.resultContent}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name={getIcon(item.type)}
                  size={24}
                  color="#0ea5e9"
                />
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultTypeTitle}>{getTitle(item.type)}</Text>
                <Text style={styles.resultTarget}>{item.target}</Text>
                <Text style={styles.resultSummary}>{getResultSummary(item)}</Text>
                <Text style={styles.resultDate}>{formatDate(item.timestamp)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  emptyContainer: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 32 },
  resultCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultContent: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultInfo: { flex: 1 },
  resultTypeTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  resultTarget: { fontSize: 12, color: '#dbeafe', marginTop: 2 },
  resultSummary: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  resultDate: { fontSize: 11, color: '#64748b', marginTop: 4 },
  deleteButton: { padding: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#9ca3af', marginTop: 8, textAlign: 'center', maxWidth: 200 },
});
