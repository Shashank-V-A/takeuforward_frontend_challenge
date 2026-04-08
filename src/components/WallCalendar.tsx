import { useState, useRef } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import calendarHero from "@/assets/calendar-hero.jpg";
import { ChevronLeft, ChevronRight, X, Plus, Calendar, Trash2 } from "lucide-react";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MONTH_HEROES: Record<number, { label: string }> = {
  0: { label: "January" },
  1: { label: "February" },
  2: { label: "March" },
  3: { label: "April" },
  4: { label: "May" },
  5: { label: "June" },
  6: { label: "July" },
  7: { label: "August" },
  8: { label: "September" },
  9: { label: "October" },
  10: { label: "November" },
  11: { label: "December" },
};

export default function WallCalendar() {
  const {
    year, month, monthName, calendarDays,
    range, handleDateClick, isInRange, isStart, isEnd, isToday,
    goToPrevMonth, goToNextMonth, goToToday,
    notes, addNote, removeNote,
  } = useCalendar();

  const [noteInput, setNoteInput] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const noteInputRef = useRef<HTMLInputElement>(null);

  const handleMonthChange = (dir: "prev" | "next") => {
    setFlipDirection(dir);
    setIsFlipping(true);
    setTimeout(() => {
      if (dir === "prev") goToPrevMonth();
      else goToNextMonth();
      setTimeout(() => setIsFlipping(false), 50);
    }, 300);
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[520px] mx-auto">
        {/* Spiral Binding */}
        <SpiralBinding />

        {/* Calendar Card */}
        <div
          className="bg-card rounded-b-lg overflow-hidden"
          style={{ boxShadow: "0 25px 60px -12px hsl(var(--calendar-shadow) / 0.25)" }}
        >
          {/* Hero Image Section */}
          <div className="relative overflow-hidden">
            <div
              className={`transition-all duration-300 ${
                isFlipping
                  ? flipDirection === "next"
                    ? "translate-y-[-100%] opacity-0"
                    : "translate-y-[100%] opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <img
                src={calendarHero}
                alt="Calendar hero"
                className="w-full h-[280px] md:h-[340px] object-cover"
                width={1920}
                height={1080}
              />
            </div>

            {/* Blue diagonal overlay with month/year */}
            <div className="absolute bottom-0 right-0 w-[55%] h-full pointer-events-none">
              <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                <polygon points="120,0 300,0 300,200 40,200" fill="hsl(var(--calendar-accent))" opacity="0.92" />
                <polygon points="100,200 130,0 120,0 40,200" fill="hsl(var(--calendar-accent))" opacity="0.5" />
              </svg>
              <div className="absolute bottom-0 right-0 p-6 md:p-8 text-right z-10">
                <p className="text-primary-foreground font-display font-bold text-3xl md:text-4xl leading-none">
                  {year}
                </p>
                <p className="text-primary-foreground font-display font-black text-2xl md:text-3xl tracking-wider mt-1">
                  {monthName}
                </p>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => handleMonthChange("prev")}
              className="absolute top-4 left-4 bg-card/80 hover:bg-card text-card-foreground rounded-full p-1.5 backdrop-blur-sm transition-colors z-20"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMonthChange("next")}
              className="absolute top-4 right-4 bg-card/80 hover:bg-card text-card-foreground rounded-full p-1.5 backdrop-blur-sm transition-colors z-20"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Section: Notes + Grid */}
          <div className="flex flex-col md:flex-row">
            {/* Notes Section */}
            <div className="w-full md:w-[35%] p-4 md:p-5 border-b md:border-b-0 md:border-r border-border">
              <h3 className="font-display font-semibold text-sm text-card-foreground mb-3">Notes</h3>

              {rangeLabel && (
                <p className="text-[11px] text-calendar-accent font-medium mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {rangeLabel}
                </p>
              )}

              <div className="flex gap-1.5 mb-3">
                <input
                  ref={noteInputRef}
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddNote()}
                  placeholder="Add a note..."
                  className="flex-1 text-xs bg-secondary border-none rounded px-2.5 py-1.5 text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  onClick={handleAddNote}
                  className="bg-primary text-primary-foreground rounded p-1.5 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0">
                {notes.length === 0 ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="border-b border-calendar-line h-5" />
                    ))}
                  </div>
                ) : (
                  <div className="max-h-[140px] overflow-y-auto space-y-0">
                    {notes.map(note => (
                      <div
                        key={note.id}
                        className="flex items-start justify-between gap-1 border-b border-calendar-line py-1.5 group"
                      >
                        <span className="text-[11px] text-card-foreground leading-tight flex-1">
                          {note.text}
                        </span>
                        <button
                          onClick={() => removeNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5 shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 p-4 md:p-5">
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
                      key={idx}
                      onClick={() => handleDateClick(item.date)}
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
                      `}
                    >
                      {item.day}
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
