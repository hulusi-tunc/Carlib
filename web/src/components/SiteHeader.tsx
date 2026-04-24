"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n";

/**
 * Site header with a smooth shrink-on-scroll "floating pill" transition.
 *
 * The header is a single persistent element that morphs between two states
 * instead of cross-fading two different elements. That keeps the transition
 * continuous — every property (height, width, corner radius, padding,
 * background, shadow, backdrop blur) eases at the same time, so the header
 * feels like it's *settling* into the pill shape rather than snapping to it.
 *
 * The binary `floating` toggle fires at a small scroll threshold, and the
 * long `ease-out-expo`-style curve + 500ms duration + subtle inner scale
 * nudge give it the soft, "breathing" arrival the hero deserves. We also
 * cross-fade the CTA label so the copy swap doesn't read as a hard cut.
 */
export function SiteHeader() {
  const t = useT();
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full pt-[env(safe-area-inset-top)]"
      data-floating={floating}
    >
      {/* Morphing container. mx-auto centers it when it shrinks below the
          page max-width; the transition list covers every property that
          changes between the two states so nothing animates in isolation. */}
      <div
        className={cn(
          "relative mx-auto flex items-center justify-between",
          "will-change-[max-width,height,padding,border-radius,background-color,box-shadow,backdrop-filter,margin-top,transform]",
          "motion-safe:transition-[max-width,height,padding,border-radius,background-color,box-shadow,backdrop-filter,margin-top,transform]",
          "motion-safe:duration-[520ms]",
          // Apple-ish ease-out-expo — settles without overshoot.
          "motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
          floating
            // 24px mobile / 80px desktop — generous gap so the pill clearly
            // reads as "floating above" rather than "clipped to" the top.
            ? "mt-6 sm:mt-20 h-11 sm:h-12 max-w-[min(880px,calc(100%-1.5rem))] sm:max-w-[min(880px,calc(100%-2rem))] rounded-full pl-3.5 pr-1.5 sm:pl-4 bg-white/85 backdrop-blur-md shadow-[0_18px_40px_-20px_rgba(15,15,15,0.35)] ring-1 ring-border/70 scale-100"
            // A whisper of scale while resting — so when the pill arrives
            // it reads as a gentle settle-down rather than a zoom. On mobile
            // we keep a bit of top breathing so the logo never butts up
            // against the status-bar / viewport edge.
            : "mt-3 sm:mt-0 h-16 sm:h-20 max-w-6xl rounded-none px-5 sm:px-6 bg-transparent backdrop-blur-0 shadow-none ring-0 ring-transparent scale-[1.005]"
        )}
      >
        <Logo floating={floating} />
        <Nav floating={floating} className="absolute left-1/2 -translate-x-1/2" />
        <MorphingCta floating={floating} full={t.nav.ctaFull} compact={t.nav.ctaCompact} />
      </div>
    </header>
  );
}

/* ─────────────────────────── Logo ─────────────────────────── */

function Logo({ floating }: { floating: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "relative inline-flex items-center font-medium tracking-tight leading-none",
        "motion-safe:transition-[font-size] motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        // 1.2× the previous sizes: rest goes 24 → 29, compact 22 → 26.
        floating ? "text-[26px]" : "text-[29px]"
      )}
    >
      <span className="text-ink">Car</span>
      <span className="text-brand-yellow">lib</span>
    </Link>
  );
}

/* ─────────────────────────── Nav ─────────────────────────── */

function Nav({
  floating,
  className,
}: {
  floating: boolean;
  className?: string;
}) {
  const t = useT();
  return (
    <nav
      className={cn(
        // Match the CTA's text treatment: `font-medium` + dark ink, same
        // 13/14px scale. Previously the links inherited a lighter, regular
        // weight (ink-secondary, 400) which read as washed-out next to the
        // solid-black button.
        "hidden items-center font-medium text-ink sm:flex",
        "motion-safe:transition-[gap,font-size] motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        floating ? "gap-5 text-[13px]" : "gap-8 text-sm",
        className
      )}
    >
      <a href="#problem" className="transition-colors hover:text-ink/60">
        {t.nav.problem}
      </a>
      <a href="#how-it-works" className="transition-colors hover:text-ink/60">
        {t.nav.howItWorks}
      </a>
      <a href="#shops" className="transition-colors hover:text-ink/60">
        {t.nav.shops}
      </a>
    </nav>
  );
}

/* ─────────────────────────── CTA ─────────────────────────── */

/**
 * Primary CTA that morphs its own size alongside the header and shows
 * whichever copy variant matches the current state — "I'm a body shop" at
 * rest, "I'm interested" when the header is floating. Rendering only the
 * active label (no stacked ghost) means the button width tracks the live
 * copy cleanly — which is what broke in the previous iteration where an
 * invisible sibling held the width of the longer label.
 */
function MorphingCta({
  floating,
  full,
  compact,
}: {
  floating: boolean;
  full: string;
  compact: string;
}) {
  return (
    <Link
      href="#get-started"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full font-medium bg-ink text-white whitespace-nowrap",
        "motion-safe:transition-[height,padding,font-size] motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:bg-ink/90 active:scale-[0.98]",
        floating ? "h-9 px-4 text-[13px]" : "h-11 px-5 text-sm"
      )}
    >
      {floating ? compact : full}
    </Link>
  );
}
