import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '@/components/ActionButton';
import { GradientBackground } from '@/components/GradientBackground';
import { ScreenCard } from '@/components/ScreenCard';
import { useHydration } from '@/hooks/useHydration';
import { AppStackParamList } from '@/types/navigation';
import { DoseOption } from '@/types/hydration';

type Props = StackScreenProps<AppStackParamList, 'Dose'>;

const OPTIONS: DoseOption[] = [200, 250, 300, 500];

export function DoseScreen({ navigation }: Props) {
  const {
    doseMl,
    goalMl,
    reminderTimes,
    consumedMl,
    remainingMl,
    progressPercent,
    updateDoseSetting,
  } = useHydration();
  const [selectedDose, setSelectedDose] = useState<DoseOption>(doseMl);

  const handleSave = async () => {
    await updateDoseSetting(selectedDose);
    Alert.alert(
      'Configuração salva',
      'Sua dose diária foi mantida para os próximos lembretes.',
    );
    navigation.goBack();
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenCard
          title='Escolha da dose'
          subtitle='Essa medida será usada como base para o botão de consumo e os lembretes.'
        >
          <View style={styles.options}>
            {OPTIONS.map((option) => (
              <ActionButton
                key={option}
                label={`${option} ml`}
                onPress={() => setSelectedDose(option)}
                variant={selectedDose === option ? 'primary' : 'secondary'}
              />
            ))}
          </View>
          <Text style={styles.summary}>
            Dose selecionada: {selectedDose} ml
          </Text>
          <Text style={styles.summarySecondary}>
            Meta diária atual: {goalMl} ml
          </Text>
          <Text style={styles.summarySecondary}>
            Consumo registrado: {consumedMl} ml
          </Text>
          <Text style={styles.summarySecondary}>
            Restante: {remainingMl} ml
          </Text>
          <Text style={styles.summarySecondary}>
            Progresso: {Math.round(progressPercent)}%
          </Text>
          <Text style={styles.summarySecondary}>
            Lembretes: {reminderTimes.length}
          </Text>
        </ScreenCard>

        <ScreenCard
          title='Horários automáticos'
          subtitle='Distribuídos entre 08:00 e 22:00.'
        >
          {reminderTimes.map((time) => (
            <Text key={time} style={styles.timeItem}>
              {time}
            </Text>
          ))}
        </ScreenCard>

        <ActionButton label='Salvar configuração' onPress={handleSave} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  options: {
    gap: 10,
    marginBottom: 8,
  },
  summary: {
    color: '#0b2840',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 6,
  },
  summarySecondary: {
    color: '#4f6474',
    fontSize: 14,
    marginBottom: 4,
  },
  timeItem: {
    paddingVertical: 8,
    color: '#0b2840',
    fontSize: 16,
    fontWeight: '700',
  },
});
