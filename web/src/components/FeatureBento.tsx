"use client";

import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n";
import Image from "next/image";
import { Fragment, useEffect, useState, type ReactNode } from "react";

/**
 * Bento-grid feature section. Three cards — each a real, animated and
 * interactive mini component echoing the iOS Carlib app:
 *   1) Hero: live ClaimDetailView with an auto-advancing status timeline.
 *   2) Photo card: DeclarationFlow photo uploader that fills in on loop.
 *   3) Shop card: GarageDetail card with hover interactions + pulse.
 */
export function FeatureBento() {
  const t = useT();
  return (
    <section id="features" className="bg-[#06060a] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-3xl">
          <h2 className="font-medium text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            {t.features.heading}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
            {t.features.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-4">
          <HeroCard />
          <div className="grid gap-4 md:grid-cols-2">
            <PhotoCard />
            <ShopCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/*  1. Hero card — animated claim detail with status timeline   */
/* ============================================================ */

type Step = {
  key: "submitted" | "matched" | "accepted" | "progress" | "completed";
  tint: string; // bg class
  tintText: string;
  tintSoft: string;
  pill: string;
  pillSub: string;
};

/** Build the 5 status steps from the active locale's claim-step copy.
 *  Tints + keys are static; pill/pillSub come from i18n. */
function useClaimSteps(): Step[] {
  const t = useT();
  const tones = [
    { key: "submitted", tint: "bg-status-submitted", tintText: "text-status-submitted", tintSoft: "bg-status-submitted/15" },
    { key: "matched", tint: "bg-status-matched", tintText: "text-status-matched", tintSoft: "bg-status-matched/15" },
    { key: "accepted", tint: "bg-status-accepted", tintText: "text-status-accepted", tintSoft: "bg-status-accepted/15" },
    { key: "progress", tint: "bg-status-repairing", tintText: "text-status-repairing", tintSoft: "bg-status-repairing/15" },
    { key: "completed", tint: "bg-status-completed", tintText: "text-status-completed", tintSoft: "bg-status-completed/15" },
  ] as const;
  return tones.map((tone, i) => ({
    ...tone,
    pill: t.mockup.claimSteps[i].pill,
    pillSub: t.mockup.claimSteps[i].pillSub,
  }));
}

function HeroCard() {
  const t = useT();
  const STEPS = useClaimSteps();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 2400);
    return () => clearInterval(id);
  }, [STEPS.length]);

  const step = STEPS[stepIndex];

  return (
    <article className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] text-white ring-1 ring-white/10">
      {/* Grainy amber gradient asset (Gradient V59) — replaces the prior
          CSS yellow-blur. Covers the whole card. A dark scrim on top keeps
          the heading legible where the gradient peaks in the bottom-right. */}
      <Image
        src="/grain-gradient-hero.png"
        alt=""
        width={2400}
        height={1800}
        aria-hidden
        unoptimized
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.15)_45%,rgba(10,10,10,0)_75%)]"
      />

      {/* Mobile: the notification stack is absolutely pinned to the top-left
          of the card (see below — `top-6` + its own `pt-6`, ~100px visible
          tall). We reserve that space with `pt-36` so the heading never
          lands under it. On md+ the card becomes two columns and the text
          bottom-aligns in its cell, so the stack no longer collides with
          the heading — we drop back to the tighter `pt-16`. */}
      <div className="relative grid items-end gap-10 px-8 pt-36 sm:px-12 sm:pt-40 md:grid-cols-[1fr_minmax(320px,520px)] md:gap-6 md:pt-16">
        {/* LEFT — text block anchored to the bottom-left of the card via
            the grid's items-end. */}
        <div className="flex flex-col gap-5 pb-12 sm:pb-16 md:pb-20">
          <h3 className="max-w-md font-medium text-3xl leading-[1.12] tracking-tight sm:text-[40px]">
            {t.features.hero.titleL1}
            <br />
            {t.features.hero.titleL2}
          </h3>
          <p className="max-w-md text-[15px] leading-relaxed text-white/70">
            {t.features.hero.body}
          </p>
        </div>

        {/* RIGHT — phone mockup with an iOS-style notification stack
            anchored to its top-right. The stack rotates as the claim
            advances: a new pill drops in at the front, the previous
            one slides back (smaller + faded), older ones compress
            behind until they fall off the stack. */}
        <div className="relative mx-auto block w-full max-w-[420px] translate-x-[6%] self-end sm:translate-x-[8%]">
          <Image
            src="/mockup-shop-claim.png"
            alt="Carlib shop-owner claim detail screen shown on an iPhone held in a hand"
            width={548}
            height={996}
            priority
            unoptimized
            className="relative z-10 block h-auto w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
          />
        </div>
      </div>

      {/* Notification stack — pinned to the card's top-left corner.
          Absolute relative to the article itself so it's anchored to
          the card boundary, not to the phone column. */}
      <div className="pointer-events-none absolute left-6 top-6 z-20 w-[320px] max-w-[78%] sm:left-10 sm:top-10">
        <NotificationStack stepIndex={stepIndex} />
      </div>
    </article>
  );
}

