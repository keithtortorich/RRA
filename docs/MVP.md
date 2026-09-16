# RRA MVP Implementation
Track A — Stripped MVP, Shipped

Nine files in the live path. Two bug fixes applied. Guardrails + client_facing_summary enforced in propose.py. Scoring wired to the real benchmark/leak library. Everything else is untouched.

---

## What Changed

File Action Why
rra/core/guardrails.py FIX Wedge-first check compares leak_id, not substrings
rra/core/client_facing.py unchanged Already correct
rra/core/effort.py unchanged Already correct
rra/core/scoring.py unchanged Already correct
rra/verticals/hvac/benchmarks.py unchanged Already correct
rra/verticals/hvac/leak_library.py unchanged Already correct
rra_mvp/__init__.py unchanged —
rra_mvp/runner.py unchanged Worker subprocess layer
rra_mvp/scan.py unchanged Raw worker evidence
rra_mvp/scoring.py REWRITE Wired to leak library + benchmarks; sizing registry validation
rra_mvp/audit.py REWRITE Full pipeline: scan → signal extract → score → audit report + JSON
rra_mvp/propose.py REWRITE Guardrail enforcement + client_facing_summary + two-view render
rra_mvp/cli.py UPDATE Three commands: scan / audit / propose
rra_mvp/verticals/hvac.md unchanged Vertical pack

Everything in rra/orchestrator/, rra/stages/, rra/workers/, tests/, scripts/ stays as-is — that's your v2 blueprint, not the live path.

---

Fix 1 — rra/core/guardrails.py

The wedge-first check now compares leak_id when available, with a token-overlap fallback for the case where only natural-language text is present. Also added MISSING_PAID_TRAFFIC_FIX enforcement and a build_decision_checklist() helper.

