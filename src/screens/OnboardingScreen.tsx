import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '@/components/ActionButton';
import { GradientBackground } from '@/components/GradientBackground';
import { ScreenCard } from '@/components/ScreenCard';
import { AppStackParamList } from '@/types/navigation';
import {
  ActivityLevel,
  DoseOption,
  Gender,
  UserProfile,
} from '@/types/hydration';
import { buildHydrationPlan, getActivityLabel } from '@/utils/hydration';
import { useHydration } from '@/hooks/useHydration';

type Props = StackScreenProps<AppStackParamList, 'Onboarding'>;

const ACTIVITY_OPTIONS: ActivityLevel[] = [
  'sedentario',
  'weekly_1_2',
  'weekly_3_5',
  'daily',
];
const DOSE_OPTIONS: DoseOption[] = [200, 250, 300, 500];

export function OnboardingScreen({ navigation }: Props) {
  const { submitOnboarding } = useHydration();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    gender: 'outro',
    heightCm: '',
    weightKg: '',
    activityLevel: 'sedentario',
  });
  const [doseMl, setDoseMl] = useState<DoseOption>(300);

  const previewPlan = useMemo(() => {
    if (!profile.name || !profile.weightKg) {
      return null;
    }

    return buildHydrationPlan(profile, doseMl);
  }, [profile, doseMl]);

  const updateField = <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K],
  ) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleContinue = async () => {
    if (
      !profile.name ||
      !profile.age ||
      !profile.heightCm ||
      !profile.weightKg
    ) {
      Alert.alert(
        'Faltam dados',
        'Preencha nome, idade, altura e peso para continuar.',
      );
      return;
    }

    await submitOnboarding(profile, doseMl);
    navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>Hydra</Text>
          <Text style={styles.title}>
            Seu plano de hidratação começa agora.
          </Text>
          <Text style={styles.subtitle}>
            Complete seu perfil para calcular automaticamente a meta diária e
            organizar os lembretes.
          </Text>
        </View>

        <ScreenCard
          title='Cadastro inicial'
          subtitle='Informações básicas para montar a meta ideal.'
        >
          <View style={styles.inputsGrid}>
            <Field
              label='Nome'
              value={profile.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder='Ex: Marina'
            />
            <Field
              label='Idade'
              value={profile.age}
              onChangeText={(value) => updateField('age', value)}
              placeholder='Ex: 28'
              keyboardType='number-pad'
            />
            <Field
              label='Altura (cm)'
              value={profile.heightCm}
              onChangeText={(value) => updateField('heightCm', value)}
              placeholder='Ex: 172'
              keyboardType='number-pad'
            />
            <Field
              label='Peso (kg)'
              value={profile.weightKg}
              onChangeText={(value) => updateField('weightKg', value)}
              placeholder='Ex: 80'
              keyboardType='decimal-pad'
            />
          </View>

          <Text style={styles.sectionLabel}>Sexo</Text>
          <View style={styles.chipsRow}>
            {(['masculino', 'feminino', 'outro'] as Gender[]).map((gender) => (
              <ChoiceChip
                key={gender}
                selected={profile.gender === gender}
                label={genderLabel(gender)}
                onPress={() => updateField('gender', gender)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>
            Frequência de atividade física
          </Text>
          <View style={styles.optionList}>
            {ACTIVITY_OPTIONS.map((option) => (
              <ChoiceRow
                key={option}
                selected={profile.activityLevel === option}
                label={getActivityLabel(option)}
                onPress={() => updateField('activityLevel', option)}
              />
            ))}
          </View>
        </ScreenCard>

        <ScreenCard
          title='Dose preferida'
          subtitle='Depois do cálculo, o app usa esta medida para cada lembrete.'
        >
          <View style={styles.chipsRow}>
            {DOSE_OPTIONS.map((option) => (
              <ChoiceChip
                key={option}
                selected={doseMl === option}
                label={`${option} ml`}
                onPress={() => setDoseMl(option)}
              />
            ))}
          </View>
        </ScreenCard>

        {previewPlan ? (
          <ScreenCard
            title='Prévia da meta'
            subtitle='O app vai usar esta referência para montar os lembretes.'
          >
            <Text style={styles.previewText}>
              {previewPlan.goalMl} ml por dia
            </Text>
            <Text style={styles.previewTextSecondary}>
              {previewPlan.goalLiters} litros por dia
            </Text>
            <Text style={styles.previewHint}>
              {previewPlan.reminderTimes.length} lembretes distribuídos entre
              08:00 e 22:00.
            </Text>
          </ScreenCard>
        ) : null}

        <ActionButton label='Finalizar cadastro' onPress={handleContinue} />
      </ScrollView>
    </GradientBackground>
  );
}

function genderLabel(gender: Gender): string {
  switch (gender) {
    case 'masculino':
      return 'Masculino';
    case 'feminino':
      return 'Feminino';
    case 'outro':
      return 'Outro';
  }
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor='#8da3b4'
        style={styles.input}
      />
    </View>
  );
}

function ChoiceChip({
  selected,
  label,
  onPress,
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      variant={selected ? 'primary' : 'secondary'}
    />
  );
}

function ChoiceRow({
  selected,
  label,
  onPress,
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <ActionButton
      label={selected ? `✓ ${label}` : label}
      onPress={onPress}
      variant={selected ? 'primary' : 'secondary'}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 32,
  },
  hero: {
    gap: 8,
    paddingTop: 14,
    paddingBottom: 6,
  },
  kicker: {
    color: '#0b5fff',
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    color: '#0b2840',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4f6474',
  },
  inputsGrid: {
    gap: 14,
    marginBottom: 8,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#244056',
  },
  input: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#f6fbff',
    borderWidth: 1,
    borderColor: 'rgba(11,95,255,0.10)',
    paddingHorizontal: 16,
    color: '#0b2840',
    fontSize: 16,
  },
  sectionLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '800',
    color: '#244056',
    marginBottom: 10,
  },
  chipsRow: {
    gap: 10,
  },
  optionList: {
    gap: 10,
  },
  previewText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0b5fff',
  },
  previewTextSecondary: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
    color: '#0b2840',
  },
  previewHint: {
    marginTop: 6,
    fontSize: 14,
    color: '#4f6474',
  },
});
