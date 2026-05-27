import React from 'react';
import { StyleSheet, View } from 'react-native';

export function GradientBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFillObject, styles.background]} />
      <View style={styles.haloOne} />
      <View style={styles.haloTwo} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    backgroundColor: '#effbff',
  },
  haloOne: {
    position: 'absolute',
    top: -100,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(0, 198, 255, 0.13)',
  },
  haloTwo: {
    position: 'absolute',
    bottom: 120,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(89, 255, 214, 0.12)',
  },
});
