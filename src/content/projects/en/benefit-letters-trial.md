---
title: "Simpler letters, more claims: a randomised trial of benefit take-up"
lang: en
summary: Many eligible households never apply for support they are owed. We tested whether a redesigned letter, with and without an SMS reminder, changes that.
sectors:
  - labour
  - digital
partner: National social security agency (anonymised)
countries:
  - Greece
years: "2025"
status: completed
design: Three-arm individually randomised trial
sample: 36,000 eligible households (12,000 per arm)
preregistration:
  registry: AEA RCT Registry
  id: AEARCTR-0000000 (placeholder)
headline:
  value: "+5.4 pp"
  label: more households applied within 60 days when the new letter was paired with an SMS reminder
featured: true
order: 1
illustrative: true
results:
  title: Effect of the redesigned letter on take-up, relative to the standard letter
  unit: pp
  unitLabel: Difference from control, percentage points
  decimals: 1
  note: OLS with randomisation-strata fixed effects and pre-registered baseline covariates. HC2 robust standard errors. Intervals are 95%. Applications and approvals are measured for all targeted households, not only applicants.
  effects:
    - group: Applied within 60 days
      label: Simplified letter
      estimate: 3.1
      ciLow: 2.1
      ciHigh: 4.1
      controlMean: 18.4
      n: 24000
    - group: Applied within 60 days
      label: Simplified letter + SMS
      estimate: 5.4
      ciLow: 4.4
      ciHigh: 6.4
      controlMean: 18.4
      n: 24000
    - group: Approved within 90 days
      label: Simplified letter
      estimate: 2.2
      ciLow: 1.3
      ciHigh: 3.1
      controlMean: 14.9
      n: 24000
    - group: Approved within 90 days
      label: Simplified letter + SMS
      estimate: 3.9
      ciLow: 3.0
      ciHigh: 4.8
      controlMean: 14.9
      n: 24000
    - group: Unintended effects
      label: Calls to the helpline (letter + SMS)
      estimate: 0.1
      ciLow: -0.3
      ciHigh: 0.5
      controlMean: 2.6
      n: 24000
---

## The question

Means-tested benefits only work if the people they are designed for actually claim them. Our partner estimated that fewer than one in five eligible households applied within two months of being notified. The standard notification letter ran to three pages of legal text, with the deadline and the application link on page two.

The agency wanted to know whether a clearer letter would raise take-up, and whether a low-cost SMS reminder would add anything on top.

## What we did

We randomly assigned 36,000 eligible households to one of three groups: the standard letter, a simplified one-page letter, or the simplified letter followed by an SMS reminder ten days later. Randomisation was stratified by region and household type. The primary outcome, the analysis model and the subgroups were registered before the letters were sent.

The new letter was built with the agency's caseworkers. It led with what the household was entitled to, gave one deadline, and printed a short link and a QR code to the online application.

## What we found

The simplified letter raised applications by 3.1 percentage points on a control mean of 18.4%. Adding the SMS reminder raised them by 5.4 points, a 29% increase on the control group. Approvals rose by less than applications, as expected, because not every applicant turns out to be eligible, but the gap between the arms held.

We found no detectable change in calls to the helpline. The estimate is 0.1 percentage points and the interval runs from −0.3 to 0.5, so we can rule out increases of more than half a point: the new letters did not add meaningfully to frontline workload.

## What changed

The agency adopted the simplified letter with SMS reminder for all new notifications. We agreed a follow-up to measure whether the effect persists once the letter is no longer new to staff and applicants.
