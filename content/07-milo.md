# Milo: a WhatsApp AI sales agent for WatchShop.ng

**Live:** Milo is built, not deployed. The store it was built for, [watchshop.ng](https://watchshop.ng), is live.
**Role:** Owner of WatchShop.ng; designed and built Milo as its only engineer · first version before Jun 2026 (**TBC**), rebuilt Jun 2026, hardened Sep 2026 · Code is private · happy to walk through it in an interview
**Stack:** C#, .NET 9, ASP.NET Core, EF Core 9 + Npgsql, PostgreSQL (jsonb, xmin), Xeption, Microsoft.Extensions.Http.Resilience, BackgroundService + System.Threading.Channels, DeepSeek (`deepseek-chat` over its Anthropic-compatible Messages API), WhatsApp Cloud API, WooCommerce REST, Paystack, SMTP, xUnit, Moq, FluentAssertions, WebApplicationFactory, GitHub Actions (postgres:16 service), Docker (image not yet built)

> Status: draft copy built from the re-verified audit (3 Nov 2026). Items marked **TBC** need your numbers or confirmation. See "Before publishing" at the end.

---

## 1. The problem, and who it affected
WatchShop.ng is my own online store for affordable fashion watches, built on WooCommerce. Its contact page sends customers to WhatsApp.

I wanted an agent on that line that could:
- answer product questions from the live catalogue;
- check the status of an order;
- place an order and send a Paystack payment link;
- hand anything it shouldn't answer to a person, by email.

The first version of Milo did most of this, but it wasn't safe to let near orders and payments. An audit on 10 Jun 2026 found 9 critical problems. Among them:
- there was no signature check on the WhatsApp webhook, so anyone with the URL could post fake messages, look up customers' orders, run up LLM costs and send messages from the store's number;
- the Paystack check failed open, and the amount paid was never checked against the order;
- the prompt told the model to use tools that didn't exist;
- the escalation email to a person wasn't built;
- there were no tests and no CI.

The people at risk were my customers (anyone with the URL could pull up their orders) and the store (underpaid orders, its WhatsApp number and its LLM budget).

**TBC:** what handling WhatsApp by hand cost before Milo, for example hours a day or chats missed out of hours.

## 2. My role
Milo is my product. I'm the only engineer on it, and all 48 commits are mine:
- **28 commits on 10 Jun 2026** under my "WatchShop Dev" git identity;
- **20 signed commits on 23 Sep 2026** under my own name.

I set the design, made the decisions and built it, in three stages:
- **Before the repo (TBC).** The first version already talked to WhatsApp, DeepSeek, WooCommerce and Paystack, with 6 of today's 7 tools. Where it lived and when I built it: **TBC**.
- **The June rebuild (10 Jun 2026, 28 commits in one day).** I had the first version audited, then fixed it and rebuilt it:
  - the critical fixes, already in the first commit (a 4,764-line baseline of 103 files): webhook signature checks, a Paystack check that fails closed, amount, currency and order checks, one delivery path, escalation by email, a fallback reply when the agent loop runs out, and a prompt that matches the real tools;
  - a refactor into The Standard's layers, the same layering I use in my open-source work;
  - an async inbound queue with message-id dedupe, context windowing, structured logging with correlation IDs, HTTP resilience and per-IP rate limiting;
  - the first unit tests and CI, an acceptance suite, the eval harness, a Dockerfile and the docs.

  That's about 10,400 lines added after the first commit.
- **The hardening pass (23 Sep 2026, 20 commits).** I went back to get it ready for production: +3,467 / −335 lines, 1,958 of them in tests.
  - Order tools are bound to the verified WhatsApp sender, which closed an IDOR.
  - Each Paystack reference is claimed atomically, so webhooks that arrive together confirm once.
  - A durable inbound outbox and a bounded worker pool.
  - Compensation for half-finished orders.
  - A real `xmin` concurrency token.
  - Fatal migrations, a schema check in `/health`, trusted-proxy handling, and a startup check that the prompt and the tools match.
  - A fallback reply when the agent loop throws, which isn't retried down a broken channel.
  - SMTP timeouts and retries, and an honest reply when escalation fails.
  - Real-Postgres tests in CI.
  - A non-root Docker image with a health check.

The September pass also corrected three June decisions:
- June's `xmin` token broke startup and was removed; September mapped it properly;
- June trusted `X-Forwarded-For` from every caller; September trusts only named proxies;
- June logged a failed migration and carried on; September stops the app.

Roughly a fifth of today's code comes from the first commit, three-fifths from the rest of the June rebuild and a fifth from September (git blame at HEAD, excluding migrations and images).

## 3. The architecture
One ASP.NET Core service on .NET 9, in The Standard's layers: brokers → foundations → processings → orchestrations → coordinations → controllers. Each foundation service maps failures to typed Xeption exceptions. PostgreSQL holds conversations (jsonb, with an `xmin` concurrency token), message claims and payment claims.

```
 Customer on WhatsApp
        │
        ▼
 Meta Cloud API ──POST──► WebhookController
                           · X-Hub-Signature-256: HMAC-SHA256, constant time, fails closed
                           · per-IP rate limit, 60 a minute
                           · claim by message id, payload saved in Postgres, THEN 200
                                      │
                                      ▼
                bounded channel ──► worker pool (4)     unfinished claims resume at startup
                                      │
                                      ▼
                Agent loop, max 8 steps ◄────► DeepSeek (deepseek-chat)
                  context cut at user turns; each tool call kept with its result
                  tools: search_products · get_product_by_id · get_variations ·
                         get_order_by_id · get_orders_by_phone · place_order ·
                         escalate_to_human
                  order tools use the VERIFIED sender, never the model's arguments
                                      │
            ┌─────────────────────────┼──────────────────────────┐
            ▼                         ▼                          ▼
    WooCommerce REST          Paystack payment link       SMTP email to a person
    catalogue and orders      (order cancelled if         (escalation)
                               the link fails)
                                      │
                                      ▼
        one sanitiser (no emoji, no markdown) is the only path back to WhatsApp

 Paystack charge.success ──► signature check ──► claim the reference FIRST
        ──► check amount, currency and order ──► update the order, tell the customer once
```

- **Agent loop:** at most 8 model calls per message. The model sees the last 12 messages, cut at a user turn; oversized tool results are swapped for a placeholder, and older turns aren't summarised. The full history stays in Postgres.
- **Tools:** the 7 above. The app won't start if the prompt and the tool catalogue disagree.
- **Resilience:** standard resilience handlers (retries, timeouts, circuit breaker) on the 4 outbound HTTP clients.
- **Health:** `/health` checks the database and that migrations are applied.
- **Hosting:** none yet. DEPLOY.md covers local runs behind ngrok and a Dockerfile that has never been built.

## 4. Key decisions and trade-offs
- **Never trust the model with identity.** Order tools take the customer's phone from the verified WhatsApp sender and ignore what the model passes. This closed an IDOR: a customer could ask for someone else's order. Trade-off: phone matching is tuned for Nigerian numbers (the last 10 digits), so it could mismatch numbers from other countries.
- **Claim first, then act, on payments.** Each Paystack `charge.success` takes a claim on its reference before anything else happens. Amount, currency and order are checked next. A failure releases the claim so Paystack's retry can try again. Trade-off: if releasing the claim also fails, that confirmation needs a manual check from the error log.
- **Save the message before saying 200.** Each WhatsApp message is claimed in Postgres with its payload before the webhook returns, and unfinished claims resume at startup. Intake is duplicate-safe and restart-safe. Trade-off: WhatsApp doesn't redeliver after a 200, so a message that fails during processing is dropped; the customer usually gets an apology instead.
- **Always reply, but not down a broken channel.** If the loop throws or runs out of steps, the customer gets a fallback message, unless sending to WhatsApp is what failed.
- **One way out.** A single sanitiser is the only path to WhatsApp. The audit had found two competing send paths that could double-send or drop a reply.
- **Compensate rather than coordinate.** If the order is created but the payment link fails, Milo cancels the WooCommerce order (best effort) instead of leaving it half-done.
- **The Standard's layers.** More files and ceremony than a thin service, but every layer can be tested on its own. The 200 unit cases are organised by layer, with dependencies mocked.
- **Fast tests first, real Postgres where it matters.** I chose EF Core InMemory and hand-written fakes over the audit's suggested Testcontainers and WireMock. 14 of the 16 acceptance tests run on InMemory, 13 of them through the full HTTP pipeline: no Docker, no keys, no cost. InMemory skips migrations, so a broken one went unnoticed; 2 tests now run on a real postgres:16 container for jsonb, duplicate-key errors and migrations.
- **Evals stay out of CI.** The 7 golden scenarios need a live DeepSeek key, cost tokens and aren't deterministic. 4 of them are scored by an LLM judge, and the judge is the same model under test, which is a known weakness.
- **DeepSeek** over its Anthropic-compatible endpoint, which was already in the first version. Why: **TBC**.
- **Not done yet:** the audit's suggested secret-scanning job and load tests, summarising older turns, and a Docker build in CI.

## 5. The outcome
- **Status: built, not deployed.** The repo shows local runs behind ngrok only, and no production host. **TBC:** whether Milo has ever answered real customers.
- **Before and after:**
  - 10 Jun 2026: 9 critical audit findings, no tests, no CI;
  - 23 Sep 2026: **216 automated tests pass in CI** (200 unit, 16 acceptance; 2 of the acceptance tests on real Postgres), plus 7 live-LLM eval scenarios that only run by hand with a DeepSeek key (no recorded run in the repo).
- **CI** runs on every push to `main`, and all 33 runs so far have passed. There are no PRs and `main` isn't protected.
- **What the real-Postgres tests caught:** the migration that moved conversations to jsonb failed outright on real Postgres; it needed an explicit `USING` cast. CI had only ever used InMemory, which skips migrations. The new tests failed on their first local run against Postgres, I fixed the migration, and CI now guards it.
- **Reuse:** Upsert ChannelSync uses the same claim-first pattern, and its code points to Milo's as the reference.
- **TBC:** conversations handled, orders placed, payments confirmed, response times, eval scores.

**What to show:**
- the architecture diagram above;
- the audit's critical list next to the 23 Sep CI run (216 passing);
- the IDOR fix and the test that proves it;
- the Paystack claim-first sequence, at the level of the diagram;
- the real-Postgres test failing on the old migration, then passing;
- a recorded WhatsApp conversation on a test number (**TBC**: record one);
- the eval scenario names (never the system prompt).

---

## Before publishing
- [ ] Say "built, not deployed" until Milo answers real customers. Don't write "in production", "battle-tested" or "production-hardened"; "hardened for production" is fine.
- [ ] The Docker image has never been built: commit `f52e3e4` says so, and CI has no docker step. Build it once before calling Milo containerised.
- [ ] Intake is "duplicate-safe and restart-safe", not "exactly once" or "never loses a message". The comment in `InboundMessageWorker.cs` says a released claim can be redelivered or resumed, but releasing deletes the saved payload and WhatsApp won't redeliver after a 200. Fix the code or the comment before going live.
- [ ] Milo doesn't take payments. It sends Paystack links and applies each confirmation once per reference.
- [ ] Run the 7 evals once and save the scores before quoting any. Say 4 of them are judged by the same model.
- [ ] Write "CI runs on every push to main", not "gated by CI".
- [ ] Clean up the store before linking it. On 3 Nov 2026, 22 of the 23 public products on watchshop.ng were theme demo items (hoodies, dresses, "Redish 500g"), several shown with watch photos, and the homepage links to 7 of them. Milo's `search_products` would offer them to customers too.
- [ ] Confirm the keys from the first version were rotated. The audit says they were committed in plain text there; none are in this repo's history.
- [ ] Never publish the system prompt, the logo files, the store's email addresses, its config or its WhatsApp number. Remove the tracked lock and scratch files before sharing any code.
- [ ] `MILO_AUDIT.md` was never updated after the fixes. If you show it, show only its critical list, as the "before".

## Questions for you
1. Has Milo ever answered real customers on the store's WhatsApp? If so, since when, and roughly how many conversations, orders and payments?
2. Where did the first version live before 10 Jun 2026 (another repo or a local folder)? When did you build it, and did anyone else work on it?
3. Why DeepSeek: cost, quality, or the Anthropic-compatible endpoint?
4. Is the WhatsApp line on the contact page answered by Milo, by you or by staff?
5. What did handling WhatsApp by hand cost before Milo?
6. Commit `7f34922` cites "the plan in the audit" for the outbox, but `MILO_AUDIT.md` has no outbox, IDOR or proxy findings. Was there a second audit in September?
7. Were the live evals ever run? What did they score?
8. Did you ever build the Docker image, or run Milo anywhere other than locally behind ngrok?
9. In October you asked whether Milo could be sold to other stores as a managed service. Should the case study mention that as "exploring", or leave it out?
10. Is WatchShop.ng run under Upsert? The "WatchShop Dev" commits use your Upsert email, which decides the LinkedIn "associated with" field.
