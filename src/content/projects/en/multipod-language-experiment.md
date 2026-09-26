---
title: "Does reading in a second language cost citizens understanding? A seven-country experiment"
lang: en
summary: Political information about the EU increasingly arrives in English. For the MultiPoD project we tested, in seven countries, what that does to how much citizens understand, and whether a simple choice of language fixes it.
sectors:
  - democracy
  - equality
programmes:
  - Horizon Europe
partner: MultiPoD consortium (Horizon Europe)
countries:
  - Austria
  - Belgium
  - France
  - Greece
  - Portugal
  - Spain
  - United Kingdom
years: "2026"
status: completed
design: Three-arm survey experiment
sample: 4,861 multilingual respondents, from a survey of 8,195 adults
headline:
  value: "−0.52"
  label: correct answers out of six when the same article was read in a second language (control average 3.7)
featured: true
order: 0
illustrative: false
provisional: Estimates from the revised MultiPoD deliverable D1.1 (September 2026), which is still under review. Figures may change in the final deliverable and in the forthcoming paper.
results:
  title: Effect on comprehension, relative to reading in the survey language
  unit: answers
  unitLabel: Difference from first-language control, correct answers out of 6
  decimals: 2
  note: Intention-to-treat effects of random assignment, estimated by OLS on the multilingual analysis sample (N = 4,861; 4,854 with full controls) with HC1 robust standard errors. Full controls add country fixed effects, demographics, English proficiency, political interest and news use. Control mean 3.68 correct answers. The study was not pre-registered, so every specification estimated is shown.
  effects:
    - group: Forced second language
      label: Unadjusted
      estimate: -0.487
      ciLow: -0.616
      ciHigh: -0.358
      controlMean: 3.676
      n: 4861
    - group: Forced second language
      label: Demographics and country fixed effects
      estimate: -0.493
      ciLow: -0.620
      ciHigh: -0.366
      controlMean: 3.676
      n: 4861
    - group: Forced second language
      label: Full controls
      estimate: -0.523
      ciLow: -0.648
      ciHigh: -0.398
      controlMean: 3.676
      n: 4854
    - group: Choice of language
      label: Unadjusted
      estimate: 0.158
      ciLow: 0.036
      ciHigh: 0.280
      controlMean: 3.676
      n: 4861
    - group: Choice of language
      label: Demographics and country fixed effects
      estimate: 0.155
      ciLow: 0.037
      ciHigh: 0.273
      controlMean: 3.676
      n: 4861
    - group: Choice of language
      label: Full controls
      estimate: 0.140
      ciLow: 0.024
      ciHigh: 0.256
      controlMean: 3.676
      n: 4854
secondaryResults:
  - title: Perceived difficulty
    unit: points
    unitLabel: Difference from control, points on a 1 to 5 difficulty scale
    decimals: 2
    note: Higher means harder. Full controls with country fixed effects, HC1 robust standard errors, N = 4,854. Control mean 2.93.
    effects:
      - label: Forced second language
        estimate: 0.244
        ciLow: 0.171
        ciHigh: 0.317
        controlMean: 2.932
        n: 4854
      - label: Choice of language
        estimate: -0.011
        ciLow: -0.082
        ciHigh: 0.060
        controlMean: 2.932
        n: 4854
  - title: Time spent reading
    unit: log points
    unitLabel: Difference from control, log points of time on page
    decimals: 3
    note: 0.105 log points is roughly 11% more time (95% CI about 2% to 21%). Full controls with country fixed effects, HC1 robust standard errors, N = 4,853.
    effects:
      - label: Forced second language
        estimate: 0.105
        ciLow: 0.021
        ciHigh: 0.189
        n: 4853
      - label: Choice of language
        estimate: 0.077
        ciLow: -0.001
        ciHigh: 0.155
        n: 4853
---

## The question

MultiPoD is building an online space where citizens from across Europe can deliberate on policy across language borders. Political information about the EU is increasingly available first, or only, in English. Before designing how the platform handles language, the consortium needed to know whether that matters: does reading political information in a second language reduce what people take from it, and does letting people choose their language help?

## What we did

We embedded a three-arm experiment in a survey of 8,195 adults in Austria, Belgium, France, Greece, Portugal, Spain and the United Kingdom, recruited through an online panel. Multilingual respondents, the 4,861 people who speak at least one language beyond their first, were randomly assigned to read the same 250-word article on the EU AI Act in one of three ways: in the survey language, in their second language with no choice, or in a language of their choosing.

Six factual questions about the article followed immediately. We also asked how difficult the text felt and recorded how long people spent reading it.

The study was not pre-registered. The hypotheses came from earlier research, and we report every specification we estimated: unadjusted, with demographics and country fixed effects, and with full controls.

## What we found

Reading in a forced second language cost about half a correct answer: −0.52 on the six-question test (95% CI −0.65 to −0.40), roughly 14% of the control group's average score of 3.7. The estimate barely moves across specifications. People in that condition also rated the text as harder, by 0.24 points on a five-point scale, and spent roughly 11% longer on it. More effort, less understanding.

Offering a choice avoided the penalty. Respondents who picked their own language scored slightly above the control group (+0.14, 95% CI 0.02 to 0.26), and we found no detectable change in how difficult they found the text: the interval rules out increases of more than 0.06 points. Their reading time was not clearly different from the control group's, although the interval does not rule out an increase of up to about 17%.

The penalty is statistically significant in Austria, Belgium, France, Greece and the United Kingdom, and not distinguishable from zero in Portugal and Spain. Country estimates are much less precise than the pooled result and are best read descriptively.

## What this cannot tell us

Online panel respondents tend to be younger, more digitally literate and more politically attentive than the general population. The test covers one short, factual article; longer or more technical texts could produce different effects. Some respondents did not complete the outcomes, which the deliverable addresses with completion-rate comparisons and bounds.

## What it means for the platform

The study's recommendations for MultiPoD follow directly from the two findings: default to each user's preferred language rather than to English, make language choice simple, visible and reversible, label translated or summarised content clearly, and monitor comprehension and effort by language so that no group carries a heavier burden.

Ethos Lab led the study within MultiPoD Work Package 1. MultiPoD is funded by the European Union's Horizon Europe programme. Views and opinions expressed are those of the authors only and do not necessarily reflect those of the European Union.
