# RRA MVP Operator Guide

## Purpose

Run the smallest end-to-end system that can produce a credible paid revenue-recovery audit and a client-safe proposal.

## Prerequisites

- Python environment suitable for the repository.
- Claude Code CLI available as `claude`.
- The four worker repositories cloned locally:
  - `ai-marketing-claude`
  - `geo-seo-claude`
  - `ai-reputation-claude`
  - `ai-sales-team-claude`

## Configure workers

From the RRA repository root:

```bash
export RRA_MARKETING_REPO="$(pwd)/../ai-marketing-claude"
export RRA_GEO_REPO="$(pwd)/../geo-seo-claude"
export RRA_REPUTATION_REPO="$(pwd)/../ai-reputation-claude"
export RRA_SALES_REPO="$(pwd)/../ai-sales-team-claude"
```

## Install

```bash
pip install -e .
```

## Commands

```bash
revenue-scan https://example-hvac.com
revenue-audit https://example-hvac.com
revenue-propose path/to/opportunities.json
```

For a stronger audit, replace benchmark assumptions with observed metrics:

```bash
revenue-audit https://example-hvac.com --metrics metrics.json
```

Example `metrics.json`:

```json
{
  "monthly_inbound_calls": 143,
  "missed_call_rate": 0.52,
  "average_service_ticket": 720
}
```

## Operating sequence

1. Run `revenue-scan`.
2. Review evidence and identify assumptions.
3. Manually verify Google reviews, after-hours call handling, mobile site conversion, booking access, and 24/7 claims.
4. Record observed metrics in `metrics.json`.
5. Run `revenue-audit` again with the metrics file.
6. Run `revenue-propose` on the resulting opportunities JSON.
7. Send only the client-facing proposal.
8. Record outreach and follow-up in `pipeline.md`.

## Output handling

The proposal command produces two views:

- Internal: evidence, IDs, confidence, assumptions, and operator detail.
- Client-facing: headline, quantified leak, three tiers, and one next step.

Never send the internal view to a prospect.

## Pre-flight acceptance

Before using a real prospect, confirm:

- `which claude` succeeds.
- All four worker repository paths exist.
- All four environment variables resolve correctly.
- Installation completes.
- A scan against a harmless test URL completes.
- Audit output is created.
- Proposal output contains separate internal and client-safe views.
- The Good tier matches the top-ranked leak.
- Client output contains no forbidden internal keys.

If the worker invocation in `rra_mvp/runner.py` does not match the installed Claude CLI, fix and retest it before prospecting.
