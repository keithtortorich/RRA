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