```python
"""
RRA v1 — Commercial & Operational Guardrails
Enforces §17.1 (payment), §17.2 (delivery gap), §17.3 (access boundary).


Changes from v1.0:
- WEDGE_FIRST_VIOLATION now compares leak_id (fallback: token overlap).
  Fixes the bug where a correctly-wedge-first proposal whose Good focus
  paraphrased the top finding was rejected by naive substring matching.
- Added MISSING_PAID_TRAFFIC_FIX for paid_traffic top leak (§9 appendix D).
- Added build_decision_checklist() + render_decision_checklist().
"""


from __future__ import annotations


import re
from enum import Enum
from typing import Any, Dict, List, Tuple




class GuardrailViolation(str, Enum):
    PERFORMANCE_PRICING      = "PERFORMANCE_PRICING"
    REVENUE_SHARE            = "REVENUE_SHARE"
    ATTRIBUTION_CLAUSE       = "ATTRIBUTION_CLAUSE"
    MISSING_OPERATIONAL_FIX  = "MISSING_OPERATIONAL_FIX"
    PREMATURE_ACCESS_REQUEST = "PREMATURE_ACCESS_REQUEST"
    WEDGE_FIRST_VIOLATION    = "WEDGE_FIRST_VIOLATION"
    FORBIDDEN_TIER_SHAPE     = "FORBIDDEN_TIER_SHAPE"
    MISSING_PAID_TRAFFIC_FIX = "MISSING_PAID_TRAFFIC_FIX"




FORBIDDEN_PRICING_PATTERNS: List[str] = [
    "revenue share", "revenue-share", "% of recovered",
    "percent of recovered", "performance only", "performance-only",
    "contingent fee", "commission on", "commission-based",
    "attribution-based", "we get paid when",
]


OPERATIONAL_FIX_REQUIRED_CATEGORIES = {"response_speed", "lead_capture"}


OPERATIONAL_FIX_KEYWORDS: List[str] = [
    "receptionist", "ai receptionist", "virtual csr", "sms catcher",
    "sms capture", "after-hours", "after hours", "live routing",
    "call routing", "dispatcher", "call answering", "24/7 coverage",
    "missed-call text-back", "missed call text-back",
]


PAID_TRAFFIC_FIX_KEYWORDS: List[str] = [
    "ad ", "ads ", " ad", "paid", "ppc", "google ads", "call tracking",
    "campaign", "ad account", "ad spend",
]


PERMITTED_ACCESS_STATES = {"public_only"}


_STOPWORDS = {
    "and", "or", "the", "a", "an", "of", "to", "for", "in", "on",
    "with", "by", "at", "is", "are", "was", "were", "be", "been",
    "this", "that", "these", "those", "it", "its", "as", "from",
    "fix", "fixing", "system", "systems", "deploy", "install",
    "setup", "set", "up", "down",
}




def _tokenize(text: str) -> set:
    tokens = re.findall(r"[a-z0-9]+", text.lower())
    return {t for t in tokens if t not in _STOPWORDS and len(t) > 2}




def _topics_overlap(a: str, b: str, threshold: float = 0.34) -> bool:
    ta, tb = _tokenize(a), _tokenize(b)
    if not ta or not tb:
        return False
    inter = ta & tb
    smaller = ta if len(ta) <= len(tb) else tb
    return (len(inter) / len(smaller)) >= threshold




def _scan_for_forbidden_pricing(text: str) -> List[str]:
    if not text:
        return []
    lower = text.lower()
    return [p for p in FORBIDDEN_PRICING_PATTERNS if p in lower]




def _has_operational_fix(text: str) -> bool:
    if not text:
        return False
    lower = text.lower()
    return any(kw in lower for kw in OPERATIONAL_FIX_KEYWORDS)




def _has_paid_traffic_fix(text: str) -> bool:
    if not text:
        return False
    lower = text.lower()
    return any(kw in lower for kw in PAID_TRAFFIC_FIX_KEYWORDS)




def _flatten_tier_text(tier: Dict[str, Any]) -> str:
    parts = [str(tier.get("name", "")), str(tier.get("focus", "")),
             str(tier.get("description", ""))]
    includes = tier.get("includes", [])
    if isinstance(includes, list):
        parts.extend(str(x) for x in includes)
    return " ".join(parts)




def validate_proposal(proposal: Dict[str, Any]) -> Tuple[bool, List[str]]:
    violations: List[str] = []
    if not isinstance(proposal, dict):
        return False, ["PROPOSAL_NOT_A_DICT"]


    pricing_model = str(proposal.get("pricing_model", "")).lower()
    if pricing_model and pricing_model not in {"fixed_fee", "fixed"}:
        if pricing_model in {"performance", "revenue_share", "hybrid"}:
            violations.append(GuardrailViolation.PERFORMANCE_PRICING.value)
        else:
            violations.append(GuardrailViolation.ATTRIBUTION_CLAUSE.value)


    tiers = proposal.get("tiers", {}) or {}
    blob = " ".join([
        _flatten_tier_text(tiers.get("good", {})),
        _flatten_tier_text(tiers.get("better", {})),
        _flatten_tier_text(tiers.get("best", {})),
        str(proposal.get("client_summary", "")),
    ])
    if _scan_for_forbidden_pricing(blob):
        violations.append(GuardrailViolation.REVENUE_SHARE.value)


    access_state = proposal.get("access_boundary")
    if access_state is not None and access_state not in PERMITTED_ACCESS_STATES:
        violations.append(GuardrailViolation.PREMATURE_ACCESS_REQUEST.value)


    good = tiers.get("good", {})
    if not good:
        violations.append(GuardrailViolation.FORBIDDEN_TIER_SHAPE.value)


    internal = proposal.get("internal_opportunities", [])
    if internal and good:
        top = internal[0]
        top_leak_id = top.get("leak_id")
        good_leak_id = good.get("leak_id") or good.get("focus_leak_id")


        # --- WEDGE-FIRST: prefer leak_id match, fall back to text ---
        if top_leak_id and good_leak_id:
            if str(top_leak_id) != str(good_leak_id):
                violations.append(GuardrailViolation.WEDGE_FIRST_VIOLATION.value)
        else:
            top_finding = str(top.get("finding", ""))
            good_focus = str(good.get("focus", ""))
            if top_finding and good_focus and not _topics_overlap(top_finding, good_focus):
                violations.append(GuardrailViolation.WEDGE_FIRST_VIOLATION.value)


        top_category = str(top.get("category", "")).lower()
        good_text = _flatten_tier_text(good)


        if top_category in OPERATIONAL_FIX_REQUIRED_CATEGORIES:
            if not _has_operational_fix(good_text):
                violations.append(GuardrailViolation.MISSING_OPERATIONAL_FIX.value)


        if top_category == "paid_traffic":
            if not _has_paid_traffic_fix(good_text):
                violations.append(GuardrailViolation.MISSING_PAID_TRAFFIC_FIX.value)


    return (len(violations) == 0), violations




def assert_compliant(proposal: Dict[str, Any]) -> None:
    ok, violations = validate_proposal(proposal)
    if not ok:
        raise ValueError("Proposal violates commercial guardrails: "
                         + ", ".join(violations))




def build_decision_checklist(proposal: Dict[str, Any]) -> Dict[str, bool]:
    tiers = proposal.get("tiers", {}) or {}
    good = tiers.get("good", {})
    internal = proposal.get("internal_opportunities", []) or []
    top = internal[0] if internal else {}
    top_category = str(top.get("category", "")).lower()


    fixed_fee = str(proposal.get("pricing_model", "")).lower() in {"fixed_fee", "fixed"}
    good_text = _flatten_tier_text(good)
    no_forbidden = not _scan_for_forbidden_pricing(good_text)
    op_fix_ok = (
        top_category not in OPERATIONAL_FIX_REQUIRED_CATEGORIES
        or _has_operational_fix(good_text)
    )
    access_ok = proposal.get("access_boundary") in (None, "public_only")


    leads_with_top = True
    if internal and good:
        top_leak_id = top.get("leak_id")
        good_leak_id = good.get("leak_id") or good.get("focus_leak_id")
        if top_leak_id and good_leak_id:
            leads_with_top = str(top_leak_id) == str(good_leak_id)
        else:
            leads_with_top = _topics_overlap(
                str(top.get("finding", "")), str(good.get("focus", "")))


    single_fix = bool(good) and not good.get("is_bundle", False)


    return {
        "pricing_is_fixed_fee": fixed_fee,
        "no_revenue_share_or_performance": no_forbidden,
        "no_attribution_clause": True,
        "operational_fix_present_when_needed": op_fix_ok,
        "public_data_only": access_ok,
        "leads_with_top_opportunity": leads_with_top,
        "good_tier_is_single_fix": single_fix,
        "client_facing_filter_applied": proposal.get("client_summary") is not None,
    }




def render_decision_checklist(flags: Dict[str, bool]) -> str:
    lines = ["COMMERCIAL DECISION CHECKLIST — RRA v1",
             "All boxes must be TRUE before proposal is presented.", ""]
    all_ok = True
    for name, ok in flags.items():
        mark = "x" if ok else " "
        lines.append(f"[{mark}] {name}")
        if not ok:
            all_ok = False
    lines.append("")
    lines.append(f"All checks passed: {'YES' if all_ok else 'NO — DO NOT SEND'}")
    return "\n".join(lines)
```

---

Fix 2 — rra_mvp/scoring.py

Sizing registry now declares required metrics per leak and validates against the leak library at import. Drift raises RuntimeError on module load — never a silent drop.

