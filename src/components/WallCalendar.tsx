import { useEffect, useMemo, useRef, useState } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { toDateKey } from "@/lib/calendar";
import { getHolidayForDate, type HolidayRegion } from "@/data/holidays";
import HeroSection from "@/components/calendar/HeroSection";
import NotesPanel from "@/components/calendar/NotesPanel";
import MonthControls from "@/components/calendar/MonthControls";
import januaryHero from "@/assets/calendar-hero-jan.png";
import februaryHero from "@/assets/calendar-hero-feb.png";
import marchHero from "@/assets/calendar-hero-mar.png";
import aprilHero from "@/assets/calendar-hero-apr.png";
import mayHero from "@/assets/calendar-hero-may.png";
import juneHero from "@/assets/calendar-hero-jun.png";
import julyHero from "@/assets/calendar-hero-jul.png";
import augustHero from "@/assets/calendar-hero-aug.png";
import septemberHero from "@/assets/calendar-hero-sep.png";
import octoberHero from "@/assets/calendar-hero-oct.png";
import novemberHero from "@/assets/calendar-hero-nov.png";
import decemberHero from "@/assets/calendar-hero-dec.png";
import bottomLogo from "@/assets/calendar-bottom-logo.png";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTH_STORY: Record<number, { chapter: string; quote: string; tint: string; season: "winter" | "spring" | "summer" | "autumn" }> = {
  0: { chapter: "Chapter: Summit Resolve", quote: "Every steep start shapes the year ahead.", tint: "rgba(16,34,58,0.22)", season: "winter" },
  1: { chapter: "Chapter: Frozen Horizon", quote: "Courage grows in cold, clear air.", tint: "rgba(18,54,95,0.18)", season: "winter" },
  2: { chapter: "Chapter: Valley Dawn", quote: "New trails appear when you keep moving.", tint: "rgba(34,88,118,0.14)", season: "spring" },
  3: { chapter: "Chapter: Trail Awakening", quote: "Step by step, the map becomes yours.", tint: "rgba(34,90,111,0.14)", season: "spring" },
  4: { chapter: "Chapter: Ridge Bond", quote: "Progress is stronger when shared.", tint: "rgba(79,98,108,0.16)", season: "spring" },
  5: { chapter: "Chapter: Long Light", quote: "Momentum favors those who keep pace.", tint: "rgba(80,88,72,0.15)", season: "summer" },
  6: { chapter: "Chapter: Wild Ascent", quote: "The climb tests you before it crowns you.", tint: "rgba(34,66,78,0.17)", season: "summer" },
  7: { chapter: "Chapter: Open Sky", quote: "The view expands with every brave choice.", tint: "rgba(24,70,110,0.16)", season: "summer" },
  8: { chapter: "Chapter: Storm Edge", quote: "Hold steady; weather always changes.", tint: "rgba(36,56,84,0.2)", season: "autumn" },
  9: { chapter: "Chapter: Dry Wind", quote: "Discipline turns distance into milestones.", tint: "rgba(64,58,46,0.18)", season: "autumn" },
  10: { chapter: "Chapter: Cloud Leap", quote: "Trust the leap; your footing follows.", tint: "rgba(43,73,106,0.18)", season: "autumn" },
  11: { chapter: "Chapter: Snow Crest", quote: "Finish strong, then rise again.", tint: "rgba(24,56,92,0.2)", season: "winter" },
};
const HERO_BY_MONTH: Record<number, string> = {
  0: januaryHero,   // January
  1: februaryHero,  // February
  2: marchHero,     // March
  3: aprilHero,     // April
  4: mayHero,       // May
  5: juneHero,      // June
  6: julyHero,      // July
  7: augustHero,    // August
  8: septemberHero, // September
  9: octoberHero,   // October
  10: novemberHero, // November
  11: decemberHero, // December
};

