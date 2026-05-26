import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { GradientBackground } from '../components/GradientBackground';

export function LoadingScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#0b5fff' />
        <Text style={styles.text}>Carregando hidratação...</Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    color: '#0b2840',
    fontSize: 16,
    fontWeight: '700',
  },
});
