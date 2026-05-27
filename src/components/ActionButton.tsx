import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  style,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        style,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[styles.text, variant === 'secondary' && styles.secondaryText]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: '#0b5fff',
    shadowColor: '#0b5fff',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  secondary: {
    backgroundColor: 'rgba(11,95,255,0.08)',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryText: {
    color: '#0b5fff',
  },
});
