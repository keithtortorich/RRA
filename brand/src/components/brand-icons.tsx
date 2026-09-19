import type { SVGProps } from "react";

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type P = SVGProps<SVGSVGElement> & { title: string };

function Frame({ title, children, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={title} {...rest}>
      <title>{title}</title>
      {children}
    </svg>
  );
}

export function IconLeak(p: Omit<P, "title">) {
  return (
    <Frame title="Leak" {...p}>
      <circle cx="12" cy="9.5" r="6" {...s} />
      <path d="M9.2 14.6c.6.9 1.6 1.6 2.8 1.6s2.2-.7 2.8-1.6" {...s} />
      <path d="M12 16.4v3.1" {...s} />
      <circle cx="12" cy="20.7" r="0.85" fill="currentColor" />
    </Frame>
  );
}

export function IconSeal(p: Omit<P, "title">) {
  return (
    <Frame title="Seal" {...p}>
      <path d="M6.2 16.6a8 8 0 1 1 11.6 0" {...s} />
      <path d="M6.2 16.6a8 8 0 0 0 11.6 0" {...s} strokeWidth={2} />
    </Frame>
  );
}

export function IconScan(p: Omit<P, "title">) {
  return (
    <Frame title="Scan" {...p}>
      <path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3" {...s} />
      <circle cx="12" cy="12" r="3.2" {...s} />
    </Frame>
  );
}

export function IconQuantify(p: Omit<P, "title">) {
  return (
    <Frame title="Quantify" {...p}>
      <path d="M5 19V6M5 19h14" {...s} />
      <path d="M8 15h2.5M12.5 11H15M8 11h2.5M12.5 15H15" {...s} />
      <path d="M5 19h14" {...s} />
    </Frame>
  );
}

export function IconRecover(p: Omit<P, "title">) {
  return (
    <Frame title="Recover" {...p}>
      <path d="M12 4v10" {...s} />
      <path d="M8 8l4-4 4 4" {...s} />
      <path d="M5 16.5h14" {...s} />
      <path d="M5 19h14" {...s} />
    </Frame>
  );
}

export function IconCall(p: Omit<P, "title">) {
  return (
    <Frame title="Missed call" {...p}>
      <path d="M8 4.5h8l1.5 4.2-2.8 1.6a11 11 0 0 1-5.4 0L6.5 8.7 8 4.5z" {...s} />
      <path d="M9.2 19.2c3.6 3.6 8.4 4.4 10.3 2.5 1.2-1.2.2-3.4-1.4-5.2" {...s} />
      <path d="M15.5 13.5l3.2 3.2" {...s} />
    </Frame>
  );
}

export function IconEstimate(p: Omit<P, "title">) {
  return (
    <Frame title="Estimate" {...p}>
      <path d="M7 3.5h10v17H7z" {...s} />
      <path d="M9.5 8h5M9.5 11h5M9.5 14h3" {...s} />
    </Frame>
  );
}

export function IconMembership(p: Omit<P, "title">) {
  return (
    <Frame title="Membership" {...p}>
      <rect x="3.5" y="6" width="17" height="12" rx="1" {...s} />
      <path d="M3.5 10h17" {...s} />
      <path d="M7 14h4" {...s} />
    </Frame>
  );
}

export const brandIcons = [
  { name: "Leak", node: IconLeak },
  { name: "Seal", node: IconSeal },
  { name: "Scan", node: IconScan },
  { name: "Quantify", node: IconQuantify },
  { name: "Recover", node: IconRecover },
  { name: "Missed call", node: IconCall },
  { name: "Estimate", node: IconEstimate },
  { name: "Membership", node: IconMembership },
] as const;
