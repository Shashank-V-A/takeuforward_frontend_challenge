import { Dispatch, SetStateAction, RefObject } from "react";
import { Calendar, Trash2 } from "lucide-react";

import type { CalendarNote } from "@/hooks/useCalendar";

export default function NotesPanel(props: {
  rangeLabel: string | null;
  selectedDateLabel: string;
  noteInput: string;
  setNoteInput: Dispatch<SetStateAction<string>>;
  noteInputRef: RefObject<HTMLInputElement>;
  onAddNote: () => void;
  notesForSelectedDate: CalendarNote[];
  removeNote: (id: string) => void;
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
  } = props;

  return (
    <div className="w-full md:w-[35%] p-4 md:p-5 border-b md:border-b-0 md:border-r border-border">
      <h3 className="font-display font-semibold text-sm text-card-foreground mb-3">Notes</h3>

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

