import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HydrationProvider, useHydration } from './src/hooks/useHydration';
import { AppStackParamList } from './src/types/navigation';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { DoseScreen } from './src/screens/DoseScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';

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
