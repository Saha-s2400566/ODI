import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useSavedResults, DiagnosticResult } from '../context/SavedResultsContext';
import { useTheme } from '../context/ThemeContext';

interface SavedResultsScreenProps
  extends BottomTabScreenProps<any, 'Saved'> {}

interface SavedSection {
  title: string;
  data: DiagnosticResult[];
}

export default function SavedResultsScreen({ navigation }: SavedResultsScreenProps) {
  const { results, removeResult } = useSavedResults();
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

  const sortedResults = React.useMemo(
    () => [...results].sort((a, b) => b.timestamp - a.timestamp),
    [results],
  );

  const groupedResults = React.useMemo<SavedSection[]>(() => {
    const sections: SavedSection[] = [
      {
        title: 'Reachability Checks',
        data: sortedResults.filter((item) => item.type === 'reachability'),
      },
      {
        title: 'DNS Lookups',
        data: sortedResults.filter((item) => item.type === 'dns'),
      },
      {
        title: 'Port Checks',
        data: sortedResults.filter((item) => item.type === 'port'),
      },
    ].filter((section) => section.data.length > 0);

    return sections;
  }, [sortedResults]);

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

  const getResultSummary = (result: DiagnosticResult) => {
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

  if (sortedResults.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="content-save-outline" size={52} color="#475569" />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Results</Text>
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          Run any diagnostic and tap Save Result to keep it here.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={groupedResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: isDark ? '#7dd3fc' : '#0369a1' }]}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleViewDetail(item.id)}
            activeOpacity={0.85}
          >
            <View style={styles.resultContent}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                <MaterialCommunityIcons name={getIcon(item.type)} size={24} color="#0ea5e9" />
              </View>
              <View style={styles.resultInfo}>
                <Text style={[styles.resultTypeTitle, { color: colors.text }]}>{getTitle(item.type)}</Text>
                <Text style={[styles.resultTarget, { color: colors.muted }]}>{item.target}</Text>
                <Text style={[styles.resultSummary, { color: colors.secondary }]}>{getResultSummary(item)}</Text>
                <Text style={[styles.resultDate, { color: isDark ? '#64748b' : '#64748b' }]}>{formatDate(item.timestamp)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
  container: { flex: 1 },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 36,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  resultCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultContent: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultInfo: { flex: 1 },
  resultTypeTitle: { fontSize: 15, fontWeight: '600' },
  resultTarget: { fontSize: 12, marginTop: 3 },
  resultSummary: { fontSize: 12, marginTop: 3 },
  resultDate: { fontSize: 11, marginTop: 5 },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16 },
  emptyText: { fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 },
});
