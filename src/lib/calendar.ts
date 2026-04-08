export type CalendarDay = {
  day: number;
  currentMonth: boolean;
  date: Date;
};

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

// Monday-based calendar grid (7 columns x 6 rows = 42 cells).
export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Convert JS Sunday(0)..Saturday(6) to Monday(0)..Sunday(6).
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  // Previous month fill
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    days.push({ day: d, currentMonth: false, date: new Date(year, month - 1, d) });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, currentMonth: true, date: new Date(year, month, d) });
  }

  // Next month fill to 42 cells
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, currentMonth: false, date: new Date(year, month + 1, d) });
  }

  return days;
}

