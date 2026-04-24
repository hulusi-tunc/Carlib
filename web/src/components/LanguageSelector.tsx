"use client";

import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n";

/**
 * Segmented EN / FR toggle wired to the app-wide I18nProvider. Click
 * either pill to flip the entire landing's copy; the choice is
 * persisted to localStorage and the <html lang> attribute is kept in
 * sync for assistive tech.
 */
export function LanguageSelector() {
  const { locale, setLocale } = useLocale();

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
