export function isNewYear(date: Date): boolean {
  const year = date.getFullYear();

  const start = new Date(year, 11, 15); // 15 Dec
  const end = new Date(year + 1, 0, 15); // 15 Jan

  // если январь — сравниваем с предыдущим декабрём
  if (date.getMonth() === 0) {
    const prevStart = new Date(year - 1, 11, 15);
    const prevEnd = new Date(year, 0, 15);
    return date >= prevStart && date <= prevEnd;
  }

  return date >= start && date <= end;
}
