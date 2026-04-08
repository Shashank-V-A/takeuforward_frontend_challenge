# takeuforward Journey Calendar

A themed wall-calendar web app built as a frontend engineering challenge.  
The idea behind this project is simple: make a calendar that feels less like a form and more like a product experience.

It includes month-wise hero visuals, realistic page-flip transitions, expedition-style logs/events, keyboard-first navigation, holiday overlays, and persistent local data.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- Vitest + React Testing Library
- localStorage for client-side persistence

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in terminal (usually http://localhost:8080 or next available port).

Useful commands:

```bash
npm test
npm run build
npm run lint
```

## Architecture / project structure

Main UI flow:

- src/components/WallCalendar.tsx
  - Orchestrates calendar state + UI composition.
  - Handles month flips, shortcuts, holiday mode, and theme/realism settings.

Feature components:

- src/components/calendar/HeroSection.tsx
  - Month hero image + chapter/motto + animated overlays.
- src/components/calendar/MonthControls.tsx
  - Month/year selectors, theme toggle, holiday toggle, realism mode.
- src/components/calendar/NotesPanel.tsx
  - Notes + events panel styled as expedition logs.

Logic + data:

- src/hooks/useCalendar.ts
  - Calendar state, notes/events CRUD, day selection, streak logic.
- src/lib/calendar.ts
  - Pure calendar grid utility (42-cell, Monday-first layout).
- src/data/holidays.ts
  - Optional India/global holiday mapping.

Testing:

- src/test/calendar.test.ts
  - Unit tests for date-grid utility.
- src/test/WallCalendar.test.tsx
  - Interaction tests for month switching, notes flow, and a11y behavior.

## Creative work added in this project

- **Journey Calendar storytelling**
  - Each month is treated as a “chapter” with its own hero image.
  - Added month-level chapter line + one-line quote/motto.

- **Cinematic month transitions**
  - 3D page-flip effect with shadow lift.
  - Seasonal flip pacing (winter slower, summer faster) for subtle mood differences.
  - Hero-image parallax on hover and ambient tint overlay.

- **Narrative event system**
  - Event types: `Trail`, `Milestone`, `Rest`, `Challenge`.
  - Auto-categorization based on text keywords.
  - Day-level event chips + legend.

- **Holiday layer**
  - Toggle: Off / India / Global.
  - Subtle holiday marker + hover label.

- **Wall realism + personalization**
  - Wall/Desk mode toggle.
  - Nail-and-binding visual treatment, slight sway in wall mode, softer desk mode.
  - Theme options: Light, Dark, Ocean.

- **Smart interactions**
  - Quick-add parsing (phrases like “today”, “tomorrow”, “6pm”).
  - Keyboard shortcuts (←, →, T, N, E).
  - Activity streak indicator.

## About me

I’m Shashank, a pre final year b.tech student who enjoys turning plain UI problems into polished user experiences.  
This project reflects how I approach frontend work:

- start with solid structure and reusable components,
- then focus on UX details, accessibility, and performance,
- and finally ship with tests and clear documentation.

I’m currently building projects like this to grow into a strong product-oriented software engineer.
