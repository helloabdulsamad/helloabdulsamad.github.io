# Upsert Scout: new jobs from the companies you care about

**Live:** [scout.upsert.ng](https://scout.upsert.ng) · public developer API at api.scout.upsert.ng
**Role:** Founder and sole engineer, Upsert Labs · Sep 2026 – present · Code is private

## 1. The problem
People who want to work at specific companies check dozens of careers pages by hand. Each page runs on a different hiring system, so new jobs get missed. Developers building job tools also want a clean, current jobs feed they can plug into.

## 2. My role
Scout is my product, under my company, Upsert Labs. I made the product and security decisions, built it and run it. The core was live within days in September 2026; I added the developer API in October.

## 3. How it works
- Every day, Scout checks each company's job board. It uses the official feeds of the main hiring systems first, and only reads pages directly as a fallback.
- It spots new and closed jobs, and shows each user their own board with new jobs flagged.
- Developers can use the same data through an API, with approved keys and fair-use limits. Scout is built on .NET.

## 4. Key decisions
- **Official feeds first.** The data is more reliable and the crawler is less likely to be blocked. The trade-off is slightly less coverage.
- **Closed jobs are marked inactive, never deleted.** The history stays, so users can see what changed.
- **API keys by approval only, with limits per key.** This protects the service and its data from abuse, at the cost of slower sign-up for developers.
- **Speed with safety checks.** Every change had to pass automated tests and security scans before it went in.

## 5. The outcome
- Live: the web app and the public developer API.
- The catalogue holds 242 companies in 19 countries, checked against their live job boards.
- A test on the real database before launch found a bug that broke every action in the app. I fixed it before anyone saw it.
