# EventHome: ticketing and venue booking for Nigerian events

**Live:** [eventhome.app](https://eventhome.app) · demo with simulated payments: [demo.eventhome.app](https://demo.eventhome.app)
**Role:** Co-founder and sole engineer · Sep 2026 – present · Code is private; happy to walk through it in an interview

## 1. The problem
Nigerian event organisers sell tickets over WhatsApp, check bank transfers by hand and pay promoters manually. Gates run on weak mobile signal. Venue owners want to take bookings and deposits online. Every slip costs real money: oversold tickets, missed or doubled payments, double-booked venues.

## 2. My role
I'm a co-founder and the only engineer. I set the product scope and the money rules the platform must never break. Then I built it end to end, and I run it in production.

## 3. How it works
- A buyer's seat is held the moment they start checkout, so two people can't buy the same ticket.
- Payments go through Paystack and are split straight to the organiser's own account.
- A ticket is issued only when the payment provider confirms the money arrived. Every naira is recorded in a balanced ledger.
- Gate staff check tickets on a phone app built to work with no signal. Venue calendars block double bookings.

## 4. Key decisions
- **Pay organisers directly, never hold their money.** No custody of other people's funds, so less risk and no licensing burden. The cost is relying on the payment provider's split feature.
- **Stop overselling at the database itself.** No bug elsewhere in the app can sell a ticket that doesn't exist.
- **Trust the payment provider, not the browser.** Tickets go out only for confirmed payments, and regular checks catch any payment that slipped through.
- **Offline gate checks.** Entry keeps moving with no signal. The trade-off: a stolen gate phone could forge tickets for that one event. I also left out event financing, because lending needs a licence.

## 5. The outcome
- Live since September 2026. Organisers list and sell real events on it.
- In testing, 200 buyers tried to reserve 100 tickets at the same moment. Exactly 100 succeeded.
- Load tests showed the event page slowing under heavy traffic, so I redesigned how it is cached. It then stayed fast with 800 visitors at once.
- A week after launch, paid checkouts started failing. I traced it to a wrong payment-account setting and shipped the fix on 19 September 2026, so organisers could sell again.
