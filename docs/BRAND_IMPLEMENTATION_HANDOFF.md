# NETBUILD.PRO Brand Implementation Handoff

> **SUPERSEDED — 2026-09-19.** The NETBUILD.PRO / Sizzle direction below was reversed by founder decision. Current customer-facing brand is **RRA — Revenue Recovery Agency** (product: **RRA Diagnostic Terminal**). This document remains only as historical context for PR #19/#20; `docs/index.html` is the current implementation.


**Version:** 1.1  
**Date:** September 19, 2026  
**Status:** Corrected, validated, and ready for implementation  
**Source package:** `NETBUILD-PRO-Branding-v1.1.zip`

## 1. Canonical structure

NETBUILD.PRO is the public company brand and revenue-recovery firm.

RRA is the internal operating concept, product parent, repository namespace, and MVP scope anchor. It is not a customer-facing brand or service line.

| Name | Role | Visibility |
| --- | --- | --- |
| **NETBUILD.PRO** | Company and customer-facing brand | Public |
| **RRA** | Revenue Recovery Architecture and internal operating concept | Internal only |
| **Sizzle** | Internal operator surface used by NETBUILD.PRO | Internal only |
| **Stella** | Client-facing delivery surface for RRA engagements | Client-facing, not standalone |

Sizzle and Stella are two surfaces for the same coordinator role. They are not separate companies or independent products.

## 2. Repository rule

There is one active repository: `rra`.

Stella, Sizzle, workers, schemas, and shared core remain directories within that repository and are created only when implementation requires them. No repository expansion occurs before Gate 3.

Internal technical names such as `rra-*` remain unchanged for compatibility. They must not appear as visible customer-facing branding.

## 3. Public brand contract

| Field | Approved value |
| --- | --- |
| Brand | **NETBUILD.PRO** |
| Descriptor | **REVENUE RECOVERY FIRM** |
| Primary tagline | **Stop losing revenue already entering your business.** |
| Supporting line | **More revenue. Same demand.** |
| Sizzle line | **Find the leak. Recover the revenue.** |

The public positioning is simple: businesses may not need more leads. They may need to stop losing revenue already entering the business.

The operating method is:

1. Identify the leak.
2. Quantify it conservatively.
3. Recover the highest-value validated loss first.

Do not describe NETBUILD.PRO as a marketing agency, lead-generation company, AI company, CRM, or standalone SaaS vendor.

## 4. Commercial model

| Tier | Approved offer |
| --- | --- |
| **Free** | Evidence scan with no unsupported dollar claim |
| **Good** | $997 fixed fee for the single highest-priority validated leak |
| **Better** | $5,000 setup plus $2,500 per month for the top three validated opportunities |
| **Best** | $7,500 per month for full ongoing revenue-recovery management |

There is no paid-audit pricing range, revenue share, performance pricing, separate Stella subscription, or third-party Sizzle licensing.

## 5. Visual implementation rules

- The wordmark is **NETBUILD** plus a smaller Brass **.PRO** on the same baseline.
- Wordmark tracking is `0.08em`.
- The descriptor is **REVENUE RECOVERY FIRM**.
- The Seal geometry remains unchanged.
- The Seal keystone remains Brass.
- Brass is the brand and primary-action accent. It does not mean recovered revenue.
- Recovered green is reserved for confirmed, measured recovery.
- Leak red is reserved for leakage and warnings.
- Estimated opportunity values remain neutral until validated and measured.

Approved fonts remain Newsreader Medium for display and wordmark, Source Sans 3 for body and UI, and Source Code Pro for audit and scan identifiers.

## 6. Work completed

The supplied RRA brand project was corrected throughout the application and public asset package.

Completed changes include:

- Replaced visible RRA and Revenue Recovery Agency branding with NETBUILD.PRO and Revenue Recovery Firm.
- Corrected positioning, taglines, commercial language, and tier pricing.
- Clarified the NETBUILD.PRO, RRA, Stella, and Sizzle hierarchy.
- Rebuilt the wordmark treatment with the smaller Brass `.PRO` suffix.
- Preserved Seal construction and internal `rra-*` compatibility names.
- Corrected Brass, Recovered, and Leak color semantics.
- Removed green styling from estimates and unvalidated opportunity values.
- Rebuilt the horizontal lockup SVG.
- Regenerated the 1200 x 630 social-sharing image.
- Updated application metadata, Open Graph identity, tokens, components, and the implementation contract.
- Corrected the startup script so it runs from the project directory instead of a hardcoded workspace path.
- Isolated a generic PWA test fixture from the live NETBUILD.PRO site configuration.

## 7. Validation completed

| Check | Result |
| --- | --- |
| TypeScript typecheck | Passed |
| ESLint | Passed with zero errors |
| Automated tests | 250 passed, 0 failed |
| Production build | Passed |
| Brand contract check | Passed |
| Customer-facing legacy-name scan | Passed |
| Pricing and prohibited-model scan | Passed |
| Social-card visual inspection | Passed |
| Source archive integrity | Passed |

The lint run retains three non-blocking scaffold warnings. They do not affect the brand implementation or production build.

## 8. Primary implementation files

- `public/brand/HANDOFF.md`
- `src/brand/copy.ts`
- `src/brand/tokens.ts`
- `src/components/seal.tsx`
- `src/components/brand-book.tsx`
- `src/components/sections-identity.tsx`
- `src/components/sections-mark.tsx`
- `src/components/sections-application.tsx`
- `src/styles.css`
- `src/lib/og/site.json`
- `public/brand/tokens.json`
- `public/brand/rra-tokens.css`
- `public/brand/logo/rra-lockup.svg`
- `public/og.jpg`

## 9. Handoff decision

The corrected package is the implementation baseline. Older RRA customer-facing language, the prior wordmark tracking, conflicting pricing, and any claim that Brass represents recovered revenue are superseded.

Future implementation must preserve the separation between the public NETBUILD.PRO brand and the internal RRA architecture. Product architecture should enter customer-facing material only when it directly explains a client outcome.

The package is ready for repository integration and deployment review. No unresolved brand judgment calls remain.
