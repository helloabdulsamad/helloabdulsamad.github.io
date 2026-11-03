# Tredar: offline-first point of sale for Nigerian retailers

**Live:** [tredar.app](https://tredar.app) (the till) · [www.tredar.app](https://www.tredar.app) (landing) · api.tredar.app
**Role:** Sole builder and operator · Feb 2026 – present · Code is private · happy to walk through it in an interview
**Stack:** TypeScript, React 18, Vite, Tailwind CSS 4, React Router 6, IndexedDB, service-worker PWA, Node.js, Express 5 (JavaScript), Sequelize, PostgreSQL, Jest + supertest, Coolify, OVHcloud VPS, Let's Encrypt

> Status: draft copy built from the fact-checked audit. **Fix the security items under "Before publishing" before linking.**

---

## 1. The problem, and who it affected
Nigerian retailers lose sales when the power or the internet drops, and their stock drifts out of line across branches and their online store. Owners, cashiers and branch managers need a till that keeps selling offline and catches up later.

## 2. My role
All of it. I designed, built, deployed and run Tredar on my own (all 191 commits): the React PWA, the Node/Express API and the self-hosted stack.

I own the design, the operations and every fix.

## 3. The architecture
**Client: a React + TypeScript PWA.**
- **IndexedDB:** 3 write queues (sales, customers, products) plus local caches.
- **A sync engine with a heartbeat and auto-sync every 30 s.** It retries 10 times, then defers daily instead of stranding the item; it rescues stuck items and swaps offline IDs for server IDs.
- **Per-device sync health.**
- **Long offline stretches:** warnings at 5 and 6 days offline. At 7 days the app makes one final sync attempt, then logs out, and wipes local data only if nothing unsynced would be lost.

**Server: Express 5 (about 60 routes) and Sequelize on PostgreSQL.**
- **Shared-schema multi-tenancy:** a tenant ID on every tenant-owned table, 4 roles and per-shop authorization.
- **No double recording:** synced sales are deduplicated on (tenant, offline ID), so a retried sale can't be saved twice.
- **Auth:** a JWT in an httpOnly SameSite cookie.

```
Stock sync to the online store

 sale / return / ──► stock movement + outbox row ──► worker (every 15 s) ──► HMAC-signed webhook
 transfer / adjust   (same DB transaction)            backoff 1 min → 4 h,     + idempotency key
                                                      dead-letter after 48 h        │
                                                                                    ▼
                          WooCommerce stock ◄── my Upsert ChannelSync WordPress plugin
                          (by SKU)              (also sends new WooCommerce products back to Tredar)

 Guard rail: CHECK (stock ≥ 0) in PostgreSQL
```

**Hosting:** Coolify on an OVHcloud VPS, with Let's Encrypt. I moved it there from Vercel + Render.

## 4. Key decisions and trade-offs
- **Offline-first, not online-only.** No lost sales, at the cost of handling conflicts and swapping IDs.
- **Shared-schema tenancy.** Cheap to run, but every query has to enforce isolation.
- **A transactional outbox** instead of fire-and-forget calls to the online store.
- **Self-hosting on a VPS instead of PaaS.** Lower cost and full control, but I run the ops.
- **Kept the working JavaScript backend** instead of continuing a one-day Java/Spring scaffold.
- **Next debt to pay down:** types on the backend, CI, and tests for the offline engine.

## 5. The outcome
- **In production since February 2026.** API health OK on 3 Nov 2026.
- **Priced:** a free 3-day trial, then ₦10k a month for one shop. Billing is handled manually.
- **Real use:** at least one live merchant. A shop with 16 negative-stock rows needed a physical recount when the stock constraint landed.
- **What broke and how I found it:** on 24 Sep 2026 a new stock-constraint migration crashed the API on every boot, for every merchant, and Coolify kept restarting it into the same crash. I rolled back to the previous image, fixed the bad rows and made the migration self-healing.
- **Tests:** 54 Jest tests cover the stock-sync and integration code.
- **TBC:** tenants, paying shops, transactions per day, offline sales synced, sync failure rate.

**What to show:**
- the live landing page and the till;
- a GIF of a sale made offline, then synced (use the demo tenant, clearly labelled);
- the sync architecture diagram;
- the outage write-up.

---

## Before publishing
- [ ] **Security, first:**
  - **Fix the stored XSS in label printing** (`InventoryPage.tsx` writes product names and barcodes through `document.write`). Product names now arrive from WooCommerce, so outsiders can reach it.
  - **Validate `syncWebhookUrl`.** Any tenant owner can point it at any URL, and the worker POSTs to it on every stock movement (possible blind SSRF).
  - **Rotate the JWT secret and Paystack test keys** that are in the history (`backend/.env`), and scrub `tredar.sqlite` before the repo is ever made public.
  - The auth middleware also accepts a Bearer token: remove it, or document it.
- [ ] **Honesty:**
  - remove the "Get 5% Off with Loyalty Points!" message on the customer display;
  - fix DOCUMENTATION.md (5 roles, loyalty, gift cards and purchase orders don't exist) and the README (no MANAGER role; a stray "(Redeploying stable version...)" line);
  - fix the GitHub homepage link, which points to a dead Vercel URL.
- [ ] **Stock correctness:**
  - sales use an unconditional decrement, so the CHECK constraint is the only guard;
  - returns still read the stock and then write it back.

  Tighten both, or describe the guard exactly.
- [ ] **Sync claims:** only Tredar → WooCommerce stock works end to end. WooCommerce sales don't reduce Tredar stock yet, so say "Tredar → WooCommerce stock sync".
- [ ] Add CI, plus tests for the offline engine (`syncService.ts`, `offlineStore.ts`).
- [ ] The six landing screenshots show test data (a product called "Barcode", a placeholder phone number). Take new ones from the demo tenant.
- [ ] Decide whether the demo tenant is a public sandbox and make the README and DEPLOYMENT.md agree.

## Questions for you
1. How many tenants or paying shops are there? Any revenue?
2. When did you actually move from Vercel + Render to the VPS? Git doesn't record the cutover.