/** iOS-style notification stack anchored to the phone's top-right.
 *  Renders every STEP so mounted nodes persist across ticks — each one
 *  simply transitions to a new depth (0 = front, 1 = one behind, 2 =
 *  two behind) via translate + scale + opacity. A deeper depth tucks
 *  the pill further behind the one in front, matching iPhone's
 *  lock-screen notification pile: newest lands in front, previous
 *  ones slide back + shrink, oldest fade out.
 *
 *  Because node identity stays stable across stepIndex, CSS transitions
 *  smooth the depth change. The "new" pill coming in was previously
 *  hidden at `depth = MAX` (opacity 0) so its entry reads as a fresh
 *  arrival, not a jump. */
const STACK_SIZE = 3;
const STACK_OFFSET = 10; // px between depth levels
const STACK_SHRINK = 0.04; // scale decrement per depth
const PRE_ARRIVAL_Y = -44; // px above the front slot — new pill drops in from here

function NotificationStack({ stepIndex }: { stepIndex: number }) {
  const STEPS = useClaimSteps();
  return (
    <div className="pointer-events-none w-full">
      {/* Container with extra top padding so the stacked pills (which
          sit behind the front one and peek UP) have room to render
          above the front slot without clipping. */}
      <div className="relative pt-6">
        {STEPS.map((step, absIdx) => {
          // How many ticks ago this step was the current one. 0 = now.
          const rawDepth =
            (stepIndex - absIdx + STEPS.length) % STEPS.length;
          const isVisible = rawDepth < STACK_SIZE;
          // Specifically the step *one tick from becoming front*. Sits
          // above the stack with opacity 0 so that its transition into
          // front slot reads as a drop-down-from-above arrival.
          const isPreArrival = rawDepth === STEPS.length - 1;

          let translateY: number;
          let scale: number;
          let opacity: number;
          if (isVisible) {
            // Bottom-anchored pile: newest sits at bottom, older pills
            // translate UPWARD so their top edges peek out behind the
            // front pill. Combined with bottom transform-origin they
            // compress toward the bottom, reinforcing the "shuffled to
            // the back" feel.
            translateY = -rawDepth * STACK_OFFSET;
            scale = 1 - rawDepth * STACK_SHRINK;
            opacity = 1 - rawDepth * 0.3;
          } else if (isPreArrival) {
            // High above the stack — will drop down into the front slot.
            translateY = PRE_ARRIVAL_Y;
            scale = 1 - STACK_SHRINK;
            opacity = 0;
          } else {
            // Fallen off — stays at the deepest visible depth's position
            // but fades to 0. Looks like it sinks back INTO the pile
            // instead of flying away, which matches what the user asked
            // for ("shuffling to back").
            translateY = -(STACK_SIZE - 1) * STACK_OFFSET;
            scale = 1 - (STACK_SIZE - 1) * STACK_SHRINK;
            opacity = 0;
          }

          const isFront = rawDepth === 0;
          // Status-matched glow stroke on the front pill. Falls back to
          // a thin white outline + soft drop shadow for the stacked
          // cards so the depth cues stay clean.
          const colorVar = `var(--color-status-${step.key})`;
          const boxShadow = isFront
            ? `0 0 0 1px color-mix(in srgb, ${colorVar} 55%, transparent), 0 0 24px -6px color-mix(in srgb, ${colorVar} 40%, transparent), 0 12px 28px -12px rgba(0,0,0,0.55)`
            : `0 0 0 1px rgba(255,255,255,0.08), 0 10px 22px -12px rgba(0,0,0,0.45)`;

          return (
            <div
              key={step.key}
              className="absolute inset-x-0 bottom-0 rounded-2xl bg-[#0a0a0a] px-5 py-3.5 transition-all duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                zIndex: isVisible
                  ? STACK_SIZE - rawDepth
                  : 0,
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                transformOrigin: "bottom center",
                boxShadow,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors duration-500",
                    step.tint
                  )}
                />
                <span
                  className={cn(
                    "text-[14px] font-medium transition-colors duration-500",
                    step.tintText
                  )}
                >
                  {step.pill}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-white/85">
                {step.pillSub}
              </p>
            </div>
          );
        })}
        {/* Spacer — gives the relative container natural height so the
            absolute bottom-anchored pills have a bottom edge to pin to.
            Matches the front pill's padding + text metrics. */}
        <div className="invisible rounded-2xl px-5 py-3.5">
          <p className="text-[14px] font-medium">&nbsp;</p>
          <p className="mt-1 text-[12.5px] leading-snug">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

