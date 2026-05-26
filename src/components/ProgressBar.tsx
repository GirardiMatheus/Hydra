import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  progressPercent: number;
  label: string;
}

export function ProgressBar({ progressPercent, label }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{Math.round(progressPercent)}%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${Math.min(100, progressPercent)}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#244056',
  },
  percent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0b5fff',
  },
  track: {
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(11,95,255,0.10)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#0b5fff',
  },
});
