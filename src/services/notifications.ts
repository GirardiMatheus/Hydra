import * as Notifications from 'expo-notifications';

import { getRandomReminderMessage } from '@/utils/messages';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();

  if (
    current.granted ||
    current.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

export async function cancelScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailyHydrationReminders(
  times: string[],
): Promise<void> {
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
        hour,
        minute,
        repeats: true,
      },
    });
  }
}
