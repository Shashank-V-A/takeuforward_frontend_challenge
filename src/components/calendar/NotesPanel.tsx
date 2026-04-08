import { Dispatch, SetStateAction, RefObject } from "react";
import { Calendar, Trash2 } from "lucide-react";

import type { CalendarEvent, CalendarNote } from "@/hooks/useCalendar";

export default function NotesPanel(props: {
  rangeLabel: string | null;
  selectedDateLabel: string;
  noteInput: string;
  setNoteInput: Dispatch<SetStateAction<string>>;
  noteInputRef: RefObject<HTMLInputElement>;
  onAddNote: () => void;
  notesForSelectedDate: CalendarNote[];
  removeNote: (id: string) => void;
  eventInput: string;
  setEventInput: Dispatch<SetStateAction<string>>;
  eventInputRef: RefObject<HTMLInputElement>;
  onAddEvent: () => void;
  eventsForSelectedDate: CalendarEvent[];
  removeEvent: (id: string) => void;
  activityStreak: number;
}) {
  const {
    rangeLabel,
    selectedDateLabel,
    noteInput,
    setNoteInput,
    noteInputRef,
    onAddNote,
    notesForSelectedDate,
    removeNote,
    eventInput,
    setEventInput,
    eventInputRef,
    onAddEvent,
    eventsForSelectedDate,
    removeEvent,
    activityStreak,
  } = props;

  return (
    <div className="w-full md:w-[35%] p-4 md:p-5 border-b md:border-b-0 md:border-r border-border">
      <h3 className="font-display font-semibold text-sm text-card-foreground mb-2">Expedition Log</h3>
      <p className="text-[11px] text-muted-foreground mb-2">
        Streak: <span className="font-semibold text-card-foreground">{activityStreak} day{activityStreak === 1 ? "" : "s"}</span>
      </p>

      {rangeLabel && (
        <p className="text-[11px] text-calendar-accent font-medium mb-2 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {rangeLabel}
        </p>
      )}

      <p className="text-[11px] text-muted-foreground mb-2">Notes for {selectedDateLabel}</p>

      <div className="mb-3">
        <input
          ref={noteInputRef}
          value={noteInput}
          onChange={e => setNoteInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onAddNote()}
          placeholder="Add a note..."
          className="w-full text-xs bg-secondary border-none rounded px-2.5 py-1.5 text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        />
      </div>

      <div className="mb-3">
        <input
          ref={eventInputRef}
          value={eventInput}
          onChange={e => setEventInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onAddEvent()}
          placeholder="Quick add event (E)..."
          className="w-full text-xs bg-secondary border-none rounded px-2.5 py-1.5 text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        />
      </div>

      <div className="mb-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" />🥾 Trail</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" />🏁 Milestone</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />🌙 Rest</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" />⛰️ Challenge</span>
      </div>

      {eventsForSelectedDate.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {eventsForSelectedDate.map(event => (
            <div key={event.id} className="flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`w-2 h-2 rounded-full ${eventColorClass(event.color)}`} aria-hidden="true" />
                <span className="truncate">{eventIcon(event.type)} {eventLabel(event.type)}: {event.title}</span>
              </div>
              <button
                onClick={() => removeEvent(event.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-0.5 shrink-0 rounded"
                aria-label={`Remove event ${event.title}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-0">
        {notesForSelectedDate.length === 0 ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-calendar-line h-5" />
            ))}
          </div>
        ) : (
          <div className="max-h-[140px] overflow-y-auto space-y-0">
            {notesForSelectedDate.map(note => (
              <div
                key={note.id}
                className="flex items-start justify-between gap-1 border-b border-calendar-line py-1.5 group"
              >
                <span className="text-[11px] text-card-foreground leading-tight flex-1">
                  {note.text}
                </span>
                <button
                  onClick={() => removeNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function eventColorClass(color: CalendarEvent["color"]) {
  if (color === "orange") return "bg-orange-500";
  if (color === "green") return "bg-emerald-500";
  if (color === "purple") return "bg-violet-500";
  return "bg-sky-500";
}

function eventLabel(type: CalendarEvent["type"]) {
  if (type === "milestone") return "Milestone";
  if (type === "rest") return "Rest";
  if (type === "challenge") return "Challenge";
  return "Trail";
}

function eventIcon(type: CalendarEvent["type"]) {
  if (type === "milestone") return "🏁";
  if (type === "rest") return "🌙";
  if (type === "challenge") return "⛰️";
  return "🥾";
}

