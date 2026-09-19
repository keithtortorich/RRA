import type { ReactNode } from "react";
import { logoDirections, typeRoles } from "@/brand/copy";
import { rra, rraRgb } from "@/brand/tokens";
import { AppIcon, Lockup, Seal, SEAL, SEAL_PATHS, Wordmark } from "@/components/seal";
import { Caption, Prose, Section, Swatch } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

function LockupCard({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={cn("flex min-h-44 flex-col justify-between border border-rule p-6", className)}
    >
      <div className="flex flex-1 items-center">{children}</div>
      <figcaption className="mt-6 font-sans text-xs uppercase tracking-[0.16em] text-stone">
        {label}
      </figcaption>
    </figure>
  );
}

export function SectionsMark() {
  return (
    <>
      <Section id="logo-directions" num="08" kicker="Mark" title="Logo concept directions">
        <Prose>
          <p>
            Four directions were built around recovery, capture, leakage, and the returned total.
            One mark has to survive a 16px favicon, a proposal cover, and a brass foil on a business
            card. The others inform the system; they are not the system.
          </p>
        </Prose>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {logoDirections.map((d) => (
            <figure key={d.id} className="border border-rule bg-paper">
              <img
                src={d.image}
                alt=""
                className="aspect-[4/3] w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
              />
              <figcaption className="p-5">
                <p className="flex items-baseline justify-between gap-3 font-sans text-xs uppercase tracking-[0.16em]">
                  <span className="text-ink">{d.title}</span>
                  <span className={d.status === "Recommended" ? "text-brass-deep" : "text-stone"}>
                    {d.status}
                  </span>
                </p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-stone">{d.idea}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="logo" num="09" kicker="Mark" title="Recommended direction — The Seal">
        <Prose>
          <p>
            A containment ring closed by a brass keystone. Read it as a pipe fitting sealing a leak,
            or as recovered value seated in a dark system. Either reading is correct. It does not
            look like software, marketing, or AI.
          </p>
        </Prose>
        <div className="mt-12 flex justify-center border border-rule bg-paper py-16">
          <Seal className="size-40 text-ink md:size-52" />
        </div>
        <Caption>Primary symbol. Brass is structural, not decorative.</Caption>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <LockupCard label="Horizontal lockup — light">
            <Lockup size="md" />
          </LockupCard>
          <LockupCard label="Horizontal lockup — dark" className="border-ink-700 bg-ink">
            <Lockup size="md" tone="bone" />
          </LockupCard>
          <LockupCard label="Stacked lockup">
            <Lockup stacked size="md" />
          </LockupCard>
          <LockupCard label="Wordmark">
            <Wordmark className="text-5xl" />
          </LockupCard>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[16, 24, 32, 48].map((n) => (
            <figure key={n} className="border border-rule bg-paper p-4">
              <div className="flex h-20 items-center justify-center">
                <Seal className="text-ink" style={{ width: n, height: n }} />
              </div>
              <figcaption className="text-center font-mono text-xs text-stone">{n}px</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <figure className="border border-rule bg-paper p-4">
            <AppIcon className="mx-auto size-16" />
            <figcaption className="mt-3 text-center font-sans text-xs text-stone">
              App icon
            </figcaption>
          </figure>
          <figure className="border border-rule bg-ink p-4">
            <Seal className="mx-auto size-16 text-bone" />
            <figcaption className="mt-3 text-center font-sans text-xs text-bone/60">
              On ink
            </figcaption>
          </figure>
          <figure className="border border-rule bg-paper p-4">
            <Seal className="mx-auto size-16 text-ink" variant="mono" />
            <figcaption className="mt-3 text-center font-sans text-xs text-stone">Mono</figcaption>
          </figure>
          <figure className="border border-rule bg-paper p-4">
            <Seal className="mx-auto size-16 text-ink" variant="gap" />
            <figcaption className="mt-3 text-center font-sans text-xs text-stone">
              Open leak (diagrams only)
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section id="construction" num="10" kicker="Mark" title="Logo construction">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="border border-rule bg-paper p-6 md:p-10">
            <svg viewBox="0 0 64 64" className="w-full text-ink">
              <defs>
                <pattern id="g" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M8 0H0V8" fill="none" stroke={rra.rule} strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="64" height="64" fill={rra.paper} />
              <rect width="64" height="64" fill="url(#g)" />
              <circle cx="32" cy="32" r="22" fill="none" stroke={rra.rule} strokeWidth="0.4" />
              <line x1="32" y1="0" x2="32" y2="64" stroke={rra.rule} strokeWidth="0.4" />
              <line x1="0" y1="32" x2="64" y2="32" stroke={rra.rule} strokeWidth="0.4" />
              <path
                d={SEAL_PATHS.ring}
                fill="none"
                stroke={rra.ink}
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
          </div>
          <div>
            <dl className="divide-y divide-rule border-y border-rule font-sans text-sm">
              {[
                ["Canvas", "64 × 64 units"],
                ["Center", "32, 32"],
                ["Ring radius", "22 units"],
                ["Ring stroke", "5 units"],
                ["Keystone stroke", "6.5 units"],
                ["Keystone arc", "50° centered at 6 o’clock"],
                ["Ring color", "Ink on light, Bone on dark"],
                ["Keystone color", "Brass. Never Ink. Never Recovered green."],
                ["Clear space", "Half the canvas (32 units) on all sides"],
                ["Minimum digital", "16px symbol, 88px full lockup"],
                ["Minimum print", "8mm symbol"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-4 py-3">
                  <dt className="text-stone">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-leak">
                Do not
              </h3>
              <ul className="mt-3 space-y-2 font-sans text-sm text-stone">
                <li>Recolor the keystone green, red, or gradient.</li>
                <li>Fill the ring with a photograph or a dollar sign.</li>
                <li>Add a drop shadow, outline, or glow.</li>
                <li>Rotate, squeeze, or redraw the arc as an arrow.</li>
                <li>Place the mark on a busy photo without an Ink or Bone plate.</li>
                <li>Set “NETBUILD.PRO” in a geometric tech sans or a script.</li>
                <li>Use the open-gap variant except in leakage diagrams.</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 font-mono text-xs text-stone">
          Wordmark: Newsreader Medium, tracking 0.08em, no italic. The .PRO suffix is smaller and
          Brass. Descriptor: Source Sans 3 Medium, 11px equivalent, uppercase, tracking 0.28em.
          Outline fonts before sending to vendors. Geometry constant: r={SEAL.r}, keystone{" "}
          {SEAL.end - SEAL.start}°.
        </p>
      </Section>

      <Section id="palette" num="11" kicker="Color" title="Primary palette">
        <Prose>
          <p>
            Warm near-black and bone paper, with one metal: antique brass. Brass is native to
            fittings, valves, and nameplates — a vertical wink that never becomes a cartoon wrench.
            Gold was evaluated against oxblood, petrol teal, and forest. Oxblood collides with
            leakage red. Teal reads as generic consulting. Forest turns the firm into a money-green
            brand. Brass holds.
          </p>
        </Prose>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
          <Swatch
            name="Ink"
            hex={rra.ink}
            rgb={rraRgb.ink}
            use="Primary dark. Chrome, wordmark, body on light."
          />
          <Swatch
            name="Ink 800"
            hex={rra.ink800}
            rgb={rraRgb.ink800}
            use="Elevated dark surfaces."
          />
          <Swatch
            name="Bone"
            hex={rra.bone}
            rgb={rraRgb.bone}
            use="Page field. Website, reports, book."
            fg="ink"
          />
          <Swatch
            name="Paper"
            hex={rra.paper}
            rgb={rraRgb.paper}
            use="Raised light surfaces."
            fg="ink"
          />
          <Swatch
            name="Brass"
            hex={rra.brass}
            rgb={rraRgb.brass}
            use="The Seal. Accent on dark. Large type only."
          />
          <Swatch
            name="Brass Deep"
            hex={rra.brassDeep}
            rgb={rraRgb.brassDeep}
            use="Brass as text on Bone. Labels."
          />
          <Swatch name="Stone" hex={rra.stone} rgb={rraRgb.stone} use="Secondary text." />
          <Swatch name="Rule" hex={rra.rule} rgb={rraRgb.rule} use="Hairlines on light." fg="ink" />
        </div>
        <p className="mt-6 font-sans text-sm text-stone">
          Click a chip to copy HEX. Brass on Ink is AAA at large sizes. Brass on Bone is not body
          text — use Brass Deep.
        </p>
      </Section>

      <Section id="ui-palette" num="12" kicker="Color" title="Functional UI palette">
        <Prose>
          <p>
            Functional color is not brand color. Never turn the product green because the work
            involves money. Recovered and Leak appear on amounts, rows, and status — never on the
            mark, never as a page fill.
          </p>
        </Prose>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
          <Swatch
            name="Recovered"
            hex={rra.recovered}
            rgb={rraRgb.recovered}
            use="Confirmed measured recovery only. Closed leak."
          />
          <Swatch
            name="Recovered Soft"
            hex={rra.recoveredSoft}
            rgb={rraRgb.recoveredSoft}
            use="Confirmed recovery row wash and badges."
            fg="ink"
          />
          <Swatch name="Leak" hex={rra.leak} rgb={rraRgb.leak} use="Leakage, loss, warning." />
          <Swatch
            name="Leak Soft"
            hex={rra.leakSoft}
            rgb={rraRgb.leakSoft}
            use="Row wash, badges on light."
            fg="ink"
          />
        </div>
        <div className="mt-8 grid gap-px bg-rule md:grid-cols-2">
          <div className="flex items-baseline justify-between bg-paper px-5 py-6">
            <span className="font-sans text-sm text-stone">Leakage identified</span>
            <span className="font-sans text-2xl font-medium tabular text-leak">−$142,000</span>
          </div>
          <div className="flex items-baseline justify-between bg-paper px-5 py-6">
            <span className="font-sans text-sm text-stone">Estimated recovery opportunity</span>
            <span className="font-sans text-2xl font-medium tabular text-ink">$142,000</span>
          </div>
        </div>
      </Section>

      <Section id="type" num="13" kicker="Type" title="Typography">
        <div className="border border-rule bg-paper px-6 py-10 md:px-12">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-stone">
            Display — Newsreader
          </p>
          <Wordmark className="mt-4 text-5xl opsz-display md:text-7xl" />
          <p className="mt-6 max-w-3xl font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
            Stop losing revenue already entering your business.
          </p>
        </div>
        <div className="mt-4 border border-rule bg-paper px-6 py-8 md:px-12">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-stone">
            Body — Source Sans 3
          </p>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ink">
            NETBUILD.PRO locates the leak in residential HVAC operations, puts a conservative number
            on it, and recovers the highest-value loss first. Most companies do not have a demand
            problem. They have a capture problem.
          </p>
          <p className="mt-6 font-sans text-3xl font-medium tabular text-ink">$142,000</p>
          <p className="mt-1 font-sans text-xs uppercase tracking-[0.18em] text-stone">
            Data — Source Sans 3 tabular lining
          </p>
          <p className="mt-4 font-mono text-sm text-stone">SCAN-0841 · Source Code Pro</p>
        </div>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-y border-rule text-left font-sans text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.16em] text-stone">
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Face</th>
                <th className="py-3 pr-4 font-medium">Use</th>
                <th className="py-3 font-medium">Canva</th>
              </tr>
            </thead>
            <tbody>
              {typeRoles.map((row) => (
                <tr key={row.role} className="border-t border-rule align-top">
                  <td className="py-4 pr-4 font-medium text-ink">{row.role}</td>
                  <td className="py-4 pr-4 text-ink">{row.font}</td>
                  <td className="py-4 pr-4 text-stone">{row.use}</td>
                  <td className="py-4 text-stone">{row.canva}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
