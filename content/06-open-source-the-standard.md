# Open source with The Standard community

**Links:**
- [EventHighway on NuGet](https://www.nuget.org/packages/EventHighway) and [its repo](https://github.com/The-Standard-Organization/EventHighway)
- [STX.REST.RESTFulSense.Clients](https://github.com/The-Standard-Organization/STX.REST.RESTFulSense.Clients)
- [The Standard v2.10.1 release](https://github.com/hassanhabib/The-Standard/releases)
- [ADotNet](https://github.com/The-Standard-Organization/ADotNet)
- [GitFyle.Core.Api](https://github.com/The-Standard-Organization/GitFyle.Core.Api)

**Role:** Contributor · Mar 2024 – Mar 2026
**Stack:** C#, .NET 8–10, EF Core, SQL Server, Xeption, RESTFulSense, xUnit, Moq, FluentAssertions, ADotNet, NuGet

> Status: draft copy built from the fact-checked audit. This is the only public code of yours that other engineers reviewed, so it balances the solo product work.

---

## 1. The problem, and who it affected
- **EventHighway:** .NET teams want durable publish/subscribe without running a separate message broker.
- **RESTFulSense:** they want HTTP clients that raise meaningful, typed exceptions instead of raw status codes.
- **The Standard:** its engineering book needed its code samples upgraded for v2.10.1.

All three serve .NET developers who use these libraries and the methodology.

## 2. My role
I contributed to these projects; I didn't build them.

- **EventHighway: 15 merged PRs.**
  - I co-built V1 dead-event archiving with **Zafar Urakov, who designed it.** My parts were the public `ArchiveDeadEventV1sAsync` client, the orchestration that removes dead events and their listener events, the `EventV1Archive` foundation service (validation and 10 exception types) and two storage-broker methods.
  - Earlier: the Mark-As-Immediate processing and orchestration, and the .NET 9 upgrade.
- **RESTFulSense client rewrite (unreleased).**
  - Top committer: 205 of 372 commits, 6 merged PRs.
  - I wrote the HttpExchange exception taxonomy (16 classes), the ErrorMapper service and the request validation, about 27% of the surviving C#. **Raúl LB** wrote about 55%.
- **The Standard v2.10.1:** upgraded the book's code samples (PR #275). The release notes thank me by name for a major contribution.
- **ADotNet:** moved exception messages into the services (PR #103).
- **GitFyle:** a test-first contributions endpoint (PR #264) and reviews on 8 PRs.

## 3. The architecture
Every feature follows The Standard's strict layers, each with its own Xeption exception taxonomy, written test-first as FAIL-then-PASS commit pairs:

```
brokers → foundations → processings → orchestrations → coordinations → clients
```

```
EventHighway V1: archiving dead events

 client: ArchiveDeadEventV1sAsync            (mine)
   └─► coordination                          (Zafar)
         ├─► retrieve dead events + their listener events
         ├─► archive: insert listener-event archives, then the event archive
         │            (EventV1Archive foundation + storage broker: mine)
         └─► remove: delete listener events, then the event
                      (removal orchestration: mine)
```

## 4. Key decisions and trade-offs
- **Working inside the maintainers' architecture, not around it:**
  - one PR per layer;
  - FAIL→PASS commit pairs;
  - long asynchronous reviews across time zones. RESTFulSense PR #34 took 228 review comments over four months.
- **Weak spots I'd raise myself in an interview:**
  - The archive steps run as separate calls with no transaction; the library has none anywhere.
  - V1 is now marked obsolete.
  - Three gaps remain in RESTFulSense's POST path: no null-exchange check, a test that calls GET, and a request body that is never mapped.

## 5. The outcome
- **EventHighway on NuGet:**
  - my Mark-As-Immediate and .NET 9 work shipped in 1.3.2 (May 2025);
  - archiving became publicly callable in 2.1.0 (Mar 2026);
  - I'm listed among the README's contributors.
- **ADotNet:** my change is in every release from v3.0.3 to v6.0.0.
- **The Standard:** the v2.10.1 release notes credit me by name.
- **Not used:** download or star counts. They're the projects' numbers, not my impact.

**What to show:**
- the merged PR list;
- the NuGet release pages;
- a self-drawn archive diagram;
- a screenshot of a FAIL→PASS commit timeline;
- RESTFulSense PRs #19, #34 and #57 (after the POST fixes);
- the v2.10.1 release note;
- a before/after snippet from ADotNet #103;
- GitFyle review threads.

---

## Before publishing
- [ ] Fix the three RESTFulSense POST gaps before linking that repo.
- [ ] Make your membership of The-Standard-Organization public so reviewers can check it.
- [ ] Don't present PRs #242, #244 and #246 as features you wrote. They're single-commit imports of Zafar's existing submit path under a V1 suffix. Describe them as "added a parallel SubmitEventV1AsyncV1 entry point".
- [ ] Credit co-authors: Hassan Habib, Christo du Toit, Zafar Urakov, Raúl LB, Greg Hays (optionally Kailu Hu and Ahmad Salim, who reviewed your archive PRs).
- [ ] Don't attach Hassan Habib's company (BestBytes) without your OK.

## Questions for you
1. Was any of the EventHighway work done on Aspen time? Zafar is your Aspen colleague, and one of his design commits used his Aspen email. If so, don't call it volunteer work.
2. Include ARK.Apps.Mobile (.NET MAUI, mob-programming TDD sessions with Hassan Habib, 3 small PRs), or leave it out with the other mobile collaborations?
