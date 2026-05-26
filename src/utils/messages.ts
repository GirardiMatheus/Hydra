const MESSAGES = [
  'Ei campeão, teu rim pediu água 😂',
  'Hora da aguinha senão vira uva passa',
  'Seu corpo tá em 70% água e 30% teimosia',
  'Beba água imediatamente ou o relatório do xixi ficará comprometido 🚨',
  'A hidratação chamou. Ela não vai esperar para sempre.',
  'Um gole agora vale um sorriso depois.',
];

const COMPLETION_MESSAGES = [
  'Você oficialmente desbloqueou o modo peixe 🐟',
  'Seus rins estão orgulhosos',
  'Parabéns, hidratado e belo',
  'Meta batida. O corpo agradece e o xixi celebra.',
];

const MOTIVATIONAL_MESSAGES = [
  'Hoje você está mais perto do tanque cheio.',
  'Seu corpo gosta de água. Surpreendente, eu sei.',
  'Beber água é um superpoder suspeitamente barato.',
  'Cada gole ajuda mais do que parece.',
];

export function getRandomReminderMessage(): string {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

export function getRandomCompletionMessage(): string {
  return COMPLETION_MESSAGES[
    Math.floor(Math.random() * COMPLETION_MESSAGES.length)
  ];
}

export function getRandomMotivationalMessage(): string {
  return MOTIVATIONAL_MESSAGES[
    Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
  ];
}
