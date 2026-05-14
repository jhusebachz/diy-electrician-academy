export function toLocalDateKey(date: Date, refreshHour: number): string {
  const local = new Date(date.getTime());
  if (local.getHours() < refreshHour) {
    local.setDate(local.getDate() - 1);
  }

  const year = local.getFullYear();
  const month = `${local.getMonth() + 1}`.padStart(2, '0');
  const day = `${local.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hasLearningDayAdvanced(lastRefreshDay: string, now: Date, refreshHour: number): boolean {
  return toLocalDateKey(now, refreshHour) !== lastRefreshDay;
}
