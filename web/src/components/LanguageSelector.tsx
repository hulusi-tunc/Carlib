"use client";

import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n";

type Variant = "dark" | "light";

/**
 * Segmented EN / FR toggle wired to the app-wide I18nProvider. Click
 * either pill to flip the entire landing's copy; the choice is
 * persisted to localStorage and the <html lang> attribute is kept in
 * sync for assistive tech.
 *
 * Pass `variant="light"` when placed on a light surface (e.g. the
 * mobile navigation panel). The default `"dark"` variant is tuned for
 * the dark footer.
 */
export function LanguageSelector({ variant = "dark" }: { variant?: Variant } = {}) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center gap-1 rounded-full p-1 ring-1",
        variant === "dark"
          ? "bg-white/[0.06] ring-white/10"
          : "bg-tile ring-border"
      )}
    >
      <LocaleButton
        label="EN"
        active={locale === "en"}
        onClick={() => setLocale("en")}
        variant={variant}
      />
      <LocaleButton
        label="FR"
        active={locale === "fr"}
        onClick={() => setLocale("fr")}
        variant={variant}
      />
    </div>
  );
}

function LocaleButton({
  label,
  active,
  onClick,
  variant,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  variant: Variant;
}) {
  const styles =
    variant === "dark"
      ? active
        ? "bg-white text-ink"
        : "text-white/65 hover:text-white"
      : active
        ? "bg-ink text-white"
        : "text-ink-secondary hover:text-ink";
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/60",
        styles
      )}
    >
      {label}
    </button>
  );
}
