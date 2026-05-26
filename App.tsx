import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HydrationProvider, useHydration } from '@/hooks/useHydration';
import { AppStackParamList } from '@/types/navigation';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { DoseScreen } from '@/screens/DoseScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { LoadingScreen } from '@/screens/LoadingScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

function RootNavigator() {
  const { isReady, hasCompletedOnboarding } = useHydration();

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f4fbff' },
        animation: 'slide_from_right',
      }}
    >
      {!hasCompletedOnboarding ? (
        <Stack.Screen name='Onboarding' component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name='Dashboard' component={DashboardScreen} />
          <Stack.Screen name='Dose' component={DoseScreen} />
          <Stack.Screen name='History' component={HistoryScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HydrationProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </HydrationProvider>
    </SafeAreaProvider>
  );
}
