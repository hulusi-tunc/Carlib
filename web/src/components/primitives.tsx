import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Small uppercase tracking label with a yellow dot — the same kicker
 * treatment used on the iOS driver home hero states.
 */
export function Kicker({
  children,
  className,
  tone = "yellow",
}: {
  children: ReactNode;
  className?: string;
  tone?: "yellow" | "green";
}) {
  const dotColor = tone === "yellow" ? "bg-brand-yellow" : "bg-status-completed";
  const textColor = tone === "yellow" ? "text-brand-yellow" : "text-status-completed";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.14em]",
        textColor,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      {children}
    </span>
  );
}

/** Kicker + big section title. */
export function SectionHeader({
  kicker,
  title,
  kickerTone = "yellow",
  className,
  align = "left",
}: {
  kicker: string;
  title: string;
  kickerTone?: "yellow" | "green";
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Kicker tone={kickerTone}>{kicker}</Kicker>
      <h2 className="max-w-2xl font-medium text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

/** Pill button. Primary = black fill, secondary = light surface. */
export function PillButton({
  href,
  children,
  variant = "primary",
  size = "lg",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition duration-150 ease-out active:scale-[0.98]";
  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-sm",
    lg: "h-13 px-7 text-[15px]",
  } as const;
  const styles = {
    primary: "bg-ink text-white hover:bg-ink/90",
    secondary: "bg-tile text-ink hover:bg-border/60",
    ghost: "text-ink underline-offset-4 hover:underline",
  } as const;
  return (
    <Link href={href} className={cn(base, sizes[size], styles[variant], className)}>
      {children}
    </Link>
  );
}

/** Rounded tile card used for benefit items and the CTA block. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-tile p-6 ring-1 ring-border/60",
        className
      )}
    >
      {children}
    </div>
  );
}
