# Taxable: the money and integration backbone of a commerce platform

**Status:** In development, not live yet
**Role:** Project manager · 2026 – present · Code is private

## 1. The problem
Taxable is a commerce platform where businesses run their stores, cashiers, products and invoices. It needs wallets in seven African markets, ads paid from those wallets, and instant updates sent to each business's own systems. Every mistake costs real money: a double charge, a lost payout, or a balance that no longer matches the bank.

## 2. My role
I manage the Taxable project and work with its developer, who builds the services.

## 3. How it works
- Wallets let businesses and their customers pay a cashier, pay by QR code, send money by phone number and pay out to a bank account.
- A ledger records every money movement. Balances are checked against it every night and against each payment provider's records.
- Businesses can run ad campaigns paid from their wallet budgets, and receive signed notifications when invoices, payments or wallets change.
- The services pass messages to each other through a reliable queue, so one slow service doesn't block the rest. It is built on .NET and Azure.

## 4. Key decisions
- **The ledger is the single record of truth.** Balances can always be rebuilt and checked, and any drift is caught overnight.
- **One connection layer for payment providers, chosen by country.** One product covers seven markets. The trade-off: features differ from provider to provider.
- **Every ad charge carries a unique reference.** A retry never bills a business twice.
- **Sensitive bank identity numbers are passed to the provider and never stored.** Less sensitive data held means less risk.

## 5. The outcome
- Built and still in active development; not deployed yet.
- Designed for Nigeria, Ghana, Kenya, Uganda, Tanzania, Rwanda and Zambia.
