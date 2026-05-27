import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '../components/ActionButton';
import { Bottle } from '../components/Bottle';
import { GradientBackground } from '../components/GradientBackground';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenCard } from '../components/ScreenCard';
import { useHydration } from '../hooks/useHydration';
import { AppStackParamList } from '../types/navigation';
import { getDayPeriodGreeting } from '../utils/date';
import { getRandomMotivationalMessage } from '../utils/messages';

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const {
    profile,
    goalMl,
    consumedMl,
    remainingMl,
    progressPercent,
    nextReminder,
    streak,
    history,
    completionMessage,
    registerWaterIntake,
  } = useHydration();

  const greeting = useMemo(
    () => getDayPeriodGreeting(profile?.name ?? 'amigo'),
    [profile?.name],
  );
  const motivationalMessage = useMemo(
    () => getRandomMotivationalMessage(),
    [history.length],
  );
  const displayHistory = history.slice(0, 7);

  return (
    <GradientBackground>
      <FlatList
        data={displayHistory}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.headerSubtitle}>
                  Seu plano diário está pronto para funcionar.
                </Text>
              </View>
              <View style={styles.streakBadge}>
                <View style={styles.streakBadgeDot} />
                <Text style={styles.streakText}>{streak} dias</Text>
              </View>
            </View>

            <ScreenCard style={styles.highlightCard}>
              <View style={styles.metaRow}>
                <View>
                  <Text style={styles.metaLabel}>Meta diária</Text>
                  <Text style={styles.metaValue}>{goalMl} ml</Text>
                  <Text style={styles.metaSubvalue}>
                    {(goalMl / 1000).toFixed(2)} litros
                  </Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>Próximo horário</Text>
                  <Text style={styles.metaValue}>
                    {nextReminder ?? '--:--'}
                  </Text>
                  <Text style={styles.metaSubvalue}>Lembrete automático</Text>
                </View>
              </View>
            </ScreenCard>

            <ScreenCard style={styles.bottleCard}>
              <Bottle progressPercent={progressPercent} />
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Quantidade ingerida</Text>
                <Text style={styles.progressValue}>{consumedMl} ml</Text>
                <Text style={styles.remainingText}>
                  {remainingMl} ml restantes
                </Text>
              </View>
              <ProgressBar
                progressPercent={progressPercent}
                label='Progresso do dia'
              />
              {completionMessage ? (
                <Text style={styles.completionMessage}>
                  {completionMessage}
                </Text>
              ) : (
                <Text style={styles.motivation}>{motivationalMessage}</Text>
              )}
            </ScreenCard>

            <View style={styles.actionsRow}>
              <ActionButton
                label='Bebi água'
                onPress={registerWaterIntake}
                style={styles.actionButton}
              />
              <ActionButton
                label='Ajustar dose'
                onPress={() => navigation.navigate('Dose')}
                variant='secondary'
                style={styles.actionButton}
              />
            </View>

            <ScreenCard
              title='Histórico do dia'
              subtitle='Resumo recente das últimas doses registradas.'
            >
              <View style={styles.historyHeader}>
                <Text style={styles.historyHeaderText}>Hoje</Text>
                <Text style={styles.historyHeaderText}>
                  {consumedMl} / {goalMl} ml
                </Text>
              </View>
            </ScreenCard>
          </>
        }
        renderItem={({ item }) => (
          <ScreenCard style={styles.historyItem}>
            <View style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Text style={styles.historyIconText}>H</Text>
              </View>
              <View style={styles.historyTextGroup}>
                <Text style={styles.historyTitle}>{item.date}</Text>
                <Text style={styles.historySubtitle}>
                  {item.completed ? 'Meta concluída' : 'Meta em andamento'}
                </Text>
              </View>
              <Text style={styles.historyAmount}>{item.consumedMl} ml</Text>
            </View>
          </ScreenCard>
        )}
        ListEmptyComponent={
          <ScreenCard style={styles.historyItem}>
            <Text style={styles.emptyText}>
              Ainda não há histórico suficiente. Comece pelo botão “Bebi água”.
            </Text>
          </ScreenCard>
        }
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 34,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  greeting: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    color: '#0b2840',
  },
  headerSubtitle: {
    marginTop: 6,
    color: '#506677',
    fontSize: 14,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 123, 47, 0.12)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  streakText: {
    color: '#d75f0d',
    fontWeight: '800',
  },
  streakBadgeDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#ff7b2f',
  },
  highlightCard: {
    gap: 0,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  metaLabel: {
    color: '#6a7c8b',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    fontWeight: '700',
  },
  metaValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0b2840',
  },
  metaSubvalue: {
    marginTop: 4,
    color: '#4f6474',
    fontSize: 13,
  },
  bottleCard: {
    alignItems: 'center',
    gap: 18,
  },
  progressInfo: {
    alignItems: 'center',
    gap: 3,
  },
  progressLabel: {
    color: '#5a6c7a',
    fontSize: 14,
    fontWeight: '700',
  },
  progressValue: {
    color: '#0b2840',
    fontSize: 30,
    fontWeight: '900',
  },
  remainingText: {
    color: '#4f6474',
    fontSize: 13,
  },
  completionMessage: {
    textAlign: 'center',
    color: '#0b5fff',
    fontWeight: '900',
    fontSize: 16,
  },
  motivation: {
    textAlign: 'center',
    color: '#244056',
    fontWeight: '700',
    fontSize: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyHeaderText: {
    color: '#244056',
    fontWeight: '800',
  },
  historyItem: {
    padding: 16,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,95,255,0.10)',
  },
  historyIconText: {
    color: '#0b5fff',
    fontWeight: '900',
    fontSize: 14,
  },
  historyTextGroup: {
    flex: 1,
  },
  historyTitle: {
    color: '#0b2840',
    fontWeight: '800',
    fontSize: 15,
  },
  historySubtitle: {
    color: '#5a6c7a',
    marginTop: 2,
    fontSize: 13,
  },
  historyAmount: {
    color: '#0b5fff',
    fontWeight: '900',
  },
  emptyText: {
    color: '#4f6474',
    fontSize: 14,
  },
});