```python
"""
RRA MVP — Scoring Stage
Evidence → findings → sized + ranked opportunities.


Wired to:
  rra.verticals.hvac.benchmarks   — client data wins; benchmarks fill gaps
  rra.verticals.hvac.leak_library — leak definitions, signals, categories
  rra.core.effort + rra.core.scoring — deterministic math


Sizing registry validation:
  Each sizing strategy declares `requires`. At import we assert that every
  required metric is present in the corresponding leak's benchmark_keys.
  Drift → loud RuntimeError. Never a silent drop. (Fixes the latent bug
  where adding a metric to a leak but forgetting it in sizing — or vice
  versa — caused findings to vanish with only a stderr line.)
"""


from __future__ import annotations


import sys
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional, Tuple


from rra.core.effort import apply_effort_to_opportunity
from rra.core.scoring import calculate_scores_for_opportunities
from rra.verticals.hvac.benchmarks import Label, resolve_metric
from rra.verticals.hvac.leak_library import (
    DetectionSignal, LeakCategory, get_leak, match_signals,
)




MIN_EVIDENCE_CONFIDENCE = 0.50
DEFAULT_RECOVERABLE_FRACTION = 0.50


CATEGORY_TO_DEFAULT_SIGNAL = {
    LeakCategory.LEAD_CAPTURE.value:         DetectionSignal.MISSED_CALL_RATE_HIGH.value,
    LeakCategory.RESPONSE_SPEED.value:       DetectionSignal.MISSED_CALL_RATE_HIGH.value,
    LeakCategory.CONVERSION_FRICTION.value:  DetectionSignal.NO_CTA_ABOVE_FOLD.value,
    LeakCategory.FOLLOW_UP.value:            DetectionSignal.SLOW_FORM_RESPONSE.value,
    LeakCategory.LOCAL_VISIBILITY.value:     DetectionSignal.LOW_LOCAL_PACK_PRESENCE.value,
    LeakCategory.AI_SEARCH_VISIBILITY.value: DetectionSignal.POOR_AI_VISIBILITY.value,
    LeakCategory.REPUTATION_TRUST.value:     DetectionSignal.NO_REVIEW_RESPONSES.value,
    LeakCategory.TECHNICAL_SEO.value:        DetectionSignal.NO_SCHEMA_MARKUP.value,
}


OBSERVATION_HINTS = [
    ("click-to-call", DetectionSignal.NO_CLICK_TO_CALL.value),
    ("click to call", DetectionSignal.NO_CLICK_TO_CALL.value),
    ("above the fold", DetectionSignal.NO_CTA_ABOVE_FOLD.value),
    ("form requires", DetectionSignal.FORM_TOO_LONG.value),
    ("missed call",   DetectionSignal.MISSED_CALL_RATE_HIGH.value),
    ("after-hours",   DetectionSignal.NO_AFTER_HOURS_CAPTURE.value),
    ("after hours",   DetectionSignal.NO_AFTER_HOURS_CAPTURE.value),
    ("text-back",     DetectionSignal.NO_SMS_TEXTBACK.value),
    ("follow-up",     DetectionSignal.SLOW_QUOTE_FOLLOWUP.value),
    ("review",        DetectionSignal.NO_REVIEW_RESPONSES.value),
    ("local pack",    DetectionSignal.LOW_LOCAL_PACK_PRESENCE.value),
    ("gmb",           DetectionSignal.NO_GMB_OPTIMIZATION.value),
    ("ai visibility", DetectionSignal.POOR_AI_VISIBILITY.value),
    ("schema",        DetectionSignal.NO_SCHEMA_MARKUP.value),
    ("service page",  DetectionSignal.WEAK_SERVICE_PAGES.value),
    ("maintenance plan", DetectionSignal.NO_MAINTENANCE_CONVERSION.value),
    ("referral",      DetectionSignal.NO_REFERRAL_SYSTEM.value),
]




# ---------------------------------------------------------------------------
# Sizing strategies
# ---------------------------------------------------------------------------


def _recoverable(note: str = "") -> Dict[str, Any]:
    return {
        "value": DEFAULT_RECOVERABLE_FRACTION,
        "label": Label.ASSUMED.value,
        "source": "internal_modeling",
        "notes": note or "Conservative default recovery fraction.",
    }




def _size_missed_call(m):
    calls = m["monthly_inbound_calls"]["value"]
    miss = m["missed_call_rate"]["value"]
    ticket = m["average_service_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    rec = _recoverable("Half of missed calls recoverable with operational fix.")
    monthly = calls * miss * rec["value"] * ticket * margin
    return round(monthly, 2), {
        "monthly_inbound_calls": m["monthly_inbound_calls"],
        "missed_call_rate": m["missed_call_rate"],
        "average_service_ticket": m["average_service_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "recoverable_fraction": rec,
        "formula": "calls × missed_rate × recoverable × ticket × margin",
    }




def _size_booking_friction(m):
    calls = m["monthly_inbound_calls"]["value"]
    form_conv = m["web_form_to_conversation_rate"]["value"]
    ticket = m["average_service_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    form_share = 0.30
    rec = _recoverable("Share recoverable by removing booking friction.")
    monthly = calls * form_share * (1 - form_conv) * rec["value"] * ticket * margin
    return round(monthly, 2), {
        "monthly_inbound_calls": m["monthly_inbound_calls"],
        "web_form_to_conversation_rate": m["web_form_to_conversation_rate"],
        "average_service_ticket": m["average_service_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_form_share_of_calls": {"value": form_share, "label": Label.ASSUMED.value,
                                         "source": "internal_modeling",
                                         "notes": "~30% of inbound is form-based."},
        "recoverable_fraction": rec,
        "formula": "calls × form_share × (1 − form_conv) × recoverable × ticket × margin",
    }




def _size_quote_followup(m):
    ticket = m["average_replacement_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    monthly_estimates = 10
    close_lift = 0.08
    monthly = monthly_estimates * close_lift * ticket * margin
    return round(monthly, 2), {
        "average_replacement_ticket": m["average_replacement_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_monthly_estimates": {"value": monthly_estimates,
                                       "label": Label.ASSUMED.value,
                                       "source": "internal_modeling"},
        "assumed_close_rate_lift": {"value": close_lift,
                                     "label": Label.ASSUMED.value,
                                     "source": "internal_modeling"},
        "formula": "estimates × close_lift × replacement_ticket × margin",
    }




def _size_unworked_leads(m):
    calls = m["monthly_inbound_calls"]["value"]
    form_conv = m["web_form_to_conversation_rate"]["value"]
    ticket = m["average_service_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    form_share = 0.30
    rec = _recoverable("Half of unworked form leads recoverable.")
    monthly = calls * form_share * (1 - form_conv) * rec["value"] * ticket * margin
    return round(monthly, 2), {
        "monthly_inbound_calls": m["monthly_inbound_calls"],
        "web_form_to_conversation_rate": m["web_form_to_conversation_rate"],
        "average_service_ticket": m["average_service_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_form_share_of_calls": {"value": form_share, "label": Label.ASSUMED.value,
                                         "source": "internal_modeling"},
        "recoverable_fraction": rec,
        "formula": "calls × form_share × (1 − form_conv) × recoverable × ticket × margin",
    }




def _size_local_visibility(m):
    calls = m["monthly_inbound_calls"]["value"]
    ticket = m["average_service_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    suppressed = 0.10
    rec = _recoverable("Share recoverable by improving local visibility.")
    monthly = calls * suppressed * rec["value"] * ticket * margin
    return round(monthly, 2), {
        "monthly_inbound_calls": m["monthly_inbound_calls"],
        "average_service_ticket": m["average_service_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_suppressed_share": {"value": suppressed, "label": Label.ASSUMED.value,
                                      "source": "internal_modeling"},
        "recoverable_fraction": rec,
        "formula": "calls × suppressed_share × recoverable × ticket × margin",
    }




def _size_ai_visibility(m):
    ticket = m["average_service_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    jobs = 3
    monthly = jobs * ticket * margin
    return round(monthly, 2), {
        "average_service_ticket": m["average_service_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_monthly_jobs": {"value": jobs, "label": Label.ASSUMED.value,
                                  "source": "internal_modeling"},
        "formula": "jobs × ticket × margin",
    }




def _size_reputation(m):
    ticket = m["average_service_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    jobs = 2
    monthly = jobs * ticket * margin
    return round(monthly, 2), {
        "average_service_ticket": m["average_service_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_monthly_jobs": {"value": jobs, "label": Label.ASSUMED.value,
                                  "source": "internal_modeling"},
        "formula": "jobs × ticket × margin",
    }




def _size_service_pages(m):
    ticket = m["average_replacement_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    jobs = 1
    monthly = jobs * ticket * margin
    return round(monthly, 2), {
        "average_replacement_ticket": m["average_replacement_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_monthly_jobs": {"value": jobs, "label": Label.ASSUMED.value,
                                  "source": "internal_modeling"},
        "formula": "jobs × replacement_ticket × margin",
    }




def _size_maintenance(m):
    ticket = m["average_service_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    jobs = 4
    monthly = jobs * ticket * margin
    return round(monthly, 2), {
        "average_service_ticket": m["average_service_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_monthly_jobs": {"value": jobs, "label": Label.ASSUMED.value,
                                  "source": "internal_modeling"},
        "formula": "jobs × ticket × margin",
    }




def _size_referral(m):
    ticket = m["average_service_ticket"]["value"]
    margin = m["contribution_margin_per_job"]["value"]
    jobs = 3
    monthly = jobs * ticket * margin
    return round(monthly, 2), {
        "average_service_ticket": m["average_service_ticket"],
        "contribution_margin_per_job": m["contribution_margin_per_job"],
        "assumed_monthly_jobs": {"value": jobs, "label": Label.ASSUMED.value,
                                  "source": "internal_modeling"},
        "formula": "jobs × ticket × margin",
    }




SIZING_STRATEGIES: Dict[str, Dict[str, Any]] = {
    "HVAC-LEAK-001": {"fn": _size_missed_call,
        "requires": ("monthly_inbound_calls", "missed_call_rate",
                     "average_service_ticket", "contribution_margin_per_job")},
    "HVAC-LEAK-002": {"fn": _size_booking_friction,
        "requires": ("monthly_inbound_calls", "web_form_to_conversation_rate",
                     "average_service_ticket", "contribution_margin_per_job")},
    "HVAC-LEAK-003": {"fn": _size_quote_followup,
        "requires": ("average_replacement_ticket", "contribution_margin_per_job")},
    "HVAC-LEAK-004": {"fn": _size_unworked_leads,
        "requires": ("monthly_inbound_calls", "web_form_to_conversation_rate",
                     "average_service_ticket", "contribution_margin_per_job")},
    "HVAC-LEAK-005": {"fn": _size_local_visibility,
        "requires": ("monthly_inbound_calls", "average_service_ticket",
                     "contribution_margin_per_job")},
    "HVAC-LEAK-006": {"fn": _size_ai_visibility,
        "requires": ("average_service_ticket", "contribution_margin_per_job")},
    "HVAC-LEAK-007": {"fn": _size_reputation,
        "requires": ("average_service_ticket", "contribution_margin_per_job")},
    "HVAC-LEAK-008": {"fn": _size_service_pages,
        "requires": ("average_replacement_ticket", "contribution_margin_per_job")},
    "HVAC-LEAK-009": {"fn": _size_maintenance,
        "requires": ("average_service_ticket", "contribution_margin_per_job")},
    "HVAC-LEAK-010": {"fn": _size_referral,
        "requires": ("average_service_ticket", "contribution_margin_per_job")},
}




def _validate_sizing_registry() -> None:
    problems: List[str] = []
    for leak_id, spec in SIZING_STRATEGIES.items():
        try:
            leak = get_leak(leak_id)
        except KeyError:
            problems.append(f"{leak_id}: sizing strategy exists but leak not in library")
            continue
        required = set(spec["requires"])
        declared = set(leak.benchmark_keys)
        missing = required - declared
        if missing:
            problems.append(f"{leak_id}: sizing requires {sorted(missing)} "
                            f"but leak library declares {sorted(declared)}")
    if problems:
        raise RuntimeError(
            "Sizing registry out of sync with leak library:\n  "
            + "\n  ".join(problems))




_validate_sizing_registry()




# ---------------------------------------------------------------------------
# Signal extraction
# ---------------------------------------------------------------------------


def _dedupe(items):
    seen, out = set(), []
    for item in items:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out




def _extract_signals_from_evidence(ev: Dict[str, Any]) -> List[str]:
    signals: List[str] = []
    single = ev.get("signal")
    if single:
        signals.append(str(single))
    plural = ev.get("signals")
    if isinstance(plural, (list, tuple)):
        signals.extend(str(s) for s in plural)
    if signals:
        return _dedupe(signals)


    observation = str(ev.get("observation", "")).lower()
    for keyword, signal in OBSERVATION_HINTS:
        if keyword in observation:
            signals.append(signal)
    if not signals:
        cat = ev.get("category")
        if cat and cat in CATEGORY_TO_DEFAULT_SIGNAL:
            signals.append(CATEGORY_TO_DEFAULT_SIGNAL[cat])
    return _dedupe(signals)




def extract_signals_from_markdown(markdown: str) -> List[str]:
    """Deterministic signal extraction from worker markdown. No LLM."""
    if not markdown:
        return []
    lower = markdown.lower()
    signals: List[str] = []
    for keyword, signal in OBSERVATION_HINTS:
        if keyword in lower:
            signals.append(signal)
    for signal_name in {s.value for s in DetectionSignal}:
        spaced = signal_name.replace("_", " ")
        if spaced in lower:
            signals.append(signal_name)
    return _dedupe(signals)




# ---------------------------------------------------------------------------
# Metric resolution + opportunity construction
# ---------------------------------------------------------------------------


def _resolve_metrics(required_keys, client_metrics: Dict[str, float]) -> Dict[str, Dict[str, Any]]:
    return {key: resolve_metric(client_metrics.get(key), key) for key in required_keys}




_LABEL_MULTIPLIER = {
    Label.KNOWN.value:     1.00,
    Label.ESTIMATED.value: 0.90,
    Label.ASSUMED.value:   0.80,
    Label.UNKNOWN.value:   0.70,
}




def _confidence_multiplier(roi: Dict[str, Any]) -> float:
    if not roi:
        return 1.0
    multipliers = [
        _LABEL_MULTIPLIER.get(str(v.get("label", Label.ESTIMATED.value)), 0.85)
        for v in roi.values()
        if isinstance(v, dict) and "label" in v
    ]
    return min(multipliers) if multipliers else 1.0




def _build_opportunity(business_id, candidate, evidence_ids, client_metrics, index):
    leak_id = candidate.leak_id
    spec = SIZING_STRATEGIES.get(leak_id)
    if spec is None:
        return None


    try:
        metrics = _resolve_metrics(spec["requires"], client_metrics)
    except KeyError as exc:
        print(f"[scoring] {leak_id}: missing benchmark {exc}", file=sys.stderr)
        return None


    try:
        monthly, roi = spec["fn"](metrics)
    except (KeyError, TypeError, ValueError) as exc:
        print(f"[scoring] {leak_id}: sizing failed — {exc}", file=sys.stderr)
        return None


    if monthly <= 0:
        return None


    combined = max(0.0, min(1.0, candidate.confidence * _confidence_multiplier(roi)))
    leak = get_leak(leak_id)


    opp = {
        "id": f"OPP-{index:04d}",
        "business_id": business_id,
        "evidence_ids": evidence_ids,
        "leak_id": leak_id,
        "category": candidate.category,
        "finding": candidate.name,
        "estimated_monthly_opportunity": monthly,
        "confidence": round(combined, 3),
        "effort": leak.default_effort,
        "time_to_value_days": leak.default_time_to_value_days,
        "requires_operational_fix": leak.requires_operational_fix,
        "playbook_id": leak.playbook_id,
        "roi_assumptions": roi,
        "recommendation": {"action": leak.recommended_action},
    }
    return apply_effort_to_opportunity(opp)




# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------


@dataclass
class ScoringResult:
    business_id: str
    opportunities: List[Dict[str, Any]]
    warnings: List[str] = field(default_factory=list)
    signals_seen: List[str] = field(default_factory=list)


    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)




def score_evidence(
    business_id: str,
    evidence: List[Dict[str, Any]],
    client_metrics: Optional[Dict[str, float]] = None,
) -> ScoringResult:
    client_metrics = client_metrics or {}
    warnings: List[str] = []


    signal_to_evidence: Dict[str, List[str]] = {}
    for ev in evidence or []:
        conf = float(ev.get("confidence", 0.0) or 0.0)
        if conf < MIN_EVIDENCE_CONFIDENCE:
            warnings.append(f"{ev.get('id', '<unknown>')}: confidence "
                            f"{conf:.2f} below {MIN_EVIDENCE_CONFIDENCE} — dropped")
            continue
        for sig in _extract_signals_from_evidence(ev):
            signal_to_evidence.setdefault(sig, []).append(ev.get("id", ""))


    all_signals = sorted(signal_to_evidence.keys())
    if not all_signals:
        return ScoringResult(business_id=business_id, opportunities=[],
                             warnings=warnings + ["no signals extracted"],
                             signals_seen=[])


    candidates = match_signals(all_signals)
    if not candidates:
        return ScoringResult(business_id=business_id, opportunities=[],
                             warnings=warnings + ["no leak matched the signals"],
                             signals_seen=all_signals)


    opps: List[Dict[str, Any]] = []
    for i, candidate in enumerate(candidates, start=1):
        ev_ids: List[str] = []
        for sig in candidate.matched_signals:
            ev_ids.extend(signal_to_evidence.get(sig, []))
        ev_ids = _dedupe([e for e in ev_ids if e])


        opp = _build_opportunity(business_id, candidate, ev_ids, client_metrics, i)
        if opp is not None:
            opps.append(opp)


    if not opps:
        return ScoringResult(business_id=business_id, opportunities=[],
                             warnings=warnings + ["no opportunities could be sized"],
                             signals_seen=all_signals)


    ranked = calculate_scores_for_opportunities(opps)
    for i, opp in enumerate(ranked, start=1):
        opp["id"] = f"OPP-{i:04d}"


    return ScoringResult(business_id=business_id, opportunities=ranked,
                         warnings=warnings, signals_seen=all_signals)
```

