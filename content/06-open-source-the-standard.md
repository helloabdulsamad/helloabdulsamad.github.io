# Open source with The Standard community

**Links:** [EventHighway on NuGet](https://www.nuget.org/packages/EventHighway) · [RESTFulSense client](https://github.com/The-Standard-Organization/STX.REST.RESTFulSense.Clients) · [The Standard v2.10.1](https://github.com/hassanhabib/The-Standard/releases) · [ADotNet](https://github.com/The-Standard-Organization/ADotNet)
**Role:** Contributor · Mar 2024 – Mar 2026

## 1. The problem
.NET teams want reliable event messaging without running a separate message broker; EventHighway gives them that. They also want web clients that report clear, useful errors instead of bare status codes; that is RESTFulSense. And The Standard, the engineering book behind these libraries, needed its code samples brought up to date.

## 2. My role
I'm a contributor, not the creator. I added features and upgrades to EventHighway, wrote the error handling for the RESTFulSense client rewrite, and updated the book's code samples.

## 3. How it works
- **EventHighway:** I built parts of its archiving for failed events, a feature to process events straight away, and its move to .NET 9.
- **RESTFulSense:** I wrote the error types, the error mapping and the request checks in the new client.
- **ADotNet and GitFyle:** smaller improvements and code reviews.
- Every change follows The Standard's strict layers and is written test first: a failing test, then the code that makes it pass.

## 4. Key decisions
- **Work inside the maintainers' design, not around it.** One small change per layer. Slower, but each change is easy to review and trust.
- **Test first, always.** Every feature arrives with the tests that prove it works.
- **Patient, written reviews across time zones.** Some changes took months to merge. That is the price of code that many teams depend on.

## 5. The outcome
- My EventHighway work shipped on NuGet in version 1.3.2 (May 2025) and 2.1.0 (March 2026). I'm listed among its contributors.
- My ADotNet change is in every release from v3.0.3 to v6.0.0.
- The Standard's v2.10.1 release notes thank me by name.
- The RESTFulSense rewrite is not released yet.
