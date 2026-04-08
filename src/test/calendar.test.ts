import { describe, it, expect } from "vitest";
import { getCalendarDays, toDateKey } from "@/lib/calendar";

describe("calendar utils", () => {
  it("getCalendarDays returns 42 cells and correct current month count", () => {
    const year = 2026;
    const month = 3; // April

    const days = getCalendarDays(year, month);

    expect(days).toHaveLength(42);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentMonthCount = days.filter(d => d.currentMonth).length;
    expect(currentMonthCount).toBe(daysInMonth);
  });

  it("grid starts on Monday and ends on Sunday", () => {
    const year = 2026;
    const month = 3; // April

    const days = getCalendarDays(year, month);
    expect(days[0].date.getDay()).toBe(1); // Monday => 1 in JS
    expect(days[days.length - 1].date.getDay()).toBe(0); // Sunday => 0 in JS
  });

  it("toDateKey uses the expected stable format", () => {
    const d = new Date(2026, 3, 8);
    expect(toDateKey(d)).toBe("2026-3-8");
  });
});

