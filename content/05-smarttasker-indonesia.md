# SmartTasker Indonesia: launching a live marketplace in a new country

**Live:** "SmartTasker Indonesia" on the App Store and Google Play · [smarttasker.id](https://www.smarttasker.id)
**Client:** Smarttasker Pty Ltd, who approved its inclusion here
**Role:** Major contributor · Jun – Nov 2026

## 1. The problem
Smarttasker took its Australian task marketplace to Indonesia, starting in Bali. Customers post tasks, Taskers make offers, and payment is held until the job is done. The launch needed Bahasa Indonesia throughout, a sign-in that works on popular Android phones, steady releases on both app stores, and a way to measure paid marketing.

## 2. My role
I owned the English and Indonesian language system, the app releases and crash fixes in the field. I also owned the marketing tracking plan and the bilingual marketing site.

## 3. How it works
- Every screen in the Flutter app comes in English and Indonesian. Emails and push notifications follow each user's chosen language.
- Key steps in the customer journey are reported to AppsFlyer, so the growth team can see which ads bring customers.
- The bilingual website collects waitlist sign-ups and contact requests, and sends each phone to the right app store.

## 4. Key decisions
- **Translations are checked automatically.** A missing Indonesian line stops the release instead of reaching users.
- **Marketing events sent from the server,** not only from the phone. They survive phone privacy limits, so ad spend can be measured.
- **Fix sign-in fast, review later.** A self-repairing storage fix got Samsung users signed in quickly. Its fallback is flagged for a later security review.
- **Check payouts end to end before launch,** instead of trusting the Australian set-up.

## 5. The outcome
- Shipped five releases between September and November 2026. The app is live on both stores.
- Sign-in unblocked on Samsung S22 and S24 phones. The first fix shipped a day before the Google Play launch.
- Before launch, the payout check caught a database limit that would have capped a Rp 860,500 payout at Rp 99,999.99. Taskers would have been underpaid.
- TikTok ad tracking confirmed working in production.
