import { useMemo, useRef, useState } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { toDateKey } from "@/lib/calendar";
import HeroSection from "@/components/calendar/HeroSection";
import NotesPanel from "@/components/calendar/NotesPanel";
import MonthControls from "@/components/calendar/MonthControls";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function WallCalendar({ initialDate }: { initialDate?: Date } = {}) {
  const {
    year, month, monthName, calendarDays,
    range, handleDateClick, isInRange, isStart, isEnd, isToday,
    goToPrevMonth, goToNextMonth, goToToday, setMonthYear, clearSelection,
    notesForSelectedDate, selectedDateKey, addNote, removeNote, getNoteCountForDate,
  } = useCalendar(initialDate);

  const [noteInput, setNoteInput] = useState("");
  const [flipPhase, setFlipPhase] = useState<"idle" | "out" | "in">("idle");
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const noteInputRef = useRef<HTMLInputElement>(null);
  const dayButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleMonthChange = (dir: "prev" | "next") => {
    if (flipPhase !== "idle") return;

    setFlipDirection(dir);
    setFlipPhase("out");
    setTimeout(() => {
      if (dir === "prev") goToPrevMonth();
      else goToNextMonth();
      setFlipPhase("in");
      setTimeout(() => setFlipPhase("idle"), 280);
    }, 280);
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    addNote(noteInput.trim());
    setNoteInput("");
    noteInputRef.current?.focus();
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[520px] mx-auto">
        {/* Spiral Binding */}
        <SpiralBinding />

        {/* Calendar Card */}
        <div
          className={`bg-card rounded-b-lg overflow-hidden ${
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
          style={{ boxShadow: "0 25px 60px -12px hsl(var(--calendar-shadow) / 0.25)" }}
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

          {/* Hero Image Section */}
          <HeroSection
            year={year}
            monthName={monthName}
            isFlipping={flipPhase !== "idle"}
            flipDirection={flipDirection}
            onPrevMonth={() => handleMonthChange("prev")}
            onNextMonth={() => handleMonthChange("next")}
            controlsDisabled={flipPhase !== "idle"}
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
            />

            {/* Calendar Grid */}
            <div className="flex-1 p-4 md:p-5">
              <MonthControls
                month={month}
                year={year}
                onMonthYearChange={setMonthYear}
                onClearSelection={clearSelection}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpiralBinding() {
  const spirals = Array.from({ length: 18 });
  return (
    <div className="relative h-6 flex items-center justify-center gap-[6px] px-4 overflow-hidden">
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
