"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n";
import { LanguageSelector } from "@/components/LanguageSelector";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the expand-down menu on Esc so keyboard users can dismiss it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full pt-[env(safe-area-inset-top)]"
      data-floating={floating}
    >
      {/* Morphing pill container. mx-auto centers it when it shrinks below
          the page max-width; the transition list covers every property
          that changes between the two states so nothing animates alone. */}
      <div
        className={cn(
          "relative mx-auto flex items-center justify-between",
          // Margin-top is intentionally NOT in this transition list. The
          // resting state has no top margin (header flush to page top);
          // floating has `sm:mt-20`. If margin animated over 520ms the pill
          // would slide UPWARD into the viewport edge mid-morph — which is
          // exactly the "touches the top" bug we kept chasing. Keeping the
          // margin change instant lets the pill snap to its float offset
          // the moment the threshold trips, while the shape/color/etc.
          // still ease into the pill form smoothly.
          "will-change-[max-width,height,padding,border-radius,background-color,box-shadow,backdrop-filter,transform]",
          "motion-safe:transition-[max-width,height,padding,border-radius,background-color,box-shadow,backdrop-filter,transform]",
          "motion-safe:duration-[520ms]",
          "motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
          // Arbitrary-value margins (`mt-[Npx]`) always land in the
          // generated CSS — no chance of a Tailwind JIT miss stranding
          // the pill at the top. Bumped the desktop gap to 120px so it
          // reads as unmistakably floating even on wide / tall displays.
          floating
            ? "mt-[40px] sm:mt-[150px] h-11 sm:h-12 max-w-[min(880px,calc(100%-1.5rem))] sm:max-w-[min(880px,calc(100%-2rem))] rounded-full pl-3.5 pr-1.5 sm:pl-4 bg-white/85 backdrop-blur-md shadow-[0_18px_40px_-20px_rgba(15,15,15,0.35)] ring-1 ring-border/70 scale-100"
            : "mt-3 sm:mt-0 h-16 sm:h-20 max-w-6xl rounded-none px-5 sm:px-6 bg-transparent backdrop-blur-0 shadow-none ring-0 ring-transparent scale-[1.005]"
        )}
      >
        <Logo floating={floating} />
        {/* Desktop-only absolute-centered nav. Hidden <sm — on mobile
            the hamburger + expand-down panel take its place. */}
        <Nav floating={floating} className="absolute left-1/2 -translate-x-1/2" />
        {/* Right-side group. Wrapping CTA + hamburger in one flex child
            means the pill's `justify-between` only has TWO flex children
            (Logo + group) and places them at the left/right edges — the
            CTA no longer gets pushed to the middle on mobile, where it
            used to be the only non-Logo flex sibling before the group. */}
        <div className="flex items-center gap-2">
          <MorphingCta
            floating={floating}
            full={t.nav.ctaFull}
            compact={t.nav.ctaCompact}
          />
          <HamburgerButton
            floating={floating}
            open={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          />
        </div>
      </div>

      {/* Expand-down panel — appears directly below the pill and matches
          the pill's horizontal alignment. Stays clipped to 0 height when
          closed so layout doesn't shift. */}
      <MobilePanel
        open={menuOpen}
        floating={floating}
        onClose={() => setMenuOpen(false)}
        ctaLabel={t.nav.ctaFull}
        links={[
          { href: "#problem", label: t.nav.problem },
          { href: "#how-it-works", label: t.nav.howItWorks },
          { href: "#shops", label: t.nav.shops },
        ]}
      />
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
  className,
}: {
  floating: boolean;
  full: string;
  compact: string;
  className?: string;
}) {
  return (
    <Link
      href="#get-started"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full font-medium bg-ink text-white whitespace-nowrap",
        "motion-safe:transition-[height,padding,font-size] motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:bg-ink/90 active:scale-[0.98]",
        floating ? "h-9 px-4 text-[13px]" : "h-11 px-5 text-sm",
        className
      )}
    >
      {/* Mobile always shows the compact label so the button fits next
          to the hamburger inside the pill. Desktop keeps the morphing
          behaviour — full label at rest, compact when floating. */}
      <span className="sm:hidden">{compact}</span>
      <span className="hidden sm:inline">{floating ? compact : full}</span>
    </Link>
  );
}

/* ─────────────────────────── Hamburger ─────────────────────────── */

/**
 * Mobile-only toggle. Sits in the pill where the desktop CTA would
 * normally be. The two-line icon crosses into an X when the panel is
 * open so the button reads as "close" without shifting in size.
 */
function HamburgerButton({
  floating,
  open,
  onClick,
}: {
  floating: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-ink text-white sm:hidden",
        "motion-safe:transition-[height,width,background-color] motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:bg-ink/90 active:scale-[0.96]",
        floating ? "h-9 w-9" : "h-11 w-11"
      )}
    >
      <span className="relative block h-4 w-5">
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-[4px] h-[1.8px] w-full rounded-full bg-current",
            "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-y-[5px] rotate-45" : "translate-y-0 rotate-0"
          )}
        />
        <span
          aria-hidden
          className={cn(
            "absolute left-0 bottom-[4px] h-[1.8px] w-full rounded-full bg-current",
            "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "-translate-y-[5px] -rotate-45" : "translate-y-0 rotate-0"
          )}
        />
      </span>
    </button>
  );
}

/* ─────────────────────────── Expand-down panel ─────────────────── */

/**
 * Mobile menu that grows straight down from the header pill instead of
 * sliding in from the side.
 *
 * Positioned `absolute` against the sticky <header> so the panel
 * overlays the page without pushing the hero down. Width + horizontal
 * inset track the pill's current state (resting full-width vs.
 * floating capsule) so the drop-down always reads as attached to the
 * header. A grid-rows `0fr → 1fr` trick animates the natural content
 * height without measuring it in JS.
 */
function MobilePanel({
  open,
  floating,
  onClose,
  links,
  ctaLabel,
}: {
  open: boolean;
  floating: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  ctaLabel: string;
}) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        // Absolute relative to the sticky <header> so the panel floats
        // over the page without growing the header's flow height. `mt-2`
        // is the 8px gap between pill and panel — lives on the outer
        // wrapper, NOT inside the clip container, so it doesn't eat the
        // card's rounded corners. Width mirrors the pill's extent.
        "absolute left-0 right-0 top-full z-40 mx-auto mt-2 sm:hidden",
        "motion-safe:transition-[max-width,padding,grid-template-rows,opacity] motion-safe:duration-[320ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        floating
          ? "max-w-[min(880px,calc(100%-1.5rem))] px-0"
          : "max-w-6xl px-5",
        "grid",
        open
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0 pointer-events-none"
      )}
    >
      {/*
        Single element that carries BOTH the card's visuals (rounded
        corners, white fill, ring, shadow) AND the `overflow-hidden`
        needed for the grid-rows animation to clip content during the
        open/close transition. `overflow: hidden` only clips children —
        the element's own box-shadow renders outside its box, so the
        drop shadow no longer gets chopped off at the bottom.
      */}
      <div
        className={cn(
          "overflow-hidden rounded-3xl bg-white",
          "ring-1 ring-border/70 shadow-[0_18px_40px_-20px_rgba(15,15,15,0.35)]",
          "motion-safe:transition-transform motion-safe:duration-[320ms] motion-safe:ease-out",
          open ? "translate-y-0" : "-translate-y-1"
        )}
      >
        <div className="p-5">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-tile"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-4 border-t border-border/60 pt-4">
            <Link
              href="#get-started"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-white hover:bg-ink/90 active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
            <div className="flex items-center justify-center">
              <LanguageSelector variant="light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
