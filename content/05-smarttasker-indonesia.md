# SmartTasker Indonesia: launching a live marketplace in a new country

**Live:** App Store "SmartTasker Indonesia" · Google Play `au.smarttasker.id` · [smarttasker.id](https://www.smarttasker.id)
**Client:** Smarttasker Pty Ltd, who approved adding their product to this portfolio.
**Role:** Second engineer and major contributor · Jun – Nov 2026
**Stack:** Flutter, Dart, GetX, Dio, Firebase (Crashlytics, Analytics, Messaging), AppsFlyer + OneLink, iOS App Tracking Transparency, Laravel 11, PHP 8.2, MySQL, Vercel serverless functions, Brevo, TikTok Events API, Meta Pixel

> Status: draft copy built from the fact-checked audit.

---

## 1. The problem, and who it affected
Smarttasker took its Australian task marketplace to Indonesia, starting in Bali. Customers post tasks, Taskers make offers, and payment is held until the job is done.

The launch needed four things:
- Bahasa Indonesia throughout;
- a sign-in that works on popular Android phones;
- a steady release train on both stores;
- attribution to measure paid acquisition.

That affected customers, Taskers and the client's growth team.

## 2. My role
I was the second engineer, working alongside **Zafar Urakov**. He forked the Australian codebase and led most of the engineering, including payments (Xendit), payouts, identity verification, CI and deployment.

I owned:
- **localization:** the app's EN/ID framework and most of the string extraction, plus the backend fix that made emails and push notifications follow each user's language;
- **releases:** every version from 1.2.5 to 1.2.9 on the App Store and Google Play;
- **field crashes:** including the Android Keystore failure that blocked sign-in on Samsung flagships;
- **attribution:** the client's AppsFlyer event plan, built on the SDK the app already had (client funnel events, then 10 server-to-server events, the iOS tracking prompt and a deep-link fix);
- **the bilingual marketing site:** the custom layer on top of the Australian site's export (EN/ID toggle, waitlist and contact functions, TikTok Events API, Meta pixel, store redirect, 9 email templates in EN and ID).
## 3. The architecture
- **Mobile:** a Flutter/GetX app (about 61k hand-written lines, 23 modules) calling a Laravel 11 API (MySQL, Xendit payments, gated Coolify deploys).
- **Localization:**
  - 14 per-feature EN/ID dictionaries with 983 typed keys at launch (now 16 and 1,128);
  - a parity test that fails when EN and ID drift, and an audit tool;
  - about 1,230 call sites across 20 of the 23 modules.
- **Attribution:** client funnel events, then a server-to-server AppsFlyer broker with 10 events. The broker does nothing until a key is configured, times out after 5 s and never throws; callers guard the once-only events.
- **Marketing site:** a bilingual port of the Australian site on Vercel, with serverless functions for:
  - the waitlist: Brevo, plus a server-side TikTok event with SHA-256-hashed contact data, deduplicated against the pixel;
  - the contact form;
  - `/download`, which sends each phone to the right store.

```
Attribution

 app events ──► (1.2.7) client-side funnel events
            └─► (1.2.9) AppsFlyer ID sync ─► Laravel API ─► S2S broker ─► AppsFlyer
                                             10 events at real trigger points,
                                             once-only events guarded by callers
 iOS: ATT prompt  ·  OneLink deep links switched to the Indonesian template
```

## 4. Key decisions and trade-offs
- **Typed keys plus a parity test** instead of free-form strings, so a missing translation fails the build instead of shipping.
- **Attribution moved to the server**, so events survive client-side privacy limits. The cost is depending on backend trigger points.
- **The Keystore fix:** self-healing secure storage, a retry, then an unencrypted fallback. It unblocked sign-in fast; a security review would want the fallback revisited.
- **Payouts audited end to end before launch, not trusted.** That's how the money-column overflow was caught.

## 5. The outcome
- **Releases:** shipped every version from 1.2.5 to 1.2.9 (12 Sep – 2 Nov 2026). 1.2.9 is live on both stores.
- **Sign-in unblocked on Samsung S22/S24 devices.** Before the fix, Crashlytics showed 110 crash events from 2 users on one Samsung model. The fix shipped over two releases (17 and 22 Sep), the first a day before the Google Play launch.
- **Caught before launch:** money columns at `decimal(7,2)` would have capped a Rp 860,500 payout at Rp 99,999.99. Widened to `decimal(16,2)`.
- **TikTok Events API** verified working in production (Jul 2026).
- **TBC:** crash-free rate before and after, installs, signups, attributed conversions.

**What to show:**
- the store links;
- EN/ID screenshots taken in the app (the store listing is English-only);
- a release timeline from 1.2.5 to 1.2.9;
- the Keystore write-up;
- the attribution map;
- an overflow card: Rp 860,500 → Rp 99,999.99;
- a visible credit line for Zafar Urakov.

---

## Before publishing
- [ ] **Credit Zafar Urakov** and ask if he's happy to be named. Adeleke Bakare finalised the site's EN/ID legal copy; get their OK before naming them.
- [ ] **Server-side attribution is live:** the production API answers the new AppsFlyer route. Before claiming it works end to end, confirm with Zafar that the S2S key is set in Coolify (without it the broker silently sends nothing) and that events show in AppsFlyer. Also, the CI deploy step got a 401 from Coolify on 29 Oct, so its token needs refreshing.
- [ ] Archive `aosunlana/smarttask.landing.id` and delete its Vercel project. It's public and still shows the withdrawn giveaway.
- [ ] Don't link the public landing repo: it carries about 63 MB of mirrored WordPress plugin files, including paid Elementor Pro.
- [ ] Brevo on the API never reached `master` (PR #72 is still open), so don't list it as an API outcome.
- [ ] Leave out the Australian pause; that's the client's business news.
- [ ] Don't use commit screenshots.

## Questions for you
1. What was the crash-free rate before and after the Keystore fix?
2. Is Zafar happy to be named, and what title do you want for yourself on this project?