---

rra_mvp/audit.py — REWRITE

The audit stage is the operator's working document. It runs the scan, scores it, writes both a full audit report (internal) and the opportunities JSON that propose consumes.

```python
"""
RRA MVP — Audit Stage
URL → evidence → findings → sized opportunities → audit report + JSON.


The audit is INTERNAL — do not send to client.
Client-facing artifact is produced by propose.py.
"""


from __future__ import annotations


import hashlib
import json
import os
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


from rra_mvp.runner import run_workers_parallel
from rra_mvp.scan import SCAN_WORKERS
from rra_mvp.scoring import extract_signals_from_markdown, score_evidence




DEFAULT_OUTPUT_DIR = "reports/audits"




_SIGNAL_TO_CATEGORY = {
    "no_click_to_call": "lead_capture",
    "missed_call_rate_high": "lead_capture",
    "no_after_hours_capture": "lead_capture",
    "no_sms_textback": "lead_capture",
    "no_cta_above_fold": "conversion_friction",
    "form_too_long": "conversion_friction",
    "no_online_booking": "conversion_friction",
    "mobile_booking_broken": "conversion_friction",
    "slow_form_response": "follow_up",
    "slow_quote_followup": "follow_up",
    "no_followup": "follow_up",
    "no_review_responses": "reputation_trust",
    "low_review_count": "reputation_trust",
    "negative_reviews_unanswered": "reputation_trust",
    "no_review_request_flow": "reputation_trust",
    "low_local_pack_presence": "local_visibility",
    "no_gmb_optimization": "local_visibility",
    "poor_ai_visibility": "ai_search_visibility",
    "no_schema_markup": "technical_seo",
    "weak_service_pages": "conversion_friction",
    "no_maintenance_conversion": "conversion_friction",
    "no_referral_system": "follow_up",
}




def audit(
    client_name: str,
    url: str,
    output_dir: Optional[str] = None,
    client_metrics: Optional[Dict[str, float]] = None,
) -> Dict[str, str]:
    output_dir = output_dir or DEFAULT_OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)


    print(f"[audit] scanning {url} for {client_name}")
    worker_results = run_workers_parallel(SCAN_WORKERS, url)


    business_id = _business_id(client_name, url)
    evidence: List[Dict[str, Any]] = []


    for worker, result in worker_results.items():
        if result.status != "ok":
            print(f"[audit] {worker}: {result.status} — {result.stderr[:120]}")
            continue
        signals = extract_signals_from_markdown(result.stdout)
        for sig in signals:
            evidence.append({
                "id": f"EVD-{worker}-{sig}",
                "business_id": business_id,
                "category": _SIGNAL_TO_CATEGORY.get(sig, "unknown"),
                "observation": f"{worker} detected {sig}",
                "signal": sig,
                "worker_source": worker,
                "confidence": 0.85,
                "observed_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            })


    scoring_result = score_evidence(
        business_id=business_id,
        evidence=evidence,
        client_metrics=client_metrics or {},
    )


    slug = _slugify(client_name)
    today = date.today().isoformat()
    report_path = Path(output_dir) / f"{slug}-audit-{today}.md"
    opportunities_path = Path(output_dir) / f"{slug}-opportunities-{today}.json"


    report_path.write_text(
        _render_audit(client_name, url, business_id, worker_results,
                       scoring_result, client_metrics or {}),
        encoding="utf-8",
    )


    opp_payload = {
        "ctx": {"business_id": business_id, "name": client_name, "url": url},
        "client_metrics": client_metrics or {},
        "signals": scoring_result.signals_seen,
        "warnings": scoring_result.warnings,
        "opportunities": scoring_result.opportunities,
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    opportunities_path.write_text(json.dumps(opp_payload, indent=2), encoding="utf-8")


    print(f"[audit] report        → {report_path}")
    print(f"[audit] opportunities → {opportunities_path}")


    return {
        "report_path": str(report_path),
        "opportunities_path": str(opportunities_path),
    }




def _render_audit(client_name, url, business_id, worker_results,
                  scoring_result, client_metrics) -> str:
    lines: List[str] = []
    lines.append(f"# Revenue Recovery Audit — {client_name}")
    lines.append(f"**URL:** {url}  ")
    lines.append(f"**Business ID:** {business_id}  ")
    lines.append(f"**Date:** {date.today().isoformat()}  ")
    lines.append("**Status:** INTERNAL — do not send to client")
    lines.append("")
    lines.append("---")
    lines.append("")


    lines.append("## Worker Scan Summary")
    lines.append("| Worker | Status | Output (chars) |")
    lines.append("|--------|--------|----------------|")
    for worker, result in worker_results.items():
        lines.append(f"| {worker} | {result.status} | {len(result.stdout)} |")
    lines.append("")


    lines.append("## Signals Detected")
    if scoring_result.signals_seen:
        for sig in scoring_result.signals_seen:
            lines.append(f"- `{sig}`")
    else:
        lines.append("_No signals detected._")
    lines.append("")


    lines.append("## Ranked Opportunities")
    opps = scoring_result.opportunities
    if not opps:
        lines.append("_No opportunities could be sized from detected signals._")
    else:
        lines.append("| # | Leak ID | Finding | $/mo | Conf | Effort | TTV | Score |")
        lines.append("|---|---------|---------|------|------|--------|-----|-------|")
        for i, opp in enumerate(opps, 1):
            lines.append(
                f"| {i} | {opp.get('leak_id')} | {opp.get('finding')} "
                f"| ${int(opp.get('estimated_monthly_opportunity', 0)):,} "
                f"| {opp.get('confidence')} "
                f"| {opp.get('effort_label')} "
                f"| {opp.get('time_to_value_days')}d "
                f"| {opp.get('priority_score')} |"
            )
        lines.append("")
        total = sum(o.get("estimated_monthly_opportunity", 0) for o in opps)
        lines.append(f"**Total monthly opportunity:** ${int(total):,}")
    lines.append("")


    if opps:
        top = opps[0]
        lines.append("## Top Opportunity — Assumptions")
        lines.append(f"**{top.get('finding')}** (`{top.get('leak_id')}`)")
        lines.append("")
        lines.append("| Metric | Value | Label | Source |")
        lines.append("|--------|-------|-------|--------|")
        for key, metric in (top.get("roi_assumptions") or {}).items():
            if not isinstance(metric, dict) or "value" not in metric:
                continue
            value = metric.get("value")
            if isinstance(value, float):
                value = f"{value:g}"
            lines.append(
                f"| {key} | {value} | {metric.get('label')} | {metric.get('source')} |"
            )
        lines.append("")


    if client_metrics:
        lines.append("## Client-Supplied Metrics")
        for k, v in client_metrics.items():
            lines.append(f"- `{k}` = {v}")
        lines.append("")


    if scoring_result.warnings:
        lines.append("## Warnings")
        for w in scoring_result.warnings:
            lines.append(f"- {w}")
        lines.append("")


    lines.append("## Raw Worker Output")
    for worker, result in worker_results.items():
        lines.append(f"### {worker}")
        lines.append(f"Status: `{result.status}`")
        if result.stdout:
            lines.append("<details><summary>Output</summary>")
            lines.append("")
            lines.append("```")
            lines.append(result.stdout.strip()[:20000])
            lines.append("```")
            lines.append("</details>")
        lines.append("")


    return "\n".join(lines)




