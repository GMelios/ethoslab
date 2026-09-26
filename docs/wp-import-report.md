# WordPress import report

Generated 2026-09-26 14:08 UTC by `npm run import:wp` in 7s.
Source: https://ethoslab.gr (WordPress REST API, plus public HTML for the `portfolio-item` post type).

| What | Imported | Source |
|---|---|---|
| Pages | 51 (34 EN / 17 EL) | `/wp-json/wp/v2/pages` |
| Posts | 0 (0 EN / 0 EL) | `/wp-json/wp/v2/posts` |
| Projects | 14 (13 EN / 1 EL) | `portfolio-item` (not in REST): discovered from portfolio grids, fetched as HTML |
| People | 9 (9 EN / 0 EL) | `portfolio-item` entries tagged Team / Executive Team / Consultants |
| Images | 107 files, 34793 KB | 0 downloaded this run, 107 already on disk |
| Skipped | 15 | see below |
| Stale | 0 | kept; rerun with --prune to delete |
| Errors | 0 | see below |

Project sectors were inferred from keywords in `src/data/sectors.json` and need a human review. The importer never overwrites `sectors`, `summary` or `role` once they exist.

## Projects

| Lang | Title | Source | File | Words | Images | WP tags |
|---|---|---|---|---|---|---|
| el | Γραφείο Μεταφοράς Τεχνολογίας Πανεπιστημίου Κρήτης | [source](https://ethoslab.gr/project/business-real-estate/) | `src/content/projects/el/grafeio-metaforas-technologias-panepistimioy-kritis.md` | 3 | 0 + cover | Commerce, Consultation |
| en | ACTIVE – Strengthening Policies in Sports and Leisure Activities focused on Children | [source](https://ethoslab.gr/project/active-strengthening-policies-in-sports-and-leisure-activities-focused-on-children/) | `src/content/projects/en/active.md` | 41 | 0 + cover | EU Programs, Policy, REC Programme |
| en | BENEFITS | [source](https://ethoslab.gr/project/benefits/) | `src/content/projects/en/benefits.md` | 279 | 0 + cover | EU Programs, Horizon, Policy |
| en | E.T.Ho.S – EU’s R.E.C Programme 2014-2020 | [source](https://ethoslab.gr/project/personal-injury/) | `src/content/projects/en/ethos.md` | 128 | 0 + cover | EU Programs, Policy, REC Programme |
| en | EDU-well | [source](https://ethoslab.gr/project/edu-well/) | `src/content/projects/en/edu-well.md` | 92 | 0 + cover | Erasmus+, EU Programs, Policy |
| en | ESG Lab | [source](https://ethoslab.gr/project/esg-lab/) | `src/content/projects/en/esg-lab.md` | 199 | 1 + cover | Business, Erasmus+, EU Programs |
| en | Ethos-FCNC partnership for ESG | [source](https://ethoslab.gr/project/ethos-fcnc-partnership-for-esg/) | `src/content/projects/en/ethos-fcnc-partnership-for-esg.md` | 158 | 0 + cover | Business, consultation |
| en | FAROS – FEATURE A PROTECTIVE ENVIRONMENT FOR LGBTI+ PERSONS | [source](https://ethoslab.gr/project/faros-feature-a-protective-environment-for-lgbti-persons/) | `src/content/projects/en/faros.md` | 83 | 0 + cover | EU Programs, Policy, REC Programme |
| en | GEM – Gender Equality Matters | [source](https://ethoslab.gr/project/gem-gender-equality-matters/) | `src/content/projects/en/gem.md` | 103 | 0 + cover | EU Programs, Policy, REC Programme |
| en | HEAL – enHancing rEcovery and integrAtion through networking, empLoyment training and psychological support for women victims of trafficking | [source](https://ethoslab.gr/project/heal-enhancing-recovery-and-integration-through-networking-employment-training-and-psychological-support-for-women-victims-of-trafficking/) | `src/content/projects/en/heal.md` | 390 | 0 + cover | EU Programs, horizon, Policy |
| en | MultiPoD – Public Spaces for Citizen Deliberation | [source](https://ethoslab.gr/project/multipod-multilingual-and-multicultural-spaces-for-political-deliberation/) | `src/content/projects/en/multipod.md` | 455 | 0 + cover | EU Programs, horizon, Policy |
| en | PARTICIPATION -Analysing & Preventing Extremism through Participation Horizon 2020 | [source](https://ethoslab.gr/project/participation-analysing-preventing-extremism-through-participation-horizon-2020/) | `src/content/projects/en/participation.md` | 95 | 0 + cover | EU Programs, horizon, Policy |
| en | The Employment Effects of Disability Benefits Without Work Restrictions | [source](https://ethoslab.gr/project/the-employment-effects-of-disability-benefits-without-work-restrictions/) | `src/content/projects/en/the-employment-effects-of-disability-benefits-without-work.md` | 165 | 0 + cover |  |
| en | VoiceIt | [source](https://ethoslab.gr/project/voiceit/) | `src/content/projects/en/voiceit.md` | 84 | 0 + cover | EU Programs, Policy, REC Programme |

## People

| Lang | Title | Source | File | Words | Images | WP tags |
|---|---|---|---|---|---|---|
| en | Bouke Klein Teeselink | [source](https://ethoslab.gr/project/bouke-klein-teeselink/) | `src/content/people/en/bouke-klein-teeselink.md` | 0 | 0 + cover | Consultants |
| en | George Melios | [source](https://ethoslab.gr/project/gmelios/) | `src/content/people/en/george-melios.md` | 252 | 0 + cover | Executive Team |
| en | George Vasilopoulos | [source](https://ethoslab.gr/project/george-vasilopoulos/) | `src/content/people/en/george-vasilopoulos.md` | 0 | 0 + cover | Consultants |
| en | Georgios Strofyllas | [source](https://ethoslab.gr/project/georgios-strofyllas/) | `src/content/people/en/georgios-strofyllas.md` | 127 | 0 + cover | Team |
| en | Konstantinos Chalikias | [source](https://ethoslab.gr/project/konstantinos-chalikias/) | `src/content/people/en/konstantinos-chalikias.md` | 79 | 0 + cover | Team |
| en | Maria Christina Grekou | [source](https://ethoslab.gr/project/maria-christina-grekou/) | `src/content/people/en/maria-christina-grekou.md` | 91 | 0 + cover | Team |
| en | Nikolaos Avgeris | [source](https://ethoslab.gr/project/nikolaos-avgeris/) | `src/content/people/en/nikolaos-avgeris.md` | 119 | 0 + cover | Team |
| en | Nikolaos Melios | [source](https://ethoslab.gr/project/nikolaos-melios/) | `src/content/people/en/nikolaos-melios.md` | 393 | 0 + cover | Executive Team |
| en | Yara Sleiman | [source](https://ethoslab.gr/project/yara-sleiman/) | `src/content/people/en/yara-sleiman.md` | 0 | 0 + cover | Consultants |

## Pages

| Lang | Title | Source | File | Words | Images |
|---|---|---|---|---|---|
| el | About us | [source](https://ethoslab.gr/el/about-us-2/) | `src/content/pages/el/about-us-2.md` | 30 | 4 |
| el | Home | [source](https://ethoslab.gr/el/home-2/) | `src/content/pages/el/home-2.md` | 306 | 7 |
| el | Δημοκρατία | [source](https://ethoslab.gr/el/%ce%b4%ce%b7%ce%bc%ce%bf%ce%ba%cf%81%ce%b1%cf%84%ce%af%ce%b1/) | `src/content/pages/el/dimokratia.md` | 427 | 0 |
| el | Διακυβέρνηση | [source](https://ethoslab.gr/el/%ce%b4%ce%b9%ce%b1%ce%ba%cf%85%ce%b2%ce%ad%cf%81%ce%bd%ce%b7%cf%83%ce%b7/) | `src/content/pages/el/diakyvernisi.md` | 435 | 0 |
| el | Εκπαίδευση | [source](https://ethoslab.gr/el/%ce%b5%ce%ba%cf%80%ce%b1%ce%af%ce%b4%ce%b5%cf%85%cf%83%ce%b7/) | `src/content/pages/el/ekpaideysi.md` | 564 | 0 |
| el | Εκπαίδευση | [source](https://ethoslab.gr/%ce%b5%ce%ba%cf%80%ce%b1%ce%af%ce%b4%ce%b5%cf%85%cf%83%ce%b7-2/) | `src/content/pages/el/ekpaideysi-2.md` | 235 | 12 |
| el | Εμπειρία – Έργα | [source](https://ethoslab.gr/projects/) | `src/content/pages/el/projects.md` | 10 | 9 |
| el | Εμπειρία και Συνεργασίες | [source](https://ethoslab.gr/el/track-record-and-partnerships-2/) | `src/content/pages/el/track-record-and-partnerships-2.md` | 169 | 26 |
| el | Επιχειρηματικός Μετασχηματισμός | [source](https://ethoslab.gr/el/%ce%b5%cf%80%ce%b9%cf%87%ce%b5%ce%b9%cf%81%ce%b7%ce%bc%ce%b1%cf%84%ce%b9%ce%ba%cf%8c%cf%82-%ce%bc%ce%b5%cf%84%ce%b1%cf%83%cf%87%ce%b7%ce%bc%ce%b1%cf%84%ce%b9%cf%83%ce%bc%cf%8c%cf%82/) | `src/content/pages/el/epicheirimatikos-metaschimatismos.md` | 376 | 0 |
| el | Ιστορία μας | [source](https://ethoslab.gr/el/%ce%b9%cf%83%cf%84%ce%bf%cf%81%ce%af%ce%b1-%ce%bc%ce%b1%cf%82/) | `src/content/pages/el/istoria-mas.md` | 790 | 0 |
| el | Μεταφορές | [source](https://ethoslab.gr/el/%ce%bc%ce%b5%cf%84%ce%b1%cf%86%ce%bf%cf%81%ce%ad%cf%82/) | `src/content/pages/el/metafores.md` | 494 | 0 |
| el | Οικονομία | [source](https://ethoslab.gr/el/%ce%bf%ce%b9%ce%ba%ce%bf%ce%bd%ce%bf%ce%bc%ce%af%ce%b1/) | `src/content/pages/el/oikonomia.md` | 698 | 0 |
| el | Περιβάλλον | [source](https://ethoslab.gr/el/%cf%80%ce%b5%cf%81%ce%b9%ce%b2%ce%ac%ce%bb%ce%bb%ce%bf%ce%bd/) | `src/content/pages/el/perivallon.md` | 385 | 0 |
| el | Προϊόντα | [source](https://ethoslab.gr/el/%cf%80%cf%81%ce%bf%cf%8a%cf%8c%ce%bd%cf%84%ce%b1/) | `src/content/pages/el/proionta.md` | 257 | 2 |
| el | Τεχνητή Νοημοσύνη και Τεχνολογία | [source](https://ethoslab.gr/el/%cf%84%ce%b5%cf%87%ce%bd%ce%b7%cf%84%ce%ae-%ce%bd%ce%bf%ce%b7%ce%bc%ce%bf%cf%83%cf%8d%ce%bd%ce%b7-%ce%ba%ce%b1%ce%b9-%cf%84%ce%b5%cf%87%ce%bd%ce%bf%ce%bb%ce%bf%ce%b3%ce%af%ce%b1/) | `src/content/pages/el/techniti-noimosyni-kai-technologia.md` | 287 | 0 |
| el | Τομείς Εξειδίκευσης | [source](https://ethoslab.gr/el/%cf%84%ce%bf%ce%bc%ce%b5%ce%af%cf%82-%ce%b5%ce%be%ce%b5%ce%b9%ce%b4%ce%af%ce%ba%ce%b5%cf%85%cf%83%ce%b7%cf%82/) | `src/content/pages/el/tomeis-exeidikeysis.md` | 312 | 8 |
| el | Υπηρεσίες | [source](https://ethoslab.gr/el/%cf%85%cf%80%ce%b7%cf%81%ce%b5%cf%83%ce%af%ce%b5%cf%82/) | `src/content/pages/el/ypiresies.md` | 210 | 1 |
| en | About us | [source](https://ethoslab.gr/about-us/) | `src/content/pages/en/about-us.md` | 30 | 4 |
| en | AI & Technology | [source](https://ethoslab.gr/ai-technology/) | `src/content/pages/en/ai-technology.md` | 213 | 0 |
| en | Behavioural Insights for Policy | [source](https://ethoslab.gr/behavioural-insights-for-policy/) | `src/content/pages/en/behavioural-insights-for-policy.md` | 689 | 0 |
| en | Behavioural Insights for Policy Workshop | [source](https://ethoslab.gr/bipgreece2026-registration/) | `src/content/pages/en/bipgreece2026-registration.md` | 279 | 0 |
| en | Business Transformation | [source](https://ethoslab.gr/business-transformation/) | `src/content/pages/en/business-transformation.md` | 297 | 0 |
| en | Contact Us | [source](https://ethoslab.gr/contact-us/) | `src/content/pages/en/contact-us.md` | 10 | 0 |
| en | Data Analytics & Welfare Measurement | [source](https://ethoslab.gr/data-analytics-welfare-measurement/) | `src/content/pages/en/data-analytics-welfare-measurement.md` | 62 | 0 |
| en | Democracy | [source](https://ethoslab.gr/democracy/) | `src/content/pages/en/democracy.md` | 322 | 0 |
| en | Design | [source](https://ethoslab.gr/design-2/) | `src/content/pages/en/design-2.md` | 319 | 0 |
| en | Diagnose | [source](https://ethoslab.gr/diagnose/) | `src/content/pages/en/diagnose.md` | 360 | 0 |
| en | Domains of Expertise | [source](https://ethoslab.gr/domains-of-expertise/) | `src/content/pages/en/domains-of-expertise.md` | 243 | 8 |
| en | Economy | [source](https://ethoslab.gr/economy/) | `src/content/pages/en/economy.md` | 503 | 0 |
| en | Education | [source](https://ethoslab.gr/education/) | `src/content/pages/en/education.md` | 328 | 0 |
| en | Environment | [source](https://ethoslab.gr/enviroment/) | `src/content/pages/en/enviroment.md` | 317 | 0 |
| en | Esg Lab | [source](https://ethoslab.gr/esg-lab/) | `src/content/pages/en/esg-lab.md` | 1423 | 0 |
| en | EU Regions AI Editor | [source](https://ethoslab.gr/eu-regions-ai-editor/) | `src/content/pages/en/eu-regions-ai-editor.md` | 126 | 0 |
| en | Evaluate | [source](https://ethoslab.gr/evaluate/) | `src/content/pages/en/evaluate.md` | 395 | 0 |
| en | Government | [source](https://ethoslab.gr/government/) | `src/content/pages/en/government.md` | 340 | 0 |
| en | Home | [source](https://ethoslab.gr/) | `src/content/pages/en/home.md` | 274 | 7 |
| en | How we work | [source](https://ethoslab.gr/how-we-work/) | `src/content/pages/en/how-we-work.md` | 252 | 0 |
| en | Insights | [source](https://ethoslab.gr/reports/) | `src/content/pages/en/reports.md` | 193 | 1 |
| en | Measure | [source](https://ethoslab.gr/measure/) | `src/content/pages/en/measure.md` | 401 | 0 |
| en | Our History | [source](https://ethoslab.gr/our-history/) | `src/content/pages/en/our-history.md` | 596 | 0 |
| en | Our People | [source](https://ethoslab.gr/our-people/) | `src/content/pages/en/our-people.md` | 95 | 9 |
| en | Privacy Policy / GDPR | [source](https://ethoslab.gr/privacy-policy-gdpr/) | `src/content/pages/en/privacy-policy-gdpr.md` | 1967 | 0 |
| en | Products | [source](https://ethoslab.gr/products/) | `src/content/pages/en/products.md` | 194 | 2 |
| en | Projects | [source](https://ethoslab.gr/projects-2/) | `src/content/pages/en/projects-2.md` | 107 | 13 |
| en | RWI | [source](https://ethoslab.gr/rwi-2/) | `src/content/pages/en/rwi-2.md` | 639 | 5 |
| en | Services | [source](https://ethoslab.gr/our-services/) | `src/content/pages/en/our-services.md` | 175 | 1 |
| en | Terms of Use | [source](https://ethoslab.gr/terms-of-use/) | `src/content/pages/en/terms-of-use.md` | 486 | 0 |
| en | Track Record and Partnerships | [source](https://ethoslab.gr/track-record-and-partnerships/) | `src/content/pages/en/track-record-and-partnerships.md` | 154 | 26 |
| en | Transport | [source](https://ethoslab.gr/transport/) | `src/content/pages/en/transport.md` | 405 | 0 |
| en | Η εταιρεία | [source](https://ethoslab.gr/aboutus/) | `src/content/pages/en/aboutus.md` | 625 | 14 |
| en | Σχετικά με εμάς | [source](https://ethoslab.gr/%cf%83%cf%87%ce%b5%cf%84%ce%b9%ce%ba%ce%ac-%ce%bc%ce%b5-%ce%b5%ce%bc%ce%ac%cf%821/) | `src/content/pages/en/schetika-me-emas1.md` | 676 | 16 |

## Posts

The REST API returned no published posts.

## Skipped

- empty content: Αειφορία – ESG (https://ethoslab.gr/αειφορία-esg/)
- empty content: Εταιρική διακυβέρνηση (https://ethoslab.gr/εταιρική-διακυβέρνηση/)
- empty content: Επιχειρήσεις (https://ethoslab.gr/επιχειρήσεις/)
- empty content: Policy (https://ethoslab.gr/policy/)
- empty content: Tailor-made services (https://ethoslab.gr/tailor-made-services/)
- empty content: Sustainability – ESG (https://ethoslab.gr/sustainability-esg/)
- empty content: Διακυβέρνηση και Πολιτικές (https://ethoslab.gr/διακυβέρνηση-και-πολιτικές/)
- empty content: Ευρωπαϊκά προγράμματα (https://ethoslab.gr/ευρωπαϊκά-προγράμματα/)
- empty content: Χρηματοδοτικές λύσεις (https://ethoslab.gr/χρηματοδοτικές-λύσεις/)
- empty content: Εξειδικευμένες υπηρεσίες (https://ethoslab.gr/εξειδικευμένες-υπηρεσίες/)
- empty content: Ιστορία επιχειρήσεων (https://ethoslab.gr/ιστορία-επιχειρήσεων/)
- empty content: Δημιουργία ταυτότητας (https://ethoslab.gr/δημιουργία-ταυτότητας/)
- empty content: Επικοινωνία (https://ethoslab.gr/επικοινωνία/)
- empty content: News List (https://ethoslab.gr/news-list/)
- empty content: News & Updates (https://ethoslab.gr/news-updates/)

## Stale files

None.

## Errors

None.
