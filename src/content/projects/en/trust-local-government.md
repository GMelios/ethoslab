---
title: "Which messages build trust in local government? A five-country survey experiment"
lang: en
summary: Municipalities across Southern and Central Europe are asked to explain reforms to sceptical residents. We tested four ways of doing it, side by side, in five countries.
sectors:
  - democracy
  - regions
partner: European research foundation (anonymised)
countries:
  - Greece
  - Italy
  - Spain
  - Portugal
  - Poland
years: "2025"
status: completed
design: Pre-registered survey experiment, five arms
sample: 10,000 adults, 2,000 per country
preregistration:
  registry: OSF Registries
  id: osf.io/xxxxx (placeholder)
headline:
  value: "0.14 SD"
  label: higher trust in local government after hearing that residents co-designed the reform
featured: true
order: 3
illustrative: true
results:
  title: Effect of each message on trust in local government
  unit: SD
  unitLabel: Difference from control, standard deviations
  decimals: 2
  note: Outcome is a standardised index of three trust items (mean 0, SD 1 in the control group). OLS with country fixed effects and pre-registered covariates, HC2 robust standard errors, 95% intervals. Country estimates are exploratory and not adjusted for multiple comparisons.
  effects:
    - group: All five countries
      label: Budget transparency
      estimate: 0.11
      ciLow: 0.05
      ciHigh: 0.17
      n: 4000
    - group: All five countries
      label: Performance data
      estimate: 0.07
      ciLow: 0.01
      ciHigh: 0.13
      n: 4000
    - group: All five countries
      label: Resident co-design
      estimate: 0.14
      ciLow: 0.08
      ciHigh: 0.20
      n: 4000
    - group: All five countries
      label: Mayor's endorsement
      estimate: -0.02
      ciLow: -0.08
      ciHigh: 0.04
      n: 4000
    - group: Resident co-design, by country
      label: Greece
      estimate: 0.19
      ciLow: 0.06
      ciHigh: 0.32
      n: 800
    - group: Resident co-design, by country
      label: Italy
      estimate: 0.12
      ciLow: -0.01
      ciHigh: 0.25
      n: 800
    - group: Resident co-design, by country
      label: Spain
      estimate: 0.15
      ciLow: 0.02
      ciHigh: 0.28
      n: 800
    - group: Resident co-design, by country
      label: Portugal
      estimate: 0.10
      ciLow: -0.03
      ciHigh: 0.23
      n: 800
    - group: Resident co-design, by country
      label: Poland
      estimate: 0.14
      ciLow: 0.01
      ciHigh: 0.27
      n: 800
---

## The question

When a municipality reorganises a service, it has to tell residents why. Communications teams usually reach for one of four arguments: here is where the money goes, here are the performance figures, residents helped design this, or the mayor stands behind it. There is very little evidence on which of these moves trust, and whether the answer travels across countries with different political cultures.

## What we did

We fielded the same experiment in Greece, Italy, Spain, Portugal and Poland, with 2,000 adults per country. Each respondent read a short description of a reform to household waste collection in their own municipality, randomly paired with one of the four messages or with no message at all. We then asked three questions about trust in local government, combined into a single index.

Hypotheses, outcome measures and the analysis were registered before data collection. Translations were back-translated and piloted in each country.

## What we found

Three of the four messages raised trust. Hearing that residents co-designed the reform had the largest estimated effect, 0.14 standard deviations, although we cannot statistically distinguish it from budget transparency. The mayor's endorsement had no detectable effect on average: the estimate is close to zero, and the interval rules out any positive effect larger than 0.04 SD.

The co-design effect was positive in all five countries. Country estimates are less precise, and in Italy and Portugal the intervals include zero, but we cannot reject that the effect is the same everywhere.

## What changed

Two of the participating municipal networks now use co-design framing in their reform toolkits. The full dataset and code will be published with the working paper.
