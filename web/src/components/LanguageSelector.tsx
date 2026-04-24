"use client";

import { cn } from "@/lib/cn";
import { useState } from "react";

type Locale = "en" | "fr";

/**
 * Segmented EN / FR toggle. Today this is local state only — visual
 * switch, no routing. When i18n lands (next-intl or the App Router's
 * [locale] segment), swap the `setLocale` call for a router push and
 * read the initial value from the URL / cookie.
 */
export function LanguageSelector() {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10"
    >
      <LocaleButton
        label="EN"
        active={locale === "en"}
        onClick={() => setLocale("en")}
      />
      <LocaleButton
        label="FR"
        active={locale === "fr"}
        onClick={() => setLocale("fr")}
      />
    </div>
  );
}

function LocaleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/60",
        active
          ? "bg-white text-ink"
          : "text-white/65 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}