/** Floating status pill above the phone; colors + copy animate per step. */
function LivePill({ step }: { step: Step }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[28%] z-30 w-[112%] -translate-x-1/2 sm:w-[120%]">
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-2xl blur-xl transition-colors duration-500",
            step.tint,
            "opacity-60"
          )}
        />
        <div className="absolute inset-0 rounded-2xl bg-brand-yellow/20 blur-2xl" />
        <div className="relative rounded-2xl bg-black px-4 py-3 ring-1 ring-white/10">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-colors duration-500",
                step.tint
              )}
            />
            <span
              key={`label-${step.key}`}
              className={cn(
                "text-sm font-medium animate-[pill-in_380ms_ease-out_both] transition-colors duration-500",
                step.tintText
              )}
            >
              {step.pill}
            </span>
          </div>
          <p
            key={`sub-${step.key}`}
            className="mt-0.5 text-[13px] leading-snug text-white/85 animate-[pill-in_420ms_ease-out_40ms_both]"
          >
            {step.pillSub}
          </p>
        </div>
      </div>
    </div>
  );
}


/** Shop claim detail mockup — 1:1 replica of Figma node 815:2016
 *  ("53 — Shop · Claim Detail"). Light blue-to-white hero gradient,
 *  Peugeot hero logo + animated status badge + title/plate/damage,
 *  Refuse + Accept Case buttons (Accept pulses while status is
 *  "Submitted"), then a full 5-step TRACKING timeline, DESCRIPTION,
 *  PHOTOS strip, VEHICLE tile, LOCATION tile. The animation engine is
 *  the same `stepIndex` loop driving the left-column copy — the badge,
 *  timeline and label colors all advance together. */

