import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  num,
  title,
  kicker,
  children,
  ink = false,
}: {
  id: string;
  num: string;
  title: string;
  kicker?: string;
  children: ReactNode;
  ink?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-14 border-t px-6 py-16 md:scroll-mt-8 md:px-12 md:py-24",
        ink ? "border-ink-700 bg-ink text-bone" : "border-rule bg-bone text-ink",
      )}
    >
      <header className="mb-10 max-w-3xl">
        <p
          className={cn(
            "font-sans text-xs font-medium uppercase tracking-[0.22em]",
            ink ? "text-brass" : "text-brass-deep",
          )}
        >
          {num}
          {kicker ? `  /  ${kicker}` : ""}
        </p>
        <h2
          className={cn(
            "mt-3 font-display text-3xl font-medium tracking-tight text-balance opsz-display md:text-4xl",
            ink ? "text-bone" : "text-ink",
          )}
        >
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-2xl font-sans text-base leading-relaxed text-pretty text-ink/90",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Swatch({
  name,
  hex,
  rgb,
  use,
  fg = "bone",
}: {
  name: string;
  hex: string;
  rgb: string;
  use: string;
  fg?: "bone" | "ink";
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(hex);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className="group min-h-44 text-left"
      style={{ background: hex, color: fg === "bone" ? "#F4F1EA" : "#12110F" }}
    >
      <div className="flex h-full min-h-44 flex-col justify-between p-4">
        <div>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] opacity-80">
            {copied ? "Copied" : name}
          </p>
          <p className="mt-2 font-mono text-sm tabular">{hex}</p>
          <p className="font-mono text-xs tabular opacity-70">RGB {rgb}</p>
        </div>
        <p className="font-sans text-xs leading-snug opacity-80">{use}</p>
      </div>
    </button>
  );
}

export function DoDont({ yes, no }: { yes: string; no: string }) {
  return (
    <div className="grid gap-px bg-rule md:grid-cols-2">
      <figure className="bg-paper p-5 md:p-6">
        <figcaption className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-recovered">
          Use
        </figcaption>
        <p className="mt-3 font-display text-xl font-medium leading-snug text-ink">{yes}</p>
      </figure>
      <figure className="bg-paper p-5 md:p-6">
        <figcaption className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-leak">
          Never
        </figcaption>
        <p className="mt-3 font-sans text-sm leading-relaxed text-stone line-through decoration-leak/40">
          {no}
        </p>
      </figure>
    </div>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 font-sans text-xs leading-snug text-stone">{children}</p>
  );
}
