# NETBUILD.PRO Brand System

This directory contains the customer-facing NETBUILD.PRO brand-book application and implementation assets.

- **NETBUILD.PRO** is the public company brand.
- **RRA** is the internal operating architecture and repository namespace.
- **Sizzle** is the internal operator surface.
- **Stella** is the client-facing delivery surface and is not standalone software.

The authoritative implementation contract is [`public/brand/HANDOFF.md`](public/brand/HANDOFF.md).

## Local verification

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
node scripts/brand-check.mjs
```

Customer-facing RRA branding is retired. Internal `rra-*` filenames and token names remain for compatibility.
