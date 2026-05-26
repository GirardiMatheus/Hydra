import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface BottleProps {
  progressPercent: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Bottle({ progressPercent }: BottleProps) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [pulse]);

  const bottleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.015 }],
  }));

  const waterStyle = useAnimatedStyle(() => ({
    height: `${Math.max(0, Math.min(100, progressPercent))}%`,
    backgroundColor: interpolateColor(
      progressPercent / 100,
      [0, 0.45, 0.75, 1],
      ['#bfe8ff', '#55c7ff', '#12b886', '#00d6a3'],
    ),
  }));

  return (
    <AnimatedView style={[styles.wrapper, bottleStyle]}>
      <View style={styles.neck} />
      <View style={styles.body}>
        <Animated.View style={[styles.water, waterStyle]} />
        <View style={styles.surface} />
      </View>
      <Text style={styles.label}>{Math.round(progressPercent)}%</Text>
    </AnimatedView>
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
