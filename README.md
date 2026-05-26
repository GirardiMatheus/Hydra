# Hydra

Hydra é um app Expo em TypeScript para hidratação diária, com onboarding inicial, cálculo automático da meta de água, lembretes locais, persistência via AsyncStorage, dashboard animado e histórico local.

## Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Expo Notifications
- AsyncStorage
- React Native Reanimated

## Estrutura

```
/src
  /components
  /screens
  /services
  /hooks
  /utils
  /storage
  /types
```

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o projeto:

```bash
npm run start
```

3. Abra no dispositivo físico ou emulador com o Expo Go.

## Notificações

O app agenda notificações locais com `expo-notifications` e usa horários automáticos entre `08:00` e `22:00`.

Para testar:

1. Conceda permissão na primeira execução.
2. Complete o onboarding.
3. Ajuste um horário para poucos minutos à frente se quiser validar rapidamente a entrega local.

## Observações

- O plano diário é persistido localmente com AsyncStorage.
- O layout foi pensado para parecer um app real, com cards, gradientes e animação da garrafa.
- O áudio de gota ficou organizado em [assets/sounds/gota.mp3](assets/sounds/gota.mp3).
