import * as Notifications from 'expo-notifications';

import { getRandomReminderMessage } from '../utils/messages';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
} catch {
  // Expo Go can expose partial notifications support; keep the app booting.
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();

    if (
      current.granted ||
      current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      return true;
    }

    const result = await Notifications.requestPermissionsAsync();
    return result.granted;
  } catch {
    return false;
  }
}

export async function cancelScheduledNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    return;
  }
}

export async function scheduleDailyHydrationReminders(
  times: string[],
): Promise<void> {
  try {
    await cancelScheduledNotifications();

    for (const time of times) {
      const [hour, minute] = time.split(':').map(Number);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hora de beber água',
          body: getRandomReminderMessage(),
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute,
          repeats: true,
        },
      });
    }
  } catch {
    return;
  }
}
