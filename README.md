# RRA MVP

RRA is a revenue-recovery system for owner-operated home-service businesses. The MVP finds one credible revenue leak, quantifies it in dollars, produces a guarded client-safe proposal, and tests whether the owner will pay to fix it.

The Sales Cockpit (`SALES TOOL.html`) is the founder's operator tool: five-prospect pipeline, evidence-driven revenue calculator, outreach and $997 offer generation, objection handling, Call Mode, and activity tracking — see below.

## The MVP question

> Can RRA reliably identify a credible, evidence-backed revenue opportunity that a business owner will pay us to fix?

Until five real proposals answer that question, more platform work is out of scope.

## MVP flow

1. Scan the prospect's public presence.
2. Extract and verify revenue-leak signals.
3. Score and rank opportunities.
4. Lead with the single highest-value leak.
5. Validate the proposal against commercial guardrails.
6. Render separate internal and client-facing views.
7. Send the proposal and measure the market response.

## Start here

- [OPERATOR.md](OPERATOR.md): setup, commands, inputs, and outputs.
- [docs/MVP.md](docs/MVP.md): complete stripped-MVP implementation reference.
- [docs/LAUNCH_PLAN.md](docs/LAUNCH_PLAN.md): five-prospect validation plan.
- [docs/SALES_PLAYBOOK.md](docs/SALES_PLAYBOOK.md): launch-stage sales operating playbook.
- [pipeline.md](pipeline.md): prospect tracking template.
- [SALES TOOL.html](SALES%20TOOL.html): the sales cockpit — five-prospect board,
  revenue calculator, evidence, outreach, $997 offer builder, Call Mode,
  objections, activity tracker, notes, and launch scoreboard.

## Sales Tool — rendered webpage

`docs/index.html` is the single canonical source (self-contained, no build
step, no server, no dependencies — vanilla HTML/CSS/JS, all state in
`localStorage`). `SALES TOOL.html` at the repo root is a **git symlink** to
`docs/index.html`, not a copy — opening either file always shows the exact
same bytes, so they cannot silently diverge. Edit `docs/index.html`; the root
file follows automatically. (If your OS/tool doesn't preserve symlinks on
checkout, re-run `ln -sf docs/index.html "SALES TOOL.html"`.)

One-time setup (repo owner, in the GitHub UI): **Settings → Pages → Build and
deployment → Source: "Deploy from a branch" → Branch: `main`, folder: `/docs`
→ Save.** After that, every push to `main` republishes automatically at:

```
https://keithtortorich.github.io/RRA/
```

## Scope

The live path is `rra_mvp/`. The broader orchestrator, stages, workers, dashboards, CRM integrations, billing, additional verticals, and autonomous delivery remain out of scope until the MVP produces paid demand.

## Non-negotiable controls

- No client-facing artifact bypasses `client_facing_summary()`.
- No proposal bypasses `guardrails.validate_proposal()`.
- Every proposal leads with one highest-priority opportunity.
- Internal evidence, IDs, confidence values, and schema details never appear in the client view.
- Real observed data replaces benchmark assumptions whenever available.

## Canonical source

Prepared from [RRA 3.3](https://docs.google.com/document/d/1C_2TdFMew4X4s3b6LOfb4GAhXdvWr0yWloNTkBtHoww), read on 2026-09-16.
