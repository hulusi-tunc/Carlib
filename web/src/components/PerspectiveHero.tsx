"use client";

import { cn } from "@/lib/cn";
import { Kicker, PillButton } from "@/components/primitives";
import { useLocale, useT } from "@/lib/i18n";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Perspective = "driver" | "shop";

type StatusKey =
  | "submitted"
  | "matched"
  | "accepted"
  | "progress"
  | "repairing"
  | "completed";

/**
 * Discriminated union for every widget that can float around the phone.
 * Each `kind` renders a distinct component that echoes a real screen or
 * card from the iOS Carlib app, not just a generic notification row.
 */
type HeroWidget =
  | {
      kind: "notif";
      status: StatusKey;
      icon: ReactNode;
      title: string;
      subtitle: string;
      timestamp: string;
    }
  | {
      kind: "claimBig";
      status: StatusKey;
      statusLabel: string;
      brand: string;
      model: string;
      damage: string;
      photos: number;
      timestamp: string;
    }
  | {
      kind: "requestCard";
      brand: string;
      model: string;
      damage: string;
      distance: string;
      photos: number;
    }
  | {
      kind: "kpiBlock";
      value: string;
      label: string;
      accent: StatusKey;
      icon: ReactNode;
    }
  | {
      kind: "scheduleRow";
      time: string;
      mode: "dropoff" | "pickup";
      customer: string;
      vehicle: string;
    }
  | {
      kind: "slotPicker";
      day: string;
      slots: { time: string; selected?: boolean }[];
    }
  | {
      kind: "statusTimeline";
      steps: string[];
      currentIndex: number;
    }
  | {
      kind: "garageCard";
      name: string;
      address: string;
      distance: string;
      phone: string;
    };

// Back-compat alias for the notif-specific props so old data shape still
// carries through (legacy arrays used NotifCard directly).
type NotifCard = Extract<HeroWidget, { kind: "notif" }>;

// Maps the iOS CarlibStatusBadge status colors to Tailwind classes.
// Matches Carlib/DesignSystem/Components/CarlibStatusBadge.swift.
const statusStyles: Record<
  StatusKey,
  { bar: string; iconBg: string; iconFg: string }
> = {
  submitted: {
    bar: "bg-status-submitted",
    iconBg: "bg-status-submitted/15",
    iconFg: "text-status-submitted",
  },
  matched: {
    bar: "bg-status-matched",
    iconBg: "bg-status-matched/15",
    iconFg: "text-status-matched",
  },
  accepted: {
    bar: "bg-status-accepted",
    iconBg: "bg-status-accepted/15",
    iconFg: "text-status-accepted",
  },
  progress: {
    bar: "bg-status-progress",
    iconBg: "bg-status-progress/15",
    iconFg: "text-status-progress",
  },
  repairing: {
    bar: "bg-status-repairing",
    iconBg: "bg-status-repairing/15",
    iconFg: "text-status-repairing",
  },
  completed: {
    bar: "bg-status-completed",
    iconBg: "bg-status-completed/15",
    iconFg: "text-status-completed",
  },
};

/**
 * Flighty-style hero with a persistent Driver / Shop owner toggle pinned to
 * the viewport bottom. The toggle and phone share a sticky wrapper so they
 * pin and release together; once the user starts scrolling, the perimeter
 * of notification cards fades/slides in around the phone.
 */
