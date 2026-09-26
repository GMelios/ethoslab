---
title: "Did a youth hiring subsidy create jobs? Evidence from a staggered regional rollout"
lang: en
summary: A hiring subsidy for workers aged 18 to 24 reached regions at different times. We used that timing to estimate what the subsidy did to youth employment, and who it displaced.
sectors:
  - labour
  - regions
partner: National labour ministry (anonymised)
countries:
  - Greece
years: "2022–2024"
status: completed
design: Staggered difference-in-differences on administrative records
sample: 13 regions, quarterly employment records 2019 to 2024
headline:
  value: "+1.8 pp"
  label: youth employment rate once the subsidy reached a region
featured: true
order: 2
illustrative: true
results:
  title: Effect of the subsidy on employment, by group
  unit: pp
  unitLabel: Average effect on treated regions, percentage points
  decimals: 1
  note: Callaway and Sant'Anna (2021) estimator with not-yet-treated regions as controls, aggregated to an average effect on treated regions. With only 13 regional clusters, conventional clustered standard errors over-reject, so intervals come from a wild cluster bootstrap (Webb weights, 9,999 replications) and need not be symmetric.
  effects:
    - group: Eligible workers, aged 18 to 24
      label: All
      estimate: 1.8
      ciLow: 0.8
      ciHigh: 2.9
      controlMean: 38.6
    - group: Eligible workers, aged 18 to 24
      label: Women
      estimate: 2.3
      ciLow: 1.0
      ciHigh: 3.6
    - group: Eligible workers, aged 18 to 24
      label: Men
      estimate: 1.3
      ciLow: 0.1
      ciHigh: 2.6
    - group: Eligible workers, aged 18 to 24
      label: Unemployed for 12+ months at baseline
      estimate: 2.9
      ciLow: 1.1
      ciHigh: 4.8
    - group: Placebo and spillover checks
      label: Two years before rollout (pre-trend)
      estimate: -0.1
      ciLow: -1.0
      ciHigh: 0.8
    - group: Placebo and spillover checks
      label: Aged 25 to 29 (possible displacement)
      estimate: -0.4
      ciLow: -1.3
      ciHigh: 0.5
    - group: Placebo and spillover checks
      label: Aged 30 to 34 (not eligible)
      estimate: 0.2
      ciLow: -0.7
      ciHigh: 1.1
---

## The question

Hiring subsidies are popular because they are easy to announce and easy to administer. They are also easy to overrate. Employers may claim the subsidy for hires they would have made anyway, or hire a subsidised 22 year old instead of an unsubsidised 27 year old. The ministry wanted an estimate of net job creation before deciding whether to extend the scheme.

## What we did

The subsidy was rolled out region by region over two years, for administrative reasons unrelated to local labour markets. That staggered timing let us compare regions that already had the subsidy with regions that did not yet have it, quarter by quarter.

Recent work in econometrics shows that the standard two-way fixed effects regression can give misleading answers when treatment starts at different times and effects change over time. We therefore used an estimator that only ever compares treated regions with regions not yet treated, and we checked for differences in trends before the rollout.

## What we found

Youth employment rose by 1.8 percentage points in regions once the subsidy arrived, on a baseline of 38.6%. The point estimate is larger for young people who had been out of work for a year or more, although the intervals overlap, so we cannot say the difference is real.

We find no evidence that treated and not-yet-treated regions were already diverging before the rollout: the pre-trend estimate is −0.1 points. That supports, but cannot prove, the assumption that they would have kept moving together. We found no detectable effect on 30 to 34 year olds, who were not eligible, which is what a genuine subsidy effect predicts. For 25 to 29 year olds the estimate is slightly negative. The interval includes zero, but it also includes displacement of up to 1.3 points, so we cannot rule out that some of the gain came at the expense of slightly older workers.

## What changed

The ministry extended the subsidy with tighter targeting on the long-term unemployed, and funded a follow-up to track whether subsidised jobs last beyond the subsidy period.
