import { useState, useCallback, useMemo } from "react";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarNote {
  id: string;
  text: string;
  date?: string; // ISO date string if attached to a date range
}

const MONTH_IMAGES: Record<number, string> = {};

export function useCalendar(initialDate?: Date) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<CalendarNote[]>(() => {
    try {
      const saved = localStorage.getItem("calendar-notes");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" }).toUpperCase();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: { day: number; currentMonth: boolean; date: Date }[] = [];
    // Previous month fill
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      days.push({ day: d, currentMonth: false, date: new Date(year, month - 1, d) });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, currentMonth: true, date: new Date(year, month, d) });
    }
    // Next month fill
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, currentMonth: false, date: new Date(year, month + 1, d) });
    }
    return days;
  }, [year, month, daysInMonth, firstDayOfWeek, prevMonthDays]);

  const handleDateClick = useCallback((date: Date) => {
    setRange(prev => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      }
      if (date < prev.start) {
        return { start: date, end: prev.start };
      }
      return { start: prev.start, end: date };
    });
  }, []);

  const isInRange = useCallback((date: Date) => {
    if (!range.start || !range.end) return false;
    return date > range.start && date < range.end;
  }, [range]);

  const isStart = useCallback((date: Date) => {
    return range.start?.toDateString() === date.toDateString();
  }, [range.start]);

  const isEnd = useCallback((date: Date) => {
    return range.end?.toDateString() === date.toDateString();
  }, [range.end]);

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const saveNotes = useCallback((updated: CalendarNote[]) => {
    setNotes(updated);
    localStorage.setItem("calendar-notes", JSON.stringify(updated));
  }, []);

  const addNote = useCallback((text: string) => {
    const rangeKey = range.start && range.end
      ? `${range.start.toISOString()}_${range.end.toISOString()}`
      : undefined;
    const note: CalendarNote = { id: Date.now().toString(), text, date: rangeKey };
    saveNotes([...notes, note]);
  }, [notes, range, saveNotes]);

  const removeNote = useCallback((id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  }, [notes, saveNotes]);

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  return {
    year, month, monthName, calendarDays,
    range, handleDateClick, isInRange, isStart, isEnd, isToday,
    goToPrevMonth, goToNextMonth, goToToday,
    notes, addNote, removeNote,
    currentDate,
  };
}
