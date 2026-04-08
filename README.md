# takeuforward Calendar

This project is a “wall calendar” style UI challenge built with React + TypeScript. It includes month navigation, day selection, and per-date notes persisted in `localStorage`.

## Features

- Month / year picker (dropdowns) + previous/next navigation arrows.
- Date range selection (click-to-select start/end).
- Notes stored per date (not globally) with live filtering in the notes panel.
- Quick visual hint: a small dot indicator on calendar days that have notes.
- Keyboard & accessibility improvements:
  - Arrow-key navigation within the date grid.
  - `Enter` / `Space` selects the focused day.
  - `aria-live` announcements for month/year changes.
  - `aria-selected` / `aria-current` for date buttons.
  - Consistent `focus-visible` rings for keyboard users.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Vitest + React Testing Library

## Scripts

- Start dev server: `npm run dev`
- Run tests: `npm test`
- Build for production: `npm run build`
- Lint: `npm run lint`

## Implementation Notes

- `src/hooks/useCalendar.ts` holds the calendar state (current month, range selection, notes, localStorage persistence).
- `src/lib/calendar.ts` contains the pure utility for generating the 42-cell (6-week) Monday-based grid.
- UI is split into smaller components:
  - `src/components/calendar/HeroSection.tsx`
  - `src/components/calendar/NotesPanel.tsx`
  - `src/components/calendar/MonthControls.tsx`
- Tests:
  - `src/test/calendar.test.ts` validates the pure calendar grid generation
  - `src/test/WallCalendar.test.tsx` validates key user flows (month switching, adding notes, clearing selection, aria-live)
