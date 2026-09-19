import { useEffect, useState } from "react";
import { nav } from "@/brand/copy";
import { SectionsApplication } from "@/components/sections-application";
import { SectionsIdentity } from "@/components/sections-identity";
import { SectionsMark } from "@/components/sections-mark";
import { Lockup, Seal, Wordmark } from "@/components/seal";
import { cn } from "@/lib/utils";

export function BrandBook() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("positioning");

  useEffect(() => {
    const ids = nav.map((item) => item.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target.id) setActive(vis.target.id);
      },
      { rootMargin: "0px 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh bg-bone text-ink">
      <a
        href="#positioning"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-brass focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to system
      </a>

      <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-rule bg-bone px-4 py-3 lg:hidden">
        <Lockup size="sm" withName={false} />
        <button
          type="button"
          className="min-h-11 px-3 font-sans text-xs font-medium uppercase tracking-[0.18em] text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Close" : "Contents"}
        </button>
      </header>

      {open ? (
        <nav className="fixed top-0 right-0 bottom-0 left-0 z-40 overflow-y-auto bg-bone px-6 pt-20 pb-10 lg:hidden">
          <ol className="space-y-1">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="flex min-h-11 items-center gap-4 font-sans text-sm text-ink"
                  onClick={() => setOpen(false)}
                >
                  <span className="w-6 font-mono text-xs text-brass-deep">{item.n}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <Cover />

      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        <nav className="sticky top-0 hidden h-dvh overflow-y-auto border-r border-rule bg-bone px-5 py-8 lg:block">
          <Lockup size="sm" />
          <p className="mt-6 font-sans text-xs uppercase tracking-[0.2em] text-stone">
            Brand System
          </p>
          <ol className="mt-6 space-y-0.5">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "flex min-h-9 items-center gap-3 whitespace-nowrap font-sans text-sm leading-none",
                    active === item.id ? "text-ink" : "text-stone hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "w-5 font-mono text-xs tabular",
                      active === item.id ? "text-brass-deep" : "text-rule",
                    )}
                  >
                    {item.n}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main>
          <SectionsIdentity />
          <SectionsMark />
          <SectionsApplication />
          <footer className="border-t border-ink-700 bg-ink px-6 py-10 text-bone md:px-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <Lockup tone="bone" size="sm" />
              <p className="max-w-sm font-sans text-xs leading-relaxed text-bone/50">
                NETBUILD.PRO Brand System. For designers and engineers. Pricing, offer, and Sales
                Tool behavior are unchanged. Visual identity only.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Cover() {
  return (
    <header className="relative bg-ink text-bone lg:grid lg:min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex min-h-[72vh] flex-col justify-between px-6 py-10 md:px-12 md:py-12 lg:min-h-dvh lg:px-16">
        <div className="flex items-center gap-3">
          <Seal className="size-9 text-bone" />
          <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-bone/55">
            Brand System
          </p>
        </div>
        <div>
          <Wordmark className="text-5xl opsz-display sm:text-6xl md:text-8xl" />
          <p className="mt-4 font-sans text-xs font-medium uppercase tracking-[0.28em] text-brass">
            Revenue Recovery Firm
          </p>
          <div className="mt-8 h-px w-16 bg-brass" />
          <p className="mt-8 max-w-md font-display text-2xl font-medium leading-snug text-bone md:text-3xl">
            Stop losing revenue already entering your business.
          </p>
        </div>
        <p className="font-sans text-xs text-bone/40">Confidential · Internal identity · 2026</p>
      </div>
      <div className="relative min-h-[42vh] lg:min-h-dvh">
        <img
          src="/brand/photos/seal-object.jpg"
          alt="Physical study of The Seal — a charcoal ring closed by a brass keystone"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </header>
  );
}
