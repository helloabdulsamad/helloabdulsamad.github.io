# Upsert Scout: a job-board crawler and public jobs API

**Live:** [scout.upsert.ng](https://scout.upsert.ng) · api.scout.upsert.ng · public spec: `api.scout.upsert.ng/openapi/public.json`
**Role:** Sole engineer · Sep 2026 – present · Code is private (the public API spec is open)
**Stack:** C# / .NET 10, ASP.NET Core, EF Core 10, PostgreSQL 17, Hangfire, Argon2id, System.Threading.RateLimiting, Next.js 16, React 19, TanStack Query, MSW, Vitest, Playwright, GitHub Actions + gitleaks, Docker, Coolify. Microsoft.Playwright and AngleSharp providers are built and tested but not used in production.

> Status: draft copy built from the fact-checked audit. **Fix the two urgent issues under "Before publishing" before linking this anywhere.**

---

## 1. The problem, and who it affected
People job-hunting at specific companies check dozens of careers pages by hand, each on a different applicant-tracking system, and they miss new postings. Developers also want a clean, current jobs feed through an API.

## 2. My role
It's my product, under my company, Upsert Labs, and I'm the only person who worked on it.

What I did:
- **Made the product and security decisions:**
  - approval-only API keys;
  - 30 requests a minute and 5,000 a day per key;
  - no scraped companies in the public feed;
  - server-to-server access only.
- **Built it through 82 pull requests.**
- Deployed and run both apps.

Most of it landed in about two days (5–7 Sep 2026). I added the public developer API on 27–28 Oct 2026.

## 3. The architecture
**Scout.Core:** .NET 10 in The Standard's layers, with Identity, Scout and Developer modules, PostgreSQL 17 and Hangfire.

```
Crawl pipeline (daily, 03:00 UTC)

 Hangfire ─► one job per company that's due ─► provider by ATS ─────────────► resilience handler
 (8 workers)  (not crawled for 20 h,           Greenhouse · Lever · Ashby ·     retries with full-jitter
              not circuit-broken)               SmartRecruiters (native APIs)    backoff, honours Retry-After;
                                                HTML scraper (robots.txt,         5 failures in a row
                                                per-host limits) as fallback      ─► circuit breaks
                                                                                     │
 per-user board ◄─ match on (company, external id); hash-based change ◄──────────────┘
 (EF query filters   detection; missing postings marked inactive, never deleted;
  isolate each user)  /v1/changes feed
```

**Discovery:** community YC data and SEC EDGAR Form D filings, then probes against Greenhouse, Lever and Ashby, then the catalogue.

**Auth:**
- Argon2id passwords;
- access and refresh tokens in HttpOnly cookies;
- refresh rotation with reuse detection that revokes all the user's sessions (with a 60-second grace for benign races);
- lockout after repeated failures;
- global antiforgery and a deny-by-default policy.

**Public /v1 API:**
- **keys:** stored only as SHA-256 hashes;
- **paging:** HMAC-signed keyset cursors and a `/v1/changes` feed;
- **at the edge:** a kill switch, GET-only, per-IP limits and a global concurrency cap;
- **per key:** a token bucket, a daily quota and automatic suspension after repeated rejections.

**Scout.Web:** a Next.js 16 BFF.
- It rotates refresh tokens in the proxy and checks Origin against CSRF.
- It uses a typed client generated from the API.
- An MSW mock backend makes the end-to-end tests hermetic.

## 4. Key decisions and trade-offs
- **Native applicant-tracking APIs first;** scraping is only a fallback, and it obeys robots.txt. Reliability and politeness over coverage.
- **Hash-based change detection and inactive-marking** rather than wiping and re-syncing.
- **HMAC-signed keyset cursors instead of offsets:** stable, tamper-proof paging.
- **Rate limits kept in memory on a single instance,** and documented as such. Simple now, but they won't hold across replicas.
- **Speed behind CI gates.** Most of it landed in about two days, so tests, secret scans and vulnerable-package checks gated the merges.

## 5. The outcome
- **Live:** scout.upsert.ng and api.scout.upsert.ng. Health returns 200, the public OpenAPI lists 8 `/v1` paths, and the API sends strict security headers.
- **Catalogue:** seeded with **242 companies in 19 countries**, 238 of them verified against live job-board endpoints (6 Sep 2026).
- **CI:**
  - backend `main` passed **666 tests** on 28 Oct 2026, with clean vulnerable-package and full-history secret scans;
  - frontend: 345 tests on its last `main` run.
- **What broke and how I found it:** a smoke test against real Postgres before launch found every action returning 500, because the antiforgery filter wasn't registered. Fixed before deploy.
- **TBC:** users, API keys issued, postings tracked, crawl success rate.

**What to show:**
- a demo of the live app in light and dark: the board with New badges, companies, crawl history, the developer keys page;
- the public OpenAPI link;
- diagrams of the crawl pipeline, discovery, the auth sequence with reuse detection, and the edge controls;
- optional excerpts: the cursor signer and the API limiter.

---

## Before publishing
- [ ] **URGENT: anyone can manage the global catalogue.** Self-registration is open and there are no roles, so anyone can sign up, then delete or pause companies and trigger a crawl of everything. Add an admin role.
- [ ] **URGENT: upgrade Next.js on the web app.** Production runs next 16.3.1, which npm audit flags critical (several unauthenticated RCE advisories). Frontend `main` CI has been red since 27 Oct.
- [ ] Stop serving the internal spec at `/openapi/v1.json`. It's public and lists company delete, pause and crawl-all.
- [ ] Cloudflare is DNS-only, so the origin IP is public. Either switch the proxy on or don't describe Cloudflare as the edge.
- [ ] The web app sends no security headers and advertises `x-powered-by: Next.js`.
- [ ] The crawler's user agent points to `scout.upsert.ng/bot`, which redirects to /login. Publish that page or change the UA before claiming politeness.
- [ ] Chromium isn't in the production image, so the headless provider can't run in production. Add it or stop listing it.
- [ ] Update the README: it still says 121 companies, says there's no Dockerfile, and gives an old endpoint count.
- [ ] Scrub the origin IP (in 4 places) and a local plan path from the docs before sharing any code.
- [ ] The "New" badge is "first seen in the last 48 hours", the same for every user. Keep the copy exact.

## Questions for you
1. Any users, API keys issued or external consumers yet (the friend's job-tracker app)?
2. Do you want to publish the signed-cursor and rate-limit module as a small public code extract?
