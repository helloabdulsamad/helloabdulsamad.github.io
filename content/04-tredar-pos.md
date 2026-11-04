# Tredar: a till that keeps selling when the power goes out

**Live:** [tredar.app](https://tredar.app) (the till) · [www.tredar.app](https://www.tredar.app)
**Role:** Sole builder and operator · Feb 2026 – present · Code is private; happy to walk through it in an interview

## 1. The problem
Nigerian retailers lose sales when the power or the internet drops. Their stock also drifts out of line between branches and their online store. Owners, cashiers and branch managers need a till that keeps selling offline and catches up later.

## 2. My role
All of it. I designed, built, deployed and run Tredar on my own, from the till app to the server it talks to.

## 3. How it works
- The till runs in the browser and keeps working with no connection. Sales are saved on the device.
- When the connection comes back, it syncs on its own and keeps retrying until every sale is through. A sale sent twice is still recorded once.
- Each stock change is passed on to the merchant's WooCommerce store, so online stock matches the shop.
- One account can run several shops, with different access for owners, managers and cashiers.

## 4. Key decisions
- **Offline first, not online only.** No sale is lost to a power cut. The cost is more work to keep devices and the server in step.
- **Online-store updates are queued and retried,** not sent once and forgotten. If the online store is down for a while, it still catches up.
- **All shops share one database, kept strictly apart.** It is cheap to run, but every query has to keep each business's data separate.
- **Self-hosted on my own server** instead of a hosting platform. Lower cost and full control; the trade-off is that I run the operations.

## 5. The outcome
- In live use since February 2026.
- Stock now flows from Tredar to the merchant's online store, so the online store shows what is really on the shelf.
- In September 2026 an update crashed the server for every merchant at start-up. I rolled back to the last working version, fixed the bad stock data, and made the update safe to run again.
