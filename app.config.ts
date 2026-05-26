import type { ConfigContext, ExpoConfig } from 'expo/config';

const getBooleanEnv = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const appName = process.env.EXPO_PUBLIC_APP_NAME ?? 'Hydra';
  const appSlug = process.env.EXPO_PUBLIC_APP_SLUG ?? 'hydra';
  const appScheme = process.env.EXPO_PUBLIC_APP_SCHEME ?? 'hydra';
  const splashColor =
    process.env.EXPO_PUBLIC_SPLASH_BACKGROUND_COLOR ?? '#dff8ff';
  const androidIconBackgroundColor =
    process.env.EXPO_PUBLIC_ANDROID_ICON_BACKGROUND_COLOR ?? '#0b5fff';
  const supportsTablet = getBooleanEnv(
    process.env.EXPO_PUBLIC_IOS_SUPPORTS_TABLET,
    true,
  );

  return {
    ...config,
    name: appName,
    slug: appSlug,
    version: process.env.EXPO_PUBLIC_APP_VERSION ?? config.version ?? '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: appScheme,
    splash: {
      backgroundColor: splashColor,
    },
    ios: {
      ...config.ios,
      supportsTablet,
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundColor: '#ffffff',
        backgroundColor: androidIconBackgroundColor,
      },
    },
    plugins: ['expo-notifications'],
    extra: {
      ...config.extra,
      publicEnv: {
        appName,
        appSlug,
        appScheme,
        splashColor,
        androidIconBackgroundColor,
      },
    },
  };
};
