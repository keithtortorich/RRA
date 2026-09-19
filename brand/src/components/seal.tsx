import type { CSSProperties } from "react";
import { rra } from "@/brand/tokens";
import { cn } from "@/lib/utils";

/** Geometry of The Seal — 64-unit canvas, ring r=22, keystone 50° at 6 o'clock. */
export const SEAL = {
  view: 64,
  cx: 32,
  cy: 32,
  r: 22,
  ringWidth: 5,
  keystoneWidth: 6.5,
  start: 65,
  end: 115,
} as const;

function polar(deg: number, radius = SEAL.r) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: +(SEAL.cx + radius * Math.cos(rad)).toFixed(3),
    y: +(SEAL.cy + radius * Math.sin(rad)).toFixed(3),
  };
}

const a = polar(SEAL.end);
const b = polar(SEAL.start);
export const SEAL_PATHS = {
  ring: `M ${a.x} ${a.y} A ${SEAL.r} ${SEAL.r} 0 1 1 ${b.x} ${b.y}`,
  keystone: `M ${b.x} ${b.y} A ${SEAL.r} ${SEAL.r} 0 0 1 ${a.x} ${a.y}`,
};

type SealProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
  variant?: "color" | "mono" | "gap";
  ring?: string;
  keystone?: string;
};

export function Seal({
  className,
  style,
  title = "NETBUILD.PRO Seal",
  variant = "color",
  ring,
  keystone,
}: SealProps) {
  const ringColor = ring ?? "currentColor";
  const keyColor =
    variant === "mono" ? ringColor : variant === "gap" ? rra.leak : (keystone ?? rra.brass);

  return (
    <svg
      viewBox={`0 0 ${SEAL.view} ${SEAL.view}`}
      className={cn("block", className)}
      style={style}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d={SEAL_PATHS.ring}
        fill="none"
        stroke={ringColor}
        strokeWidth={SEAL.ringWidth}
        strokeLinecap="butt"
      />
      {variant !== "gap" ? (
        <path
          d={SEAL_PATHS.keystone}
          fill="none"
          stroke={keyColor}
          strokeWidth={SEAL.keystoneWidth}
          strokeLinecap="butt"
        />
      ) : (
        <circle cx="32" cy="54.2" r="2.2" fill={rra.leak} />
      )}
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "bone";
}) {
  return (
    <span
      aria-label="NETBUILD.PRO"
      className={cn(
        "netbuild-wordmark inline-flex items-baseline whitespace-nowrap font-display font-medium leading-none",
        tone === "ink" ? "text-ink" : "text-bone",
        className,
      )}
    >
      <span>NETBUILD</span>
      <span className="netbuild-pro">.PRO</span>
    </span>
  );
}

export function Lockup({
  className,
  tone = "ink",
  stacked = false,
  withName = true,
  size = "md",
}: {
  className?: string;
  tone?: "ink" | "bone";
  stacked?: boolean;
  withName?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sealSize = { sm: "size-8", md: "size-11", lg: "size-16" }[size];
  const word = { sm: "text-xl", md: "text-3xl", lg: "text-5xl" }[size];
  const muted = tone === "ink" ? "text-stone" : "text-bone/70";

  return (
    <div
      className={cn(
        stacked ? "flex flex-col items-start gap-3" : "flex items-center gap-3.5",
        className,
      )}
    >
      <Seal
        className={cn(sealSize, tone === "ink" ? "text-ink" : "text-bone")}
        title="NETBUILD.PRO"
      />
      <div className="flex flex-col justify-center">
        <Wordmark tone={tone} className={word} />
        {withName ? (
          <span
            className={cn(
              "mt-1 font-sans text-xs font-medium uppercase leading-none tracking-[0.28em]",
              muted,
            )}
          >
            Revenue Recovery Firm
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function AppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("block", className)}
      role="img"
      aria-label="NETBUILD.PRO app icon"
    >
      <rect width="64" height="64" rx="14" fill={rra.ink} />
      <path
        d={SEAL_PATHS.ring}
        fill="none"
        stroke={rra.bone}
        strokeWidth={SEAL.ringWidth}
        strokeLinecap="butt"
      />
      <path
        d={SEAL_PATHS.keystone}
        fill="none"
        stroke={rra.brass}
        strokeWidth={SEAL.keystoneWidth}
        strokeLinecap="butt"
      />
    </svg>
  );
}
