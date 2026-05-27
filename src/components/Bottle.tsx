import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BottleProps {
  progressPercent: number;
}

function getWaterColor(progressPercent: number): string {
  if (progressPercent >= 100) {
    return '#00d6a3';
  }

  if (progressPercent >= 75) {
    return '#12b886';
  }

  if (progressPercent >= 45) {
    return '#55c7ff';
  }

  return '#bfe8ff';
}

export function Bottle({ progressPercent }: BottleProps) {
  const normalizedProgress = Math.max(0, Math.min(100, progressPercent));

  return (
    <View style={styles.wrapper}>
      <View style={styles.neck} />
      <View style={styles.body}>
        <View
          style={[
            styles.water,
            {
              height: `${normalizedProgress}%`,
              backgroundColor: getWaterColor(normalizedProgress),
            },
          ]}
        />
        <View style={styles.surface} />
      </View>
      <Text style={styles.label}>{Math.round(normalizedProgress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  neck: {
    width: 56,
    height: 22,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 5,
    borderColor: '#0b5fff',
    borderBottomWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  body: {
    width: 180,
    height: 300,
    borderWidth: 5,
    borderColor: '#0b5fff',
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.66)',
    marginTop: -2,
    justifyContent: 'flex-end',
  },
  water: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  surface: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  label: {
    marginTop: 14,
    color: '#0b2840',
    fontWeight: '800',
    fontSize: 28,
  },
});
