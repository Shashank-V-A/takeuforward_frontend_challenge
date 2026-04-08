import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection(props: {
  year: number;
  monthName: string;
  month: number;
  isFlipping: boolean;
  flipDirection: "next" | "prev";
  onPrevMonth: () => void;
  onNextMonth: () => void;
  controlsDisabled?: boolean;
  heroImageSrc?: string;
}) {
  const { year, monthName, month, isFlipping, flipDirection, onPrevMonth, onNextMonth, controlsDisabled, heroImageSrc } = props;
  const monthTextSizeClass = getMonthTextSizeClass(monthName);

  return (
    <div className="relative overflow-hidden">
      <div
        className={`transition-all duration-300 ${
          isFlipping ? (flipDirection === "next" ? "translate-y-[-100%] opacity-0" : "translate-y-[100%] opacity-0") : "translate-y-0 opacity-100"
        }`}
      >
        {heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt={`${monthName} calendar hero`}
            className="w-full h-[280px] md:h-[340px] object-cover"
            width={1920}
            height={1080}
          />
        ) : (
          <div
            className="w-full h-[280px] md:h-[340px] bg-[linear-gradient(180deg,#c7cfdd_0%,#b2bece_100%)]"
            aria-label={`${monthName} background`}
            role="img"
          />
        )}
      </div>

      {/* Left sleek accent shape */}
      <div className="absolute bottom-0 left-0 w-[20%] h-[22%] pointer-events-none">
        <svg viewBox="0 0 180 120" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path d="M0,120 H170 L0,22 Z" fill="hsl(var(--calendar-accent))" opacity="0.82" />
        </svg>
      </div>

      {/* Right diagonal overlay */}
      <div className="absolute bottom-0 right-0 w-[44%] h-[72%] pointer-events-none">
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path d="M168,24 H300 V200 H35 Q98,148 168,24 Z" fill="hsl(var(--calendar-accent))" opacity="0.74" />
          <path d="M126,200 Q146,128 176,24 H168 Q98,148 35,200 Z" fill="hsl(var(--calendar-accent))" opacity="0.24" />
        </svg>
        <div className="absolute bottom-0 right-0 pr-4 pl-10 pb-5 md:pr-7 md:pl-14 md:pb-7 text-right z-10">
          <p className="text-primary-foreground font-display font-bold text-3xl md:text-4xl leading-none">
            {year}
          </p>
          <p
            className={`text-primary-foreground font-display font-black leading-none mt-1 uppercase ${monthTextSizeClass}`}
            style={{ maxWidth: "100%", whiteSpace: "nowrap" }}
          >
            {monthName}
          </p>
        </div>
      </div>

      {/* Live region for month/year announcements */}
      <div aria-live="polite" className="sr-only">
        {monthName} {year}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={onPrevMonth}
        className="absolute top-4 left-4 bg-card/80 hover:bg-card text-card-foreground rounded-full p-1.5 backdrop-blur-sm transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        aria-label="Previous month"
        type="button"
        disabled={controlsDisabled}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={onNextMonth}
        className="absolute top-4 right-4 bg-card/80 hover:bg-card text-card-foreground rounded-full p-1.5 backdrop-blur-sm transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        aria-label="Next month"
        type="button"
        disabled={controlsDisabled}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Hero gradient for better text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}

function getMonthTextSizeClass(monthName: string) {
  const length = monthName.length;
  if (length >= 9) return "text-[1.7rem] md:text-[2.15rem] tracking-wide";
  if (length >= 8) return "text-[1.85rem] md:text-[2.3rem] tracking-wide";
  return "text-2xl md:text-3xl tracking-wider";
}