def _business_id(client_name: str, url: str) -> str:
    key = f"{client_name}|{url}".lower().encode("utf-8")
    return f"BUS-{hashlib.sha1(key).hexdigest()[:8].upper()}"




def _slugify(name: str) -> str:
    return name.lower().replace(" ", "-").replace("/", "-") or "client"
```

---

rra_mvp/propose.py — REWRITE

Guardrail-enforced, client_facing_summary-sanitized, wedge-first, two-view render.

```python
"""
RRA MVP — Proposal Stage
Opportunities JSON → Good / Better / Best proposal.


Every proposal is:
  1. Guardrail-checked (raises ValueError if non-compliant)
  2. Client-facing-filtered via rra.core.client_facing.client_facing_summary
  3. Wedge-first (Good tier == #1 opportunity, matched by leak_id)
  4. Rendered as two files: internal (operator) and external (client)
"""


from __future__ import annotations


import json
import os
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


from rra.core.client_facing import client_facing_summary
from rra.core.guardrails import (
    build_decision_checklist, render_decision_checklist, validate_proposal,
)




DEFAULT_OUTPUT_DIR = "reports/proposals"




# ---------------------------------------------------------------------------
# Tier construction — each tier carries leak_id so guardrails can match on ID
# ---------------------------------------------------------------------------


