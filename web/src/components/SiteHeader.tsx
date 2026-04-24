"use client";

import { useEffect, useState } from "react";
import { PillButton } from "@/components/primitives";
import { cn } from "@/lib/cn";

/**
 * Site header with a shrink-on-scroll "floating pill" behaviour.
 *
 * - At the top of the page it renders full-width, no background — it's
 *   part of the hero.
 * - Once the user has scrolled ~80px past the fold, it becomes
 *   `position: fixed` and collapses into a rounded capsule that
 *   hovers over the content with a soft blur + shadow. This is the
 *   same pattern Apple uses on apple.com, with a Carlib-shaped capsule.
 *
 * The scroll threshold is small on purpose: the moment the hero title
 * leaves the viewport, we want the header to feel like a companion
 * element rather than a disappeared one.
 */
export function SiteHeader() {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Resting header — lives in-flow at the top of the page. */}
      <header
        className={cn(
          "relative z-30 bg-screen transition-opacity duration-200",
          floating ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        aria-hidden={floating}
      >
        <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Logo />
          <Nav className="absolute left-1/2 -translate-x-1/2" />
          <PillButton href="#get-started" variant="primary" size="md">
            I'm a body shop
          </PillButton>
        </div>
      </header>

      {/* Floating pill — mounts once, fades + slides in on scroll. */}
      <div
        className={cn(
          "fixed left-1/2 top-3 z-50 w-[min(880px,calc(100vw-2rem))] -translate-x-1/2",
          "transition-all duration-300 ease-out",
          floating
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        )}
        aria-hidden={!floating}
      >
        <div
          className={cn(
            "relative flex h-12 items-center justify-between gap-4 rounded-full pl-4 pr-1.5",
            "bg-white",
            "ring-1 ring-border/70 shadow-[0_18px_40px_-20px_rgba(15,15,15,0.35)]"
          )}
        >
          <Logo compact />
          <Nav compact className="absolute left-1/2 -translate-x-1/2" />
          <PillButton href="#get-started" variant="primary" size="sm">
            I'm interested
          </PillButton>
        </div>
      </div>
    </>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="/"
      className={cn(
        "font-medium tracking-tight",
        compact ? "text-xl" : "text-2xl"
      )}
    >
      <span className="text-ink">Car</span>
      <span className="text-brand-yellow">lib</span>
    </a>
  );
}

function Nav({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "hidden items-center text-ink-secondary sm:flex",
        compact ? "gap-5 text-[13px]" : "gap-8 text-sm",
        className
      )}
    >
      <a href="#problem" className="hover:text-ink">
        The problem
      </a>
      <a href="#how-it-works" className="hover:text-ink">
        How it works
      </a>
      <a href="#shops" className="hover:text-ink">
        For body shops
      </a>
    </nav>
  );
}
