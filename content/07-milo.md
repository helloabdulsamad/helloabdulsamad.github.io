# Milo: a WhatsApp sales assistant for WatchShop.ng

**Status:** Built, not deployed yet. The store it serves, WatchShop.ng, is live.
**Role:** Owner of WatchShop.ng; designed and built Milo · Jun – Sep 2026 · Code is private; happy to walk through it in an interview

## 1. The problem
WatchShop.ng is my own online store for affordable fashion watches. Its contact page sends customers to WhatsApp, and I wanted an assistant on that line that could answer product questions, check orders, take orders and hand tricky cases to a person. The first version wasn't safe near orders and payments. Anyone with its web address could fake messages, look up customers' orders and send messages from the store's number, and payments weren't checked against the order.

## 2. My role
Milo is my product and I'm its only engineer. I had the first version reviewed, rebuilt it in June 2026, then hardened it for production in September 2026.

## 3. How it works
- A customer messages the store on WhatsApp.
- Milo searches the live catalogue, looks up the customer's own orders, and can place an order and send a Paystack payment link.
- Anything it shouldn't answer goes to a person by email.
- Every message is saved before it is handled, so a restart doesn't lose it. Milo is built on .NET.

## 4. Key decisions
- **Identity comes from the verified phone number, never from what a customer types.** Customers can only ever see their own orders. The trade-off: number matching is tuned for Nigerian numbers.
- **Each payment is checked, then confirmed once.** The amount, currency and order must match first, so there are no underpaid or double-confirmed orders.
- **Always reply.** If something fails, the customer gets a polite holding message instead of silence.
- **Clean up half-finished orders.** If the payment link fails, the order is cancelled instead of left hanging.

## 5. The outcome
- Built and hardened for production; not live with customers yet.
- All nine critical problems found in the first version's review are fixed.
- Automated tests now run on every change. Tests on a real database caught a data upgrade that would have failed at launch.
