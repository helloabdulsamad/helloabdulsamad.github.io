# Upsert: managed online stores for Nigerian small businesses

**Live:** [upsert.ng](https://upsert.ng) · merchant console at app.upsert.ng
**Role:** Founder and lead engineer, Upsert Labs · Jun 2026 – present · Code is private; happy to walk through it in an interview

## 1. The problem
Nigerian small businesses want their own online store, but they lack the technical skills and don't want to pay marketplace commission. Upsert gives them a fully managed store for a flat monthly fee, with zero commission. Payments go straight to the merchant's own Paystack account. To run that profitably with a small team, every step of a store's life has to run itself.

## 2. My role
I founded Upsert and designed and built the platform. That covers the system that creates and runs every store, the console merchants use, and the store themes.

## 3. How it works
- A merchant signs up and subscribes in the console.
- Once payment is confirmed, the platform builds their store automatically: a separate WooCommerce store, set up for naira and VAT, ready to sign in to.
- After that, the platform watches each store's health, fixes common faults itself, chases failed payments, and handles custom domains.
- It also has encrypted backups, and updates go to a test store first, then roll out in stages. The platform is built on .NET.

## 4. Key decisions
- **Run WooCommerce rather than build a shop engine.** I tried a custom storefront first and dropped it within a day. Merchants already know WooCommerce, and it got the product to market much faster.
- **One separate store per merchant.** One merchant's problem can't spread to another, and each store can be restored on its own. The cost is more server resources per store.
- **Store setup that survives a crash.** If a server restarts halfway, setup picks up where it stopped, so no store is left half-built.
- **Simple hosting a small team can run,** instead of heavy enterprise tooling. When one fleet-wide update took a store down, I switched that feature off until it could be undone safely.

## 5. The outcome
- Live, and early: the product site, the merchant console and the platform behind them are all running.
- Built in about 100 days, from June to October 2026.
- Early on, merchants could be signed out without warning. I found the cause and fixed it, so sessions stay stable.
