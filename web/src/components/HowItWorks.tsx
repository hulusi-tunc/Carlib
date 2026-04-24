"use client";

import { cn } from "@/lib/cn";
import { Kicker } from "@/components/primitives";
import { useEffect, useRef, useState } from "react";

type Step = {
  n: string;
  title: string;
  body: string;
  badge: string;
};

// Five-step driver flow from the PRD + the iOS app's ClaimStatus pipeline
// (submitted → matched → accepted → repairing → completed). Badge tones
// reuse the status colors defined in Carlib/DesignSystem so the web-to-app
// visual language stays consistent.
const steps: Step[] = [
  {
    n: "01",
    title: "Declare the accident.",
    body:
      "A guided four-step flow captures accident type, vehicle info, and damage photos. A couple of minutes from the side of the road — one tap to submit.",
    badge: "bg-status-submitted/15 text-status-submitted",
  },
  {
    n: "02",
    title: "Match with a shop.",
    body:
      "Browse vetted carrossiers on the map. Filter by specialty and slot, then tap to send them your file — photos and vehicle info already attached.",
    badge: "bg-status-matched/15 text-status-matched",
  },
  {
    n: "03",
    title: "Book a drop-off.",
    body:
      "Pick a slot that works on the shop's calendar. Instant confirmation, a reminder the day before, and directions to the carrosserie.",
    badge: "bg-status-accepted/15 text-status-accepted",
  },
  {
    n: "04",
    title: "Track the repair.",
    body:
      "Diagnostic, parts, repair, quality check — every update the shop makes lands as a push notification, with the photos they added along the way.",
    badge: "bg-status-repairing/15 text-status-repairing",
  },
  {
    n: "05",
    title: "Pick up the keys.",
    body:
      "Ready-for-pickup push lands the moment QC signs off. Swing by the shop, sign the handover, drive home.",
    badge: "bg-status-completed/15 text-status-completed",
  },
];

/**
 * Scroll-linked "How it works" timeline. Steps alternate left/right around a
 * vertical spine in the middle. A yellow progress line grows down the spine
 * as the user scrolls, and the step closest to the viewport center lifts to
 * full opacity while the others dim — echoing the Air.inc reference the
 * client sent, tuned to Carlib's type + status palette.
 */
export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [active, setActive] = useState(0);
  // Yellow indicator is sized to match the active step's content block and
  // slides down the spine to track it. Stored as offsets in px so the div
  // can animate both top + height smoothly.
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  useEffect(() => {
    let raf = 0;
    function update() {
      const list = listRef.current;
      if (!list) return;
      const listRect = list.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = vh / 2;

      // Active step — whichever item's vertical center is closest to the
      // viewport center. Gives a "scrollspy" feel without IntersectionObserver
      // thresholds, which are awkward for items taller than the viewport.
      let bestIdx = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        const r = item.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      setActive(bestIdx);

      // Resize the indicator to match the active item and position it at
      // the item's top — so the yellow segment is always exactly as tall
      // as the "badge + title + body" block of the currently-focused step.
      const activeItem = itemRefs.current[bestIdx];
      if (activeItem) {
        const itemRect = activeItem.getBoundingClientRect();
        setIndicator({
          top: itemRect.top - listRect.top,
          height: itemRect.height,
        });
      }
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative bg-screen py-24 text-ink sm:py-32"
    >
      {/* Intro */}
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Kicker className="mb-5 justify-center">How it works</Kicker>
        <h2 className="font-medium text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-[56px]">
          Five steps from the bump
          <br />
          to the keys back in your hand.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary">
          Every stage of a carrosserie claim, guided from your phone — no
          forms, no phone tag, no chasing an update.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative mx-auto mt-20 max-w-5xl px-6 sm:mt-28">
        {/* Base spine — thin dimmed line straight down the middle. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 bottom-0 hidden w-[2px] -translate-x-1/2 rounded-full bg-border/60 md:block"
        />

        <ol
          ref={listRef}
          className="relative flex flex-col gap-20 sm:gap-28 md:gap-36"
        >
          {/* Yellow indicator — fixed-length segment whose height matches
              the active step's content block. Slides along the spine as
              scroll flips which step is active. Lives inside the <ol> so
              its `top` is relative to the list's own coordinate system. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 hidden w-[3px] -translate-x-1/2 rounded-full bg-brand-yellow shadow-[0_0_14px_rgba(245,183,0,0.5)] transition-[top,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:block"
            style={{
              top: `${indicator.top}px`,
              height: `${indicator.height}px`,
            }}
          />
          {steps.map((step, i) => {
            const onRight = i % 2 === 1;
            const isActive = i === active;
            return (
              <li
                key={step.n}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={cn(
                  "md:grid md:grid-cols-2 md:gap-16",
                  "transition-opacity duration-500 ease-out",
                  isActive ? "opacity-100" : "opacity-30"
                )}
              >
                <div
                  className={cn(
                    "max-w-lg",
                    onRight ? "md:col-start-2" : "md:col-start-1"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]",
                      step.badge
                    )}
                  >
                    Step {step.n}
                  </span>
                  <h3 className="mt-5 font-medium text-3xl leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-[40px]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink-secondary">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
