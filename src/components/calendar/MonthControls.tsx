export default function MonthControls(props: {
  month: number;
  year: number;
  onMonthYearChange: (month: number, year: number) => void;
  onClearSelection: () => void;
  controlsDisabled?: boolean;
  holidayRegion?: "none" | "india" | "global";
  onHolidayRegionChange?: (region: "none" | "india" | "global") => void;
  themeMode?: "light" | "dark" | "ocean";
  onThemeModeChange?: (theme: "light" | "dark" | "ocean") => void;
  realismMode?: "wall" | "desk";
  onRealismModeChange?: (mode: "wall" | "desk") => void;
}) {
  const {
    month,
    year,
    onMonthYearChange,
    onClearSelection,
    controlsDisabled,
    holidayRegion = "none",
    onHolidayRegionChange,
    themeMode = "light",
    onThemeModeChange,
    realismMode = "wall",
    onRealismModeChange,
  } = props;

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
    <div className="mb-3 space-y-2">
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

        <button
          onClick={onClearSelection}
          className="text-[11px] text-muted-foreground font-display font-semibold hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
        >
          Clear selection
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={realismMode}
          onChange={e => onRealismModeChange?.(e.target.value as "wall" | "desk")}
          className="text-[11px] rounded border border-input bg-card px-2 py-1 font-display font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label="Calendar realism mode"
          disabled={controlsDisabled}
        >
          <option value="wall">Mode: Wall</option>
          <option value="desk">Mode: Desk</option>
        </select>
        <select
          value={themeMode}
          onChange={e => onThemeModeChange?.(e.target.value as "light" | "dark" | "ocean")}
          className="text-[11px] rounded border border-input bg-card px-2 py-1 font-display font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label="Theme"
          disabled={controlsDisabled}
        >
          <option value="light">Theme: Light</option>
          <option value="dark">Theme: Dark</option>
          <option value="ocean">Theme: Ocean</option>
        </select>
        <select
          value={holidayRegion}
          onChange={e => onHolidayRegionChange?.(e.target.value as "none" | "india" | "global")}
          className="text-[11px] rounded border border-input bg-card px-2 py-1 font-display font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label="Holiday layer"
          disabled={controlsDisabled}
        >
          <option value="none">Holidays: Off</option>
          <option value="india">Holidays: India</option>
          <option value="global">Holidays: Global</option>
        </select>
      </div>
    </div>
  );
}

