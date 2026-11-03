# Inkz ’N’ Paint: a nationwide web-to-print web application (client build)

**Live:** not yet. Built, not deployed: there is no staging or production URL, and inkznpaint.ng and inkznpaint.com don't resolve (checked 3 Nov 2026).
**Role:** Founder of Upsert Labs (the developer) and lead engineer · Oct 2026 – present · Client work, code is private · happy to walk through it in an interview
**Stack:** PHP 8.3, WordPress 7.1 on Roots Bedrock (Composer), WooCommerce 11.2, MariaDB 11 (SQLite in development), JavaScript, Fabric.js 6, jsPDF + svg2pdf, Node.js (server-side rendering service), Python (design-to-code compilers, pixel-comparison tools), Paystack (payments, webhooks, Transfers, account checks), Canva Connect API, Docker, Coolify v4, nginx, PHP-FPM, GitHub Actions

> Status: draft copy built from both repos at the latest commit (b9380da, 2 Nov 2026) and the earlier audit, re-checked on 3 Nov 2026. Items marked **TBC** need your numbers or confirmation. See "Before publishing" at the end.

---

## 1. The problem, and who it affected
Inkz ’N’ Paint is a printing press that sells across Nigeria from one studio. It wanted its own web application to sell print nationwide, with prices customers can see for themselves, against an established online printer.

That affects three groups:
- **Customers** want to pick a product and options, see the price straight away, and supply print-ready artwork even if they have no designer.
- **Staff** need one place to run orders, proofs, production, dispatch and pricing.
- **Customers far from the studio** wait longer and pay more for delivery. A vetted local printer in their state can print the job faster and cheaper.

## 2. My role
I founded Upsert Labs, the developer; Inkz ’N’ Paint is the client. I'm the only committer: all 61 commits in the code repo and the one snapshot commit in the docs repo are mine.

What I did:
- Ran the engagement from discovery to agreed scope. That covered research, an 89-screen design and a clickable prototype (17–21 Oct 2026), then quotation rounds until the client agreed the scope on 27 Oct.
- Took the product decisions with the client, based on research into Canva's terms and APIs, editor options and partner-network models: Edit in Canva on each customer's own account, our own print editor, and the partner network as a fulfilment network rather than a marketplace.
- Set the rules the build followed:
  - no hard-coded prices, products or business details;
  - every screen pixel-faithful to the approved design;
  - a HANDOFF document updated at every milestone.
- Built the print editor (17–21 Oct) and the WordPress application (24 Oct – 2 Nov 2026): the inkz-core plugin, the theme and the compilers that turn the design into screens, the rendering service and the Docker hosting.
- Ran a scope audit against every quoted item (1 Nov), then tested the Docker image on MariaDB before any deploy, including my own hands-on pass (2 Nov).

Nobody else committed to either repo. The application is built on the Roots team's Bedrock boilerplate, WooCommerce and Fabric.js. The stock photos are by Pexels and Unsplash photographers, credited in the licence records.

## 3. The architecture
A WordPress 7.1 and WooCommerce 11.2 application on **Bedrock**: Composer installs WordPress and the plugins, and settings come from the environment. Our code sits in three places:

- **the inkz-core plugin:** 37 feature modules (uploads, the editor, Canva, the Studio, partners, referrals and wallet, SEO, bot protection and more) on top of the core pricing, cart and Paystack checkout code, a REST API under `inkz/v1` and 9 custom tables;
- **the inkz theme:** 87 screens compiled from the approved design, fed with live data;
- **the Inkz editor:** a Fabric.js 6 print editor, about 8,400 lines of JavaScript, built into the theme.

```
Order to partner payout

 customer ─► product page ───► design ─────────────► cart ───────────► checkout
             live price:       upload with checks     every line        Paystack (signed
             JSON defaults +   Inkz editor            priced again      webhook, payment
             logged Studio     Edit in Canva          from its saved    verified server-side)
             edits             hire a designer        options           or bank transfer
                               send artwork later                              │
                                                                               ▼
 Studio: proof ─► customer approves ─► route the order
                                          ├─► home state, pickup, abroad, or items partners
                                          │   don't print: the home studio prints
                                          └─► other states: that state's partner pool
                                                (when a capable partner has capacity)
                                                wave 1  the best-ranked partner alone
                                                wave 2  a shortlist; first to accept wins
                                                wave 3  the open pool
                                                nobody  the home studio prints; staff alerted
                                                               │
                                                               ▼
 partner prints ─► quality photos ─► courier ─► delivered ─► 72-hour hold ─► weekly payout run
                                                                              (Paystack Transfers)
```

