import { Audio } from 'expo-av';

export async function playWaterDropSound(): Promise<void> {
  const { sound } = await Audio.Sound.createAsync(
    require('../../assets/sounds/gota.mp3'),
    { shouldPlay: true },
  );

  sound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isLoaded || status.isPlaying) {
      return;
    }

    void sound.unloadAsync();
  });
}
