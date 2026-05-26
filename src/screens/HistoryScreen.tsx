import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '../components/ActionButton';
import { GradientBackground } from '../components/GradientBackground';
import { ScreenCard } from '../components/ScreenCard';
import { useHydration } from '../hooks/useHydration';
import { AppStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<AppStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const { history, streak } = useHydration();

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenCard
          title='Histórico semanal'
          subtitle='Visão simples dos últimos registros salvos localmente.'
        >
          <Text style={styles.streak}>Streak atual: {streak} dias</Text>
          {history.length === 0 ? (
            <Text style={styles.empty}>Sem registros ainda.</Text>
          ) : null}
          {history.map((entry) => (
            <View key={entry.date} style={styles.row}>
              <View>
                <Text style={styles.date}>{entry.date}</Text>
                <Text style={styles.detail}>
                  {entry.completed ? 'Meta concluída' : 'Meta parcial'}
                </Text>
              </View>
              <Text style={styles.amount}>{entry.consumedMl} ml</Text>
            </View>
          ))}
        </ScreenCard>

        <ActionButton
          label='Voltar'
          onPress={() => navigation.goBack()}
          variant='secondary'
        />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
  },
  streak: {
    marginBottom: 16,
    color: '#0b5fff',
    fontWeight: '900',
    fontSize: 16,
  },
  empty: {
    color: '#4f6474',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11,95,255,0.08)',
  },
  date: {
    color: '#0b2840',
    fontWeight: '800',
  },
  detail: {
    color: '#5a6c7a',
    marginTop: 2,
  },
  amount: {
    color: '#0b5fff',
    fontWeight: '900',
  },
});
