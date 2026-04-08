export type HolidayRegion = "none" | "india" | "global";

type HolidayMap = Record<string, string>;

const INDIA_HOLIDAYS: HolidayMap = {
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "12-25": "Christmas Day",
  "11-01": "Diwali (approx.)",
  "03-14": "Holi (approx.)",
};

const GLOBAL_HOLIDAYS: HolidayMap = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "03-08": "International Women's Day",
  "05-01": "Labor Day",
  "10-31": "Halloween",
  "12-25": "Christmas Day",
};

export function getHolidayForDate(date: Date, region: HolidayRegion): string | null {
  if (region === "none") return null;
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const key = `${month}-${day}`;

  if (region === "india") return INDIA_HOLIDAYS[key] ?? null;
  return GLOBAL_HOLIDAYS[key] ?? null;
}

