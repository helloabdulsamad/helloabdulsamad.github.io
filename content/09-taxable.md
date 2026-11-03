# Taxable: wallets, ads, webhooks and events for a multi-tenant commerce platform

**Live:** Not live. Built, not deployed: no CI, releases, deployments or hosting config in any repo, and every service address in config is localhost · Code is private (Ahmad Salim's repos)
**Role:** I manage the project and work with its developer, **Ahmad Salim** ([SlimAhmad](https://github.com/SlimAhmad)), who built all five services · dates **TBC** · none of the code is mine
**Stack:** .NET 10, C#, ASP.NET Core, EF Core 10 on SQL Server, Azure Service Bus, EventHighway 2.2.0, Hangfire on PostgreSQL, Redis with FusionCache, Azure Blob Storage, .NET Aspire 13 test hosts, WireMock.Net, xUnit v3, XpressWallet and Flutterwave APIs, OpenTelemetry (all Ahmad's build)

> Status: draft built from the five repos (read-only) and the audit, fact-checked on 3 Nov 2026. **Recommendation: show this as a short "projects I lead" card, not a full case study, and add it to LinkedIn once your role answers are in and Ahmad agrees to be named.** The repos prove the system and Ahmad's work. Nothing in them shows yours yet: no commits, reviews, issues or mentions. Upgrade it to a full case study only when you can show your own artefacts (plans, acceptance notes, a deployment you ran) and a service is live. Items marked **TBC** need your answers. See "Before publishing" at the end.

---

## 1. The problem, and who it affected
Taxable is a multi-tenant commerce platform. Businesses (tenants) run stores, cashiers, products and invoices on it. These five services are its money and integration backbone. From the repos' docs, they have to solve four problems:
- **Money in seven markets.** Businesses and their customers need wallets held at a payment provider: XpressWallet in Nigeria, and Flutterwave in Ghana, Kenya, Uganda, Tanzania, Rwanda and Zambia. People pay a cashier, pay by QR code or send money to a wallet by phone number, and money can be paid out to bank accounts.
- **Ads.** Tenants, the platform itself and outside advertisers run campaigns on one ad engine. Tenant campaigns are paid from budgets held in their wallets and charged per impression, per click or per placement. A charge must never be taken twice.
- **Integrations.** Tenants want signed webhooks for invoice, payment, wallet, subscription, customer and campaign events, so they don't have to poll.
- **Reliable messages between services.** Money, ad, compliance and notification events must arrive and be retried, not lost in direct calls between services.

It affects tenants and their cashiers, their customers, advertisers, and the platform's operators, who reconcile the ledger against the providers. Every mistake costs real money: a double charge, a lost payout, a ledger that drifts away from the provider.

**TBC with you:** who the tenants are, which markets go first, and who owns Taxable as a business.

## 2. My role
I manage the Taxable project and work with its developer, **Ahmad Salim**. Ahmad built all five services. None of the code is mine, and nothing here should be read as mine.

What the record shows:
- I have write access to the five repos. Ahmad (admin) and I are the only collaborators.
- GitHub has no commits, pull requests, reviews, comments, issues or issue activity from me in any of them, and no file or commit message names me. So my part of the work happens outside GitHub (**TBC:** where: calls, documents, a board).
- Ahmad opens and merges every pull request himself (all 249), and none has a formal review.

What I do (**TBC:** keep only the lines you confirm, and say how you do each one):
- set scope and priorities, for example the order of the phases in the wallet plan;
- review the architecture and the design decisions;
- choose the payment providers and manage those relationships;
- own QA and the acceptance of finished work;
- run or approve deployments;
- handle the stakeholders: the business owner, tenants and providers;
- hold or approve the budget.

## 3. The architecture
Five .NET 10 microservices in The Standard's layered style: brokers, then foundations, processings, orchestrations, coordinations and managements, then controllers. Redrawn at system level from the repos' docs:

```
 Other Taxable services (users, products, inventory, POS, invoicing, entitlements,
 compliance, risk, CRM, calling, notifications, media, reporting): not in these repos
        │ publish events                                  ▲ subscribe
        ▼                                                 │
 EVENTS ── durable relay on EventHighway 2.2.0 (SQL Server)
           one participant per publishing service; routes each event
           to its Azure Service Bus topic; EventHighway owns the retries
        │
        ├──► WALLETS ── double-entry ledger as the source of truth;
        │      stored balances checked against it every night
        │      top-ups, transfers, QR and cashier payments, bank payouts,
        │      ad-budget holds, provider fees, risk holds, reconciliation
        │        └──► XpressWallet (NG) · Flutterwave (GH, KE, UG, TZ, RW, ZM)
        │
        ├──► ADVERTISEMENTS ── campaigns, moderation, serving, tracking;
        │      asks Wallets to hold, capture and release budgets, by event only
        │
        └──► WEBHOOKS ── internal events become versioned tenant events,
               signed with HMAC-SHA256, delivered at least once, replayable

 WORKER (Hangfire on PostgreSQL) ── timed HTTP triggers ──► the four services
   webhook ingestion, event retries and scheduled events (every minute),
   Wallets risk sweep (every 5 min), ad settlement (every 15 min),
   balance check (02:00 UTC) and reconciliation (02:30 UTC)
```

- **Wallets** is the largest: about 79k lines of service code, 25 migrations and 30 controllers. It covers wallets and store sub-wallets, payments, payouts, cross-border transfers, budget holds for ads, provider fees, KYC tiers projected from Compliance's events, risk holds and reconciliation against each provider's records.
- **Advertisements** serves the highest-priority ad, breaking ties by weighted eCPM, within frequency caps and the daily budget. Each charge is written to a local budget ledger under a unique key, so a retry never bills twice.
- **Webhooks** lets tenants register endpoints with API keys, rotate signing secrets with an overlap, and replay deliveries.
- **Events** is a thin layer over EventHighway's V2 client. It registers each publishing service, forwards its events to Service Bus, and calls Webhooks back to deliver each webhook.
- **Worker** is about 300 lines: seven recurring jobs whose schedules can be changed in config.
- **Testing:** unit tests (xUnit v3, Moq, FluentAssertions) in four of the five repos (Worker has none), plus acceptance tests that start Wallets, Advertisements, Webhooks or Events in a .NET Aspire test host with SQL Server and the Service Bus emulator. Wallets, Advertisements and Webhooks add WireMock stand-ins for what they call (the two providers, the Events API, tenant endpoints). Advertisements and Webhooks add Redis, and Advertisements adds Azurite for blob storage.
- **The link to my open-source work.** Events builds on EventHighway, the open-source event library from The Standard community. I have 15 merged PRs in EventHighway upstream: 14 on its V1 API (dead-event archiving, mark-as-immediate, run-event and submit) and a .NET 9 upgrade. Taxable calls only EventHighway's V2 client, so it doesn't use the V1 features I worked on. Ahmad is an EventHighway contributor too.

## 4. Key decisions and trade-offs
These are Ahmad's decisions, as recorded in his docs and pull requests.
- **The ledger is the source of truth.** Every money movement is a double-entry posting. Stored balances are a projection that each flow updates in the same database transaction as its postings, and a nightly job checks every balance against the ledger and logs any drift, so it can be rebuilt from the ledger (decided 13 Oct 2026). Earlier, a comparison with another wallet codebase exposed six gaps, including no optimistic concurrency and no atomic ledger-and-balance writes. Ahmad closed all six on 8 Aug 2026 (Wallets PRs #71 to #76).
- **Providers sit behind one interface, routed by country.** One codebase covers seven markets. The trade-off is that features differ by provider: Flutterwave has no wallet tiers, so KYC tier upgrades go to XpressWallet only.
- **Services talk through events, not direct calls** (revised on 13 Oct 2026). Wallets stopped calling Entitlements, Compliance, Users and Risk while it handles a request. It keeps local copies built from their events, and Risk answers asynchronously. The synchronous API brokers were deleted (Wallets PR #199). The trade-off: outgoing payouts and transfers are parked until Risk decides.
- **Ads funding goes through events, and every step can be repeated** (Advertisements PR #2). Each request carries the same idempotency key every time, and the settlement run re-sends anything unanswered, so a lost or duplicated message corrects itself. Ahmad's README records the risks: events are published best-effort with no outbox, and the campaign spend total is a hot row to re-check after load testing.
- **Reconciliation never edits the ledger.** Breaks with a provider keep both sides as evidence and are fixed only with compensating entries.
- **Start cautious with provider webhooks.** The first XpressWallet webhook receiver only logged events and never credited wallets, because the provider's payload format wasn't documented.
- **One owner for retries.** Webhook dispatch turned off the HTTP client's own retries, so they don't double up with EventHighway's (Events PR #1).
- **Don't store the BVN.** The customer's BVN, which the Nigerian provider needs, is passed to the provider and never stored, and an acceptance test checks this (Wallets PR #228).

**TBC:** which of these, if any, I shaped. I'll add a decision as mine only once you confirm it and say where it was made.

## 5. The outcome
- **Status: built, not deployed.** I found no deployment anywhere in the repos: no CI workflows on any branch, no releases or tags, no GitHub deployments or environments, no Docker or pipeline files, and every service address in config is localhost. The build projects only print "Hello, World!". The one piece of infrastructure code is a tool in Advertisements that creates its Service Bus topics in an existing Azure namespace; nothing in the repos shows it has been run. **TBC:** whether anything runs outside these repos.
- **The size of Ahmad's build** (checked 3 Nov 2026):
  - 1,876 commits on all branches across the five repos, from 20 Feb 2026. 1,636 of Wallets' 1,801 commits are from October 2026;
  - 249 pull requests;
  - about 140k lines of service C# (without migrations) and 178k lines of tests;
  - 3,453 test methods (xUnit `[Fact]` and `[Theory]`) across the unit and acceptance projects. I haven't run them, and there is no CI. Ahmad's plan records his own local runs; its latest entry (29 Oct 2026) lists 2,522 unit tests and 118 of 118 acceptance tests for Wallets.
- **Still moving:** the latest change landed on 3 Nov 2026 (Events PR #10).
- **TBC:** launch date, tenants, markets live, transaction volume, uptime, and anything my management changed (dates hit, scope cut, problems caught in acceptance).

**What to show:**
- the system map above, redrawn as a clean diagram;
- the ad-funding flow (hold, capture, release) as a simple sequence, with no amounts;
- the Worker's schedule table;
- a link to EventHighway on GitHub, with the V1 and V2 note;
- the label "Code is private · built by Ahmad Salim";
- nothing from the private repos (code, screenshots, docs) without Ahmad's written OK.

---

## Before publishing
- [ ] **Answer the role questions below**, then rewrite section 2 with only the lines you can back up. Delete any TBC line you can't confirm rather than leave it in.
- [ ] **Get Ahmad's written OK** to name him, link his GitHub and describe the system. If someone else owns Taxable (the code headers say "Taxable Inc."), get theirs too.
- [ ] Don't describe Taxable with the lines I use for my own products ("I built", "I own production"). On Taxable, Ahmad built it, there is no CI, and nothing is in production.
- [ ] Keep the status as "built, not deployed" until a service is reachable. Don't write "launched", "processes payments" or "serves tenants".
- [ ] Present 3,453 as "test methods in the repos", not as passing tests, and quote Ahmad's recorded runs only as his records. (The audit's 3,501 also counted 48 attributes in example files outside the test projects.)
- [ ] Describe the EventHighway link exactly: my upstream PRs are on V1; Taxable uses V2.
- [ ] No pull request has a formal GitHub review, and the median time from opening to merge is about 5 seconds. Don't write "reviewed the code" or "approved PRs" unless you did it somewhere you can point to.
- [ ] Keep out: fee and VAT figures, the transaction-authorisation design, all secrets and seed values, internal hostnames, ports and Azure resource names, the names of other codebases in Ahmad's plan, and the security gaps listed for Ahmad.
- [ ] Pass the pre-deployment security notes to Ahmad: seeded event credentials, Wallets authentication, the Hangfire dashboard, CI.
- [ ] Reconcile the portfolio files: `github-audit-report.md` now lists Taxable as a card (line 43) but still under "Leave out" (line 202), and `selection.json` and `hiring-lenses.json` still say to leave it out.
- [ ] Ask Ahmad for a LinkedIn recommendation that describes your management. It's the only proof of your role that doesn't need repo access.

## Questions for you
1. **Ownership:** who owns Taxable as a business: Ahmad, his company (his GitHub lists Panda-tut), "Taxable Inc." (the name in the code's copyright headers), a client, or you and Upsert? Are you a contractor, an employee or a partner on it? (No amounts needed.)
2. **Title and dates:** what's your title (project manager, product lead, technical lead, co-founder) and when did you start? The code history starts on 20 Feb 2026.
3. **Scope and priorities:** do you decide what gets built next, such as the phase order in `docs/WALLET_PLATFORM_PLAN.md`? Did you set the seven-market scope?
4. **Planning issues:** all 63 issues were opened from Ahmad's account, 47 of them on 6 Aug 2026. Did you write or dictate any of them? Ahmad's plan quotes the questions that triggered phases 9 to 12 (for example, whether money can be paid out to a bank account). Were any of those questions yours?
5. **Architecture:** did you review or shape any design decision, such as the 13 Oct move to events, the provider abstraction, the reconciliation rules or the BVN handling? Where is it recorded?
6. **Providers:** who chose XpressWallet for Nigeria and Flutterwave for the other six markets? Who manages those relationships and the move from sandbox to live access?
7. **QA and acceptance:** how do you accept finished work (demos, test runs, sign-off)? Would you start reviewing PRs on GitHub, so there's a visible trace?
8. **Deployments:** is any service deployed anywhere, in staging or production? Who runs it? Has the Advertisements Service Bus provisioning tool been run?
9. **Stakeholders:** who are the first tenants or pilots, and who talks to them?
10. **Budget:** do you hold or approve the budget (cloud, provider costs)? No figures needed.
11. **Artefacts:** is there anything you produced that can be shown: a roadmap, specs, acceptance criteria, meeting notes, a board?
12. **Other services:** do the services these repos depend on (Users, Products, Inventory, POS, Invoicing, Risk, Compliance, Reporting, the gateway and the Taxable.Core program docs) live in repos you can't see? Are you involved in them?
13. **Naming:** may Ahmad be named and his GitHub linked? Is "Taxable" the public product name?
14. **EventHighway:** may I say Ahmad is also an EventHighway contributor? (He approved one of your PRs there, #186.) Is that how you met?
15. **LinkedIn link:** Taxable has no public URL, so the draft links EventHighway. Do you want that, or no link until Taxable has a site?
16. **Format:** are you happy with a short "projects I lead" card plus a LinkedIn project, or do you have material that would support a full case study?