export default function WallCalendar({ initialDate }: { initialDate?: Date } = {}) {
  const {
    year, month, monthName, calendarDays,
    range, handleDateClick, isInRange, isStart, isEnd, isToday,
    goToPrevMonth, goToNextMonth, goToToday, setMonthYear, clearSelection,
    notesForSelectedDate, selectedDateKey, addNote, removeNote, getNoteCountForDate,
    eventsForSelectedDate, addEvent, addEventOnDate, removeEvent, getEventsForDate, activityStreak,
  } = useCalendar(initialDate);

  const [noteInput, setNoteInput] = useState("");
  const [eventInput, setEventInput] = useState("");
  const [flipPhase, setFlipPhase] = useState<"idle" | "out" | "in">("idle");
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [holidayRegion, setHolidayRegion] = useState<HolidayRegion>("none");
  const [realismMode, setRealismMode] = useState<"wall" | "desk">(() => {
    try {
      const saved = localStorage.getItem("calendar-realism");
      return saved === "desk" ? "desk" : "wall";
    } catch {
      return "wall";
    }
  });
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "ocean">(() => {
    try {
      const saved = localStorage.getItem("calendar-theme");
      if (saved === "dark" || saved === "ocean" || saved === "light") return saved;
    } catch {
      // ignore localStorage issues
    }
    return "light";
  });
  const noteInputRef = useRef<HTMLInputElement>(null);
  const eventInputRef = useRef<HTMLInputElement>(null);
  const dayButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const season = MONTH_STORY[month]?.season ?? "spring";
  const flipMs = season === "winter" ? 360 : season === "summer" ? 220 : season === "autumn" ? 300 : 260;

  const runFlipTransition = (dir: "prev" | "next", onMidFlip: () => void) => {
    if (flipPhase !== "idle") return;

    setFlipDirection(dir);
    setFlipPhase("out");
    setTimeout(() => {
      onMidFlip();
      setFlipPhase("in");
      setTimeout(() => setFlipPhase("idle"), flipMs);
    }, flipMs);
  };

  const handleMonthChange = (dir: "prev" | "next") => {
    runFlipTransition(dir, () => {
      if (dir === "prev") goToPrevMonth();
      else goToNextMonth();
    });
  };

  const handleMonthYearChange = (nextMonth: number, nextYear: number) => {
    if (nextMonth === month && nextYear === year) return;
    const currentIndex = year * 12 + month;
    const targetIndex = nextYear * 12 + nextMonth;
    const dir: "prev" | "next" = targetIndex > currentIndex ? "next" : "prev";

    runFlipTransition(dir, () => {
      setMonthYear(nextMonth, nextYear);
    });
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const text = noteInput.trim();
    const quickEventMatch = /(today|tomorrow|\b(?:mon|tue|wed|thu|fri|sat|sun)\b|\d{1,2}(:\d{2})?\s?(am|pm)?)/i.test(text);
    if (quickEventMatch) {
      let target = new Date();
      if (/tomorrow/i.test(text)) target.setDate(target.getDate() + 1);
      if (/today/i.test(text)) target = new Date();
      addEventOnDate(text, target);
      addNote(`Auto-log: ${text}`);
    } else {
      addNote(text);
    }
    setNoteInput("");
    noteInputRef.current?.focus();
  };
  const handleAddEvent = () => {
    if (!eventInput.trim()) return;
    addEvent(eventInput.trim());
    setEventInput("");
    eventInputRef.current?.focus();
  };

  const rangeLabel = range.start
    ? range.end
      ? `${range.start.toLocaleDateString()} — ${range.end.toLocaleDateString()}`
      : `${range.start.toLocaleDateString()} — Select end date`
    : null;

  const selectedDateLabel = useMemo(() => {
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    return new Date(y, m, d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }, [selectedDateKey]);

  // Month hero mapping (all years): Jan through Dec provided.
  const heroImageForMonth = useMemo(() => {
    return HERO_BY_MONTH[month];
  }, [month]);

  // Preload nearby month hero images to keep page flips smooth.
  useEffect(() => {
    const prevMonth = (month + 11) % 12;
    const nextMonth = (month + 1) % 12;
    const candidates = [prevMonth, nextMonth, month];

    candidates.forEach(m => {
      const src = HERO_BY_MONTH[m];
      if (!src) return;
      const img = new Image();
      img.src = src;
    });
  }, [month]);
  useEffect(() => {
    localStorage.setItem("calendar-realism", realismMode);
  }, [realismMode]);

  // Persist and apply theme to the document root.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.removeAttribute("data-theme");

    if (themeMode === "dark") root.classList.add("dark");
    if (themeMode === "ocean") root.setAttribute("data-theme", "ocean");

    localStorage.setItem("calendar-theme", themeMode);
  }, [themeMode]);

  // Global keyboard shortcuts (skip when typing in input/select/textarea).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleMonthChange("prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleMonthChange("next");
      } else if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        goToToday();
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        noteInputRef.current?.focus();
      } else if (e.key.toLowerCase() === "e") {
        e.preventDefault();
        eventInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToToday]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[520px] mx-auto">
        {/* Spiral Binding */}
        <SpiralBinding realismMode={realismMode} />

        {/* Calendar Card */}
        <div
          className={`relative bg-card rounded-b-lg overflow-hidden ${
            flipPhase === "out"
              ? flipDirection === "next"
                ? "calendar-flip-out-next"
                : "calendar-flip-out-prev"
              : flipPhase === "in"
                ? flipDirection === "next"
                  ? "calendar-flip-in-next"
                  : "calendar-flip-in-prev"
                : ""
          }`}
          data-realism={realismMode}
          style={{
            boxShadow:
              realismMode === "wall"
                ? "0 28px 64px -14px hsl(var(--calendar-shadow) / 0.28)"
                : "0 14px 30px -12px hsl(var(--calendar-shadow) / 0.18)",
            ["--flip-ms" as string]: `${flipMs}ms`,
          }}
        >
          <div
            className={`pointer-events-none absolute inset-0 z-30 ${
              flipPhase === "out"
                ? "calendar-lift-shadow-out"
                : flipPhase === "in"
                  ? "calendar-lift-shadow-in"
                  : ""
            }`}
            aria-hidden="true"
          />

          <div className="calendar-paper-texture pointer-events-none absolute inset-0 z-10" aria-hidden="true" />

          {/* Hero Image Section */}
          <HeroSection
            year={year}
            monthName={monthName}
            month={month}
            isFlipping={flipPhase !== "idle"}
            flipDirection={flipDirection}
            onPrevMonth={() => handleMonthChange("prev")}
            onNextMonth={() => handleMonthChange("next")}
            controlsDisabled={flipPhase !== "idle"}
            heroImageSrc={heroImageForMonth}
            chapterTitle={MONTH_STORY[month]?.chapter}
            monthQuote={MONTH_STORY[month]?.quote}
            tintColor={MONTH_STORY[month]?.tint}
          />

          {/* Bottom Section: Notes + Grid */}
          <div className="flex flex-col md:flex-row">
            {/* Notes Section */}
            <NotesPanel
              rangeLabel={rangeLabel}
              selectedDateLabel={selectedDateLabel}
              noteInput={noteInput}
              setNoteInput={setNoteInput}
              noteInputRef={noteInputRef}
              onAddNote={handleAddNote}
              notesForSelectedDate={notesForSelectedDate}
              removeNote={removeNote}
              eventInput={eventInput}
              setEventInput={setEventInput}
              eventInputRef={eventInputRef}
              onAddEvent={handleAddEvent}
              eventsForSelectedDate={eventsForSelectedDate}
              removeEvent={removeEvent}
              activityStreak={activityStreak}
            />

            {/* Calendar Grid */}
            <div className="flex-1 p-4 md:p-5">
              <MonthControls
                month={month}
                year={year}
                onMonthYearChange={handleMonthYearChange}
                onClearSelection={clearSelection}
                controlsDisabled={flipPhase !== "idle"}
                holidayRegion={holidayRegion}
                onHolidayRegionChange={setHolidayRegion}
                themeMode={themeMode}
                onThemeModeChange={setThemeMode}
                realismMode={realismMode}
                onRealismModeChange={setRealismMode}
              />

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map((day, i) => (
                  <div
                    key={day}
                    className={`text-center text-[11px] font-display font-bold ${
                      i >= 5 ? "text-calendar-weekend" : "text-card-foreground"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-y-1">
                {calendarDays.map((item, idx) => {
                  const dayOfWeek = idx % 7;
                  const isWeekend = dayOfWeek >= 5;
                  const start = isStart(item.date);
                  const end = isEnd(item.date);
                  const inRange = isInRange(item.date);
                  const today = isToday(item.date);
                  const holiday = getHolidayForDate(item.date, holidayRegion);
                  const events = getEventsForDate(item.date);

                  return (
                    <button
                      ref={el => {
                        dayButtonRefs.current[idx] = el;
                      }}
                      key={idx}
                      type="button"
                      data-testid={`day-${toDateKey(item.date)}`}
                      data-date-key={toDateKey(item.date)}
                      onClick={() => handleDateClick(item.date)}
                      onKeyDown={e => {
                        const move = (targetIdx: number) => dayButtonRefs.current[targetIdx]?.focus();
                        if (e.key === "ArrowRight" && idx < calendarDays.length - 1) {
                          e.preventDefault();
                          move(idx + 1);
                        } else if (e.key === "ArrowLeft" && idx > 0) {
                          e.preventDefault();
                          move(idx - 1);
                        } else if (e.key === "ArrowDown" && idx + 7 < calendarDays.length) {
                          e.preventDefault();
                          move(idx + 7);
                        } else if (e.key === "ArrowUp" && idx - 7 >= 0) {
                          e.preventDefault();
                          move(idx - 7);
                        } else if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDateClick(item.date);
                        }
                      }}
                      aria-label={item.date.toLocaleDateString(undefined, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      title={holiday ?? undefined}
                      aria-selected={start || end || inRange}
                      aria-current={today ? "date" : undefined}
                      className={`
                        relative h-8 md:h-9 flex items-center justify-center text-sm font-medium transition-all duration-150 cursor-pointer
                        ${!item.currentMonth ? "text-calendar-grey" : isWeekend ? "text-calendar-weekend" : "text-card-foreground"}
                        ${start || end ? "bg-primary text-primary-foreground rounded-full z-10 font-bold scale-110" : ""}
                        ${inRange ? "bg-calendar-accent-light" : ""}
                        ${inRange && !start && !end ? "rounded-none" : ""}
                        ${start && range.end ? "rounded-r-none rounded-l-full" : ""}
                        ${end ? "rounded-l-none rounded-r-full" : ""}
                        ${start && !range.end ? "rounded-full" : ""}
                        ${today && !start && !end ? "ring-2 ring-primary ring-offset-1 ring-offset-card rounded-full" : ""}
                        ${!start && !end && !inRange ? "hover:bg-secondary rounded-full" : ""}
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
                      `}
                    >
                      {item.day}
                      {events.length > 0 && item.currentMonth && (
                        <div className="absolute top-1 left-1 right-1 flex items-center gap-0.5 justify-center" aria-hidden="true">
                          {events.slice(0, 2).map(event => (
                            <span
                              key={event.id}
                              className={`h-1.5 rounded-full flex-1 max-w-[10px] ${
                                event.color === "orange"
                                  ? "bg-orange-500"
                                  : event.color === "green"
                                    ? "bg-emerald-500"
                                    : event.color === "purple"
                                      ? "bg-violet-500"
                                      : "bg-sky-500"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {holiday && item.currentMonth && (
                        <span
                          className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-500"
                          aria-hidden="true"
                        />
                      )}
                      {getNoteCountForDate(item.date) > 0 && item.currentMonth && (
                        <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Today button */}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={goToToday}
                  className="text-[11px] text-calendar-accent font-display font-semibold hover:underline transition-colors"
                >
                  Today
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                <img
                  src={bottomLogo}
                  alt="takeuforward logo"
                  className="h-5 md:h-6 w-auto object-contain object-right"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpiralBinding({ realismMode }: { realismMode: "wall" | "desk" }) {
  const spirals = Array.from({ length: 18 });
  return (
    <div
      className={`relative h-10 flex items-end justify-center gap-[6px] px-4 overflow-hidden ${
        realismMode === "wall" ? "calendar-sway" : ""
      }`}
    >
      {/* Wall nail + hanger */}
      {realismMode === "wall" && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20" aria-hidden="true">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/55 shadow-[0_1px_2px_rgba(0,0,0,0.35)] mx-auto" />
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-foreground/40 mx-auto -mt-[1px]" />
          </div>
          <div
            className="absolute top-[8px] left-1/2 -translate-x-1/2 w-9 h-5 border-2 border-foreground/35 rounded-b-full rounded-t-[2px]"
            style={{ borderTop: "none" }}
            aria-hidden="true"
          />
        </>
      )}

      {spirals.map((_, i) => (
        <div key={i} className="relative w-4 h-6 flex items-end justify-center">
          <div
            className="w-3 h-5 border-2 border-foreground/40 rounded-full"
            style={{ borderBottom: "none", clipPath: "inset(0 0 40% 0)" }}
          />
        </div>
      ))}
      {/* Wire line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/20" />
    </div>
  );
}