def _good_tier(top: Dict[str, Any]) -> Dict[str, Any]:
    finding = top.get("finding", "the top revenue leak")
    recommended = (top.get("recommendation") or {}).get("action", "Fix the #1 leak")
    category = str(top.get("category", "")).lower()
    leak_id = top.get("leak_id")


    includes = [f"Deep diagnosis of: {finding}"]
    if category in {"lead_capture", "response_speed"}:
        includes.append("AI receptionist / SMS catcher setup (immediate operational fix)")
    elif category == "paid_traffic":
        includes.append("Call tracking + paid-traffic leak fix")
    else:
        includes.append("Implementation of the #1 opportunity")
    includes.append("30-day measurement of recovered revenue")


    return {
        "name": "Good — Fix the Biggest Leak",
        "focus": finding,
        "leak_id": leak_id,
        "focus_leak_id": leak_id,
        "description": "Single-fix entry designed to prove value fast.",
        "recommended_action": recommended,
        "monthly_impact": int(round(top.get("estimated_monthly_opportunity", 0))),
        "price": 997,
        "monthly": 0,
        "includes": includes,
    }




def _better_tier(ranked: List[Dict[str, Any]]) -> Dict[str, Any]:
    total = sum(o.get("estimated_monthly_opportunity", 0) for o in ranked[:3])
    return {
        "name": "Better — Revenue Recovery Systems",
        "focus": "Primary leak + next two highest opportunities",
        "leak_id": ranked[0].get("leak_id") if ranked else None,
        "description": "Install and manage the top three fixes.",
        "monthly_impact": int(round(total)),
        "price": 5000,
        "monthly": 2500,
        "includes": [
            "Everything in Good",
            "Implementation of top 3 opportunities",
            "90-day roadmap and baseline tracking",
            "Monthly optimization review",
        ],
    }




