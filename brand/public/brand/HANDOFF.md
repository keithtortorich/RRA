# NETBUILD.PRO Brand Implementation Handoff

**Version:** 1.1  
**Status:** Implementation contract  
**Scope:** Customer-facing visual identity, voice, and brand implementation

This document governs the customer-facing NETBUILD.PRO brand. Product behavior,
commercial guardrails, repository governance, evidence rules, and operational
architecture remain governed by the RRA repository and its approved specifications.

## Identity

- **Customer-facing brand:** NETBUILD.PRO
- **Descriptor:** Revenue Recovery Firm
- **Category:** Revenue recovery
- **Internal operating concept and repository namespace:** RRA
- **Internal operator surface:** Sizzle
- **Client-facing delivery surface:** Stella

RRA remains the internal product parent and operating concept. It must not appear
as a customer-facing logo, acronym, alternate company name, metadata label, or
accessibility label. Existing `rra-*` filenames, schemas, storage keys, imports,
packages, and CSS variables remain unchanged unless a separate technical migration
is approved.

## Messaging

- **Primary:** Stop losing revenue already entering your business.
- **Supporting:** More revenue. Same demand.
- **Sizzle:** Find the leak. Recover the revenue.

NETBUILD.PRO identifies where existing demand fails to become collected revenue,
quantifies the loss conservatively, and recovers the highest-value validated leak first.

## Commercial model

- **Free:** Evidence scan with no unsupported dollar claim
- **Good:** $997 fixed fee for the single highest-priority validated leak
- **Better:** $5,000 setup plus $2,500 per month for the top three validated opportunities
- **Best:** $7,500 per month for full ongoing revenue-recovery management

No revenue share, performance pricing, attribution-based fee, paid-audit range,
separate Stella subscription, or third-party Sizzle licensing.

## Voice

- Short and precise
- Financially literate
- Commercially direct
- Evidence-driven
- Premium and understated
- Skeptical-owner friendly

Never use: “AI-powered,” “10X,” “growth engine,” “revolutionary,”
“game-changing,” “supercharge,” or “unlock your potential.”

Do not describe missed calls or unconverted opportunities as revenue the client
has already earned.

## The Seal

The Seal is a containment ring closed by an antique-brass keystone at 6 o’clock.

| Property        |                      Value |
| --------------- | -------------------------: |
| Canvas          |                    64 × 64 |
| Center          |                     32, 32 |
| Ring radius     |                         22 |
| Ring stroke     |                          5 |
| Keystone arc    |                        50° |
| Keystone stroke |                        6.5 |
| Ring color      | Ink on light, Bone on dark |
| Keystone color  |                      Brass |

Do not recolor the keystone, fill the ring, add shadows, arrows, glows, or
dollar signs, rotate the mark, or distort its geometry.

## Wordmark and lockup

`NETBUILD.PRO`

- **NETBUILD:** Newsreader Medium at full size
- **.PRO:** smaller, Brass, aligned to the baseline
- Tracking: `0.08em`
- Lockup height: 64px
- Lockup width: determined by the final SVG `viewBox`
- Preserve intrinsic aspect ratio

```text
[Seal] NETBUILD.PRO
       REVENUE RECOVERY FIRM
```

## Color

| Token          |       HEX | Use                                         |
| -------------- | --------: | ------------------------------------------- |
| Ink            | `#12110F` | Primary dark                                |
| Ink 800        | `#1C1B18` | Elevated dark surfaces                      |
| Ink 700        | `#2A2824` | Dark borders                                |
| Stone          | `#6F6A62` | Secondary text                              |
| Rule           | `#D8D2C6` | Light hairlines                             |
| Bone           | `#F4F1EA` | Main page background                        |
| Paper          | `#FAF7F1` | Raised light surfaces                       |
| Brass          | `#C5A572` | Brand accent, Seal keystone, primary action |
| Brass Light    | `#D4B88A` | Dark-mode highlight                         |
| Brass Deep     | `#6E5428` | Brass text on Bone                          |
| Recovered      | `#2F5A40` | Confirmed measured recovered revenue only   |
| Recovered Soft | `#E3EDE6` | Confirmed recovery badges and washes        |
| Leak           | `#8F2E28` | Leakage or warning only                     |
| Leak Soft      | `#F3E4E2` | Leak badges and washes                      |

Recovered and Leak are functional data colors, not brand colors. Brass is the
brand and action accent. It does not mean recovered revenue. Estimates and
benchmarks must never be styled as confirmed recovery.

## Typography

- Display and wordmark: Newsreader Medium
- Canva display fallback: Libre Baskerville
- Body and UI: Source Sans 3
- Canva body fallback: Source Sans Pro
- Data: Source Sans 3 with tabular lining figures
- Audit and scan IDs: Source Code Pro

## Application

- **Sizzle:** Ink forensic workstation, Bone readouts, sharp corners, hairline
  borders, Brass primary action, and explicit evidence-quality labels.
- **Stella:** Approved client-facing findings, actions, progress, and measured
  results only. No internal scoring or unapproved claims.
- **Website:** Bone field, left-aligned editorial hero, one Brass rule, one
  primary action, and no SaaS mosaic or chatbot chrome.
- **Reports:** US Letter, 1-inch margins, Ink covers, Bone interiors, and the
  sequence Leak → conservative value → recovery action.
- **Canva:** Brand Kit named NETBUILD.PRO, 0–2px corner radius, no default
  effects, and no customer-facing RRA identity.

## Asset contract

- `/brand/logo/rra-seal.svg`
- `/brand/logo/rra-seal-on-ink.svg`
- `/brand/logo/rra-app-icon.svg`
- `/brand/logo/rra-lockup.svg`
- `/brand/tokens.json`
- `/brand/rra-tokens.css`

The `rra-*` filenames are retained intentionally as internal compatibility
contracts. Their visible titles, labels, and wordmark content use NETBUILD.PRO.

Regenerate `public/og.jpg` after any wordmark or tagline change.
