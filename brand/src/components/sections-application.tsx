import { messaging } from "@/brand/copy";
import { rra, rraRgb } from "@/brand/tokens";
import { brandIcons } from "@/components/brand-icons";
import { Lockup, Seal } from "@/components/seal";
import { Caption, Prose, Section } from "@/components/ui-bits";

const leaks = [
  { name: "After-hours unanswered", amount: 142000, share: 100 },
  { name: "Estimate, no follow-up", amount: 96000, share: 68 },
  { name: "Membership under-attach", amount: 64000, share: 45 },
  { name: "Repair-to-replace miss", amount: 41000, share: 29 },
];

function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function SectionsApplication() {
  return (
    <>
      <Section id="icons" num="14" kicker="System" title="Iconography">
        <Prose>
          <p>
            24px grid. 1.5px stroke. Round caps. No fill except a single confirmed recovery or leak
            mark. No friendly blobs, no gradient orbs, no Lucide icons in marketing materials.
            Product UI may use Lucide only if stroke is reduced to 1.5 and color is Ink / Bone /
            Brass.
          </p>
        </Prose>
        <ul className="mt-10 grid grid-cols-2 border border-rule sm:grid-cols-4">
          {brandIcons.map((icon) => (
            <li
              key={icon.name}
              className="flex flex-col items-center gap-3 border-rule border-r border-b p-6 last:border-r-0"
            >
              <icon.node className="size-8 text-ink" />
              <span className="font-sans text-xs text-stone">{icon.name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="photo" num="15" kicker="System" title="Photography and visual style">
        <Prose>
          <p>
            Evidence, not lifestyle. The central image of the brand is a leak being found: a
            fitting, a droplet, an empty chair after hours. People appear as hands at work, not as
            smiling portraits. No stock “diverse call center.” No robots. No dashboards with fake
            neon charts.
          </p>
        </Prose>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <figure className="md:col-span-2">
            <img
              src="/brand/photos/leak-fitting.jpg"
              alt="Brass fitting with a single droplet forming at the joint"
              className="aspect-square w-full object-cover md:aspect-[2/1] outline outline-1 -outline-offset-1 outline-ink/10"
            />
            <Caption>
              Master metaphor — the leak, found. Use full-bleed on covers and scan intros.
            </Caption>
          </figure>
          <figure>
            <img
              src="/brand/photos/office-night.jpg"
              alt="Empty HVAC office after hours"
              className="aspect-video w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
            />
            <Caption>After hours. Demand is still calling. Nobody is there.</Caption>
          </figure>
          <figure>
            <img
              src="/brand/photos/van-dusk.jpg"
              alt="Work van at dusk on a residential street"
              className="aspect-video w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
            />
            <Caption>Residential HVAC, observed. No vehicle wrap logos.</Caption>
          </figure>
          <figure>
            <img
              src="/brand/photos/hands-panel.jpg"
              alt="Technician's hands closing a furnace panel"
              className="aspect-[3/2] w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
            />
            <Caption>Hands, not faces. Operational respect.</Caption>
          </figure>
          <figure>
            <img
              src="/brand/photos/clipboard.jpg"
              alt="Clipboard, work order, and calculator"
              className="aspect-[3/2] w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
            />
            <Caption>
              Paper evidence. Keep type unreadable in stock; real reports use our type.
            </Caption>
          </figure>
        </div>
        <ul className="mt-8 grid gap-2 font-sans text-sm text-stone md:grid-cols-2">
          <li>Warm tungsten against cool window light.</li>
          <li>Desaturated, slightly analog. Fine grain allowed.</li>
          <li>Crop tight on tools, paper, fittings, rooms.</li>
          <li>Never overlay slogans in script on photographs.</li>
        </ul>
      </Section>

      <Section id="data" num="16" kicker="System" title="Data visualization">
        <Prose>
          <p>
            A scan should make leakage obvious in a few seconds. Direct labels. No rainbow. No 3D.
            No legends if a label will do. Dollars always tabular. Round conservatively; never
            display false precision.
          </p>
        </Prose>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="border border-rule bg-paper p-6">
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-stone">
              Example scan — conservative annual leakage
            </p>
            <ul className="mt-6 space-y-5">
              {leaks.map((row) => (
                <li key={row.name}>
                  <div className="flex items-baseline justify-between gap-4 font-sans text-sm">
                    <span className="text-ink">{row.name}</span>
                    <span className="tabular font-medium text-leak">{money(row.amount)}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-leak-soft">
                    <div className="h-1.5 bg-leak" style={{ width: `${row.share}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-baseline justify-between border-t border-rule pt-4">
              <span className="font-sans text-sm text-stone">
                Highest-value estimated opportunity
              </span>
              <span className="font-display text-2xl font-medium tabular text-ink">
                {money(142000)}
              </span>
            </div>
          </div>
          <div className="border border-rule bg-ink p-6 text-bone">
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-brass">
              Before / after — The Seal as diagram
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              <figure className="flex flex-col items-center">
                <Seal className="size-24 text-bone" variant="gap" />
                <figcaption className="mt-4 text-center font-sans text-xs text-bone/60">
                  Leak identified
                  <span className="mt-1 block font-sans text-lg tabular text-leak-soft">
                    −$142k
                  </span>
                </figcaption>
              </figure>
              <figure className="flex flex-col items-center">
                <Seal className="size-24 text-bone" />
                <figcaption className="mt-4 text-center font-sans text-xs text-bone/60">
                  Recovery target
                  <span className="mt-1 block font-sans text-lg tabular text-brass">
                    Prioritized
                  </span>
                </figcaption>
              </figure>
            </div>
            <p className="mt-8 font-sans text-sm leading-relaxed text-bone/70">
              Use the open-gap Seal only in this diagram. Everywhere else the keystone is seated.
              Brass marks brand structure and primary action. Recovered green marks confirmed
              measured recovery. Leak red marks loss.
            </p>
          </div>
        </div>
      </Section>

      <Section id="sales-tool" num="17" kicker="Application" title="Sales Tool visual direction">
        <Prose>
          <p>
            Do not redesign the product. Skin it as a forensic workstation, not as a SaaS marketing
            dashboard. Dark chrome. Bone readouts. Brass marks brand accents, selected states, and
            the primary action. Recovered green is reserved for confirmed measured recovery. Sharp
            corners. Hairlines.
          </p>
        </Prose>
        <div className="mt-10 overflow-hidden border border-ink-700 bg-ink text-bone">
          <header className="flex items-center justify-between gap-4 border-b border-ink-700 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <Lockup tone="bone" withName={false} size="sm" />
              <span className="hidden font-sans text-xs uppercase tracking-[0.2em] text-bone/45 sm:inline">
                {messaging.salesToolLine}
              </span>
            </div>
            <span className="font-mono text-xs text-bone/45">SCAN-0841</span>
          </header>
          <div className="grid md:grid-cols-[220px_1fr]">
            <aside className="border-b border-ink-700 p-4 md:border-r md:border-b-0">
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-bone/45">Leaks</p>
              <ul className="mt-3 space-y-1 font-sans text-sm">
                {["After-hours unanswered", "Estimate follow-up", "Membership attach"].map(
                  (item, i) => (
                    <li
                      key={item}
                      className={
                        i === 0 ? "bg-ink-800 px-2 py-2 text-bone" : "px-2 py-2 text-bone/55"
                      }
                    >
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </aside>
            <div className="p-5 md:p-8">
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-brass">
                Highest-value leak
              </p>
              <h3 className="mt-3 font-display text-2xl font-medium md:text-3xl">
                After-hours unanswered
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="border border-ink-700 p-4">
                  <p className="font-sans text-xs text-bone/45">Conservative annual</p>
                  <p className="mt-1 font-sans text-2xl font-medium tabular text-leak-soft">
                    −$142,000
                  </p>
                </div>
                <div className="border border-ink-700 p-4">
                  <p className="font-sans text-xs text-bone/45">Recovery target</p>
                  <p className="mt-1 font-sans text-2xl font-medium tabular text-brass">
                    Prioritized
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mt-6 min-h-11 bg-brass px-5 font-sans text-sm font-medium text-ink"
              >
                {messaging.offerCta}
              </button>
            </div>
          </div>
        </div>
        <Caption>
          Specimen only. Keep existing Sales Tool behavior. Header language: “NETBUILD.PRO · SIZZLE”
          with “Find the leak. Recover the revenue.” as the quiet line.
        </Caption>
      </Section>

      <Section id="website" num="18" kicker="Application" title="Website visual direction">
        <Prose>
          <p>
            Bone field. Left-aligned editorial hero. One brass rule. One primary action. No agency
            mosaic, no numbered pastel process, no chatbot widget in the corner. The site should
            feel like a letter from counsel.
          </p>
        </Prose>
        <div className="mt-10 border border-rule bg-bone">
          <div className="flex items-center justify-between border-b border-rule px-5 py-4">
            <Lockup size="sm" />
            <span className="hidden font-sans text-xs uppercase tracking-[0.18em] text-stone sm:inline">
              Scan · Method · Contact
            </span>
          </div>
          <div className="px-5 py-12 md:px-12 md:py-16">
            <p className="font-sans text-xs uppercase tracking-[0.22em] text-brass-deep">
              Revenue Recovery Firm
            </p>
            <h3 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight text-ink md:text-5xl">
              {messaging.hero}
            </h3>
            <div className="mt-5 h-px w-16 bg-brass" />
            <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-stone">
              {messaging.subhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex min-h-11 items-center bg-ink px-5 font-sans text-sm font-medium text-bone">
                {messaging.scanCta}
              </span>
              <span className="inline-flex min-h-11 items-center border border-rule px-5 font-sans text-sm text-ink">
                How the scan works
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="proposal" num="19" kicker="Application" title="Proposal and report direction">
        <Prose>
          <p>
            Letter, 1-inch margins, hairline rules. Cover is Ink. Interior is Bone with optional
            ledger rules. Every finding is Leak → Conservative value → Recovery action.
            Confidential, always.
          </p>
        </Prose>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="aspect-[8.5/11] bg-ink p-8 text-bone md:p-10">
            <Seal className="size-12 text-bone" />
            <p className="mt-16 font-sans text-xs uppercase tracking-[0.24em] text-brass">
              Confidential
            </p>
            <h3 className="mt-4 font-display text-3xl font-medium leading-tight">
              Revenue Recovery Scan
            </h3>
            <p className="mt-4 max-w-xs font-sans text-sm text-bone/70">
              Conservative findings. Highest-value leak first.
            </p>
            <div className="mt-16 border-t border-ink-700 pt-4 font-sans text-sm">
              <p>Prepared for Hale & Sons Heating</p>
              <p className="text-bone/55">18 September 2026</p>
            </div>
          </div>
          <div className="aspect-[8.5/11] border border-rule bg-paper p-8 md:p-10">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-brass-deep">
              Finding 01
            </p>
            <h3 className="mt-3 font-display text-2xl font-medium text-ink">
              After-hours unanswered
            </h3>
            <p className="mt-4 font-sans text-sm leading-relaxed text-stone">
              Eighteen percent of inbound demand arrives when nobody is on the board. Conservative
              recovery, not best case: one hundred forty-two thousand dollars a year.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="bg-leak-soft p-3">
                <p className="font-sans text-xs text-leak">Leakage</p>
                <p className="font-sans text-xl font-medium tabular text-leak">$142,000</p>
              </div>
              <div className="border border-rule bg-paper p-3">
                <p className="font-sans text-xs text-stone">Estimated opportunity</p>
                <p className="font-sans text-xl font-medium tabular text-brass-deep">$142,000</p>
              </div>
            </div>
            <p className="mt-8 font-sans text-xs text-stone">
              Recommended action — $997 Good implementation.
            </p>
          </div>
        </div>
      </Section>

      <Section id="canva" num="20" kicker="Application" title="Canva implementation">
        <Prose>
          <p>
            Start from a blank document. Do not use Canva’s “Corporate,” “Gradient Startup,” or
            Magic Studio palettes. Build a Brand Kit named NETBUILD.PRO and lock it.
          </p>
        </Prose>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-y border-rule text-left font-sans text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.16em] text-stone">
                <th className="py-3 pr-4 font-medium">Item</th>
                <th className="py-3 font-medium">Specification</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Brand Kit name", "NETBUILD.PRO"],
                ["Logos to upload", "Seal (on light), Seal (on ink), App icon, Horizontal lockup"],
                ["Primary", `${rra.ink}  Ink. ${rra.bone}  Bone. ${rra.brass}  Brass.`],
                [
                  "Secondary",
                  `${rra.brassDeep}  Brass Deep. ${rra.stone}  Stone. ${rra.rule}  Rule.`,
                ],
                [
                  "Functional (optional)",
                  `${rra.recovered}  Confirmed recovery. ${rra.leak}  Leak.`,
                ],
                ["Heading font", "Newsreader. Fallback: Libre Baskerville."],
                ["Body font", "Source Sans 3. Fallback: Source Sans Pro."],
                ["Presentation", "1920 × 1080. Bone field. Ink covers. No rounded cards."],
                ["Proposal / report", "US Letter 8.5 × 11. 1-inch margins."],
                ["Instagram", "1080 × 1080. Seal centered on Ink."],
                ["Story", "1080 × 1920. Same, extra clear space."],
                [
                  "LinkedIn / X banner",
                  "1584 × 396 / 1500 × 500. Ink, lockup left, no slogan parade.",
                ],
                ["Business card", "3.5 × 2 in. Ink reverse with Seal. Bone front with lockup."],
                ["Email signature", "Lockup 140px wide. Descriptor in Source Sans 11px Stone."],
                ["Corners", "0–2px. Never Canva’s default 16px rounding."],
                ["Effects", "No shadows, glows, or overlays above 8% black."],
              ].map(([k, v]) => (
                <tr key={k} className="border-t border-rule align-top">
                  <td className="py-3 pr-4 font-medium text-ink">{k}</td>
                  <td className="py-3 text-stone">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="handoff" num="—" kicker="Handoff" title="NETBUILD.PRO brand handoff" ink>
        <p className="max-w-2xl font-sans text-sm leading-relaxed text-bone/80">
          Use this page as the implementation contract. Do not interpret. Do not add a second
          accent. Do not introduce Inter, purple, or rounded SaaS chrome.
        </p>
        <dl className="mt-10 divide-y divide-ink-700 border-y border-ink-700 font-sans text-sm">
          {[
            ["Name", "NETBUILD.PRO  /  Revenue Recovery Firm"],
            ["Line", messaging.hero],
            ["Tool line", messaging.salesToolLine],
            ["Mark", "The Seal — containment ring, brass keystone at 6 o’clock"],
            ["Ink", `${rra.ink}  RGB ${rraRgb.ink}`],
            ["Bone", `${rra.bone}  RGB ${rraRgb.bone}`],
            ["Brass", `${rra.brass}  RGB ${rraRgb.brass}`],
            ["Brass Deep", `${rra.brassDeep}  RGB ${rraRgb.brassDeep}`],
            ["Recovered", `${rra.recovered}  — confirmed measured amounts only`],
            ["Leak", `${rra.leak}  — amounts only`],
            ["Display", "Newsreader Medium"],
            ["Body / UI", "Source Sans 3"],
            ["Data", "Source Sans 3 tabular lining. IDs in Source Code Pro."],
            ["Radius", "2px maximum. Prefer 0."],
            ["CTA Scan", messaging.scanCta],
            ["CTA Offer", messaging.offerCta],
            ["Tokens", "/brand/tokens.json  ·  /brand/rra-tokens.css"],
            [
              "Logo files",
              "/brand/logo/rra-seal.svg  ·  rra-seal-on-ink.svg  ·  rra-app-icon.svg  ·  rra-lockup.svg",
            ],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-1 py-3 md:grid-cols-[160px_1fr]">
              <dt className="text-brass">{k}</dt>
              <dd className="text-bone">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 font-display text-2xl font-medium text-bone">
          Look like a firm that can find, and recover, serious lost revenue.
        </p>
      </Section>
    </>
  );
}
