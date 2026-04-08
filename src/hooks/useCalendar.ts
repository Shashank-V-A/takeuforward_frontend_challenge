import { useState, useCallback, useMemo } from "react";
import { getCalendarDays, toDateKey } from "@/lib/calendar";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarNote {
  id: string;
  text: string;
  dateKey: string;
}

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

  const calendarDays = useMemo(() => {
    return getCalendarDays(year, month);
  }, [year, month]);

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
  const setMonthYear = useCallback((nextMonth: number, nextYear: number) => {
    setCurrentDate(new Date(nextYear, nextMonth, 1));
  }, []);
  const clearSelection = useCallback(() => setRange({ start: null, end: null }), []);

  const saveNotes = useCallback((updated: CalendarNote[]) => {
    setNotes(updated);
    localStorage.setItem("calendar-notes", JSON.stringify(updated));
  }, []);

  const selectedDateKey = useMemo(() => {
    if (range.start) return toDateKey(range.start);
    return toDateKey(currentDate);
  }, [currentDate, range.start]);

  const addNote = useCallback((text: string) => {
    const note: CalendarNote = { id: Date.now().toString(), text, dateKey: selectedDateKey };
    saveNotes([...notes, note]);
  }, [notes, saveNotes, selectedDateKey]);

  const removeNote = useCallback((id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  }, [notes, saveNotes]);

  const notesForSelectedDate = useMemo(
    () => notes.filter(note => note.dateKey === selectedDateKey),
    [notes, selectedDateKey],
  );

  const getNoteCountForDate = useCallback(
    (date: Date) => notes.filter(note => note.dateKey === toDateKey(date)).length,
    [notes],
  );

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  return {
    year, month, monthName, calendarDays,
    range, handleDateClick, isInRange, isStart, isEnd, isToday,
    goToPrevMonth, goToNextMonth, goToToday, setMonthYear, clearSelection,
    notes, notesForSelectedDate, selectedDateKey, addNote, removeNote, getNoteCountForDate,
    currentDate,
  };
}
