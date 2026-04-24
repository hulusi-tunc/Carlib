"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Kicker } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n";

// PRD requirement (US-10, §5, §8.2): the landing has to collect the first
// garage partners via a visible form above the fold, with a confirmation
// state after submit. Fields are minimal on purpose — this is validation
// marketing, not a full onboarding.

type Fields = {
  shopName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
};

const empty: Fields = {
  shopName: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
};

export function GarageSignupForm() {
  const t = useT();
  const [values, setValues] = useState<Fields>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof Fields) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const missing = (
      ["shopName", "contactName", "email", "phone", "city"] as const
    ).filter((k) => values[k].trim().length === 0);

    if (missing.length) {
      setError(t.signup.errors.missing);
      return;
    }
    if (!values.email.includes("@")) {
      setError(t.signup.errors.invalidEmail);
      return;
    }

    // No backend yet — this is the validation-marketing stub. We log so it's
    // obvious during manual testing that the form "works" end-to-end.
    // eslint-disable-next-line no-console
    console.info("[carlib-landing] garage signup", values);
    setSubmitted(true);
  };

  return (
    <section
      id="get-started"
      className="bg-ink text-white"
      aria-labelledby="garage-signup-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:grid-cols-[1.05fr_1fr] sm:px-12 sm:py-28">
        {/* Pitch side */}
        <div className="flex flex-col justify-center gap-6">
          <Kicker tone="yellow" className="text-brand-yellow">
            {t.signup.kicker}
          </Kicker>
          <h2
            id="garage-signup-heading"
            className="max-w-md font-medium text-4xl leading-[1.08] tracking-tight sm:text-5xl"
          >
            {t.signup.heading}
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-white/70">
            {t.signup.pitch}
          </p>
          <ul className="mt-2 space-y-2 text-[15px] text-white/75">
            {t.signup.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <Dot /> {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Form side — surfaces the iOS CarlibTextField treatment on web:
            52px height, 12px radius, filled with no stroke, label above in
            sentence case (no uppercase tracking). Matches
            Carlib/DesignSystem/Components/CarlibTextField.swift. */}
        <div>
          {submitted ? (
            <SuccessState />
          ) : (
            <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
              <FieldRow
                id="shopName"
                label={t.signup.fields.shopName}
                placeholder={t.signup.fields.shopNamePlaceholder}
                value={values.shopName}
                onChange={update("shopName")}
                autoComplete="organization"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <FieldRow
                  id="contactName"
                  label={t.signup.fields.contactName}
                  placeholder={t.signup.fields.contactNamePlaceholder}
                  value={values.contactName}
                  onChange={update("contactName")}
                  autoComplete="name"
                />
                <FieldRow
                  id="city"
                  label={t.signup.fields.city}
                  placeholder={t.signup.fields.cityPlaceholder}
                  value={values.city}
                  onChange={update("city")}
                  autoComplete="address-level2"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <FieldRow
                  id="email"
                  label={t.signup.fields.email}
                  placeholder={t.signup.fields.emailPlaceholder}
                  value={values.email}
                  onChange={update("email")}
                  type="email"
                  autoComplete="email"
                />
                <FieldRow
                  id="phone"
                  label={t.signup.fields.phone}
                  placeholder={t.signup.fields.phonePlaceholder}
                  value={values.phone}
                  onChange={update("phone")}
                  type="tel"
                  autoComplete="tel"
                />
              </div>

              {error && (
                <p role="alert" className="text-[13px] text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={cn(
                  // Mirrors CarlibButton (pill, 52pt height, medium weight).
                  "mt-3 inline-flex h-13 items-center justify-center rounded-full",
                  "bg-brand-yellow px-7 text-[15px] font-medium text-ink",
                  "transition duration-150 ease-out hover:bg-brand-yellow/90",
                  "active:scale-[0.98]"
                )}
              >
                {t.signup.submit}
              </button>

              <p className="text-center text-[13px] text-white/50">
                {t.signup.disclaimer}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FieldRow({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[14px] font-medium text-white/60">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          // iOS CarlibTextField parity: 52px height, 12px radius (md token
          // in globals.css, mirroring CarlibRadius.md), filled surface,
          // no stroke. Focus is a soft yellow glow, not a hard ring.
          "h-13 rounded-md bg-white/[0.06] px-4 text-[15px] text-white",
          "placeholder:text-white/30",
          "outline-none transition-[box-shadow,background-color] duration-150",
          "focus:bg-white/[0.09] focus:shadow-[0_0_0_2px_rgba(245,183,0,0.55)]"
        )}
      />
    </label>
  );
}

function SuccessState() {
  const t = useT();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-yellow/15 text-brand-yellow">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
          <path d="M5 12.5l4 4 10-10" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-white">{t.signup.success.heading}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-white/65">
        {t.signup.success.body}
      </p>
    </div>
  );
}

function Dot() {
  return (
    <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-brand-yellow" />
  );
}