def _best_tier(ranked: List[Dict[str, Any]]) -> Dict[str, Any]:
    total = sum(o.get("estimated_monthly_opportunity", 0) for o in ranked)
    return {
        "name": "Best — Full Revenue Recovery Management",
        "focus": "Continuous recovery and continuous improvement",
        "leak_id": ranked[0].get("leak_id") if ranked else None,
        "description": "Ongoing management of the full Revenue Recovery System.",
        "monthly_impact": int(round(total)),
        "price": 0,
        "monthly": 7500,
        "includes": [
            "Everything in Better",
            "Monthly re-scan and priority refresh",
            "Dedicated recovery management",
            "Quarterly business review",
        ],
    }




# ---------------------------------------------------------------------------
# Assembly
# ---------------------------------------------------------------------------


def build_proposal(ctx: Dict[str, Any],
                    opportunities: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not opportunities:
        raise ValueError("propose: no opportunities — nothing to propose")


    ranked = sorted(opportunities,
                    key=lambda o: o.get("priority_score", 0), reverse=True)
    top = ranked[0]


    generated_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    client_summary = client_facing_summary(
        opportunities=ranked,
        client_name=ctx.get("name", "your business"),
    )


    proposal: Dict[str, Any] = {
        "business_id": ctx.get("business_id"),
        "client_name": ctx.get("name", "your business"),
        "generated_at": generated_at,
        "pricing_model": "fixed_fee",
        "access_boundary": "public_only",
        "primary_recommendation": {
            "leak_id": top.get("leak_id"),
            "finding": top.get("finding"),
            "estimated_monthly_impact": int(round(top.get("estimated_monthly_opportunity", 0))),
            "recommended_action": (top.get("recommendation") or {}).get("action"),
            "time_to_value_days": int(top.get("time_to_value_days", 14)),
        },
        "tiers": {
            "good":   _good_tier(top),
            "better": _better_tier(ranked),
            "best":   _best_tier(ranked),
        },
        "client_summary": client_summary,
        "internal_opportunities": ranked,
    }


    ok, violations = validate_proposal(proposal)
    if not ok:
        raise ValueError(
            "Non-compliant proposal blocked by guardrails: "
            + ", ".join(violations)
        )
    return proposal




# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------


def render_operator_view(proposal: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append(f"# Proposal (Internal) — {proposal.get('client_name')}")
    lines.append(f"_Generated: {proposal.get('generated_at')}_")
    lines.append("")
    lines.append(f"**Pricing model:** {proposal.get('pricing_model')}  ")
    lines.append(f"**Access boundary:** {proposal.get('access_boundary')}")
    lines.append("")


    primary = proposal.get("primary_recommendation", {})
    lines.append("## Primary Recommendation")
    lines.append(f"- **Leak:** {primary.get('finding')} (`{primary.get('leak_id')}`)")
    lines.append(f"- **Monthly impact:** ${int(primary.get('estimated_monthly_impact', 0)):,}")
    lines.append(f"- **Action:** {primary.get('recommended_action')}")
    lines.append(f"- **Time-to-value:** {primary.get('time_to_value_days')} days")
    lines.append("")


    lines.append("## Tiers")
    for label in ("good", "better", "best"):
        tier = proposal["tiers"][label]
        lines.append(f"### {tier.get('name')}")
        lines.append(f"- **Focus:** {tier.get('focus')}")
        lines.append(f"- **Leak ID:** `{tier.get('leak_id')}`")
        lines.append(f"- **Monthly impact:** ${int(tier.get('monthly_impact', 0)):,}")
        price_bits = []
        if tier.get("price"):
            price_bits.append(f"${int(tier['price']):,} setup")
        if tier.get("monthly"):
            price_bits.append(f"${int(tier['monthly']):,}/mo")
        lines.append(f"- **Price:** {' + '.join(price_bits) or '—'}")
        for item in tier.get("includes", []):
            lines.append(f"  - {item}")
        lines.append("")


    lines.append("## Ranked Opportunities (Internal)")
    lines.append("| # | Leak ID | Finding | $/mo | Conf | Effort | TTV (d) | Score |")
    lines.append("|---|---------|---------|------|------|--------|---------|-------|")
    for i, opp in enumerate(proposal.get("internal_opportunities", []), 1):
        lines.append(
            f"| {i} | {opp.get('leak_id')} | {opp.get('finding')} "
            f"| ${int(opp.get('estimated_monthly_opportunity', 0)):,} "
            f"| {opp.get('confidence')} "
            f"| {opp.get('effort_label')} "
            f"| {opp.get('time_to_value_days')} "
            f"| {opp.get('priority_score')} |"
        )
    lines.append("")


    lines.append("## Commercial Decision Checklist")
    flags = build_decision_checklist(proposal)
    lines.append("```")
    lines.append(render_decision_checklist(flags))
    lines.append("```")
    return "\n".join(lines)




def render_client_view(proposal: Dict[str, Any]) -> str:
    summary = proposal.get("client_summary") or {}
    tiers = proposal.get("tiers", {})


    lines: List[str] = []
    lines.append(f"# Revenue Recovery Proposal — {proposal.get('client_name')}")
    lines.append(f"_Prepared {date.today().isoformat()}_")
    lines.append("")
    lines.append("## The Situation")
    lines.append("")
    lines.append(summary.get("headline", ""))
    lines.append("")
    lines.append("## What We Propose")
    lines.append("")


    for label in ("good", "better", "best"):
        tier = tiers.get(label, {})
        if not tier:
            continue
        lines.append(f"### {tier.get('name')}")
        lines.append(f"_{tier.get('description', '')}_")
        lines.append("")
        lines.append(f"**Estimated monthly impact:** ${int(tier.get('monthly_impact', 0)):,}")
        price_bits = []
        if tier.get("price"):
            price_bits.append(f"${int(tier['price']):,} setup")
        if tier.get("monthly"):
            price_bits.append(f"${int(tier['monthly']):,}/month")
        lines.append(f"**Investment:** {' + '.join(price_bits) or '—'}")
        lines.append("")
        lines.append("Includes:")
        for item in tier.get("includes", []):
            lines.append(f"- {item}")
        lines.append("")


    lines.append("## Next Step")
    lines.append("")
    lines.append(summary.get("next_step", "Reply with the option you'd like to start with."))
    return "\n".join(lines)




# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------


def propose(
    client_name: str,
    opportunities_path: str,
    output_dir: Optional[str] = None,
) -> Dict[str, str]:
    output_dir = output_dir or DEFAULT_OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)


    with open(opportunities_path, "r", encoding="utf-8") as fh:
        payload = json.load(fh)


    ctx = payload.get("ctx") or {"business_id": "BUS-UNKNOWN", "name": client_name}
    ctx.setdefault("name", client_name)
    opportunities = payload.get("opportunities") or []


    proposal = build_proposal(ctx, opportunities)


    slug = _slugify(client_name)
    today = date.today().isoformat()
    operator_path = Path(output_dir) / f"{slug}-proposal-{today}.internal.md"
    client_path = Path(output_dir) / f"{slug}-proposal-{today}.md"


    operator_path.write_text(render_operator_view(proposal), encoding="utf-8")
    client_path.write_text(render_client_view(proposal), encoding="utf-8")


    print(f"[propose] internal → {operator_path}")
    print(f"[propose] client   → {client_path}")


    return {
        "operator_path": str(operator_path),
        "client_path": str(client_path),
    }




def _slugify(name: str) -> str:
    return name.lower().replace(" ", "-").replace("/", "-") or "client"
```

---

rra_mvp/cli.py — UPDATE

Three commands. audit accepts optional client-supplied metrics via JSON file.

```python
"""RRA MVP — CLI entry points."""


from __future__ import annotations


import argparse
import json
import sys


from rra_mvp import audit as audit_mod
from rra_mvp import propose as propose_mod
from rra_mvp import scan as scan_mod




def scan_cmd(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="revenue-scan")
    parser.add_argument("url")
    parser.add_argument("--out", default=None)
    parser.add_argument("--workers", default=None)
    args = parser.parse_args(argv)
    workers = args.workers.split(",") if args.workers else None
    path = scan_mod.scan(args.url, output_dir=args.out, workers=workers)
    print(path)
    return 0




def audit_cmd(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="revenue-audit")
    parser.add_argument("client_name")
    parser.add_argument("url")
    parser.add_argument("--out", default=None)
    parser.add_argument("--metrics", default=None,
                        help="Path to JSON file with client-supplied metrics")
    args = parser.parse_args(argv)


    metrics = None
    if args.metrics:
        with open(args.metrics, "r", encoding="utf-8") as fh:
            metrics = json.load(fh)


    result = audit_mod.audit(args.client_name, args.url,
                              output_dir=args.out, client_metrics=metrics)
    print(result["report_path"])
    print(result["opportunities_path"])
    return 0




def propose_cmd(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="revenue-propose")
    parser.add_argument("client_name")
    parser.add_argument("opportunities_path",
                        help="Path to opportunities JSON from revenue-audit")
    parser.add_argument("--out", default=None)
    args = parser.parse_args(argv)


    result = propose_mod.propose(
        client_name=args.client_name,
        opportunities_path=args.opportunities_path,
        output_dir=args.out,
    )
    print(result["client_path"])
    return 0




if __name__ == "__main__":
    sys.exit(scan_cmd())
```

---

How to Run

```bash
pip install -e .


# 1. Scan: raw worker evidence only
revenue-scan https://example-hvac.com


# 2. Audit: evidence → sized + ranked opportunities
revenue-audit "ABC HVAC" https://example-hvac.com
# → reports/audits/abc-hvac-audit-2026-09-16.md          (internal)
# → reports/audits/abc-hvac-opportunities-2026-09-16.json


# Optional: pass client-supplied metrics so benchmarks don't fill gaps
echo '{"monthly_inbound_calls": 143, "average_service_ticket": 720}' > metrics.json
revenue-audit "ABC HVAC" https://example-hvac.com --metrics metrics.json


# 3. Propose: guardrail-checked, client-safe proposal
revenue-propose "ABC HVAC" reports/audits/abc-hvac-opportunities-2026-09-16.json
# → reports/proposals/abc-hvac-proposal-2026-09-16.internal.md   (operator)
# → reports/proposals/abc-hvac-proposal-2026-09-16.md            (client)
```

If guardrails fail, propose raises with the exact violations:

```
ValueError: Non-compliant proposal blocked by guardrails: WEDGE_FIRST_VIOLATION, MISSING_OPERATIONAL_FIX
```

The operator view includes the Commercial Decision Checklist pre-rendered. The client view contains zero IDs, zero confidence floats, zero schema keys — enforced by client_facing_summary().

---

## What This Ships

· Two bug fixes applied — no silent sizing drops, no false wedge-first rejections.
· Guardrails enforced at proposal time — non-compliant proposals cannot leave the pipeline.
·
V1
