"""Dependency-free public website fallback scanner for standalone MVP operation."""
from __future__ import annotations
from html.parser import HTMLParser
from urllib.parse import urlparse
from urllib.request import Request, urlopen

class _Signals(HTMLParser):
    def __init__(self):
        super().__init__(); self.tel=False; self.form=False; self.schema=False; self.booking=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); href=str(a.get('href','')).lower(); typ=str(a.get('type','')).lower()
        if tag=='a' and href.startswith('tel:'): self.tel=True
        if tag=='form': self.form=True
        if tag=='script' and typ=='application/ld+json': self.schema=True
        if any(k in href for k in ('book','schedule','appointment')): self.booking=True

def scan_public_url(url: str, timeout: float=12.0) -> str:
    parsed=urlparse(url)
    if parsed.scheme not in {'http','https'} or not parsed.netloc:
        raise ValueError('url must be an absolute http(s) URL')
    req=Request(url,headers={'User-Agent':'RRA-MVP/1.0 public-audit'})
    with urlopen(req,timeout=timeout) as resp:
        ctype=resp.headers.get_content_type()
        if ctype not in {'text/html','application/xhtml+xml'}: raise ValueError(f'unsupported content type: {ctype}')
        raw=resp.read(2_000_000)
    text=raw.decode('utf-8',errors='replace'); p=_Signals(); p.feed(text)
    signals=[]
    if not p.tel: signals.append('no_click_to_call')
    if not p.form: signals.append('no_online_booking')
    if not p.booking: signals.append('no_online_booking')
    if not p.schema: signals.append('no_schema_markup')
    signals=list(dict.fromkeys(signals))
    return '\n'.join(f'- {s}' for s in signals)
