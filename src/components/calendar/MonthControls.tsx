export default function MonthControls(props: {
  month: number;
  year: number;
  onMonthYearChange: (month: number, year: number) => void;
  onClearSelection: () => void;
  controlsDisabled?: boolean;
}) {
  const { month, year, onMonthYearChange, onClearSelection, controlsDisabled } = props;

  const MONTHS = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ] as const;

  const yearOptions = Array.from({ length: 11 }, (_, i) => (year - 5) + i);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <select
          value={month}
          onChange={e => onMonthYearChange(Number(e.target.value), year)}
          className="text-xs rounded border border-input bg-card px-2 py-1 font-display font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label="Select month"
          disabled={controlsDisabled}
        >
          {MONTHS.map((label, idx) => (
            <option key={label} value={idx}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={e => onMonthYearChange(month, Number(e.target.value))}
          className="text-xs rounded border border-input bg-card px-2 py-1 font-display font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label="Select year"
          disabled={controlsDisabled}
        >
          {yearOptions.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onClearSelection}
        className="text-[11px] text-muted-foreground font-display font-semibold hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
      >
        Clear selection
      </button>
    </div>
  );
}