export function PerspectiveHero() {
  const t = useT();
  const { locale } = useLocale();
  // Per-locale mockup assets. The phone screens shown in the hero are
  // real UI captures, so they have to swap along with the rest of the
  // copy when the visitor flips FR / EN.
  //
  // `?v=N` is a cache-bust knob. Bump the version whenever you replace
  // the underlying PNG so the browser + Next.js image optimizer don't
  // keep serving the previous file (both cache aggressively by URL).
  const driverMockup =
    locale === "fr" ? "/mockup-driver-fr.png?v=3" : "/mockup-driver.png";
  const shopMockup =
    locale === "fr" ? "/mockup-shop-fr.png?v=3" : "/mockup-shop.png";
  const [view, setView] = useState<Perspective>("driver");
  // Hero-scroll progress (0 when top in view, 1 after a short scroll). Used
  // to trigger the perimeter-cards reveal as soon as the user starts moving.
  const [progress, setProgress] = useState(0);
  // Trigger flag for the dark wash — flips to `true` the moment the
  // user crosses the hero's midpoint while scrolling down, and back to
  // `false` when they scroll back up past it. The actual motion is a
  // fixed-duration CSS transition, so once triggered the sheet runs to
  // completion regardless of whether the user keeps scrolling or stops.
  const [darkCovered, setDarkCovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // Timestamp (ms) — scroll handler ignores view/dark updates until this
  // point passes. Set by manual toggle clicks so the programmatic scroll
  // they trigger doesn't momentarily flip state back and cause flicker.
  const viewLockRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    function update() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolledIn = Math.max(0, -rect.top);

      // Progress 1 — used for the perimeter notification-card reveal.
      // Normalized to the first 60vh of runway.
      const runway = window.innerHeight * 0.6;
      setProgress(Math.min(1, scrolledIn / runway));

      // Total scroll distance inside the hero.
      const total = rect.height - window.innerHeight;
      const through = total > 0 ? scrolledIn / total : 0;

      // Progress 2 — auto-swap Driver ↔ Shop halfway through the whole
      // section so the cards/halo flip on a single threshold. Same
      // threshold also triggers the dark wash to begin its rise. Skipped
      // while a manual toggle click is animating the scroll (view is
      // already set optimistically there and we don't want a crossing
      // scroll frame to revert it).
      if (Date.now() >= viewLockRef.current) {
        const reached = through > 0.5;
        const next: Perspective = reached ? "shop" : "driver";
        setView((prev) => (prev === next ? prev : next));
        setDarkCovered((prev) => (prev === reached ? prev : reached));
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

  const revealed = progress > 0.04;

  const copy =
    view === "driver"
      ? {
          kicker: t.hero.driver.kicker,
          headline: (
            <>
              {t.hero.driver.headlineL1}
              <br />
              {t.hero.driver.headlineL2}
            </>
          ),
          body: t.hero.driver.body,
          primaryCta: { label: t.hero.driver.primaryCta, href: "#get-started" },
          secondaryCta: { label: t.hero.driver.secondaryCta, href: "#features" },
        }
      : {
          kicker: t.hero.shop.kicker,
          headline: (
            <>
              {t.hero.shop.headlineL1}
              <br />
              {t.hero.shop.headlineL2}
            </>
          ),
          body: t.hero.shop.body,
          primaryCta: { label: t.hero.shop.primaryCta, href: "#get-started" },
          secondaryCta: { label: t.hero.shop.secondaryCta, href: "#features" },
        };

  const cards = view === "driver" ? buildDriverCards(t) : buildShopCards(t);

  const isShop = view === "shop";

  return (
    <section
      ref={sectionRef}
      className={cn(
        // bg/text color change is synced to the *middle* of the dark
        // circle's scale animation — by the time the section bg snaps,
        // the circle is already covering the viewport, so the bg change
        // itself is invisible. No parallel fade the user can perceive.
        "relative min-h-[150vh] overflow-clip transition-colors duration-100 delay-[450ms]",
        isShop ? "bg-[#06060a] text-white" : "bg-screen text-ink"
      )}
    >
      {/* Text block — normal flow, scrolls away as user reads.
          Mobile tuning: shorter top padding, smaller headline/body so the
          copy fits a phone screen without breaking the layout. */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pt-6 text-center sm:px-6 sm:pt-10 md:pt-12">
        <Kicker className="mb-4 sm:mb-6">{copy.kicker}</Kicker>
        <h1
          className={cn(
            "font-medium text-[34px] leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[88px] xl:leading-[1.02] transition-colors duration-100 delay-[450ms]",
            isShop ? "text-white" : "text-ink"
          )}
        >
          {copy.headline}
        </h1>
        <p
          className={cn(
            "mt-5 max-w-2xl text-[15px] leading-relaxed sm:mt-7 sm:text-lg md:text-xl transition-colors duration-100 delay-[450ms]",
            isShop ? "text-white/70" : "text-ink-secondary"
          )}
        >
          {copy.body}
        </p>
        <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center">
          <PillButton
            href={copy.primaryCta.href}
            variant="primary"
            className={cn(
              "w-full sm:w-auto transition-colors duration-100 delay-[450ms]",
              isShop && "bg-white text-ink hover:bg-white/90"
            )}
          >
            {copy.primaryCta.label}
          </PillButton>
          <PillButton
            href={copy.secondaryCta.href}
            variant="secondary"
            className={cn(
              "w-full sm:w-auto transition-colors duration-100 delay-[450ms]",
              isShop && "bg-white/10 text-white hover:bg-white/15"
            )}
          >
            {copy.secondaryCta.label}
          </PillButton>
        </div>
      </div>

      {/* Pinned phone + perimeter cards + toggle — all in one sticky wrapper
          so they pin and release as a single stage. The sticky wrapper is
          pulled up above the text block; the pull is larger on mobile
          because the text block is shorter there, so without the extra
          lift the phone sits way below the CTAs and leaves dead space.
          Mobile tuning note: the phone image is `scale-[1.45]` with
          `origin-bottom` so its *visible* top sits well above its box; a
          -68vh pull therefore yanked the crown of the phone into the
          secondary CTA. -54vh keeps the phone high enough to fill the
          viewport on scroll while leaving breathing room above it.
          Desktop invariant: at page-top we want the phone to *peek* from
          below, not invade the headline. Because the sticky wrapper is
          `h-screen` and the phone is bottom-aligned inside it, the rule
          of thumb is `pull + phone_max_h ≤ 100vh`. We hold pull at a flat
          -8vh on ≥md so the phone can grow as wide/tall as each breakpoint
          allows — `2xl:max-h-[92vh]` still pairs to 100vh exactly. This
          trades a hair of vertical breathing room for a phone that
          actually dominates the hero on 15"+ displays. */}
      <div className="sticky top-0 z-10 -mt-[54vh] flex h-screen items-end justify-center pb-0 sm:-mt-[52vh] md:-mt-[8vh] lg:-mt-[8vh] xl:-mt-[8vh] 2xl:-mt-[8vh]">
        <div className="relative flex h-full w-full items-end justify-center">
          {/* Shop dark wash — solid sheet that rises from below on
              trigger. Asymmetric timing: forward (rise into shop) is a
              gentle 2.2s ease-out so the dark settles in smoothly,
              reverse (drop back to driver) is a faster 1.4s ease-in so
              scrolling back to the top feels snappy instead of slow. */}
          <div
            aria-hidden
            style={{
              transform: darkCovered
                ? "translate3d(0, 0%, 0)"
                : "translate3d(0, 100%, 0)",
              transition: darkCovered
                ? "transform 1400ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "transform 850ms cubic-bezier(0.55, 0, 0.78, 0.2)",
              willChange: "transform",
            }}
            className="pointer-events-none absolute inset-0 bg-[#06060a]"
          />
          {/* Shop-mode warm glow — a strong yellow halo behind the phone
              that only appears once the dark wash has covered the scene.
              Delayed on enter so it lights up after the scene goes dark;
              instant on exit so it vanishes before the light theme returns. */}
          <div
            aria-hidden
            style={{
              transition: isShop
                ? "opacity 700ms ease-out 500ms"
                : "opacity 300ms ease-out 0ms",
            }}
            className={cn(
              "pointer-events-none absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full",
              "h-[780px] w-[780px]",
              "bg-brand-yellow blur-3xl",
              isShop ? "opacity-40" : "opacity-0"
            )}
          />

          {/* Perimeter notification cards — hidden on small screens, revealed
              on scroll with a staggered fade + slide. Left stack enters from
              the left, right stack from the right. */}
          <NotifStack
            side="left"
            cards={cards.left}
            revealed={revealed}
            perspective={view}
          />
          <NotifStack
            side="right"
            cards={cards.right}
            revealed={revealed}
            perspective={view}
          />

          {/* Phone mockups — both layered and crossfaded on toggle. Each
              mockup is a real screen capture from the Carlib iOS app shown
              in a hand, so the toggle feels like the user is handing the
              phone to a different persona rather than hue-rotating one
              image. Responsive: on mobile the phone is centered and smaller
              so the text above still has room; desktop keeps the larger
              off-center placement. */}
          {/* Responsive sizing note: paired with the pulls above so that
              `pull + max-h` stays under 100vh at every breakpoint. Below
              that threshold the bottom-aligned phone leaves a clear gap
              above itself when the hero is at page-top, so the headline
              and CTAs never get invaded by the mockup. Widths ramp up more
              slowly now too — a 1581px viewport with `max-w-[78rem]` made
              the phone cover ~79% of the column, which is the main reason
              short-viewport desktops looked broken. */}
          <div className="relative z-10 h-auto max-h-[80vh] w-full max-w-[52rem] origin-bottom scale-[1.45] drop-shadow-[0_40px_80px_rgba(10,10,10,0.18)] sm:max-h-[80vh] sm:max-w-[52rem] sm:translate-y-[6%] sm:scale-100 md:max-h-[82vh] md:max-w-[52rem] lg:max-h-[86vh] lg:max-w-[64rem] lg:translate-x-[20px] lg:translate-y-[4%] xl:max-h-[88vh] xl:max-w-[76rem] 2xl:max-h-[92vh] 2xl:max-w-[96rem]">
            <Image
              key={driverMockup}
              src={driverMockup}
              alt="A hand holding a phone showing the Carlib driver home screen"
              width={1500}
              height={1125}
              priority
              unoptimized
              className={cn(
                "h-auto w-full object-contain transition-opacity duration-500",
                view === "driver" ? "opacity-100" : "opacity-0"
              )}
            />
            <Image
              key={shopMockup}
              src={shopMockup}
              alt="A hand holding a phone showing the Carlib body-shop dashboard"
              width={1500}
              height={1125}
              priority
              unoptimized
              className={cn(
                "absolute inset-0 h-auto w-full object-contain transition-opacity duration-500",
                view === "shop" ? "opacity-100" : "opacity-0"
              )}
            />
          </div>

          {/* Perspective toggle — pinned near the very bottom of the same
              sticky container, so it visually rides with the phone through
              the hero and exits together when the next section arrives.
              Manual clicks smoothly scroll the page to the matching half
              of the hero so the dark-wash parallax plays in sync with the
              state change. */}
          <div className="pointer-events-none absolute left-0 right-0 bottom-6 z-20 flex justify-center px-5 sm:bottom-10 md:bottom-14">
            <PerspectiveToggle
              view={view}
              onChange={(next) => {
                // Optimistic: flip state immediately so the UI reacts
                // without waiting for scroll to cross the trigger point.
                setView(next);
                setDarkCovered(next === "shop");
                // Lock the scroll handler from fighting back while the
                // programmatic smooth-scroll is underway (~1.2s).
                viewLockRef.current = Date.now() + 1500;
                // Scroll target: 70% into the hero for shop, 10% for
                // driver — both well clear of the 50% threshold so the
                // scroll handler confirms the state once the lock lifts.
                const el = sectionRef.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const sectionTopY = window.scrollY + rect.top;
                const runway = el.offsetHeight - window.innerHeight;
                const targetThrough = next === "shop" ? 0.7 : 0.1;
                window.scrollTo({
                  top: sectionTopY + runway * targetThrough,
                  behavior: "smooth",
                });
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Vertical stack of mixed hero widgets flanking the phone. Each item is
 *  rendered by a kind-specific component — they echo real Carlib iOS
 *  screens (ClaimCardView, GarageClaimsListView request card, dashboard
 *  KPI, schedule row, booking slot picker). Hidden below `lg` to keep
 *  the phone breathable on tablet. */
function NotifStack({
  side,
  cards,
  revealed,
  perspective,
}: {
  side: "left" | "right";
  cards: HeroWidget[];
  revealed: boolean;
  perspective: Perspective;
}) {
  // Stack positions — tuned close enough to the phone that they read
  // as its satellites rather than edge decorations. Percentages are
  // measured from the viewport edge to the stack's outer edge; a tiny
  // outward nudge on 2xl compensates for the much wider 96rem mockup
  // so the hands don't fully swallow them.
  const positionClass =
    side === "left"
      ? "left-[22%] xl:left-[20%] 2xl:left-[18%]"
      : "right-[22%] xl:right-[20%] 2xl:right-[18%]";
  // Per-index jitter — pseudo-random x-offsets for a hand-arranged look.
  // Y jitter kept very small so adjacent cards don't crunch into each
  // other; real breathing space comes from the stack `gap`.
  const jitterX = side === "left" ? [0, 28, 8, 36] : [0, -26, -10, -34];
  const jitterY = [0, -2, 6, -3];
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-[16%] z-0 hidden w-[300px] flex-col gap-5 lg:flex xl:w-[340px]",
        positionClass
      )}
    >
      {cards.map((widget, i) => (
        // Outer layer applies the hand-arranged jitter offset. Inner
        // layer runs the entrance keyframe. They're split so the
        // animation's `translateX` doesn't wipe out the jitter — both
        // transforms compose through the wrapper.
        <div
          key={`${perspective}-${side}-${i}`}
          style={{
            transform: `translate(${jitterX[i % jitterX.length]}px, ${
              jitterY[i % jitterY.length]
            }px)`,
          }}
        >
          <div
            style={{
              animation: revealed
                ? `notif-enter-${side} 680ms cubic-bezier(0.22,1,0.36,1) ${
                    i * 95
                  }ms both`
                : undefined,
              opacity: revealed ? undefined : 0,
            }}
          >
            <HeroWidgetCard widget={widget} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================ */
/*  Widget renderers — each echoes a real iOS Carlib component.   */
/* ============================================================ */

function HeroWidgetCard({ widget }: { widget: HeroWidget }) {
  switch (widget.kind) {
    case "notif":
      return <WidgetNotif {...widget} />;
    case "claimBig":
      return <WidgetClaimBig {...widget} />;
    case "requestCard":
      return <WidgetRequest {...widget} />;
    case "kpiBlock":
      return <WidgetKpi {...widget} />;
    case "scheduleRow":
      return <WidgetSchedule {...widget} />;
    case "slotPicker":
      return <WidgetSlotPicker {...widget} />;
    case "statusTimeline":
      return <WidgetStatusTimeline {...widget} />;
    case "garageCard":
      return <WidgetGarageCard {...widget} />;
  }
}

/** Notification row — same structure we've iterated on: left status bar,
 *  icon disc, title/subtitle, timestamp. Mirrors a compact ClaimCardView. */
/** Maps a brand name to the corresponding logo PNG copied from the iOS
 *  asset catalog (public/car-brands/*.png). Falls back to null so the
 *  parent can render an alternate icon when the brand isn't mapped. */
function CarBrandLogo({
  brand,
  size = 24,
  className,
}: {
  brand: string;
  size?: number;
  className?: string;
}) {
  const slug = brand.trim().toLowerCase().replace(/ö|ë/g, (c) =>
    c === "ö" ? "o" : "e"
  );
  const map: Record<string, string> = {
    peugeot: "/car-brands/peugeot.png",
    renault: "/car-brands/renault.png",
    citroen: "/car-brands/citroen.png",
    bmw: "/car-brands/bmw.png",
    tesla: "/car-brands/tesla.png",
  };
  const src = map[slug];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={`${brand} logo`}
      width={size}
      height={size}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

function WidgetNotif(card: Extract<HeroWidget, { kind: "notif" }>) {
  const style = statusStyles[card.status];
  return (
    <div className="flex overflow-hidden rounded-[14px] bg-white ring-1 ring-border/60 shadow-[0_16px_40px_-18px_rgba(10,10,10,0.22)]">
      <div className={cn("w-1 shrink-0", style.bar)} />
      <div className="flex flex-1 items-center gap-3 px-4 py-3.5">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            style.iconBg,
            style.iconFg
          )}
        >
          {card.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-ink leading-tight">
            {card.title}
          </p>
          <p className="mt-1 truncate text-[13px] text-ink-secondary leading-snug">
            {card.subtitle}
          </p>
        </div>
        <span className="text-[11px] font-medium text-ink-label shrink-0">
          {card.timestamp}
        </span>
      </div>
    </div>
  );
}

/** Full claim card — status badge row, vehicle name, damage, photo strip.
 *  Echoes iOS ClaimCardView with the status color bar on the left edge. */
function WidgetClaimBig(card: Extract<HeroWidget, { kind: "claimBig" }>) {
  const style = statusStyles[card.status];
  return (
    <div className="flex overflow-hidden rounded-[14px] bg-white ring-1 ring-border/60 shadow-[0_16px_40px_-18px_rgba(10,10,10,0.22)]">
      <div className={cn("w-1 shrink-0", style.bar)} />
      <div className="flex-1 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
              style.iconBg,
              style.iconFg
            )}
          >
            {card.statusLabel}
          </span>
          <span className="ml-auto text-[11px] font-medium text-ink-label">
            {card.timestamp}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <CarBrandLogo brand={card.brand} size={18} />
          <p className="text-[15px] font-medium text-ink leading-tight">
            {card.brand} {card.model}
          </p>
        </div>
        <p className="mt-0.5 text-[13px] text-ink-secondary leading-snug">
          {card.damage}
        </p>
        <div className="mt-2.5 flex items-center gap-1">
          {Array.from({ length: Math.min(3, card.photos) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-8 w-8 rounded-md",
                i === 0
                  ? "bg-[linear-gradient(135deg,#6b7285,#2a2f3a)]"
                  : i === 1
                    ? "bg-[linear-gradient(135deg,#a68c5b,#5a432a)]"
                    : "bg-[linear-gradient(135deg,#4a5a74,#232d3e)]"
              )}
            />
          ))}
          {card.photos > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-tile text-[11px] font-medium text-ink-secondary">
              +{card.photos - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Shop-side request card — new incoming claim with inline Accept/Decline
 *  pills. Echoes `GarageClaimsListView` row with actions=.request. */
function WidgetRequest(card: Extract<HeroWidget, { kind: "requestCard" }>) {
  return (
    <div className="overflow-hidden rounded-[14px] bg-white ring-1 ring-border/60 shadow-[0_18px_44px_-18px_rgba(10,10,10,0.28)]">
      <div className="flex items-start gap-3 px-4 pt-3.5 pb-2">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tile">
          {/* Use the brand logo (Peugeot, Renault, ...) as the disc icon
              when the car brand matches one we've got in /car-brands. */}
          <CarBrandLogo brand={card.brand} size={26} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-ink leading-tight">
            {card.brand} {card.model}
          </p>
          <p className="mt-0.5 text-[12.5px] text-ink-secondary leading-snug">
            {card.damage} · {card.distance} · {card.photos} photos
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 pb-3 pt-1">
        <button className="flex-1 rounded-full bg-tile py-2 text-[12px] font-medium text-ink">
          Decline
        </button>
        <button className="flex-1 rounded-full bg-brand-yellow py-2 text-[12px] font-medium text-black">
          Accept
        </button>
      </div>
    </div>
  );
}

/** Dashboard KPI pill — big accent number, small label, inline icon.
 *  Compact version of the stat blocks on GarageDashboardView. */
function WidgetKpi(card: Extract<HeroWidget, { kind: "kpiBlock" }>) {
  const style = statusStyles[card.accent];
  return (
    <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5 ring-1 ring-border/60 shadow-[0_16px_40px_-18px_rgba(10,10,10,0.22)]">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          style.iconBg,
          style.iconFg
        )}
      >
        {card.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-[22px] font-medium leading-none", style.iconFg)}>
          {card.value}
        </p>
        <p className="mt-1 text-[11.5px] text-ink-secondary leading-snug">
          {card.label}
        </p>
      </div>
    </div>
  );
}

/** Today's schedule row — time + drop-off/pickup chip + customer + car.
 *  Echoes the schedule list on GarageDashboardView. */
function WidgetSchedule(card: Extract<HeroWidget, { kind: "scheduleRow" }>) {
  const tint =
    card.mode === "dropoff" ? statusStyles.submitted : statusStyles.completed;
  return (
    <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3 ring-1 ring-border/60 shadow-[0_16px_40px_-18px_rgba(10,10,10,0.22)]">
      <div className="flex w-14 flex-col">
        <span className="text-[15px] font-medium text-ink leading-tight">
          {card.time}
        </span>
        <span className={cn("text-[10px] font-medium uppercase tracking-wider", tint.iconFg)}>
          {card.mode === "dropoff" ? "Drop" : "Pickup"}
        </span>
      </div>
      <div className={cn("h-8 w-0.5 rounded-full", tint.bar)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-ink leading-tight">
          {card.customer}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] text-ink-secondary leading-snug">
          {card.vehicle}
        </p>
      </div>
    </div>
  );
}

/** Horizontal status stepper — 5 dots with labels, one current (filled
 *  yellow), past ones checked (green), upcoming ones muted. Echoes the
 *  StatusTimelineView on DriverClaimDetailView. */
function WidgetStatusTimeline(
  card: Extract<HeroWidget, { kind: "statusTimeline" }>
) {
  return (
    <div className="rounded-[14px] bg-white px-4 py-3.5 ring-1 ring-border/60 shadow-[0_16px_40px_-18px_rgba(10,10,10,0.22)]">
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-label">
        Tracking
      </p>
      <div className="mt-2.5 flex items-center">
        {card.steps.map((step, i) => {
          const isPast = i < card.currentIndex;
          const isCurrent = i === card.currentIndex;
          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative flex w-full items-center">
                {i > 0 && (
                  <div
                    className={cn(
                      "absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2",
                      i <= card.currentIndex
                        ? "bg-status-completed"
                        : "bg-border"
                    )}
                  />
                )}
                {i < card.steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2",
                      i < card.currentIndex
                        ? "bg-status-completed"
                        : "bg-border"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative mx-auto flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-white",
                    isCurrent
                      ? "bg-brand-yellow"
                      : isPast
                        ? "bg-status-completed"
                        : "bg-border"
                  )}
                >
                  {isPast && (
                    <svg viewBox="0 0 24 24" className="h-3 w-3 text-white">
                      <path
                        d="M5 12l5 5L20 7"
                        className="stroke-current fill-none stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "text-[9.5px] font-medium leading-none",
                  isCurrent
                    ? "text-ink"
                    : isPast
                      ? "text-status-completed"
                      : "text-ink-label"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Garage card — pin icon + name + address + divider + phone CTA row.
 *  Echoes DriverClaimDetailView.garageCard. */
function WidgetGarageCard(card: Extract<HeroWidget, { kind: "garageCard" }>) {
  return (
    <div className="overflow-hidden rounded-[14px] bg-white ring-1 ring-border/60 shadow-[0_16px_40px_-18px_rgba(10,10,10,0.22)]">
      <div className="flex items-center gap-3 px-4 pt-3.5 pb-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tile text-brand-yellow-dark">
          <IconPin />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-medium text-ink leading-tight">
            {card.name}
          </p>
          <p className="mt-0.5 truncate text-[11.5px] text-ink-secondary leading-snug">
            {card.address} · {card.distance}
          </p>
        </div>
      </div>
      <div className="h-px bg-border/70" />
      <div className="flex items-center gap-2.5 px-4 py-2.5">
        <IconPhone />
        <span className="text-[12.5px] font-medium text-ink">{card.phone}</span>
        <span className="ml-auto text-ink-label">›</span>
      </div>
    </div>
  );
}

/** Booking slot picker — day + horizontal row of time chips with one
 *  selected (yellow pill). Echoes BookingFlowView's slot selection. */
function WidgetSlotPicker(card: Extract<HeroWidget, { kind: "slotPicker" }>) {
  return (
    <div className="rounded-[14px] bg-white px-4 py-3.5 ring-1 ring-border/60 shadow-[0_16px_40px_-18px_rgba(10,10,10,0.22)]">
      <div className="flex items-center gap-2">
        <IconCalendar />
        <p className="text-[12.5px] font-medium text-ink leading-tight">
          {card.day}
        </p>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        {card.slots.map((s) => (
          <span
            key={s.time}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11.5px] font-medium",
              s.selected
                ? "bg-brand-yellow text-black"
                : "bg-tile text-ink-secondary"
            )}
          >
            {s.time}
          </span>
        ))}
      </div>
    </div>
  );
}

// -------- Widget content --------------------------------------------
// Mixed `HeroWidget` arrays — each side gets 4 varied component types
// (not just notification rows) so the scene feels like a live app with
// real screens floating around the phone, not a generic notifications
// gallery. Driver side leans on claim/booking primitives; shop side
// swaps in the dashboard/request/schedule/payment primitives.

type Dictionary = import("@/lib/translations").Dictionary;

function buildDriverCards(t: Dictionary): { left: HeroWidget[]; right: HeroWidget[] } {
  const m = t.mockup.notif;
  return {
    left: [
      {
        kind: "claimBig",
        status: "repairing",
        statusLabel: m.inRepair,
        brand: "Peugeot",
        model: "308",
        damage: m.driver.parkingDamage,
        photos: 8,
        timestamp: "2m",
      },
      {
        kind: "statusTimeline",
        steps: [...m.driver.timelineSteps],
        currentIndex: 3,
      },
      {
        kind: "notif",
        status: "matched",
        icon: <IconSearch />,
        title: m.driver.shopsInterested,
        subtitle: m.driver.tapToCompare,
        timestamp: "8m",
      },
      {
        kind: "slotPicker",
        day: m.driver.slotDay,
        slots: [
          { time: "09:00" },
          { time: "10:00", selected: true },
          { time: "11:30" },
        ],
      },
    ],
    right: [
      {
        kind: "garageCard",
        name: "Dupont Auto Body",
        address: "12 Rue du Faubourg",
        distance: "2.4 km",
        phone: "+33 1 23 45 67 89",
      },
      {
        kind: "kpiBlock",
        value: "2d",
        label: m.driver.etaInRepair,
        accent: "progress",
        icon: <IconWrench />,
      },
      {
        kind: "claimBig",
        status: "completed",
        statusLabel: m.completed,
        brand: "Renault",
        model: "Clio V",
        damage: m.driver.bumperReplacement,
        photos: 12,
        timestamp: "2d",
      },
      {
        kind: "notif",
        status: "completed",
        icon: <IconCheck />,
        title: m.driver.readyForPickup,
        subtitle: m.driver.todayAfter4pm,
        timestamp: m.now,
      },
    ],
  };
}

function buildShopCards(t: Dictionary): { left: HeroWidget[]; right: HeroWidget[] } {
  const m = t.mockup.notif;
  return {
    left: [
      {
        kind: "requestCard",
        brand: "Peugeot",
        model: "308",
        damage: m.shop.parkingDamage,
        distance: "2.3 km",
        photos: 8,
      },
      {
        kind: "statusTimeline",
        steps: [...m.shop.timelineSteps],
        currentIndex: 2,
      },
      {
        kind: "scheduleRow",
        time: "09:00",
        mode: "dropoff",
        customer: "Sophie Durand",
        vehicle: "Peugeot 308",
      },
      {
        kind: "notif",
        status: "progress",
        icon: <IconCheck />,
        title: m.shop.keysReceived,
        subtitle: m.shop.driverMarkedDropoff,
        timestamp: "2h",
      },
    ],
    right: [
      {
        kind: "kpiBlock",
        value: "4",
        label: m.shop.newThisWeek,
        accent: "matched",
        icon: <IconInbox />,
      },
      {
        kind: "scheduleRow",
        time: "14:00",
        mode: "pickup",
        customer: "Jean Leclerc",
        vehicle: "Renault Clio V",
      },
      {
        kind: "claimBig",
        status: "repairing",
        statusLabel: m.inRepair,
        brand: "Citroën",
        model: "C3",
        damage: m.shop.hoodFrontLight,
        photos: 6,
        timestamp: "1d",
      },
      {
        kind: "kpiBlock",
        value: "€1.2k",
        label: m.shop.settledThisWeek,
        accent: "completed",
        icon: <IconEuro />,
      },
    ],
  };
}

// Inline SVG icons — stroke-only line style, matches Remixicon.
const svgProps = {
  viewBox: "0 0 24 24",
  className:
    "h-5 w-5 stroke-current fill-none stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]",
};
function IconCheck() {
  return (
    <svg {...svgProps}>
      <path d="M20 7L9 18l-5-5" />
    </svg>
  );
}
function IconSpark() {
  return (
    <svg {...svgProps}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg {...svgProps}>
      <path d="M22 2 11 13" />
      <path d="M22 2l-7 20-4-9-9-4z" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg {...svgProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg {...svgProps}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function IconWrench() {
  return (
    <svg {...svgProps}>
      <path d="M14 6a4 4 0 1 1 4 4l-8.5 8.5a2 2 0 1 1-2.8-2.8L15.2 5.2" />
    </svg>
  );
}
function IconCamera() {
  return (
    <svg {...svgProps}>
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
function IconKey() {
  return (
    <svg {...svgProps}>
      <circle cx="8" cy="15" r="3" />
      <path d="M10 13l9-9M17 6l2 2M15 8l2 2" />
    </svg>
  );
}
function IconInbox() {
  return (
    <svg {...svgProps}>
      <path d="M3 13l3-7h12l3 7" />
      <path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
      <path d="M3 13h5l1 2h6l1-2h5" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg {...svgProps}>
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg {...svgProps}>
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg {...svgProps}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconEuro() {
  return (
    <svg {...svgProps}>
      <path d="M18 7a7 7 0 1 0 0 10M3 10h10M3 14h10" />
    </svg>
  );
}

function PerspectiveToggle({
  view,
  onChange,
}: {
  view: Perspective;
  onChange: (v: Perspective) => void;
}) {
  const t = useT();
  return (
    <div
      role="radiogroup"
      aria-label="Switch between driver and shop-owner perspective"
      className="pointer-events-auto relative grid grid-cols-2 rounded-full border border-border/60 bg-screen/95 p-1.5 shadow-[0_14px_38px_-6px_rgba(10,10,10,0.18)] backdrop-blur"
    >
      {/* Sliding yellow pill — a single indicator that glides between the
          two options. Using a shared element (instead of per-button bg)
          lets the scroll-driven auto-switch animate, not snap. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-brand-yellow shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          view === "shop" ? "translate-x-full" : "translate-x-0"
        )}
      />
      <ToggleButton
        label={t.hero.toggle.driver}
        selected={view === "driver"}
        onClick={() => onChange("driver")}
        icon={
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] sm:h-4 sm:w-4" aria-hidden>
            <path
              d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0"
              className="stroke-current fill-none stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]"
            />
          </svg>
        }
      />
      <ToggleButton
        label={t.hero.toggle.shop}
        selected={view === "shop"}
        onClick={() => onChange("shop")}
        icon={
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] sm:h-4 sm:w-4" aria-hidden>
            <path
              d="M3 9l1.5-4h15L21 9M3 9v11h18V9M3 9h18M8 13h8"
              className="stroke-current fill-none stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]"
            />
          </svg>
        }
      />
    </div>
  );
}

function ToggleButton({
  label,
  selected,
  icon,
  onClick,
}: {
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        // Transparent button — the yellow pill lives on the parent and
        // slides behind the selected option. Only text color changes here.
        // Mobile: h-11 (44pt Apple HIG touch target) + px-5 / text-sm so
        // the toggle is a thumb-sized tap target; grows on sm+ back to the
        // roomier desktop spec.
        "relative z-10 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-300 ease-out sm:h-10 sm:gap-2 sm:px-4 sm:text-sm",
        selected ? "text-black" : "text-ink-secondary hover:text-ink"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
