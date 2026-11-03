# EventHome: ticketing, promoters and venue booking

**Live:** [eventhome.app](https://eventhome.app) · demo with simulated payments: [demo.eventhome.app](https://demo.eventhome.app)
**Role:** Co-founder and sole engineer · Sep 2026 – present · Code is private · happy to walk through it in an interview
**Stack:** TypeScript, Next.js 16, React 19, PostgreSQL 17, Drizzle ORM, Redis, Paystack (split subaccounts, transfers, webhooks), Vitest, fast-check, Playwright, k6, service-worker PWA, Cloudflare R2, Brevo, Tailwind 4, Zod 4, Docker, Coolify

> Status: draft copy built from the fact-checked audit. Items marked **TBC** need your numbers or confirmation. See "Before publishing" at the end.

---

## 1. The problem, and who it affected
Nigerian event organisers sell tickets over WhatsApp, confirm bank transfers by hand, pay promoters manually and run gates on poor connections. Buyers want to pay by transfer without creating an account. Venue owners want bookings and deposits online.

Every mistake costs real money: oversold tickets, missed or doubled payments, double-booked venues.

## 2. My role
I'm a co-founder and the only engineer; all 142 commits are mine. My co-founder runs operations and the business side.

What I did:
- Set the product scope and **eight money-and-inventory invariants** as the contract the build had to meet.
- Set the layer rules (enforced by lint) and the test-first rules.
- **Built the platform** against them, end to end.
- Deployed it on a VPS with Coolify and run it in production. That includes diagnosing a live payment outage in its first week (see the outcome).

## 3. The architecture
A Next.js 16 **modular monolith** in hexagonal layers, with the boundaries enforced by lint:

- **domain:** pure TypeScript for money in kobo, fees, discounts, ledger posting, the ticket-token format and venue matching;
- **services:** inventory holds, payments, ticketing and settlement. External providers (Paystack, Brevo, Termii, R2) sit behind ports;
- **db:** Drizzle on PostgreSQL 17, 19 forward-only migrations;
- **app:** 48 pages and 25 API routes.

```
Checkout (every step happens exactly once)

 buyer ──► HOLD ───────────► PAY ───────────► WEBHOOK ─────────► TICKET ──► LEDGER
           one conditional   idempotency      HMAC-verified,     QR holds   balanced,
           UPDATE + CHECK    key on every     deduplicated       no secret  append-only
           (sold + held      money call;      inbox + outbox                double-entry
            ≤ total)         Paystack split   in one transaction            journal (kobo)
                             to organiser's
                             subaccount
```

- **Scheduler:**
  - the outbox, hold expiry and alerts run every minute;
  - reconciliation runs every 15 minutes;
  - ledger and inventory invariant checks run nightly;
  - alerts fire when the ledger-balance or oversell signal goes red.
- **Gate app:** a PWA downloads a key manifest for each event (HKDF-derived keys) and checks tickets with no signal.
- **Venues:** a GiST exclusion constraint stops two holds overlapping on the same venue calendar.
- **Hosting:** Coolify on a VPS runs Postgres, Redis, a migrations release step, the app, the scheduler and nightly backups.

## 4. Key decisions and trade-offs
- **Split settlement through Paystack, so the platform never holds organisers' money.** No custody or licensing burden; the cost is depending on the provider's split features.
- **Oversell is stopped in the database**, with one conditional UPDATE plus a CHECK constraint, not with app locks or queues. Simple and testable; the cost is contention on hot rows.
- **The webhook is the source of truth**, never the payment redirect: an inbox, an outbox and reconciliation.
- **Integer kobo everywhere**, with property-based tests on fees, discounts, refunds and ledger posting.
- **Offline gate scanning with a key per event.** Works with no signal. The trade-off, stated in the code: a stolen gate device could forge tickets for that one event.
- **A modular monolith with ports and adapters** and no host-specific packages, rather than microservices. Portable and cheap to run.
- **Load tests showed the event page collapsing under traffic,** so I redesigned its caching.
- **Cut or deferred:**
  - event financing, which is lending and needs a licence;
  - learned demand scoring, until there is enough data (a gated v0 exists);
  - a WhatsApp channel.

## 5. The outcome
- **Live since September 2026.** Organisers list and sell real events on it; three events were listed in November 2026. Health check OK; HSTS and security headers on.
- **Oversell test:** 200 concurrent holds against 100 tickets on real Postgres; exactly 100 succeed.
- **Test suite:** about 1,000 Vitest cases, including property tests, plus Playwright suites that include an offline gate flow.
- **Load (local runs):**
  - after the caching redesign, the event page held **p95 43.9 ms at 800 concurrent visitors** (1.11 s at 1,500);
  - checkout: 800 virtual buyers raced for 500 seats with no oversell.
- **What broke and how I found it:** a week after launch, every paid checkout started failing. Settlement had stored a Paystack *transfer recipient* where checkout needed a *subaccount*. I traced it and shipped the fix on 19 Sep 2026.
- **TBC:** tickets sold, GMV, organisers onboarded, gate scans, uptime.

**What to show:**
- the live site and venue search;
- one slide with the eight invariants;
- a layer diagram;
- the checkout sequence above;
- the oversell test output;
- a k6 table;
- a recording of the offline gate;
- the /ops dashboard with emails redacted;
- the "what broke" note.

---

## Before publishing
- [ ] **Re-run the suites and capture the output.** There is no CI, and the last recorded results are from 12 Sep. Add CI (lint, typecheck, tests).
- [ ] **Re-run k6 at the same concurrency, before and after caching, and save the raw output.** The 19.3 s "before" figure was at about 4,800 users and the "after" at 800, so they can't be shown as one before/after.
- [ ] Keep the oversell test wording exact: it tests *holds*, not completed sales.
- [ ] The offline Playwright test admits by phone lookup with the network off. It doesn't scan a QR offline, and the README says the scanner has never run on a real phone. Record a real-device gate scan before claiming one.
- [ ] Update the README status table (stale since 14 Sep).
- [ ] Enforce the CSP (it's report-only) and drop the `x-powered-by` header.
- [ ] Fix the poster URLs that expire after one hour inside cached pages (they return 403 until the page regenerates).
- [ ] The only venue listed ("lojhome") looks like a placeholder; don't present it as a venue partner.
- [ ] Promoters are added by organisers, with commission paid in batches from the platform balance, and no payout batch has run in production yet. Don't write "commission paid automatically".
- [ ] Don't present the console UX as original: it was modelled on a competitor's flows. Keep the `docs/JETRON_*` files out of any public extract.
- [ ] Scrub the realistic-looking buyer email in `src/domain/email/typo.test.ts` before sharing any code.
- [ ] Agree with your co-founder before sharing code or metrics, or naming them. Run demos from demo.eventhome.app.

## Questions for you
1. Who brought in the organisers? Should your co-founder be named?
