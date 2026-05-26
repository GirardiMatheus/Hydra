export function getTodayKey(referenceDate = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = `${referenceDate.getMonth() + 1}`.padStart(2, '0');
  const day = `${referenceDate.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDayPeriodGreeting(name: string): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return `Bom dia, ${name}`;
  }

  if (hour < 18) {
    return `Boa tarde, ${name}`;
  }

  return `Boa noite, ${name}`;
}