- **Screens:** Python compilers turn the approved design canvas into server-rendered PHP with scoped CSS for the first paint, plus live templates that get their data from the plugin. Pixel-comparison tools check each screen against the canvas at desktop and phone widths.
- **Server-side rendering:** the screens run on JavaScript, so a small Node service renders the same screen code on the server. Search crawlers, answer engines and link previews get real content. It is cached, and pages fall back to browser rendering if it's down. 93 of the 97 public pages use it.
- **SEO and answer engines:** keyword URLs with 301s from the old addresses, JSON-LD, sitemaps, `llms.txt`, a Merchant feed, city landing pages and a Help centre.
- **Bot protection:**
  - per-IP limits that answer 429;
  - known scraper bots refused with 403;
  - search crawlers verified by DNS or published IP ranges, never by user agent alone;
  - no sessions for bots;
  - honeypot and timing checks on public forms instead of CAPTCHAs.
- **Hosting (built, not deployed):** one Docker image runs three services on Coolify:
  - `app` (nginx and PHP-FPM);
  - `ssr` (the rendering service);
  - `cron` (runs WordPress's due cron jobs every 60 seconds, with the page-load cron switched off).

  MariaDB is to run as a separate Coolify database with scheduled backups. An older GitHub Actions deploy pipeline is switched off.

## 4. Key decisions and trade-offs
- **WooCommerce on Bedrock, not a custom or headless shop.** The client's staff will run products, prices, delivery and policies themselves after handover, and WooCommerce already handles orders, accounts and payments. The plan rejected headless because it meant rebuilding the payment, shipping and wallet front ends. The cost is procedural WordPress PHP.
- **The server owns every price.** Default prices sit in one JSON table per product family. Staff edits in the Studio override them and are logged. The cart prices every line again from its saved options on each calculation.
- **Screens compiled from the approved design, not rebuilt by hand.** That kept 87 screens faithful to what the client approved; the build notes say nearly all came within 0.5% of the canvas in pixel comparisons. The cost is a custom screen runtime, and JavaScript-rendered pages, which is why the rendering service exists.
- **Edit in Canva on each customer's own account.** The research found that Canva's terms don't allow one shared Premium account for every customer, and that its print partnership takes no new printers. The Canva Connect sign-in flow is coded. Until Canva approves the app, it falls back to template links.
- **Our own print editor instead of a licence.** A monthly editor licence didn't suit the client. The commercial designer plugin first considered was a poor base: reading its code turned up serious security problems. So we built one on Fabric.js 6 (MIT licence):
  - text effects and masks;
  - fold lines on brochures;
  - Yoruba, Igbo, Hausa and Arabic text: it spots letters a font lacks and offers a font that has them;
  - a proof PDF, vector where possible, with fonts embedded and trim and bleed boxes set.

  The client first chose Edit in Canva over it, so it became an extra design path. The trade-offs: we maintain it, and its CMYK is a preview only. The server-side CMYK print-file worker in the plan isn't built.
- **A fulfilment network, not a marketplace.** The platform keeps the customer and the national price, and partners never see the customer's name, email, phone or street address. Orders are offered in waves because one offer at a time makes customers wait, while broadcasting to everyone rewards the fastest tap over the best printer. Earnings are held for 72 hours after delivery, so complaints come first, then paid weekly. The open risk: the plan has the owner approve each payout run with one click, and the build doesn't have that step yet.
- **One image, three services, on one VPS with Coolify.** Cheap to run, and the same image runs locally with MariaDB as a pre-deploy test. The cost is a single server; recovery relies on database backups and server snapshots (documented, not yet set up).
- **Cut or deferred:**
  - SMS and WhatsApp updates, courier booking, Flutterwave, analytics and live chat wait on provider accounts that aren't set up yet;
  - an installable phone app and offline staff mode aren't built;
  - 34 of the roughly 108 products in the plan exist; staff can add more, but new kinds of product need their own pricing code.

## 5. The outcome
- **Built, not deployed.** No staging or production URL, no GitHub deployments, and the deploy workflow is switched off (checked 3 Nov 2026).
- **Pre-deploy test (2 Nov 2026):** the first build of the Coolify image, run with MariaDB 11 in Docker.
  - All 9 custom tables were created, and the main journeys passed over HTTP and WP-CLI with no database errors.
  - 168 price combinations for posters, flyers and business cards matched the price tables.
  - The partner flow ran from routing to delivery. Earnings were held, then a payout batch was created and marked paid by hand; no real transfer was sent (no Paystack keys).
  - Customer B got a 404 on customer A's order, invoice and confirmation pages and the JSON routes.
  - The bot guard answered 429 to a burst and 403 to blocked crawlers.
  - Not tested yet: live Paystack, Canva and email, partner offer waves 2 and 3, and the weekly payout cron.
- **Scope against the quotation (audit of 1 Nov 2026):** 66 items built, 39 partly built, 14 missing, plus 1 different by design and 6 launch or owner tasks.
- **Size:** 87 screens; 34 products in 7 categories; 9 custom tables.
- **Review:** a 101-finding review was closed on 27 Oct: 100 fixed (85 already, 15 in the closing commit) and 1 no longer applied.
- **Tests:** no automated tests yet: one placeholder test, which CI doesn't run. CI validates Composer and checks PHP, JavaScript and shell syntax; all 25 runs passed.
- **What broke and how I found it:** the first Docker build exposed bugs the local development setup had never hit.
  - Container scripts had Windows line endings and wouldn't start.
  - `.dockerignore` left out the must-use plugins, so staging would have been open to search engines, with no staging banner and no email redirect.
  - The nginx page cache kept an old price after a Studio edit while the cart used the new one.

  Each was fixed at the root. My hands-on test the same day found that staff were sent to WordPress's own sign-in page and had no way to sign out; both are fixed.
- **TBC:** launch date, orders, partner printers signed up.

**What to show:**
- screens on demo data: the storefront, a product page with its live price, the five design paths, the Studio production board and pricing editor, the partner job inbox;
- the prototype-against-WordPress pixel pairs (now in `pxc/` and `Terms/`; move them out of the repo first);
- a short recording of the Inkz editor: text effects, masks, fold lines, PDF export;
- the order-to-payout diagram above;
- the design-to-code pipeline: canvas, compiled PHP and CSS, live templates, server-side rendering;
- the Coolify layout: app, ssr, cron and MariaDB;
- the "what broke" note from the Docker test.

---

## Before publishing
- [ ] **Keep the status exact: "built, not deployed".** Change the Live line only when a staging or production URL answers.
- [ ] **Make payouts safe before presenting the payout engine.** A weekly job sends money with no approval step and no transfer webhook. The transfer reference is random on each attempt and isn't saved when the call times out, so a transfer that went through can't be checked, and paying it again by hand would pay twice. Add the one-click approval, a fixed reference per batch, the transfer webhook, a guard against two runs at once, and tests. A fix is in progress on a local branch but isn't committed (3 Nov); re-check once it's merged. Don't write "automatic payouts" as a feature.
- [ ] **Add automated tests before claiming any.** There is one placeholder test and CI only checks syntax. Start with pricing, payment confirmation, the webhook and payouts. Don't use "behind tests and CI" for this project yet.
- [ ] **Make the upload checks honest.** For PDF, Illustrator, Photoshop and SVG files, the "Size and bleed" and "Resolution, fonts and colours" rows show "pass" without the file being inspected (`uploads.php`, lines 691–694).
- [ ] **Fix the legal pages before any screenshot of them.** The privacy policy names an invented Data Protection Officer, and the cookie policy lists Google Analytics and Meta cookies the site doesn't set.
- [ ] **Add outbound email before launch.** The image has no mail transport, yet the confirmation page says bank details are emailed.
- [ ] **Replace the stock Bedrock README, `LICENSE.md` and `composer.json` metadata**: GitHub labels the client repo "MIT License". Remove the stray files (`-b`, `st.txt`, `page.html`, `pxc/`, `Terms/`).
- [ ] **Self-host the editor's libraries and fonts.** fabric.js, qrcode-generator, JSZip, jsPDF and svg2pdf load from jsDelivr and cdnjs with no integrity checks, and the PDF-export fonts come from Google.
- [ ] **Say "CMYK preview", not "CMYK print files".** The editor's CMYK maths is an approximation, and the server-side CMYK worker isn't built.
- [ ] **Screenshots on demo data only.** The business details and the phone number are still placeholders; don't present them as real.
- [ ] **Fix the guides' byline before showing the blog.** The 12 answer-first guides name you as author in their schema, while their text says the print team wrote them.
- [ ] **Don't name** the competitor the research benchmarked, or the commercial plugin whose code was audited, and don't publish those security findings.
- [ ] **Never publish** the code, the InkzNPaint-docs repo (it also holds third-party captures), the quotation or any commercial terms.
- [ ] **Ask the client whether the case study may name the studio's city.** The brand is positioned as Nigeria-wide, so this draft says "the home studio".
- [ ] The history has very large "WIP … not reviewed or tested" commits (68,554 and 40,119 lines added). If you show the repo in an interview, be ready to explain them.
- [ ] Update `docs/scope-gaps.md` §5. It still says the build never ran on MariaDB and the Docker files were never built; both were done on 2 Nov. Also fix "116 quotation items" in the HANDOFF: the audit tables have 126 rows.
- [ ] Keep a written copy of the client's permission to post (you confirmed it on 3 Nov 2026).

## Questions for you
1. Who ran the client meetings and the sale: you alone, or with someone at Upsert who should be named?
2. Which key decisions were yours and which the client's? (The platform, Canva on the customer's own account, building the editor, the fulfilment network.)
3. Who ran the 101-finding review closed on 27 Oct?
4. The 12 "answer-first" guides carry your name as the author, but their text says the print team wrote them. Did you write or edit them, and which byline should they carry?
5. The plan documents carry the byline "@Ahmad", and the plan's team line includes a QA tester. Who are they, and should either be credited?
6. Three other GitHub accounts can access the repo but made no commits. Should any of them be credited?
7. Which domain will it launch on, and is there a date for staging or launch?
8. May the case study say Upsert owns the editor and can reuse it for other presses, or is that a contract term to keep private?
