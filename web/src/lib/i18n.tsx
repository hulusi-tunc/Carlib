"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Dictionary, type Locale } from "./translations";

type I18nValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Dictionary;
};

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "carlib-locale";

/**
 * App-wide i18n provider. Holds the active locale in memory, persists
 * the user's choice to localStorage, and also reflects it on the
 * <html lang> attribute so assistive tech reads the right language.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Read persisted choice on mount. We start with "en" on the server so
  // SSR output is deterministic; once on the client we sync to whatever
  // the visitor last picked.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "fr") setLocaleState(stored);
    } catch {
      // localStorage blocked — stay on default.
    }
  }, []);

  // Keep <html lang> in sync so screen readers + translation tools read
  // the right language.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value: I18nValue = {
    locale,
    setLocale,
    t: translations[locale],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Returns the active locale + a setter. */
export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside <I18nProvider>");
  }
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}

/** Returns the full translated dictionary for direct property access. */
export function useT(): Dictionary {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useT must be used inside <I18nProvider>");
  }
  return ctx.t;
}
