import {
  messaging,
  personality,
  positioning,
  promise,
  recommendedTagline,
  taglines,
  voice,
} from "@/brand/copy";
import { Caption, DoDont, Prose, Section } from "@/components/ui-bits";

export function SectionsIdentity() {
  return (
    <>
      <Section id="positioning" num="01" kicker="Strategy" title="Brand positioning">
        <p className="max-w-3xl font-display text-2xl font-medium leading-snug text-ink text-balance opsz-display md:text-4xl">
          {positioning.statement}
        </p>
        <p className="mt-6 max-w-xl font-sans text-lg text-stone">{positioning.category}</p>
        <p className="mt-8 max-w-2xl border-l-2 border-brass pl-5 font-display text-xl italic leading-snug text-ink md:text-2xl">
          {positioning.idea}
        </p>
        <div className="mt-12 grid gap-px bg-rule md:grid-cols-2">
          <div className="bg-paper p-6 md:p-8">
            <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-brass-deep">
              NETBUILD.PRO is
            </h3>
            <ul className="mt-5 space-y-3 font-sans text-sm leading-relaxed text-ink">
              {positioning.weAre.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-1 shrink-0 bg-brass" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-paper p-6 md:p-8">
            <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-stone">
              NETBUILD.PRO is not
            </h3>
            <ul className="mt-5 space-y-3 font-sans text-sm leading-relaxed text-stone">
              {positioning.weAreNot.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-1 shrink-0 bg-rule" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="promise" num="02" kicker="Strategy" title="Brand promise">
        <p className="max-w-3xl font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
          {promise.line}
        </p>
        <ol className="mt-12 grid gap-px bg-rule md:grid-cols-3">
          {promise.steps.map((step, i) => (
            <li key={step.t} className="bg-paper p-6 md:p-8">
              <p className="font-mono text-xs tabular text-brass-deep">0{i + 1}</p>
              <h3 className="mt-4 font-display text-2xl font-medium text-ink">{step.t}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-stone">{step.d}</p>
            </li>
          ))}
        </ol>
        <Prose className="mt-10">
          <p>
            The commercial model is fixed: a free evidence scan; a $997 Good implementation for the
            strongest validated leak; Better at $5,000 setup plus $2,500 monthly for the top three
            opportunities; and Best at $7,500 monthly for full ongoing recovery management. No
            revenue share, performance pricing, separate Stella subscription, or agency licensing.
          </p>
        </Prose>
      </Section>

      <Section id="personality" num="03" kicker="Character" title="Brand personality">
        <Prose>
          <p>
            Closer to financial intelligence, forensic accounting, private equity, and high-end
            operating counsel than to an internet marketing firm. If a layout could belong to a
            chatbot company, it does not belong to NETBUILD.PRO.
          </p>
        </Prose>
        <ul className="mt-12 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {personality.map((p) => (
            <li key={p.t} className="bg-paper p-6">
              <h3 className="font-display text-xl font-medium text-ink">{p.t}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-stone">{p.d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="voice" num="04" kicker="Language" title="Brand voice">
        <div className="flex flex-wrap gap-2">
          {voice.is.map((w) => (
            <span
              key={w}
              className="border border-rule bg-paper px-3 py-1.5 font-sans text-sm text-ink"
            >
              {w}
            </span>
          ))}
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-recovered">
              Do
            </h3>
            <ul className="mt-4 space-y-2 font-sans text-sm text-ink">
              {voice.do.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-leak">
              Never write
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {voice.dont.map((d) => (
                <li
                  key={d}
                  className="border border-leak-soft bg-leak-soft px-2 py-1 font-mono text-xs text-leak"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 space-y-px bg-rule">
          {voice.examples.map((ex) => (
            <DoDont key={ex.yes} yes={ex.yes} no={ex.no} />
          ))}
        </div>
      </Section>

      <Section id="messaging" num="05" kicker="Language" title="Primary messaging">
        <dl className="divide-y divide-rule border-y border-rule">
          {[
            ["Brand name", messaging.brandName],
            ["Full name", messaging.fullName],
            ["Positioning statement", messaging.positioning],
            ["One-line explanation", messaging.oneLiner],
            ["Homepage hero", messaging.hero],
            ["Homepage subheadline", messaging.subhead],
            ["Revenue Scan CTA", messaging.scanCta],
            ["$997 offer CTA", messaging.offerCta],
            ["Elevator pitch", messaging.elevator],
            ["Email-signature descriptor", messaging.emailDescriptor],
            ["Social profile", messaging.social],
            ["Proposal cover", messaging.proposalCover],
            ["Sales Tool header", `${messaging.salesToolHeader} — ${messaging.salesToolLine}`],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-2 py-5 md:grid-cols-[220px_1fr] md:gap-8">
              <dt className="font-sans text-xs font-medium uppercase tracking-[0.16em] text-stone">
                {k}
              </dt>
              <dd className="font-display text-lg font-medium leading-snug text-ink md:text-xl">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="taglines" num="06" kicker="Language" title="Ten tagline candidates">
        <ol className="divide-y divide-rule border-y border-rule">
          {taglines.map((t, i) => (
            <li key={t.line} className="grid gap-2 py-6 md:grid-cols-[3rem_1fr_18rem] md:gap-8">
              <span className="font-mono text-xs tabular text-brass-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-xl font-medium text-ink md:text-2xl">{t.line}</p>
              <p className="font-sans text-sm text-stone">{t.note}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="recommended" num="07" kicker="Language" title="Recommended tagline" ink>
        <p className="max-w-4xl font-display text-3xl font-medium leading-tight text-bone opsz-display md:text-5xl">
          {recommendedTagline.line}
        </p>
        <p className="mt-6 font-sans text-sm uppercase tracking-[0.22em] text-brass">
          Supporting line — {recommendedTagline.supporting}
        </p>
        <ul className="mt-12 max-w-2xl space-y-4 font-sans text-sm leading-relaxed text-bone/80">
          {recommendedTagline.why.map((w) => (
            <li key={w} className="flex gap-3">
              <span className="mt-2 size-1 shrink-0 bg-brass" />
              {w}
            </li>
          ))}
        </ul>
        <Caption>
          <span className="text-bone/55">{recommendedTagline.use}</span>
        </Caption>
      </Section>
    </>
  );
}
