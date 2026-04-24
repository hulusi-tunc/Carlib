"use client";

import {
  Card,
  Kicker,
  PillButton,
  SectionHeader,
} from "@/components/primitives";
import { PerspectiveHero } from "@/components/PerspectiveHero";
import { FeatureBento } from "@/components/FeatureBento";
import { HowItWorks } from "@/components/HowItWorks";
import { GarageSignupForm } from "@/components/GarageSignupForm";
import { SiteHeader } from "@/components/SiteHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useT } from "@/lib/i18n";
import Image from "next/image";
import type { ReactNode } from "react";

// Section order follows the PRD §5.0 landing-page content plan:
//   Hero → Problem → Solution → How it works → Shop benefits → Signup.
// Driver-focused benefits stay as a secondary section since the app is
// two-sided, but the primary conversion goal of this page is shop
// recruitment (cf. US-10 acceptance criteria).
export default function Home() {
  const t = useT();
  return (
    <main className="flex-1">
      <SiteHeader />
      <PerspectiveHero />
      <ProblemSection />
      <FeatureBento />
      <HowItWorks />
      <BenefitSection
        kicker={t.shopBenefits.kicker}
        title={t.shopBenefits.heading}
        items={[
          {
            icon: IconInbox,
            title: t.shopBenefits.item1.title,
            body: t.shopBenefits.item1.body,
          },
          {
            icon: IconCalendar,
            title: t.shopBenefits.item2.title,
            body: t.shopBenefits.item2.body,
          },
          {
            icon: IconCheck,
            title: t.shopBenefits.item3.title,
            body: t.shopBenefits.item3.body,
          },
        ]}
      />
      <GarageSignupForm />
      <Footer />
    </main>
  );
}

// -------- Sections --------------------------------------------------

// Problem — PRD §2.2 user-problem section. Three real-world frictions
// rendered as "illustration on top, headline + caption below" cards in the
// style of Ramp's feature grid: a centered pill or shield motif sitting in
// a soft yellow sunburst.
function ProblemSection() {
  const t = useT();
  const items = [
    {
      illustration: <PaperFormsIllustration />,
      title: t.problem.card1.title,
      caption: t.problem.card1.caption,
    },
    {
      illustration: <ForcedChoiceIllustration />,
      title: t.problem.card2.title,
      caption: t.problem.card2.caption,
    },
    {
      illustration: <ClockIllustration />,
      title: t.problem.card3.title,
      caption: t.problem.card3.caption,
    },
  ];

  return (
    <section id="problem" className="bg-[#06060a] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex flex-col gap-3">
          <Kicker tone="yellow">{t.problem.kicker}</Kicker>
          <h2 className="max-w-2xl font-medium text-3xl leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
            {t.problem.heading}
          </h2>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <article
              key={i}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/10 transition-colors duration-500 hover:ring-brand-yellow/40"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                {item.illustration}
              </div>
              <div className="px-7 pb-8 pt-2">
                <h3 className="text-2xl font-medium leading-[1.15] tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/65">
                  {item.caption}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// Problem-card illustrations.
// All three share the same rules:
//   • Dark card background.
//   • Lines/icons default to WHITE, shift to brand-yellow on hover
//     (inherited from the parent .group via group-hover:text-*).
//   • One idle animation so the cards feel alive at rest, plus an
//     extra beat on hover.
// ------------------------------------------------------------------

// ------- Card 1: Paper Forms -------------------------------------
// Generated hero render — a translucent amber accident-report form
// floating on a dark void. On hover it gently tilts and scales.
function PaperFormsIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a10]">
      <Image
        src="/problem-paper-forms.png"
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:-rotate-3"
      />
    </div>
  );
}

// ------- Card 2: Forced Choice -----------------------------------
// Generated video — three garage doors with the middle one lit.
// Always playing, muted and looped, as an ambient illustration.
function ForcedChoiceIllustration() {
  return (
    <div className="relative h-full w-full bg-[#0a0a10]">
      <video
        src="/problem-no-choice.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

// ------- Card 3: Shops Admin -------------------------------------
// Generated hero render — a translucent amber rotary phone on a dark
// void. On hover the phone shakes like it's ringing off the hook.
function ClockIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a10]">
      <Image
        src="/problem-shops-admin.png"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:[animation:phone-ring_0.6s_ease-in-out_infinite]"
      />
    </div>
  );
}

function BenefitSection({
  kicker,
  title,
  items,
}: {
  kicker: string;
  title: string;
  items: {
    icon: (props: { className?: string }) => ReactNode;
    title: string;
    body: string;
  }[];
}) {
  // Give each section a stable anchor matching its kicker
  const id = kicker.toLowerCase().includes("driver")
    ? "drivers"
    : kicker.toLowerCase().includes("body shop")
      ? "shops"
      : "trust";

  return (
    <section id={id}>
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeader kicker={kicker} title={title} />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title} className="flex flex-col gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-yellow-soft">
                <item.icon className="h-5 w-5 text-brand-yellow-dark" />
              </div>
              <h3 className="text-lg font-medium text-ink">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-ink-secondary">
                {item.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const t = useT();
  // Pure-black footer sits under the near-black signup section. The 1px
  // contrast + a top border keeps them readable as two distinct bands
  // instead of one long dark column.
  return (
    <footer className="border-t border-white/10 bg-black text-white/70">
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 sm:px-12 sm:pt-20">
        <div className="grid gap-10 sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-16">
          {/* Brand block — big logo + one-liner */}
          <div className="flex flex-col gap-5">
            <a
              href="/"
              className="inline-flex items-baseline font-medium tracking-tight"
            >
              <span className="text-5xl text-white sm:text-6xl">Car</span>
              <span className="text-5xl text-brand-yellow sm:text-6xl">
                lib
              </span>
            </a>
            <p className="max-w-xs text-[15px] leading-relaxed text-white/55">
              {t.footer.tagline}
            </p>
          </div>

          {/* Link columns */}
          <FooterColumn
            title={t.footer.product}
            links={[
              { label: t.footer.links.problem, href: "#problem" },
              { label: t.footer.links.howItWorks, href: "#how-it-works" },
              { label: t.footer.links.shops, href: "#shops" },
              { label: t.footer.links.join, href: "#get-started" },
            ]}
          />
          <FooterColumn
            title={t.footer.company}
            links={[
              { label: t.footer.links.terms, href: "#" },
              { label: t.footer.links.privacy, href: "#" },
              { label: t.footer.links.contact, href: "mailto:hello@carlib.fr" },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/45">
            © {new Date().getFullYear()} Carlib. {t.footer.rights}
          </p>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/45">
        {title}
      </p>
      <ul className="flex flex-col gap-3 text-[15px]">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-white/75 transition-colors duration-150 hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}


// -------- Minimal inline icons -----------------------------------------
// Pure SVG so we don't pull in an icon library for a first draft. The
// stroke set matches Remixicon's line family used on iOS.

type IconProps = { className?: string };
const base =
  "stroke-current fill-none stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]";

function IconInbox({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`}>
      <path d="M3 13l3-7h12l3 7" />
      <path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
      <path d="M3 13h5l1 2h6l1-2h5" />
    </svg>
  );
}

function IconCalendar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </svg>
  );
}

