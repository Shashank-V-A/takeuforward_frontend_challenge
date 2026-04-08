import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WallCalendar from "@/components/WallCalendar";

describe("WallCalendar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders month/year and allows adding a note for a clicked date", () => {
    render(<WallCalendar initialDate={new Date(2026, 3, 8)} />);

    // Month header is present (both visible hero and sr-only aria-live region).
    expect(screen.getAllByText("APRIL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026").length).toBeGreaterThan(0);

    const dayBtn = screen.getByTestId("day-2026-3-15");
    fireEvent.click(dayBtn);

    const input = screen.getByPlaceholderText("Add a note...");
    fireEvent.change(input, { target: { value: "Test note" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(screen.getByText("Test note")).toBeInTheDocument();
  });

  it("clear selection removes notes from the previously selected date", () => {
    render(<WallCalendar initialDate={new Date(2026, 3, 8)} />);

    const dayBtn = screen.getByTestId("day-2026-3-15");
    fireEvent.click(dayBtn);

    const input = screen.getByPlaceholderText("Add a note...");
    fireEvent.change(input, { target: { value: "Test note" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(screen.getByText("Test note")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(screen.queryByText("Test note")).not.toBeInTheDocument();
  });

  it("month dropdown updates the hero month label", () => {
    render(<WallCalendar initialDate={new Date(2026, 3, 8)} />);

    const monthSelect = screen.getByLabelText("Select month");
    fireEvent.change(monthSelect, { target: { value: "4" } }); // MAY

    expect(screen.getAllByText("MAY").length).toBeGreaterThan(0);
  });

  it("exposes an aria-live region for month/year changes", () => {
    const { container } = render(<WallCalendar initialDate={new Date(2026, 3, 8)} />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toBeTruthy();
    expect(live?.textContent).toContain("APRIL");
    expect(live?.textContent).toContain("2026");
  });
});