function ShopClaimDetailMockup({
  step,
  stepIndex,
}: {
  step: Step;
  stepIndex: number;
}) {
  const t = useT();
  const TIMELINE_LABELS = t.mockup.timeline;
  const SHOP_CLAIM = t.mockup.shopClaim;
  return (
    <div className="relative z-0 flex h-full flex-col overflow-hidden bg-white text-ink">
      {/* Hero gradient — blue tint at top fading into white. Covers the
          phone's status bar area too for the Figma-accurate feel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[260px] bg-[linear-gradient(to_bottom,#ebf2ff_0%,#f7faff_55%,#ffffff_100%)]"
      />

      {/* === HERO === */}
      <div className="relative flex flex-col items-center gap-2.5 px-5 pt-1 pb-4">
        {/* Back row */}
        <div className="flex w-full items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-ink text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            ‹
          </div>
        </div>

        {/* Car circle */}
        <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#e9ecef]">
          <Image
            src="/car-brands/peugeot.png"
            alt="Peugeot"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Animated status badge — color + label cycle with stepIndex */}
        <div
          key={`badge-${step.key}`}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition-colors duration-500 animate-[pill-in_320ms_ease-out_both]",
            step.tintSoft
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", step.tint)} />
          <span
            className={cn(
              "text-[10px] font-medium leading-none",
              step.tintText
            )}
          >
            {t.mockup.timeline[stepIndex]}
          </span>
        </div>

        {/* Vehicle title */}
        <p className="text-[18px] font-medium leading-tight text-ink">
          Peugeot 308
        </p>
        <p className="text-[9px] text-ink-secondary leading-none">
          BC-456-CD
        </p>

        {/* Damage line */}
        <div className="flex items-center gap-1 text-[10px] text-ink-secondary leading-none">
          <CarMiniIcon />
          {SHOP_CLAIM.collision}
        </div>

        {/* Refuse + Accept Case — yellow button pulses while Submitted */}
        <div className="flex w-full items-center gap-1.5 pt-1.5">
          <button className="h-7 flex-1 rounded-full bg-[#e9ecef] text-[10px] font-medium text-ink">
            {SHOP_CLAIM.refuse}
          </button>
          <button className="relative h-7 flex-1 overflow-visible rounded-full bg-brand-yellow text-[10px] font-medium text-black">
            {stepIndex === 0 && (
              <span className="pointer-events-none absolute inset-0 animate-[phone-ring_1600ms_ease-out_infinite] rounded-full ring-2 ring-brand-yellow" />
            )}
            <span className="relative">{SHOP_CLAIM.acceptCase}</span>
          </button>
        </div>
      </div>

      {/* === CONTENT === */}
      <div className="relative flex flex-1 flex-col gap-3 px-5 pb-4">
        {/* TRACKING */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-ink-secondary">
            {SHOP_CLAIM.tracking}
          </p>
          <div className="flex items-center">
            {TIMELINE_LABELS.map((_, i) => {
              const isPast = i < stepIndex;
              const isCurrent = i === stepIndex;
              return (
                <Fragment key={i}>
                  <div
                    className={cn(
                      "relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-500",
                      isCurrent
                        ? "bg-brand-yellow scale-110"
                        : isPast
                          ? "bg-status-completed"
                          : "border-2 border-[#d8dce1] bg-white"
                    )}
                  >
                    {isPast && (
                      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-white">
                        <path
                          d="M5 12l5 5L20 7"
                          className="stroke-current fill-none stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]"
                        />
                      </svg>
                    )}
                  </div>
                  {i < TIMELINE_LABELS.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 rounded-full transition-colors duration-500",
                        i < stepIndex ? "bg-status-completed" : "bg-[#d8dce1]"
                      )}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
          <div className="flex items-start justify-between">
            {TIMELINE_LABELS.map((label, i) => (
              <span
                key={label}
                className={cn(
                  "text-[7.5px] leading-none transition-colors duration-500",
                  i === 0 && "text-left",
                  i === TIMELINE_LABELS.length - 1 && "text-right",
                  i === stepIndex
                    ? "font-medium text-ink"
                    : i < stepIndex
                      ? "text-status-completed"
                      : "text-ink-label"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-1">
          <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-ink-secondary">
            {SHOP_CLAIM.description}
          </p>
          <p className="text-[9.5px] leading-tight text-ink">
            {SHOP_CLAIM.damageText}
          </p>
        </div>

        {/* PHOTOS */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-ink-secondary">
              {SHOP_CLAIM.photos}
            </p>
            <div className="h-px flex-1 bg-[#e9ecef]" />
            <p className="text-[8.5px] font-medium text-ink-secondary">3</p>
          </div>
          <div className="flex gap-1.5 overflow-hidden">
            {[
              { bg: "#402e1f", label: SHOP_CLAIM.photoLabels[0] },
              { bg: "#5c3d24", label: SHOP_CLAIM.photoLabels[1] },
              { bg: "#2e2629", label: SHOP_CLAIM.photoLabels[2] },
            ].map((p) => (
              <div
                key={p.label}
                className="flex h-[66px] w-[86px] shrink-0 items-end overflow-hidden rounded-lg p-1.5"
                style={{ backgroundColor: p.bg }}
              >
                <div className="max-w-full overflow-hidden truncate rounded-full bg-black/55 px-1.5 py-0.5 text-[7px] font-medium text-white">
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VEHICLE */}
        <div className="flex flex-col gap-1">
          <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-ink-secondary">
            {SHOP_CLAIM.vehicle}
          </p>
          <div className="flex items-center gap-2 rounded-xl bg-[#f1f3f7] p-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e3e6eb]">
              <Image
                src="/car-brands/peugeot.png"
                alt=""
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium leading-none text-ink">
                Peugeot 308
              </p>
              <div className="mt-0.5 flex items-center gap-1 text-[8.5px] text-ink-secondary leading-none">
                <span>BC-456-CD</span>
                <span className="text-ink-label">·</span>
                <span>2019</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex flex-col gap-1">
          <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-ink-secondary">
            {SHOP_CLAIM.location}
          </p>
          <div className="flex items-center gap-2 rounded-xl bg-[#f1f3f7] p-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-yellow/15">
              <PinMiniIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium leading-none text-ink">
                Paris 11e
              </p>
              <p className="mt-0.5 text-[8.5px] leading-none text-ink-secondary">
                48.859, 2.368
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small icons used only inside the claim-detail mockup. */
function CarMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 text-ink-secondary">
      <path
        d="M5 15l1-4a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 11l1 4M5 15h14M5 15v3h2v-1h10v1h2v-3"
        className="stroke-current fill-none stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"
      />
    </svg>
  );
}

function PinMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-brand-yellow-dark">
      <path
        d="M12 21s-6-6.5-6-11a6 6 0 1 1 12 0c0 4.5-6 11-6 11z"
        className="stroke-current fill-current [stroke-linecap:round] [stroke-linejoin:round]"
      />
      <circle cx="12" cy="10" r="2" className="fill-white" />
    </svg>
  );
}

/* ============================================================ */
/*  2. Photo card — auto-fill loop + interactive replay         */
/* ============================================================ */

/**
 * Tiles for the "Photos of the damage" upload demo.
 *
 * The grid has 6 slots. Only the first `FILL_COUNT` (4) auto-fill with
 * photos; the last two are left as empty placeholders to read as
 * "optional extra shots" — that was the PRD's original intent.
 *
 * `src` URLs hit loremflickr with car-crash / damage tags so the demo
 * renders actual accident imagery. `?lock=N` pins the result so the same
 * URL always returns the same photo. Swap for licensed shots once
 * they're available.
 */
// Image srcs for the auto-filled slots (labels come from i18n).
const PHOTO_SRCS = [
  "https://loremflickr.com/400/400/car,damage,bumper?lock=101",
  "https://loremflickr.com/400/400/car,crash,wreck?lock=102",
  "https://loremflickr.com/400/400/car,accident,fender?lock=103",
  "https://loremflickr.com/400/400/car,dent,scratch?lock=104",
] as const;
/** Photos that actually auto-fill (the first N of the grid). */
const FILL_COUNT = 4;
/** Total slots rendered in the grid (includes empty placeholders). */
const TILE_COUNT = 6;

function PhotoCard() {
  const t = useT();
  const [filled, setFilled] = useState(0);
  const [loopTick, setLoopTick] = useState(0);

  // Sequential-fill animation on the first 4 slots. Tiles light up one
  // at a time, hold at full so the "all photos attached" state is
  // readable, then the whole thing resets and plays again.
  useEffect(() => {
    setFilled(0);
    let count = 0;
    const fillInt = setInterval(() => {
      count += 1;
      setFilled(count);
      if (count >= FILL_COUNT) {
        clearInterval(fillInt);
      }
    }, 700);
    const restart = setTimeout(
      () => setLoopTick((t) => t + 1),
      700 * FILL_COUNT + 3000,
    );
    return () => {
      clearInterval(fillInt);
      clearTimeout(restart);
    };
  }, [loopTick]);

  return (
    <article className="relative overflow-hidden rounded-3xl bg-[#0b0f1c] text-white ring-1 ring-white/5">
      {/* Subtle starfield */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.18)_0,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_85%,rgba(245,183,0,0.12)_0,transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(white 0.7px, transparent 0.7px)",
            backgroundSize: "32px 32px",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.05))",
          }}
        />
      </div>

      <div className="relative flex h-full flex-col gap-6 p-6 sm:gap-8 sm:p-8">
        <div>
          <h3 className="text-xl font-medium">
            {t.features.photo.titleLead}{" "}
            <span className="text-white/60">
              {t.features.photo.titleAside}
            </span>
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
            {t.features.photo.body}
          </p>
        </div>

        {/* Live upload panel */}
        <div className="relative mt-auto overflow-hidden rounded-2xl bg-black/30 p-4 ring-1 ring-white/10 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="min-w-0 text-[13px] font-medium">
              {t.mockup.photoPanel.stepCaption}
            </p>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors duration-300",
                filled >= FILL_COUNT
                  ? "bg-status-completed text-white"
                  : "bg-brand-yellow text-black"
              )}
            >
              {filled >= FILL_COUNT && (
                <svg viewBox="0 0 24 24" className="h-3 w-3">
                  <path
                    d="M5 12l5 5L20 7"
                    className="stroke-current fill-none stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]"
                  />
                </svg>
              )}
              {filled} / {FILL_COUNT}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/5">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                filled >= FILL_COUNT ? "bg-status-completed" : "bg-brand-yellow"
              )}
              style={{ width: `${(filled / FILL_COUNT) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: TILE_COUNT }).map((_, i) => {
              // Slots past FILL_COUNT stay empty forever. Inside the fill
              // range, slot `filled` is the one currently uploading.
              const state: "empty" | "uploading" | "filled" =
                i >= FILL_COUNT
                  ? "empty"
                  : i < filled
                    ? "filled"
                    : i === filled
                      ? "uploading"
                      : "empty";
              return (
                <PhotoCell
                  key={i}
                  label={t.mockup.photoPanel.tileLabels[i] ?? ""}
                  src={i < FILL_COUNT ? PHOTO_SRCS[i] : undefined}
                  state={state}
                  tone={i % 3}
                />
              );
            })}
          </div>
          <p className="mt-3 text-[10.5px] text-white/40">
            {filled < FILL_COUNT
              ? t.mockup.photoPanel.uploadingTpl.replace(
                  "{label}",
                  t.mockup.photoPanel.tileLabels[filled] ?? "",
                )
              : t.mockup.photoPanel.attached}
          </p>
        </div>
      </div>
    </article>
  );
}

function PhotoCell({
  label,
  src,
  state,
  tone,
}: {
  label: string;
  src?: string;
  state: "empty" | "uploading" | "filled";
  tone: number;
}) {
  const bg =
    tone === 0
      ? "bg-[linear-gradient(135deg,#4a4a52,#2a2a32)]"
      : tone === 1
        ? "bg-[linear-gradient(135deg,#5a4a3a,#2a1e12)]"
        : "bg-[linear-gradient(135deg,#3a4a5a,#1e252e)]";
  if (state === "filled" && src) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg animate-[photo-pop_380ms_ease-out_both]">
        {/* Gradient base — stays visible if the photo fails to load so the
            tile never renders as a broken image icon. */}
        <div className={cn("absolute inset-0", bg)} />
        {/* Real claim photo. `next/image` handles responsive sizing; the
            warm overlay + label sit on top to preserve the card mood. */}
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 640px) 33vw, 140px"
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
        <span className="absolute bottom-1.5 left-1.5 text-[8px] font-medium text-white drop-shadow">
          {label}
        </span>
      </div>
    );
  }
  if (state === "uploading") {
    return (
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-dashed border-brand-yellow/60 bg-brand-yellow/5">
        <div className="absolute inset-0 animate-[photo-sweep_1200ms_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_30%,rgba(245,183,0,0.25)_50%,transparent_70%)]" />
        <div className="relative h-4 w-4 animate-spin rounded-full border-2 border-brand-yellow border-t-transparent" />
      </div>
    );
  }
  return (
    <div className="relative flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/5">
      <PlusIcon className="h-5 w-5 text-white/30" />
    </div>
  );
}

/* ============================================================ */
/*  3. Shop card — pulse + hover interactive book button        */
/* ============================================================ */

function ShopCard() {
  const t = useT();
  return (
    <article
      className="group relative overflow-hidden rounded-3xl text-white ring-1 ring-white/10 transition-shadow duration-300 hover:ring-brand-yellow/30"
    >
      {/* Raw gradient asset — covers the card. `unoptimized` bypasses
          Next/Image's per-hash cache so the file is always served fresh
          after a swap. A 10% black layer on top tones the whole thing
          down a notch. */}
      <Image
        src="/grain-gradient-yellow.png"
        alt=""
        width={678}
        height={1200}
        aria-hidden
        unoptimized
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_100%)]"
      />

      <div className="relative flex h-full flex-col gap-10 p-8 sm:p-10">
        <div>
          <h3 className="text-xl font-medium">
            {t.features.shop.titleLead}{" "}
            <span className="text-white/65">
              {t.features.shop.titleAside}
            </span>
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
            {t.features.shop.body}
          </p>
        </div>

        <ShopPlanningMockup />
      </div>
    </article>
  );
}

/** Shop planning mockup — echoes GaragePlanningView. A Today column of
 *  hourly slots: some are already booked (drop-off / pickup), some are
 *  OPEN. Every ~1.8s an "OPEN" slot flips to a freshly-booked drop-off
 *  with a slide-in, selling the "drivers fill your bay themselves" idea
 *  at a glance. */
type PlanSlot = {
  time: string;
  state: "booked-dropoff" | "booked-pickup" | "open";
  who?: string;
  vehicle?: string;
  brandLogo?: string;
};

const PLAN_BASE: PlanSlot[] = [
  {
    time: "09:00",
    state: "booked-dropoff",
    who: "Sophie Durand",
    vehicle: "Peugeot 308",
    brandLogo: "/car-brands/peugeot.png",
  },
  { time: "10:30", state: "open" },
  {
    time: "14:00",
    state: "booked-pickup",
    who: "Jean Leclerc",
    vehicle: "Renault Clio V",
    brandLogo: "/car-brands/renault.png",
  },
  { time: "16:00", state: "open" },
];

// Slots that land into OPEN rows over time.
const PLAN_BOOKINGS: { index: number; slot: PlanSlot }[] = [
  {
    index: 1,
    slot: {
      time: "10:30",
      state: "booked-dropoff",
      who: "Amélie Roche",
      vehicle: "Citroën C3",
      brandLogo: "/car-brands/citroen.png",
    },
  },
  {
    index: 3,
    slot: {
      time: "16:00",
      state: "booked-dropoff",
      who: "Lucas Martin",
      vehicle: "Peugeot 308",
      brandLogo: "/car-brands/peugeot.png",
    },
  },
];

function ShopPlanningMockup() {
  const t = useT();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => (t + 1) % (PLAN_BOOKINGS.length + 1));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Apply bookings up to the current tick.
  const slots = PLAN_BASE.map((s) => ({ ...s }));
  for (let i = 0; i < tick && i < PLAN_BOOKINGS.length; i++) {
    const b = PLAN_BOOKINGS[i];
    slots[b.index] = { ...b.slot };
  }
  const bookedCount = slots.filter((s) => s.state !== "open").length;

  return (
    <div className="mt-auto overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10 backdrop-blur-sm">
      {/* Header — date + booked counter */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
            {t.mockup.shopPlanning.today}
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-white">
            {t.mockup.shopPlanning.planning}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-completed opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-completed" />
          </span>
          <span
            key={`c-${bookedCount}`}
            className="text-[11px] font-medium text-white animate-[pill-in_320ms_ease-out_both]"
          >
            {t.mockup.shopPlanning.bookedTpl.replace(
              "{n}",
              String(bookedCount),
            )}
          </span>
        </div>
      </div>

      {/* Slot list */}
      <div className="flex flex-col divide-y divide-white/5">
        {slots.map((slot, i) => (
          <PlanRow key={i} slot={slot} />
        ))}
      </div>
    </div>
  );
}

function PlanRow({ slot }: { slot: PlanSlot }) {
  const t = useT();
  const isOpen = slot.state === "open";
  const isPickup = slot.state === "booked-pickup";
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 transition-colors duration-500",
        isOpen
          ? "bg-transparent"
          : "bg-gradient-to-r from-white/3 to-transparent"
      )}
    >
      <div className="flex w-11 shrink-0 flex-col">
        <span className="text-[12px] font-medium leading-none text-white">
          {slot.time}
        </span>
        <span
          className={cn(
            "mt-0.5 text-[8px] font-medium uppercase tracking-wider leading-none",
            isOpen
              ? "text-white/35"
              : isPickup
                ? "text-status-completed"
                : "text-status-submitted"
          )}
        >
          {isOpen
            ? t.mockup.shopPlanning.open
            : isPickup
              ? t.mockup.shopPlanning.pickup
              : t.mockup.shopPlanning.dropoff}
        </span>
      </div>
      <div
        className={cn(
          "h-7 w-0.5 rounded-full transition-colors duration-500",
          isOpen
            ? "bg-white/10"
            : isPickup
              ? "bg-status-completed"
              : "bg-status-submitted"
        )}
      />
      {isOpen ? (
        <div className="flex-1 text-[10.5px] font-medium text-white/35">
          {t.mockup.shopPlanning.availableHint}
        </div>
      ) : (
        <div
          key={`${slot.time}-${slot.who}`}
          className="flex min-w-0 flex-1 items-center gap-2 animate-[req-slide_500ms_ease-out_both]"
        >
          {slot.brandLogo && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
              <Image
                src={slot.brandLogo}
                alt=""
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-white leading-tight">
              {slot.who}
            </p>
            <p className="truncate text-[9.5px] text-white/55 leading-snug">
              {slot.vehicle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================ */
/*  Mockup primitives                                            */
/* ============================================================ */

/** iPhone-ish frame with Dynamic Island. Content renders at the screen. */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-[9/19] w-full rounded-[2.8rem] bg-[#1a1a1f] p-2 shadow-[0_40px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
      <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] bg-[#f5f2ed]">
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        {/* Status bar */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-2.5 text-[11px] font-medium text-ink">
          <span>9:41</span>
          <span className="h-2 w-10" />
        </div>
        {children}
      </div>
    </div>
  );
}

/* ============================================================ */
/*  Icons                                                         */
/* ============================================================ */

const baseIcon =
  "stroke-current fill-none stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn(baseIcon, className)}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn(baseIcon, className)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
