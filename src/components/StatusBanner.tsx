import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBanner({
  title,
  subtitle,
  tone = 'info',
}: {
  title: string;
  subtitle: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
}) {
  const palette = {
    info: { bg: '#0f1724', border: '#60a5fa', text: '#dbeafe' },
    success: { bg: '#0f2d26', border: '#34d399', text: '#d1fae5' },
    warning: { bg: '#3b2c1d', border: '#fbbf24', text: '#fef3c7' },
    danger: { bg: '#3b1d1d', border: '#f87171', text: '#fee2e2' },
  }[tone];

  return (
    <View style={[styles.banner, { backgroundColor: palette.bg, borderColor: palette.border }]}> 
      <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: palette.text }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.9,
  },
});
