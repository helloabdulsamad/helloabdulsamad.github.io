# Upsert: managed online stores for Nigerian small businesses

**Live:**
- [upsert.ng](https://upsert.ng) (product site)
- app.upsert.ng (merchant and operator console)
- api.upsert.ng (control plane)
- the public golden WordPress image on GHCR (`ghcr.io/upsert-labs-limited/upsert-wordpress`)

**Role:** Founder and lead engineer · Jun 2026 – present · Code is private · happy to walk through it in an interview
**Stack:** C# 14 / .NET 10, ASP.NET Core, EF Core 10, PostgreSQL 17, SSH.NET + WP-CLI, Coolify v4 API, Docker, Paystack subscriptions, Cloudflare R2, GHCR (SBOM, provenance), GitHub Actions + ADotNet, gitleaks, Next.js 16, React 19, TanStack Query, openapi-typescript, Vitest, Playwright, MSW, PHP / WordPress / WooCommerce, MariaDB, Redis

> Status: draft copy built from the fact-checked audit. Items marked **TBC** need your numbers or confirmation.

---

## 1. The problem, and who it affected
Nigerian small businesses want their own online store without technical skills or marketplace commission. Upsert sells a fully managed WooCommerce store for a flat ₦10,000 or ₦20,000 a month, with zero commission and payments going straight to the merchant's own Paystack.

For a tiny team to run that profitably, every step of a store's life has to be automated: provisioning, billing, health, backups, updates, suspension and restore. That affects both the merchants and the people operating the fleet.

## 2. My role
I designed and built almost all of the platform:
- **the .NET control plane:** 301 of 302 non-merge commits;
- **the Next.js merchant and operator console:** 279 of 283;
- **both storefront themes and their release pipeline;**
- **the hardened WordPress image and its CI;**
- **most of the marketing site.**

I built it to conventions I wrote for each repo, on top of The Standard (Hassan Habib's engineering methodology).

My co-admin **Ayodeji Ogundairo** contributed:
- the merchant-logo feature, end to end;
- the getting-started guide and the store-password flow;
- the Navy & Chocolate colour and type system that the console and site still use.

## 3. The architecture
**Control plane: Upsert.Core.** A .NET 10 modular monolith with 10 modules (Identity, Plans, Billing, Provisioning, Fleet, Catalog, Entitlements, Notifications, StoreCommerce, ChannelSync). It runs on PostgreSQL, with a durable job queue stored in Postgres.

**Data plane.** One isolated WordPress + WooCommerce + MariaDB + Redis stack per merchant, on Coolify-managed servers.
- Every container runs with `no-new-privileges` and `cap_drop ALL`, plus a minimal allowlist.
- Memory, CPU weight and process limits come from the merchant's plan.

```
Provisioning (crash-safe, idempotent)

 signup ─► Paystack subscription ─► webhook (HMAC-SHA512, ─► provisioning ─► deploy stack via
 in console  or 30-day free trial      constant-time, dedup)    job (Postgres    Coolify API
                                                                queue)               │
                                                                                     ▼
 Active ◄─ WP-CLI over SSH: NGN, 7.5% VAT, ◄─ readiness gates: container ready ◄─────┘
           plugins, single sign-on            + HTTPS reachable

 Lifecycle:  Pending → Provisioning → Active ⇄ Suspended → TornDown
             Failed → Provisioning (retry)     TornDown → Provisioning (restore)
```

**Operations (built):**
- health checks and self-healing;
- dunning;
- custom domains;
- chunked AES-256-GCM backups to R2, with a drill that downloads, decrypts and verifies the newest archive;
- staged, canary-first fleet updates with rollback.

**Supply chain:**
- a golden WordPress image with version-pinned, checksum-verified plugins;
- a boot test under production hardening;
- an SBOM and provenance, and a monthly rebuild.

Themes ship through three steps:
1. validate;
2. a canary on a throwaway stack (HTTP checks on / and /shop, then always destroyed);
3. staged rollout.

**Console: a Next.js 16 BFF.**
- Tokens live only in HttpOnly cookies; client JavaScript never sees them.
- Refresh rotation runs in the proxy.
- CSRF is blocked by Origin checks plus double-submit antiforgery.
- The typed client is generated from Core's OpenAPI, and CI fails if it drifts.

## 4. Key decisions and trade-offs
- **Orchestrate WooCommerce rather than build a commerce engine.** I built a headless storefront first, then dropped it within about a day (22–23 Jun 2026) for managed WooCommerce. Much faster to market and familiar to merchants, at the cost of running a PHP fleet.
- **One isolated stack per merchant, not multisite.** Strong isolation and per-store restore, at the cost of more resources per tenant.
- **A durable job queue in Postgres**, with deterministic names, adoption of orphans and reclaim-on-startup, instead of in-memory background work. Crash-safe, at the cost of polling latency.
- **Coolify instead of Kubernetes**, so a small team can run it. Coolify returns no deployment id, so I added readiness gates.
- **I shelved the image-rollout feature behind a flag** after it took a production store down and couldn't be rolled back cleanly.
- **One deployable instead of services.** The debt: four classes over 1,100 lines that need splitting.
- **Typed clients generated from the API spec**, with a drift gate in CI.

## 5. The outcome
- **Live:**
  - the control plane (`/health/live` and `/health/ready` return Healthy);
  - the console at app.upsert.ng and the product site at upsert.ng;
  - the public golden image, whose scheduled rebuild was green on 1 Nov 2026.
- **Built in about 100 days** (22 Jun – 2 Oct 2026).
- **CI at the last merge (2 Oct 2026):** 2,025 unit and 21 acceptance tests passed in Core; 2,295 Vitest and 48 Playwright tests in the console.
- **What broke and how I found it:**
  - Refreshing tokens inside Server Components dropped the rotated token, so reuse detection revoked whole sessions. I moved refresh into the Next.js proxy and made Core tolerate benign rotation races.
  - A fleet image rollout took a store down and couldn't be rolled back cleanly. I gated it behind a flag until it's safe.
- **TBC:** stores provisioned, paying merchants, MRR, typical provisioning time, restore-drill results, uptime. Until then: "live, early".

**What to show:**
- diagrams: control plane vs data plane, the provisioning sequence with its failure branches, the store lifecycle, the golden-image and theme-canary pipelines;
- console screenshots on demo data: signup, provisioning stepper, fleet health, staged update, restore;
- the theme screenshots and the GHCR link;
- the build-vs-buy paragraph;
- the "what broke" notes.

---

## Before publishing
- [ ] **upsert.ng:**
  - remove the "Amaka O." illustrative testimonial;
  - remove or back the trust claims ("99.9% online", "Daily backups", "24/7");
  - fill the `[FOUNDER TO CONFIRM …]` placeholders on /terms and /privacy, including the legal company name.
- [ ] **Confirm the production flags** for backup encryption (off by default), the restore drill and the 9 background loops that are off by default. Until then the copy says "built", not "running".
- [ ] Only suspend and resume write an audit row; provisioning, failure, teardown and restore set the status directly. Fix it, or say "suspend/resume transitions are audited".
- [ ] Stop serving the full internal OpenAPI publicly at `api.upsert.ng/openapi/v1.json` (283 KB, including operator and fleet routes).
- [ ] Rewrite `Upsert.Docs/SECURITY.md` before excerpting it. It predates the pivot and still describes split-payment commission and a headless storefront.
- [ ] Resync the console's copy of the API spec; it's one operation behind Core.
- [ ] Agree with Ayodeji before publishing any code. Use demo data in every screenshot.
- [ ] **ChannelSync + Relay:** keep them out of the headline. They aren't in production (waiting on Meta app approval). Encrypt the stored Meta tokens and add row claiming to the delivery poller before writing them up.

## Questions for you
1. How should Ayodeji be credited (name, role)?
2. Any numbers you can share later: stores provisioned, paying merchants, provisioning time, restore-drill results?
