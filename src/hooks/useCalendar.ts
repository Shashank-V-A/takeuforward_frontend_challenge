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

export interface CalendarEvent {
  id: string;
  title: string;
  type: "trail" | "milestone" | "rest" | "challenge";
  color: "blue" | "orange" | "green" | "purple";
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
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem("calendar-events");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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
  const saveEvents = useCallback((updated: CalendarEvent[]) => {
    setEvents(updated);
    localStorage.setItem("calendar-events", JSON.stringify(updated));
  }, []);

  const selectedDateKey = useMemo(() => {
    if (range.start) return toDateKey(range.start);
    return toDateKey(currentDate);
  }, [currentDate, range.start]);

  const addNote = useCallback((text: string) => {
    const note: CalendarNote = { id: Date.now().toString(), text, dateKey: selectedDateKey };
    saveNotes([...notes, note]);
  }, [notes, saveNotes, selectedDateKey]);
  const addEvent = useCallback((title: string) => {
    const classifyEventType = (value: string): CalendarEvent["type"] => {
      const text = value.toLowerCase();
      if (/(rest|break|sleep|recover|off day)/.test(text)) return "rest";
      if (/(deadline|launch|submit|milestone|demo|interview|exam)/.test(text)) return "milestone";
      if (/(hard|challenge|climb|storm|sprint|push|urgent)/.test(text)) return "challenge";
      return "trail";
    };

    const palette: CalendarEvent["color"][] = ["blue", "orange", "green", "purple"];
    const sameDayEvents = events.filter(event => event.dateKey === selectedDateKey);
    const color = palette[sameDayEvents.length % palette.length];
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title,
      type: classifyEventType(title),
      color,
      dateKey: selectedDateKey,
    };
    saveEvents([...events, event]);
  }, [events, saveEvents, selectedDateKey]);

  const addEventOnDate = useCallback((title: string, date: Date) => {
    const classifyEventType = (value: string): CalendarEvent["type"] => {
      const text = value.toLowerCase();
      if (/(rest|break|sleep|recover|off day)/.test(text)) return "rest";
      if (/(deadline|launch|submit|milestone|demo|interview|exam)/.test(text)) return "milestone";
      if (/(hard|challenge|climb|storm|sprint|push|urgent)/.test(text)) return "challenge";
      return "trail";
    };
    const dateKey = toDateKey(date);
    const palette: CalendarEvent["color"][] = ["blue", "orange", "green", "purple"];
    const sameDayEvents = events.filter(event => event.dateKey === dateKey);
    const color = palette[sameDayEvents.length % palette.length];
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title,
      type: classifyEventType(title),
      color,
      dateKey,
    };
    saveEvents([...events, event]);
  }, [events, saveEvents]);

  const removeNote = useCallback((id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  }, [notes, saveNotes]);
  const removeEvent = useCallback((id: string) => {
    saveEvents(events.filter(e => e.id !== id));
  }, [events, saveEvents]);

  const notesForSelectedDate = useMemo(
    () => notes.filter(note => note.dateKey === selectedDateKey),
    [notes, selectedDateKey],
  );
  const eventsForSelectedDate = useMemo(
    () => events.filter(event => event.dateKey === selectedDateKey),
    [events, selectedDateKey],
  );

  const getNoteCountForDate = useCallback(
    (date: Date) => notes.filter(note => note.dateKey === toDateKey(date)).length,
    [notes],
  );
  const getEventsForDate = useCallback(
    (date: Date) => events.filter(event => event.dateKey === toDateKey(date)),
    [events],
  );
  const getActivityCountForDate = useCallback(
    (date: Date) =>
      notes.filter(note => note.dateKey === toDateKey(date)).length +
      events.filter(event => event.dateKey === toDateKey(date)).length,
    [notes, events],
  );
  const activityStreak = useMemo(() => {
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const key = toDateKey(cursor);
      const hasActivity = notes.some(note => note.dateKey === key) || events.some(event => event.dateKey === key);
      if (!hasActivity) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }, [notes, events]);

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  return {
    year, month, monthName, calendarDays,
    range, handleDateClick, isInRange, isStart, isEnd, isToday,
    goToPrevMonth, goToNextMonth, goToToday, setMonthYear, clearSelection,
    notes, notesForSelectedDate, selectedDateKey, addNote, removeNote, getNoteCountForDate,
    events, eventsForSelectedDate, addEvent, addEventOnDate, removeEvent, getEventsForDate, getActivityCountForDate, activityStreak,
    currentDate,
  };
}
