# LOCH Portfolio - Stage 1: Content Density & Typography Audit

**Status:** Read-only audit complete. No production files, CSS, components, assets, configuration, or diagnostics were changed. This report is the only file created.

**Date:** 2026-11-07
**Repository:** `/Users/lochgraphy/Documents/Desktop/my-portfolio`
**Branch / HEAD:** `main` / `470421a911936b9a27f4c2c7b8b39b9ac009c292` (`Fix solid LOCH wordmark rendering on iOS Safari`)

## Reading key

- **Verified** means directly observed in the current source, computed CSS, or a current 390x844 screenshot.
- **Recommendation** means a proposed change. Nothing in this report has been implemented.
- Word counts are approximate. Sentences are counted by terminal punctuation; labels, metadata fragments, and abbreviations such as `Ltd.` are not counted as separate sentences.
- Exact source text is quoted where useful. Em dashes inside quotation marks are part of the source text, not a style choice in this report.

## Executive summary

1. **Desktop is not the main problem.** The desktop composition is coherent. Mobile density comes from repeated prose in Work cards, About, and Services, not from the overall design system.
2. **The largest verified text load is Services:** 5 summaries, 33 detail fragments, and 5 identical action labels. About is the largest continuous prose block: 81 words across 5 sentences.
3. **Repetition is measurable:** "digital" appears 13 times in rendered prose, "selected work" 3 times, "Completed" 3 times, and "Discuss this service" 5 times. The footer repeats the entire primary navigation.
4. **Punctuation is close to consistent already.** There are 17 user-facing em dashes, 0 production en dashes, and 3 non-rendered captions plus 3 code comments with em dashes. Hyphenated compounds are correct and should not be changed.
5. **Recommended sequence:** punctuation-only pass first, then remove verified redundancy, then add mobile progressive disclosure. Do not solve density by shrinking every text size.

---

## 1. Repository safety report

### 1.1 Repository identity

| Item | Verified state |
|---|---|
| Repository root | `/Users/lochgraphy/Documents/Desktop/my-portfolio` |
| Branch | `main` |
| HEAD commit | `470421a911936b9a27f4c2c7b8b39b9ac009c292` |
| HEAD subject | `Fix solid LOCH wordmark rendering on iOS Safari` |
| Audit file before creation | `PORTFOLIO-CONTENT-AUDIT.md` did not exist |
| Audit file after creation | New, untracked report only |

### 1.2 Working tree at audit start

`git status --short`:

```text
 D src/components/LoadingIndicator.tsx
 M src/components/SiteBackground.tsx
 M src/components/refracted-renderer.ts
?? public/webgl-diag.html
?? src/webgl-diag2-entry.tsx
?? webgl-diag2.html
```

`git diff --stat`:

```text
 src/components/LoadingIndicator.tsx  | 50 ------------------------------------
 src/components/SiteBackground.tsx    | 23 +++++++++++++++++++++-
 src/components/refracted-renderer.ts |  9 ++++++++-
 3 files changed, 30 insertions(+), 52 deletions(-)
```

### 1.3 Changes explicitly preserved

- Deleted: `src/components/LoadingIndicator.tsx`.
- Modified: `src/components/SiteBackground.tsx` (mobile black-hole framing).
- Modified: `src/components/refracted-renderer.ts` (wordmark spill fix).
- Untracked diagnostics: `public/webgl-diag.html`, `src/webgl-diag2-entry.tsx`, `webgl-diag2.html`.

No file was staged, committed, pushed, deployed, reset, reverted, restored, cleaned, or discarded. The shader files were read only for context and were not touched.

### 1.4 Scope discipline

- No CSS, component, asset, configuration, or content file was edited.
- No file was removed or renamed.
- Diagnostic files were left in place.
- The only write in this stage is `PORTFOLIO-CONTENT-AUDIT.md`.
- `dist/`, `node_modules/`, and `legacy-v1/` were treated as non-source or legacy output and were not modified.

---

## 2. Files inspected

### 2.1 Production content and rendering

| File | Role in the audit |
|---|---|
| `src/data/content.ts` | All project, service, education, stat, navigation, and contact data. Primary source for exact copy and counts. |
| `src/components/Hero.tsx` | Hero eyebrow, statement, sub-copy, CTA, and scroll cue. |
| `src/components/Sections.tsx` | Section headings, support copy, About prose, Education rendering, Contact copy, and Footer. |
| `src/components/ProjectCard.tsx` | Project card structure, status rendering, tags, action labels, and screen-reader text. |
| `src/components/ServiceCard.tsx` | Service card summary, detail list, action label, and screen-reader text. |
| `src/components/SectionHead.tsx` | Shared section heading, index label, and optional support copy. |
| `src/components/Nav.tsx` | Navigation labels, brand link, menu toggle, and ARIA text. |
| `src/components/CountUp.tsx` | Rendered by About stats; no independent copy. |
| `src/App.tsx` | Section order and page structure. |
| `src/main.tsx` | Confirms `src/index.css` is the production stylesheet and root `style.css` is unused. |
| `src/index.css` | Type scale, responsive breakpoints, card structure, spacing, and small-label sizing. |
| `src/assets.ts` | Asset paths for portrait, logo, and CV. |
| `index.html` | Title, meta description, Open Graph, Twitter, noscript copy, canonical URL. |

### 2.2 Supporting and excluded files

| File or area | Treatment |
|---|---|
| `README.md` | Not site-rendered. Audited for punctuation only. Contains 3 en dashes and 1 em dash. |
| `public/assets/cv.pdf`, `logo.png`, `og.jpg` | Listed as assets; binary content not audited. |
| `public/robots.txt`, `public/sitemap.xml` | Listed; not content-bearing for this audit. |
| `src/components/SiteBackground.tsx`, `src/components/refracted-renderer.ts` | Working-tree changes from prior tasks. Read only; not modified. |
| `src/webgl-diag2-entry.tsx`, `public/webgl-diag.html`, `webgl-diag2.html` | Diagnostic files. Not part of the production portfolio; excluded from user-facing copy. |
| `legacy-v1/`, root `style.css`, root `script.js` | Not referenced by the Vite entry. Legacy or unused; excluded. |
| `dist/`, `node_modules/` | Build output and dependencies; excluded. |

### 2.3 Mobile evidence used

- Current 390x844 captures re-checked in this audit: hero/top, Work, About, Education, Services, Contact (footer visible).
- Existing captures from the prior mobile task: 360x740, 390x844, 402x714, 430x932, 844x390 landscape, and 1440x900 desktop.
- Source-level responsive behavior was verified in `src/index.css`. Screenshot observations are labeled as such; code observations are labeled as verified source findings.

---

## 3. Section-by-section content audit

### 3.1 Global shell and navigation

**Current visible labels (verified):**

| Element | Exact text | Approx. words |
|---|---|---|
| Brand | `Lochgraphy` | 1 |
| Primary links | `Work`, `About`, `Education`, `Services`, `Contact` | 5 |
| Link indices | `01` to `05` | 5 numerals |
| Menu toggle | `Open menu` / `Close menu` | 2 each |
| Brand ARIA label | `Lochgraphy — back to top` | 4 |
| Nav landmark | `Primary` | 1 |

**Sentences:** none. **Approx. words:** 12 visible plus ARIA text.

- **Repeated information:** the five link labels repeat the five section headings. The numeric indices repeat the section-head indices, though the section heads add descriptors such as `01 · Selected Work`.
- **Generic or AI-sounding language:** none of consequence. Navigation is functional and should stay plain.
- **Low-value text:** none. The only issue is the em dash in the brand ARIA label.
- **Must preserve:** all five labels, anchor targets, active-section behavior, focus trap, `aria-expanded`, `aria-controls`, `aria-current`, and the mobile overlay behavior.
- **Opportunities:** punctuation only. Do not add marketing copy to the navigation.

---

### 3.2 Hero

**Current copy (verified):**

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Eyebrow | `Pasindu Lochana Rathnayaka - Digital Creator, Sri Lanka` | 0 | 7 |
| Wordmark | `LOCH` | 0 | 1 |
| H1 | `Building digital experiences.` / `Creating visual stories.` | 2 | 6 |
| Sub-copy | `I create digital experiences, visual content, and practical solutions that help ideas and businesses move forward.` | 1 | 16 |
| Primary CTA | `Selected Work` | 0 | 2 |
| Scroll cue | `Scroll` / `01` | 0 | 2 |

**Total:** approximately 33 visible words and 3 sentences.

- **Repeated information:** the sub-copy restates the H1: "digital experiences" appears in both, and "visual content" restates "visual stories." The primary CTA and the scroll cue both link to `#work`. `Selected Work` also appears in the Work section index and support copy.
- **Generic or AI-sounding language:** "Building digital experiences. Creating visual stories." is abstract enough to fit almost any creative portfolio. "Help ideas and businesses move forward" is a generic value phrase. The eyebrow is specific and stronger because it names the person, role, and location.
- **Low-value text:** the sub-copy is the main candidate. It repeats the statement without adding a concrete service, project, or proof point. The scroll cue duplicates the CTA's destination.
- **Must preserve:** the name, role, Sri Lanka, the LOCH wordmark, the two-line statement as brand identity, and at least one clear path to Work.
- **Opportunities:** keep the eyebrow, wordmark, statement, and one primary CTA. Remove or replace the sub-copy with a single concrete line using existing facts. Remove the duplicate scroll link or make it a non-interactive visual cue. The hero already fits one 390x844 viewport, so this is a content-reduction opportunity, not an overflow fix.

---

### 3.3 Work

#### 3.3.1 Work section head

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Label | `Projects & Engagements` | 0 | 3 |
| Index | `01 · Selected Work` | 0 | 3 |
| Support | `Selected work, creative projects, and digital experiences that show how I work.` | 1 | 12 |

- **Repeated information:** "Selected work" appears in the index, the support sentence, and the hero CTA. "Digital experiences" also appears in the hero and in the Ceylon Pathways description.
- **Generic or AI-sounding language:** the support sentence is circular: it says the work shows how the person works, without saying what kind of work or for whom.
- **Low-value text:** the support sentence is a strong removal candidate. The label and index already introduce the section.
- **Must preserve:** `Projects & Engagements`, `01 · Selected Work`, project order, and the section anchor `#work`.
- **Opportunities:** remove the support sentence or replace it with one specific, factual line. Reduce three introductory text blocks to two.

#### 3.3.2 Project card structure

Each card currently renders, in order: image, index + category, an optional status badge, title, description, tags, and an optional action. On mobile this becomes up to six stacked text layers after the image.

**Verified metadata duplication by card:**

| Card | Category | Tags | Overlap |
|---|---|---|---|
| Ceylon Pathways | `Travel & Tourism · Web Development` | `Travel & Tourism`, `Website Development`, `Digital Experience` | Category repeats the first two tags; description repeats "digital experience." |
| Telca Solutions CCTV | `Web Development · Digital Business Solution` | `Next.js`, `TypeScript`, `Supabase`, `Cloudinary` | Tags are a useful tech stack, not a repeat. |
| Nethwin Bookshop | `Web Development · Bookshop Digital Project` | `Web Development`, `E-commerce`, `Print on Demand` | Category repeats `Web Development`; description and tag both say print-on-demand. |
| Campus Portfolio | `Academic · Personal Portfolio Project` | `Academic Portfolio`, `Student Work`, `Creative Technology` | "Portfolio" appears in the title, category, and tag; "Academic" appears in category and tag. |

#### 3.3.3 Ceylon Pathways

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Description | `A travel-focused digital experience presenting Sri Lankan tourism through a dedicated online platform — private van tours and scenic journeys, from site architecture to guest-facing detail.` | 1 | 25 |
| Status | `Live` | 0 | 1 |
| Action | `Visit Live Website` | 0 | 3 |

- **Repeated information:** category, tags, description, status, and action all reinforce "travel website that is live." "Live" appears in the status and the action label.
- **Generic or AI-sounding language:** "travel-focused digital experience presenting Sri Lankan tourism through a dedicated online platform" is an elaborate way to say "a Sri Lanka tourism website."
- **Low-value text:** the status badge is redundant with `Visit Live Website`. The `Digital Experience` tag adds little beyond the category.
- **Must preserve:** the title, the facts that it covers Sri Lankan tourism, private van tours, scenic journeys, the live URL, and the truthful `Live` status.
- **Opportunities:** shorten to one concrete sentence. Merge status and action. Keep `Travel & Tourism` and `Website Development` as metadata, drop or demote `Digital Experience`. The existing image already communicates the visual style.

#### 3.3.4 Telca Solutions CCTV

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Description | `A business application for CCTV quotation workflows: browse a product catalogue by category, build a quotation selection, submit a quotation request, and manage the catalogue from an admin interface.` | 1 | 29 |
| Status | `Under Construction` | 0 | 2 |
| Action | none | 0 | 0 |

- **Repeated information:** "quotation" appears three times; "catalogue" twice. The four workflow steps are packed into one sentence.
- **Generic or AI-sounding language:** the opener "A business application for CCTV quotation workflows" is precise, but the colon-plus-four-verbs construction reads like a specification document rather than a portfolio card.
- **Low-value text:** no single clause is useless, but the density is high for a card. The workflow can become labels instead of prose.
- **Must preserve:** CCTV quotation workflow, product catalogue by category, quotation selection and request, admin management, the tech stack, and the truthful construction status.
- **Opportunities:** convert the four workflow steps into a compact label row (`Catalogue`, `Quotation builder`, `Request`, `Admin`) and keep one short sentence for context. Keep the tech tags because they are the most concrete information on the card.

#### 3.3.5 Nethwin Bookshop

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Description | `Digital presence for NethwinLK Printers (Pvt) Ltd. — a print-on-demand service and online bookshop where customers can explore the book collection and place print orders.` | 1 | 24 |
| Status | none | 0 | 0 |
| Action | none | 0 | 0 |

- **Repeated information:** `Web Development` appears in the category and tags; `Print on Demand` appears in the description and tags; `bookshop` appears in the title, category, and description.
- **Generic or AI-sounding language:** "Digital presence for..." is agency shorthand. The concrete facts that follow are stronger than the opener.
- **Low-value text:** the phrase "where customers can explore the book collection and place print orders" is useful but can be shortened.
- **Must preserve:** NethwinLK Printers (Pvt) Ltd., print-on-demand, online bookshop, book collection, print orders.
- **Opportunities:** lead with the company and the two concrete functions. Remove the duplicate `Web Development` tag or the category duplicate. The card has no live action, so the image and title carry more weight.

#### 3.3.6 Campus Portfolio (PS Portfolio)

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Description | `A curated showcase of academic work, teamwork, and creative technology projects built through college and community initiatives.` | 1 | 17 |
| Status | none | 0 | 0 |
| Action | none | 0 | 0 |

- **Repeated information:** `Portfolio` appears in the title, category, and tag. `Academic` appears in the category and tag.
- **Generic or AI-sounding language:** "curated showcase" and "built through college and community initiatives" are generic academic-portfolio phrasing.
- **Low-value text:** the title `Campus Portfolio (PS Portfolio)` repeats the same idea twice. The parenthetical can move to metadata.
- **Must preserve:** academic work, teamwork, creative technology, college and community context.
- **Opportunities:** use `Campus Portfolio` as the title and keep `PS Portfolio` as a metadata alias if needed. Reduce category/tag duplication. Keep the image.

#### 3.3.7 Work summary

- **Total description load:** 95 words across 4 descriptions; 107 words including the section support.
- **Main verified content problems:** section support is circular; status and action duplicate "live"; tags repeat categories; Telca packs four workflow steps into one sentence; the PS title repeats "Portfolio."
- **Main layout contributor:** on mobile, the image is followed by metarow, status, title, description, tags, and action, so even a short description sits inside a tall stack.
- **Must preserve overall:** all four titles, categories, truthful statuses, live URL, tech tags, image alt text, and project order.
- **Best opportunities:** remove the support sentence; group index, category, and status into one metadata row; deduplicate tags; shorten descriptions to one concrete sentence; keep full detail on desktop if desired and use progressive disclosure on mobile.

---

### 3.4 About

**Current copy (verified):**

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Label | `About` | 0 | 1 |
| Index | `02 · Identity` | 0 | 2 |
| Statement | `One identity across several crafts. I build digital experiences, produce visual stories, and run the digital side of hospitality businesses — not four separate jobs, but one way a studio works.` | 2 | 30 |
| Paragraph 1 | `On the technical side I design and build websites and turn business requirements into practical digital solutions.` | 1 | 17 |
| Paragraph 2 | `On the creative side, Lochgraphy is where photography, videography, editing, and brand design live. In between, I support travel and hospitality businesses with booking platforms, property listings, and the online presence guests actually see.` | 2 | 34 |
| Stats | `4` selected projects, `5` service categories, `3` education milestones, `4,621` lines of code | 0 | 4 labels |

**Total prose:** 81 words across 5 sentences, plus 4 stat labels.

- **Repeated information:** the statement and paragraph 2 both mention hospitality. The statement and paragraph 1 both say "build." "Digital experiences" repeats the hero. The first three stats repeat counts already visible in Work, Services, and Education. `Lochgraphy` repeats the nav brand and footer identity.
- **Generic or AI-sounding language:** "One identity across several crafts" is an abstract editorial claim. "Not four separate jobs, but one way a studio works" is a positioning claim rather than evidence. "Turn business requirements into practical digital solutions" is consultant phrasing.
- **Low-value text:** `Selected projects 4`, `Service categories 5`, and `Education milestones 3` are counts of content the visitor can already see. `Lines of code 4,621` is a vanity metric for most clients and is explicitly documented as needing manual refresh when the codebase changes.
- **Must preserve:** the portrait and its alt text, the Lochgraphy brand, the three-part identity (technical, creative, hospitality), and the factual service areas. Do not invent years of experience, client counts, or qualifications.
- **Opportunities:** reduce to the statement plus two short lines, or convert the three-part identity into a three-item capability strip. Keep at most two meaningful stats, or remove the stat block. On mobile, the full-width 4:5 portrait plus 81 words is the densest reading block on the page; use progressive disclosure or a shorter statement. Desktop can retain more editorial detail.

---

### 3.5 Education

**Current copy (verified):**

| Entry | Institution | Qualification | Period label | Status |
|---|---|---|---|---|
| 1 | `Gamini Central College, Nuwara Eliya` | `GCE Advanced Level & Ordinary Level` | `School education` | `Completed` |
| 2 | `NIBM — National Institute of Business Management` | `Computer Science Certification` | `Professional certification` | `Completed` |
| 3 | `SLIIT City University — University of Bedfordshire partnership` | `HND in Information Technology` | `Higher National Diploma` | `Completed` |

**Sentences:** none. **Approx. words:** 40 across all entries.

- **Repeated information:** `Completed` appears three times. The period labels largely restate the qualification level: "Higher National Diploma" versus "HND in Information Technology," "Professional certification" versus "Computer Science Certification," "School education" versus "GCE Advanced Level & Ordinary Level."
- **Generic or AI-sounding language:** none of consequence. This section is factual and should stay factual.
- **Low-value text:** the repeated status is the clearest candidate. The period labels are only useful if they distinguish types of study, which the code comment says is their purpose; they do not add chronology.
- **Must preserve:** all three institutions, NIBM, SLIIT City University, the University of Bedfordshire partnership, HND in Information Technology, Computer Science Certification, GCE Advanced and Ordinary Level, and Gamini Central College.
- **Opportunities:** remove the repeated `Completed` status or state it once at section level. Keep institution as the heading, qualification as the subline, and one short type label. Do not add dates unless the user supplies them; the current data has no dates and inventing a chronology would be inaccurate. Mobile is already a single column, so the remaining issue is metadata repetition, not layout.

---

### 3.6 Services

#### 3.6.1 Services section head

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Label | `Services` | 0 | 1 |
| Index | `04 · Capabilities` | 0 | 2 |
| Support | `A professional overview of the work I offer — small-scale, honest, and discussed directly with clients.` | 1 | 15 |

- **Repeated information:** "work I offer" restates the section label. "Small-scale, honest" is self-description rather than a service fact.
- **Generic or AI-sounding language:** "professional overview," "small-scale, honest," and "discussed directly with clients" are positioning language. They do not help a visitor choose a service.
- **Low-value text:** the support sentence is a strong removal candidate.
- **Must preserve:** `Services`, `04 · Capabilities`, the five service categories, and the contact anchor.
- **Opportunities:** remove the support line or replace it with one factual line about who the services are for. Keep the section head to label plus index.

#### 3.6.2 Service card structure

Every card renders: index, optional brand, title, summary, details list, and `Discuss this service` action. There are 5 cards, 5 summaries, 33 detail fragments, and 5 identical action labels.

| Service | Summary words | Detail count | Brand |
|---|---:|---:|---|
| Web Development | 10 | 6 | none |
| Branding & Design | 9 | 5 | none |
| Video Editing & Creative Production | 11 | 7 | `LOCHGRAPHY` |
| Travel & Hospitality Digital Support | 12 | 9 | `Nuwara Eliya Travel & Hospitality Consultancy` |
| Digital Marketing & Content | 9 | 6 | none |

**Total:** approximately 51 summary words plus 84 detail words across 33 fragments.

- **Repeated information:** `Discuss this service` appears five times and all five links go to `#contact`. "Supporting" opens two summaries. "Digital" appears in four of the five services. Several details restate their summary: "Practical digital solutions" under Web Development, "Visual storytelling" under Video, "Tourism business digital presence" and "Online booking operations" under Travel.
- **Generic or AI-sounding language:** four of five summaries open with an `-ing` verb (`Building`, `Helping`, `Supporting`, `Supporting`), which creates a repetitive rhythm. "Thoughtful visual design," "digital communication," and "practical digital solutions" are broad.
- **Low-value text:** 33 detail fragments is more than a portfolio card needs. The Travel card alone has 9. Platform names are useful, but five separate platform-management lines can become one platform row. `Business-focused digital communication` is the vaguest fragment.
- **Must preserve:** all five service categories, the Lochgraphy brand on Video, the Nuwara Eliya Travel & Hospitality Consultancy brand on Travel, the platform names (Booking.com, Agoda, Airbnb, TripAdvisor, Google Business), and the core offerings.
- **Opportunities:** keep title plus one-line summary plus 3-4 key labels. Move the full detail list into an expandable "What's included" area on mobile. Replace five identical actions with one section-level CTA or a shorter per-card label. Convert platform names into a visual metadata row. Desktop can keep two columns and more detail.

#### 3.6.3 Web Development

| Element | Exact text |
|---|---|
| Summary | `Building practical websites and digital experiences for businesses and projects.` |
| Details | `Website design and development`, `Frontend development`, `Business websites`, `Landing pages`, `Digital product interfaces`, `Practical digital solutions` |

- **Repeated information:** summary says "websites and digital experiences"; details repeat websites, frontend, and "practical digital solutions."
- **Generic language:** "practical" and "digital experiences" are repeated across the site.
- **Must preserve:** website design and development, frontend development, business websites, landing pages, digital product interfaces.
- **Opportunity:** reduce six details to four labels and keep the summary to one line.

#### 3.6.4 Branding & Design

| Element | Exact text |
|---|---|
| Summary | `Helping businesses communicate their identity through thoughtful visual design.` |
| Details | `Brand identity`, `Logo and graphic design`, `Visual communication`, `Marketing materials`, `Digital design assets` |

- **Repeated information:** "visual design" in the summary overlaps "Visual communication" and "Digital design assets."
- **Generic language:** "thoughtful visual design" and "visual communication" are broad.
- **Must preserve:** brand identity, logo and graphic design, marketing materials, digital design assets.
- **Opportunity:** reduce to four specific labels; keep "brand identity" and "logo and graphic design" as the anchors.

#### 3.6.5 Video Editing & Creative Production

| Element | Exact text |
|---|---|
| Summary | `Creative production and visual storytelling for brands, individuals, and digital platforms.` |
| Details | `Video editing`, `Photography`, `Videography`, `Visual storytelling`, `Creative content production`, `Promotional videos`, `Social media visual content` |

- **Repeated information:** "Creative production" and "visual storytelling" appear in the summary and again in the details.
- **Generic language:** "visual storytelling" is used three times across the site (hero, About, this service).
- **Must preserve:** video editing, photography, videography, promotional videos, social media visual content, and the Lochgraphy brand.
- **Opportunity:** reduce to five labels and remove the summary/detail duplicate. Keep the brand as metadata.

#### 3.6.6 Travel & Hospitality Digital Support

| Element | Exact text |
|---|---|
| Summary | `Supporting accommodation and tourism businesses with their online presence and booking operations.` |
| Details | `Booking.com management`, `Agoda listing management`, `Airbnb presence support`, `TripAdvisor presence support`, `Google Business support`, `Accommodation listing improvements`, `Property-description writing`, `Tourism business digital presence`, `Online booking operations` |

- **Repeated information:** "online presence" and "booking operations" in the summary are repeated by the platform list, "Tourism business digital presence," and "Online booking operations."
- **Generic language:** the summary is broad; the platform names are the specific, credible part.
- **Must preserve:** all five platform names, accommodation listing improvements, property-description writing, and the Nuwara Eliya Travel & Hospitality Consultancy brand.
- **Opportunity:** this is the strongest candidate for restructuring. Use one summary line, a platform row, and 2-3 supporting labels. Nine bullets is too many for a mobile card.

#### 3.6.7 Digital Marketing & Content

| Element | Exact text |
|---|---|
| Summary | `Supporting businesses with digital communication, content, and online promotion.` |
| Details | `Social media management`, `Content writing`, `Digital copywriting`, `Website content`, `Promotional content`, `Business-focused digital communication` |

- **Repeated information:** "content" appears three times; "digital communication" appears in the summary and the last detail; "promotional content" and "online promotion" overlap.
- **Generic language:** "Business-focused digital communication" is the vaguest fragment in the section.
- **Must preserve:** social media management, content writing, digital copywriting, website content, promotional content.
- **Opportunity:** reduce to four labels and remove the final vague fragment.

#### 3.6.8 Services summary

- **Verified content problem:** 33 detail fragments across five cards, with repeated summary/detail concepts and five identical actions.
- **Layout contributor:** the two-column desktop grid becomes a single column below 860px, so every card's full detail list stacks vertically.
- **Best opportunities:** one summary line per card, 3-4 labels, expandable full list, platform row for Travel, one clear action pattern.

---

### 3.7 Contact

**Current copy (verified):**

| Element | Exact text | Sentences | Approx. words |
|---|---|---|---|
| Label | `Contact` | 0 | 1 |
| Index | `05 · Contact` | 0 | 2 |
| Lead | `Let's work together.` | 1 | 3 |
| Body | `Have a project in mind, need a digital solution, or want to collaborate? Get in touch and let's discuss what we can create.` | 2 | 23 |
| Direct email | `lochgraphy@gmail.com` | 0 | 1 |
| Direct phone | `+94 77 866 0753` | 0 | 1 |
| Elsewhere | `Elsewhere` | 0 | 1 |
| Socials | `Instagram`, `LinkedIn`, `GitHub` | 0 | 3 |
| CV | `Download CV — PDF` | 0 | 3 |

- **Repeated information:** `Contact` appears as both the label and the index descriptor (`05 · Contact`). The lead and body both invite contact. "Digital solution" repeats the site-wide "digital" vocabulary. The footer repeats the social links and navigation.
- **Generic or AI-sounding language:** "Let's work together" and "Have a project in mind... let's discuss what we can create" are standard portfolio CTAs. The body does not add a concrete reason to get in touch.
- **Low-value text:** the body paragraph is the main candidate. The actionable content is the email, phone, socials, and CV.
- **Must preserve:** the lead if it is part of the identity, both email addresses in data (one is currently displayed), the displayed phone and the second phone in data, all three social URLs, the CV download, the mailto subject, external-link behavior, and screen-reader text.
- **Opportunities:** keep the lead and one short line, or remove the body entirely. Put email and phone first. Keep socials and CV as secondary actions. On mobile, the current layout is already scannable; the paragraph is the only content that pushes the direct methods down. Consider showing the second phone only if the user wants both public.

---

### 3.8 Footer

**Current copy (verified):**

| Element | Exact text | Approx. words |
|---|---|---|
| Identity | `Pasindu Lochana Rathnayaka — Lochgraphy` | 4 |
| Links | `Work`, `About`, `Education`, `Services`, `Contact`, `Back to top` | 6 |
| Copyright | `© 2026 · Built with plain React, Canvas & WebGL` | 7 |

- **Repeated information:** the five section links repeat the primary navigation. `Back to top` repeats the brand link's `#top` destination. The identity repeats the name and wordmark. The copyright repeats the current year only.
- **Generic or AI-sounding language:** the tech credit is not generic in the same way as the hero copy, but it is more about implementation than the visitor. It can stay as a signature if the user values it.
- **Low-value text:** on mobile, the full six-link footer plus copyright adds a second navigation block after the Contact section. The tech credit is optional.
- **Must preserve:** the name, Lochgraphy identity, copyright year, access to all sections, and `Back to top`.
- **Opportunities:** keep the full footer on desktop; compact it on mobile to identity, `Back to top`, and copyright, or show the section links in a single wrapped row. Standardize the identity separator. Keep the tech credit only if it is intentional brand copy.

---

### 3.9 Metadata, noscript, and non-rendered data

**Current metadata (verified):**

| Element | Exact text | Approx. words |
|---|---|---|
| `<title>` | `Pasindu Lochana Rathnayaka — LOCHGRAPHY` | 5 |
| Meta description | `Multidisciplinary digital creator — websites and digital experiences, creative production and branding, content and marketing, and travel & hospitality digital support.` | 23 |
| OG title | `Pasindu Lochana Rathnayaka — LOCHGRAPHY` | 5 |
| OG description | `Websites and digital experiences, creative production, and digital support for travel & hospitality businesses.` | 15 |
| OG image alt | `Classical statue wearing a VR headset against a dark background — LOCHGRAPHY` | 11 |
| Twitter title | `Pasindu Lochana Rathnayaka — LOCHGRAPHY` | 5 |
| Twitter description | Same as OG description | 15 |
| Twitter image alt | Same as OG image alt | 11 |
| Noscript | `_pasindu lochana rathnayaka — lochgraphy. Websites, creative production, and digital support for travel & hospitality businesses. Reach lochgraphy@gmail.com. (Enable JavaScript for the full experience.)` | 24 |

- **Repeated information:** title, OG title, and Twitter title are identical, which is correct for consistency. OG and Twitter descriptions are identical. The meta description and OG description overlap heavily. The noscript repeats the OG description plus the email.
- **Generic or AI-sounding language:** "Multidisciplinary digital creator" is broad. The meta description lists four service areas in a long triadic structure. The OG description is tighter and more readable.
- **Low-value text:** none of the metadata is user-visible in the page, but it matters for search and social previews. Do not remove the canonical URL, OG image, or contact email.
- **Must preserve:** the name, LOCHGRAPHY, canonical URL `https://lochgraphy.vercel.app/`, OG image path, `og:type`, `og:locale`, robots directives, theme color, and the noscript email.
- **Opportunities:** standardize the em dashes to hyphen-minus. Consider using the shorter OG description as the meta description. Add location or a concrete service phrase only if the user approves the wording. Do not change URLs or image paths.

**Non-rendered data (verified):**

- `Project.image.caption` is defined for all four projects but is never rendered by `ProjectCard.tsx`. Three of the four captions contain an em dash:
  - `ceylonpathways.vercel.app — live site`
  - `catalogue & quotation system — in active development`
  - `nethwinlk.com — print & bookshop project`
  - `student portfolio project` has no dash.
- The captions are dead data in the current UI. Either render them as visible figure captions or remove them from the data model in a later stage. Do not treat them as user-facing punctuation until that decision is made.
- `EDUCATION[].detail` is optional but unused by all three entries.
- `CONTACT.phones[1]` (`+94 70 466 9661`) exists in data but is not displayed. `CONTACT.emailAlt` (`lochana211@gmail.com`) also exists but is not displayed.
- The CSS tag marker that looks like a leading dash in screenshots is a 1px rule (`width: 0.35rem; height: 1px`), not a dash character. Do not "fix" it as punctuation.

---

## 4. Mobile content-density findings

### 4.1 Evidence and method

- Re-checked current 390x844 captures for hero, Work, About, Education, Services, Contact, and the footer.
- Verified source behavior and breakpoints in `src/index.css`.
- Existing captures from the prior mobile task cover 360x740, 390x844, 402x714, 430x932, and 844x390 landscape.
- Findings below distinguish genuine content problems from layout-only problems. A section can have both.

### 4.2 Section density table

| Section | Verified mobile behavior | Genuine content problem? | Layout-only problem? |
|---|---|---|---|
| Hero | Fits one 390x844 viewport: eyebrow, LOCH mark, two-line statement, three-line sub, CTA, scroll cue. Two links both go to Work. | Yes: sub-copy restates the statement; duplicate Work links. | No overflow. The composition itself is sound. |
| Work head | Three text blocks before the first card: label, index, support sentence. | Yes: support sentence is circular and repeats "Selected work." | Yes: the three-block head consumes vertical space before the image. |
| Ceylon card | Image, metarow, `Live` badge, title, 25-word description (about 5 lines), 3 tags, action. | Yes: description is long; status and action both say live; tags repeat category. | Yes: six stacked text layers after the image. |
| Telca card | Image, metarow, `Under Construction` badge, title, 29-word description, 4 tech tags. No action. | Yes: one sentence packs four workflow steps; densest description. | Yes: badge plus four tags add height. |
| Nethwin card | Image, metarow, title, 24-word description, 3 tags. No status or action. | Moderate: category/tag duplication; "Digital presence for..." opener. | Less severe because there is no status/action row. |
| PS card | Image, metarow, title, 17-word description, 3 tags. No status or action. | Moderate: "Portfolio" and "Academic" repetition; generic phrasing. | Least dense Work card. |
| About | 4:5 portrait dominates the first viewport; 30-word statement starts near the bottom; 2 paragraphs (51 words) and 4 stats follow. | Yes: 81 words is the largest continuous prose block; stats repeat counts from other sections. | Yes: full-width 4:5 portrait plus generous spacing pushes prose down. |
| Education | Section head plus 3 entries; each entry stacks period, `Completed`, institution, qualification. | Minor: `Completed` repeated 3 times; period labels restate qualification levels. | Mostly fine: single column is appropriate; no long sentences. |
| Services head | Label, index, 15-word support sentence before the first card. | Yes: support is self-descriptive positioning copy. | Yes: three text blocks before content. |
| Web Development card | Title, 10-word summary, 6 bullets, action. | Moderate: 6 bullets with one vague duplicate. | Yes: bullet list adds height. |
| Branding card | Title, 9-word summary, 5 bullets, action. | Moderate: summary and bullets overlap. | Yes. |
| Video card | Title, brand, 11-word summary, 7 bullets, action. | Yes: 7 bullets plus summary duplication. | Yes. |
| Travel card | Title, long brand name, 12-word summary, 9 bullets, action. | Yes: strongest density problem in Services; 9 bullets. | Yes: long brand plus 9 bullets pushes the action well below the card start. |
| Digital Marketing card | Title, 9-word summary, 6 bullets, action. | Moderate: vague final bullet; content repetition. | Yes. |
| Contact | Label/index, lead, 23-word body (3 lines), email, phone, Elsewhere, 3 socials, CV, footer. | Minor: body restates the lead; second phone/email unused. | Mostly fine: direct methods are visible after the body; socials/CV below. |
| Footer | Identity wraps to two lines, then six links, then copyright. | Yes: full nav repeated after Contact; `Back to top` duplicates brand link. | Yes: link row and copyright stack on narrow screens. |

### 4.3 Small labels and captions

Verified CSS values, with computed pixels at the default 16px root:

| Element | CSS value | Computed size | Tracking | Observation |
|---|---|---:|---|---|
| Nav link index | `0.62rem` | 9.9px | `0.16em` | Very small for a mobile menu. |
| Service card index / brand | `0.62rem` | 9.9px | `0.16em` | Brand names become hard to read, especially the long Travel brand. |
| Project meta / tags | `0.64rem` | 10.2px | `0.18-0.22em` | Uppercase plus wide tracking at 10px reduces legibility. |
| Hero scroll cue | `0.66rem` | 10.6px | `0.3em` | Decorative, but very small. |
| Education status | `0.68rem` | 10.9px | `0.18em` | Repeated three times. |
| Service details | `0.7rem` | 11.2px | `0.14em` | 33 fragments at 11px is the densest small-text block. |
| Footer copy | `0.7rem` | 11.2px | `0.18em` | Low priority, but small. |
| Hero eyebrow | `0.72rem` | 11.5px | `0.22em` | Readable but small; it is a label. |
| Section caption token | `clamp(0.7rem, 1vw, 0.78rem)` | 11.2-12.5px | varies | On mobile it stays near the minimum. |
| Body token | `clamp(0.95rem, 1.15vw, 1.06rem)` | 15.2-17px | normal | Body text is not too small; density is the issue. |
| Section label token | `clamp(1.05rem, 1.7vw, 1.5rem)` | 16.8-24px | `0.14em` | Strong hierarchy; keep. |
| Mobile nav link | `1.35rem` | 21.6px | `0.14em` | Good. |
| Hero statement | `clamp(1.5rem, 3.4vw, 3rem)` | 24-48px | `-0.01em` | Strong; do not shrink. |

**Verified finding:** the problem is not that all text is small. Body copy is 15.2px minimum, and headings are large. The problem is that metadata and detail text are set at 9.9-11.2px with uppercase and wide tracking, which makes already repetitive content harder to scan.

### 4.4 Genuine content problems versus layout-only problems

**Genuine content problems:**

- Work support sentence is circular and repeats "Selected work."
- Hero sub-copy restates the H1.
- Project status and action duplicate "live" on Ceylon.
- Project tags repeat categories on Ceylon, Nethwin, and PS.
- Telca description packs four workflow steps into one 29-word sentence.
- About contains 81 words plus four stats, three of which repeat counts from other sections; the fourth is a stale code metric.
- Education repeats `Completed` three times and uses period labels that restate qualification levels.
- Services contains 33 detail fragments, five identical action labels, and summary/detail duplication.
- Contact body restates the lead and repeats generic "digital solution" language.
- Footer repeats the full navigation on mobile.

**Layout-only problems:**

- Work cards stack six text layers after the image.
- About's 4:5 portrait consumes most of the first mobile viewport.
- Services cards stack full detail lists in one column below 860px.
- Footer identity wraps and the link row stacks.
- Section heads use three text blocks before content.
- Metadata labels are 9.9-11.2px with uppercase and wide tracking.

**Both:**

- Work density is content plus card structure.
- Services density is content plus single-column stacking.
- About density is prose plus portrait proportion.
- Footer density is repeated navigation plus wrapping.

### 4.5 Long descriptions and below-the-fold content

- **Work:** the Ceylon description is 25 words and about 5 lines at 390px; tags and action follow. Telca is 29 words. The title is visible in the first Work viewport, but the action is not.
- **About:** the statement begins near the bottom of the first viewport after the portrait; the two paragraphs and stats require substantial scrolling.
- **Services:** the Travel card has 9 bullets; its action is far below the card start. The Web Development card already shows 6 bullets in the first services viewport.
- **Contact:** the 23-word body is 3 lines; email and phone are visible after it. This is acceptable but could be tighter.
- **Hero:** no below-the-fold problem at 390x844; the entire hero including the scroll cue fits.

### 4.6 Where imagery or visual metadata could replace prose

- **Work:** images already do most of the visual work. Keep them; reduce the text layers around them. Tech stacks and statuses can be metadata chips.
- **Services:** no imagery currently. Platform names for Travel can become a compact logo/label row. The five service categories can be presented as a capability index with short labels rather than paragraphs.
- **About:** the portrait is strong. A three-item capability strip (technical, creative, hospitality) can replace part of the prose without inventing claims.
- **Education:** institution names and qualifications are already structured; no imagery needed. A single metadata line per entry is enough.
- **Contact:** no imagery needed. The direct contact methods are the visual hierarchy.
- **Footer:** no imagery needed; reduce repetition.

### 4.7 Expandable details

The best candidates, in order:

1. **Services details:** full 33-fragment list behind `What's included` per card. Keep 3-4 labels visible.
2. **Work descriptions on mobile:** keep one concrete sentence visible; move the longer editorial description behind `Project details` if desktop needs it.
3. **About paragraphs:** keep the statement visible; place the two supporting paragraphs behind `More about me` on mobile.
4. **Education:** no expansion needed; the data is short.
5. **Contact:** no expansion needed; shorten rather than hide.

Any expandable pattern must preserve keyboard access, visible focus, `aria-expanded`, and screen-reader labels. Do not hide content from assistive technology or search engines without a plan.

### 4.8 Hierarchy and whitespace

- The current spacing system is generous, not cramped. The issue is too many text blocks inside that space.
- Section heads currently use label, index, and optional support. Removing support from Work and Services reduces each head from three blocks to two without changing the spacing tokens.
- Grouping index, category, and status into one metadata row reduces Work card height without shrinking type.
- Separating primary contact methods from secondary social links improves Contact hierarchy.
- Do not reduce global section padding to compensate for text volume. Fix the content first.

---

## 5. Typography and punctuation findings

### 5.1 Em dash inventory

There are **23 em dash characters** across the production source files. Of these, **17 are user-facing** (rendered, accessible, or metadata), **3 are in unused project captions**, and **3 are in code comments**.

#### User-facing occurrences (17)

| # | File:line | Exact source text | Context | Recommended safe replacement |
|---:|---|---|---|---|
| 1 | `src/data/content.ts:48` | `A travel-focused digital experience presenting Sri Lankan tourism through a dedicated online platform — private van tours and scenic journeys, from site architecture to guest-facing detail.` | Rendered project description | Replace ` — ` with `: ` and restructure: `... dedicated online platform: private van tours and scenic journeys...` Or use ` - ` if the aside should remain. |
| 2 | `src/data/content.ts:86` | `Digital presence for NethwinLK Printers (Pvt) Ltd. — a print-on-demand service and online bookshop where customers can explore the book collection and place print orders.` | Rendered project description | Replace ` — ` with `: ` or a full stop. A colon reads naturally here. |
| 3 | `src/data/content.ts:216` | `NIBM — National Institute of Business Management` | Rendered institution name | Use `NIBM - National Institute of Business Management` or `NIBM (National Institute of Business Management)`. Parentheses are cleaner for an expansion. |
| 4 | `src/data/content.ts:222` | `SLIIT City University — University of Bedfordshire partnership` | Rendered institution name | Use `SLIIT City University - University of Bedfordshire partnership` or parentheses. |
| 5 | `src/components/Sections.tsx:114` | `One identity across several crafts. I build digital experiences, produce visual stories, and run the digital side of hospitality businesses — not four separate jobs, but one way a studio works.` | Rendered About statement | Replace the dash with a full stop: `... hospitality businesses. Not four separate jobs, but one way a studio works.` Or use ` - `. |
| 6 | `src/components/Sections.tsx:186` | `A professional overview of the work I offer — small-scale, honest, and discussed directly with clients.` | Rendered Services support | Best: remove the sentence. If retained, use ` - ` or a colon. |
| 7 | `src/components/Sections.tsx:251` | `Download CV — PDF` | Rendered action label | Use `Download CV (PDF)` or `Download CV - PDF`. |
| 8 | `src/components/Sections.tsx:264` | `Pasindu Lochana Rathnayaka — Lochgraphy` | Rendered footer identity | Use `Pasindu Lochana Rathnayaka - Lochgraphy`, matching the hero eyebrow's existing hyphen-minus separator. |
| 9 | `src/components/Nav.tsx:217` | `Lochgraphy — back to top` | ARIA label | Use `Lochgraphy - back to top` or `Lochgraphy, back to top`. |
| 10 | `src/components/ServiceCard.tsx:29` | ` — {service.title} (goes to the contact section)` | Screen-reader-only text | Use a colon: `: {service.title} (goes to the contact section)`. |
| 11 | `index.html:7` | `Pasindu Lochana Rathnayaka — LOCHGRAPHY` | `<title>` | Use `Pasindu Lochana Rathnayaka - LOCHGRAPHY` or a pipe separator. Keep one convention across title, OG, and Twitter. |
| 12 | `index.html:10` | `Multidisciplinary digital creator — websites and digital experiences, creative production and branding, content and marketing, and travel & hospitality digital support.` | Meta description | Use ` - ` or a colon. Consider shortening the list separately. |
| 13 | `index.html:23` | `Pasindu Lochana Rathnayaka — LOCHGRAPHY` | `og:title` | Match the `<title>` replacement. |
| 14 | `index.html:32` | `Classical statue wearing a VR headset against a dark background — LOCHGRAPHY` | `og:image:alt` | Use ` - ` or a full stop. |
| 15 | `index.html:34` | `Pasindu Lochana Rathnayaka — LOCHGRAPHY` | `twitter:title` | Match the `<title>` replacement. |
| 16 | `index.html:40` | `Classical statue wearing a VR headset against a dark background — LOCHGRAPHY` | `twitter:image:alt` | Match the OG image alt replacement. |
| 17 | `index.html:48` | `_pasindu lochana rathnayaka — lochgraphy. Websites, creative production, and digital support for travel & hospitality businesses. Reach lochgraphy@gmail.com. (Enable JavaScript for the full experience.)` | Noscript copy | Use `_pasindu lochana rathnayaka - lochgraphy.` |

#### Non-rendered occurrences (6)

| # | File:line | Exact source text | Context | Recommendation |
|---:|---|---|---|---|
| 18 | `src/data/content.ts:55` | `ceylonpathways.vercel.app — live site` | Project caption, never rendered | Leave until captions are rendered or removed. If rendered, use ` - `. |
| 19 | `src/data/content.ts:77` | `catalogue & quotation system — in active development` | Project caption, never rendered | Same. |
| 20 | `src/data/content.ts:93` | `nethwinlk.com — print & bookshop project` | Project caption, never rendered | Same. |
| 21 | `src/data/content.ts:4` | `* Central portfolio data — add a new project...` | Code comment | No user-facing change. Optional code-comment cleanup only. |
| 22 | `src/components/Hero.tsx:30` | `* Hero — editorial intro over...` | Code comment | No user-facing change. |
| 23 | `src/components/ServiceCard.tsx:4` | `* ServiceCard — the single reusable card...` | Code comment | No user-facing change. |

### 5.2 En dashes

- **Verified:** there are **0 en dash characters (`–`) in production user-facing files**.
- `README.md` contains en dashes on lines 57, 58, and 59:
  - `- **HND in IT** – SCU, Sri Lanka`
  - `- **GCE AL & OL** – Nuwara Eliya Gamini Central College`
  - `- **Computer Science Certification** – NIBM Sri Lanka`
- `README.md` also contains an em dash on line 90: `— **Lashan Herath**`.
- `README.md` is not rendered by the site. Clean it up separately only if the repository profile is in scope. Do not mix it with site content changes.

### 5.3 Hyphen-minus findings

The preferred prose separator is the standard keyboard hyphen-minus `-`. The site already uses it correctly in the hero eyebrow: `Pasindu Lochana Rathnayaka - Digital Creator, Sri Lanka`.

**Do not change these existing hyphenated words or technical forms:**

| Category | Verified examples |
|---|---|
| Compound adjectives | `travel-focused`, `guest-facing`, `print-on-demand`, `small-scale`, `business-focused`, `property-description` |
| Technical terms and filenames | `Next.js`, `TypeScript`, `noopener noreferrer`, `webgl-diag2`, `index.html` |
| URLs and email addresses | `ceylon-pathways.vercel.app`, `nethwinlk.com`, `lochgraphy@gmail.com`, `linkedin.com/in/pasindu-lochana-rathnayaka-86252a252/` |
| CSS and code | `-webkit-`, `-apple-system`, `-moz-`, negative letter-spacing values, `clamp()` expressions, class names, custom properties |
| Phone numbers | `+94 77 866 0753`, `+94 70 466 9661` (spaces, not hyphens; preserve the format) |

**Do not change these separators:**

- Middle dots in project categories (`Travel & Tourism · Web Development`) are consistent metadata separators, not dashes.
- Middle dots in the footer copyright (`© 2026 · Built with...`) are intentional.
- The leading mark before project tags and service details in screenshots is a 1px CSS rule, not a dash character. Do not replace it with text punctuation.
- Section index labels use `·` (`01 · Selected Work`). Keep them.

**Safe punctuation rule for Stage 2:** replace only the 17 user-facing em dashes listed above, and only where the sentence still reads naturally. Prefer a colon, full stop, or parentheses when the dash is doing explanatory work. Use ` - ` for simple separators and identity lines. Do not perform a global search-and-replace across code.

### 5.4 AI-style writing patterns

| Pattern | Verified examples | Why it reads generic | Recommendation |
|---|---|---|---|
| Abstract noun stacking | `digital experiences`, `visual storytelling`, `practical solutions`, `digital communication`, `online presence` | The phrases describe categories, not specific work. | Replace with concrete nouns from the actual projects and services. |
| Triadic lists | `websites and digital experiences, creative production and branding, content and marketing...`; `photography, videography, editing, and brand design`; `booking platforms, property listings, and the online presence...` | Three-part lists create a rhythmic, presentation-like cadence. | Keep only the items that matter for the section; use labels where possible. |
| Gerund openings | `Building practical websites...`, `Helping businesses communicate...`, `Supporting accommodation...`, `Supporting businesses...` | Four of five service summaries start the same way. | Use noun phrases or direct service names. |
| Self-referential claims | `show how I work`, `one way a studio works`, `small-scale, honest` | The copy praises its own approach instead of showing evidence. | Replace with facts, project names, or deliverables. |
| Generic invitation | `Let's work together.`, `Have a project in mind... let's discuss what we can create.` | The CTA could belong to any portfolio. | Keep the direct contact methods; shorten the invitation. |
| Repetition as structure | `Selected work` 3 times; `Completed` 3 times; `Discuss this service` 5 times; `digital` 13 times | Repetition makes the page feel longer without adding information. | Deduplicate labels and vary only where the variation is meaningful. |
| Overstated framing | `A curated showcase`, `A professional overview`, `dedicated online platform`, `thoughtful visual design` | Adjectives carry the meaning instead of the work itself. | Lead with the project, client, or deliverable. |

**Verified word frequency in rendered prose** (hero, Work, About, Services, Contact; excludes navigation, footer, and metadata):

| Token | Count |
|---|---:|
| `digital` | 13 |
| `businesses` | 7 |
| `experiences` | 5 |
| `visual` | 5 |
| `online` | 5 |
| `creative` | 4 |
| `practical` | 3 |
| `work` | 5 |

This is the clearest quantitative signal that the copy repeats a small vocabulary. The fix is not to ban these words, but to make each section say something specific.

### 5.5 Typography observations

- **Body size is acceptable:** the body token bottoms out at `0.95rem` (15.2px) with `line-height: 1.65`. The issue is volume, not body legibility.
- **Metadata is too small for mobile:** 9.9-11.2px uppercase with `0.14-0.3em` tracking is the main typographic weakness. Increase metadata to roughly `0.72-0.75rem` and reduce tracking to `0.1-0.14em` on mobile. This is a layout/typography recommendation, not a content fix.
- **Do not shrink headings:** the hero statement is 24px minimum and the About statement is 22.4px minimum on mobile. They provide hierarchy. Reducing them would make the page flatter and more article-like.
- **Line length is controlled:** hero sub-copy has `max-width: 34rem`; project descriptions have `max-width: 40rem`; About copy has `max-width: 40rem`. The problem is not runaway line length.
- **Uppercase labels:** section labels, project meta, tags, service details, and footer links all use uppercase. At small sizes, uppercase plus wide tracking reduces word-shape recognition. Use sentence case for longer metadata if the visual identity allows it.
- **`text-wrap: balance`** is already used on the About statement. Keep it.
- **No font-size override on `html`:** computed rem sizes above assume the browser default 16px. If a user changes their default font size, the rem-based sizes scale accordingly, which is good.

---

## 6. Proposed content improvements

### 6.1 Principles

1. **Retain facts.** Names, links, qualifications, platforms, statuses, alt text, and contact methods are not marketing copy; they are the portfolio's evidence.
2. **Shorten prose before removing information.** Most cards need one concrete sentence, not zero.
3. **Rewrite only with existing facts.** Do not invent dates, client names, metrics, years of experience, or qualifications.
4. **Convert lists to metadata where the list is really a set of labels.** Tech stacks, platforms, and statuses are metadata.
5. **Remove only clear redundancy.** Section support that restates the heading, repeated statuses, duplicate actions, and counts of visible content are safe candidates.
6. **Preserve desktop editorial detail where it adds value.** Use progressive disclosure on mobile rather than deleting information that desktop can still use.
7. **Keep accessibility text.** Screen-reader labels, alt text, and focus behavior are not content bloat.

### 6.2 Section-by-section recommendation table

Priority key: **P1** = high impact, low risk; **P2** = medium impact, needs copy approval; **P3** = polish or data hygiene.

| Section | Current problem | Recommended approach | Content to preserve | Priority |
|---|---|---|---|---|
| Hero | Sub-copy restates the H1; CTA and scroll cue both go to Work. | Keep eyebrow, wordmark, statement, and one primary CTA. Remove or replace the sub-copy with one concrete line. Remove the duplicate scroll link or make it non-interactive. | Name, role, Sri Lanka, LOCH mark, two-line statement, one Work link. | P1 |
| Work - section head | Three text blocks before the first card; support sentence is circular and repeats "Selected work." | Remove the support sentence or replace it with one specific line. Keep label and index. | `Projects & Engagements`, `01 · Selected Work`, `#work`. | P1 |
| Work - Ceylon Pathways | 25-word description; status and action both say live; tags repeat category. | Shorten to one concrete sentence. Merge status and action. Keep two category tags, drop or demote `Digital Experience`. | Sri Lankan tourism, private van tours, scenic journeys, live URL, `Live` status. | P2 |
| Work - Telca Solutions CCTV | 29-word sentence packs four workflow steps; status badge and four tech tags. | Keep one short context sentence; convert the workflow to a compact label row. Keep the tech stack. | CCTV quotation workflow, catalogue, quotation request, admin interface, Next.js, TypeScript, Supabase, Cloudinary, construction status. | P2 |
| Work - Nethwin Bookshop | Category/tag duplication; "Digital presence for..." opener. | Lead with the company and the two concrete functions. Remove duplicate `Web Development` tag. | NethwinLK Printers (Pvt) Ltd., print-on-demand, online bookshop, book collection, print orders. | P2 |
| Work - Campus Portfolio | "Portfolio" and "Academic" repeat across title, category, and tags; generic phrasing. | Use `Campus Portfolio` as the title; keep `PS Portfolio` as an alias if needed. Deduplicate category/tags. | Academic work, teamwork, creative technology, college and community context. | P3 |
| About | 81 words plus four stats; three stats repeat visible counts; code metric is stale; portrait plus prose is the densest mobile block. | Reduce to the statement plus two short lines, or a three-item capability strip. Keep at most two meaningful stats. Use progressive disclosure on mobile. | Portrait, alt text, Lochgraphy brand, technical/creative/hospitality identity, factual service areas. | P1 |
| Education | `Completed` repeated three times; period labels restate qualification levels. | Remove repeated status or state it once. Keep institution, qualification, and one type label. Do not add dates without user data. | All institutions, NIBM, SLIIT, Bedfordshire partnership, HND, Computer Science Certification, GCE A/L and O/L, Gamini Central College. | P2 |
| Services - section head | Support sentence is self-descriptive positioning copy. | Remove it or replace with one factual line about who the services are for. | `Services`, `04 · Capabilities`, five categories. | P1 |
| Services - Web Development | 6 bullets; summary/detail duplication; `Practical digital solutions` is vague. | One-line summary plus 4 labels; move full list to expandable details. | Website design and development, frontend, business websites, landing pages, digital product interfaces. | P2 |
| Services - Branding & Design | Summary and bullets overlap; broad phrasing. | One-line summary plus 4 specific labels. | Brand identity, logo and graphic design, marketing materials, digital design assets. | P2 |
| Services - Video Editing | 7 bullets; "visual storytelling" repeated. | One-line summary plus 4-5 labels; keep Lochgraphy brand. | Video editing, photography, videography, promotional videos, social media visual content. | P2 |
| Services - Travel & Hospitality | 9 bullets; platform names buried in prose; summary/detail duplication. | One summary line, a platform row, and 2-3 supporting labels; move the full list to expandable details. | Booking.com, Agoda, Airbnb, TripAdvisor, Google Business, listing improvements, property-description writing, Nuwara Eliya brand. | P1 |
| Services - Digital Marketing | 6 bullets; vague final fragment; "content" repeated. | One-line summary plus 4 labels; remove `Business-focused digital communication`. | Social media management, content writing, digital copywriting, website content, promotional content. | P2 |
| Contact | Body restates the lead; generic invitation; second phone and alternate email unused. | Keep the lead and one short line, or remove the body. Put email and phone first. Keep socials and CV secondary. Decide whether to show the second phone. | Lead, email, phone(s), Instagram, LinkedIn, GitHub, CV, mailto subject, external-link text. | P1 |
| Navigation | Functional; only punctuation issue is the brand ARIA em dash. | Punctuation only. Do not add copy. | All labels, anchors, active state, focus trap, ARIA attributes. | P1 |
| Footer | Full nav repeated on mobile; identity separator em dash; tech credit optional. | Keep full footer on desktop; compact mobile to identity, `Back to top`, and copyright. Standardize separator. | Name, Lochgraphy, copyright year, section access, `Back to top`. | P2 |
| SEO / metadata / noscript | Em dashes in title, description, image alt, and noscript; long meta description. | Standardize to hyphen-minus or colon. Consider the shorter OG description as the meta description. Do not change URLs or image paths. | Name, LOCHGRAPHY, canonical URL, OG image, robots directives, noscript email. | P2 |

### 6.3 Content disposition

| Content | Disposition | Notes |
|---|---|---|
| Name, role, Sri Lanka | Retain unchanged | Identity anchor. |
| LOCH wordmark | Retain unchanged | Brand anchor; do not touch the shader. |
| Hero statement | Retain or lightly rewrite | Keep the two-line identity if approved. |
| Hero sub-copy | Shorten or remove | Main duplication candidate. |
| Work support sentence | Remove | Circular and repeats the index. |
| Project titles | Retain unchanged | Including `Campus Portfolio (PS Portfolio)` unless the alias is approved. |
| Project descriptions | Shorten | One concrete sentence; mobile expandable if desktop detail is kept. |
| Project tags | Retain as metadata; deduplicate | Tech tags are useful; category repeats are not. |
| Project statuses | Retain truthful statuses; merge with action | `Live` and `Visit Live Website` duplicate. |
| Project captions | Decide render or remove | Currently dead data; 3 em dashes are not user-facing. |
| About statement | Retain core; rewrite for concreteness | Do not lose the three-part identity. |
| About paragraphs | Shorten or make expandable | 51 words across two paragraphs. |
| Stats | Keep at most two meaningful numbers | Remove the code-line metric or update it with approval. |
| Education facts | Retain unchanged | Institutions, qualifications, partnerships. |
| Education status | Remove or state once | `Completed` x3. |
| Education period labels | Keep one type label per entry | They classify study; they are not dates. |
| Service summaries | Shorten to one line | Four of five start with `-ing`. |
| Service details | Convert to 3-4 labels plus expandable full list | 33 fragments is too many for visible mobile content. |
| Service actions | One section CTA or shorter per-card label | `Discuss this service` x5. |
| Contact lead | Retain | Short and clear. |
| Contact body | Shorten or remove | Generic invitation. |
| Contact methods | Retain all public methods | Email, phone, socials, CV. |
| Footer identity | Retain; punctuation only | Match hero separator. |
| Footer nav | Retain desktop; compact mobile | Avoid a second full nav. |
| Footer tech credit | Optional | Keep only if it is intentional brand copy. |
| SEO metadata | Retain structure; punctuation and specificity pass | Needs approval because previews change. |
| README dashes | Clean separately | Not site-rendered. |

### 6.4 Illustrative directions (using only existing facts)

These are not final copy and should not be implemented without approval. They show the intended level of compression, using facts already present in the repository.

- **Hero sub-copy direction:** one line naming websites, visual content, and hospitality support. The current eyebrow already supplies the name, role, and Sri Lanka.
- **Work support:** delete. The label and index are enough.
- **Ceylon Pathways direction:** `Sri Lanka tourism site for private van tours and scenic journeys.` This uses only existing facts.
- **Telca direction:** `CCTV catalogue and quotation system with an admin interface.` This uses only existing facts; the tech tags carry the stack.
- **Nethwin direction:** `Print-on-demand bookshop for NethwinLK Printers.` This uses only existing facts.
- **Campus Portfolio direction:** `Academic and community technology projects.` This uses only existing facts.
- **About direction:** one sentence for the three practices (websites, visual content, hospitality support), then two short supporting lines. Do not add years or client counts.
- **Services direction:** keep each title, one summary line, and 3-4 labels. The Travel platform row carries the specific credibility.
- **Contact direction:** keep `Let's work together.` and the direct methods; remove the second invitation sentence.

---

## 7. Proposed responsive improvements

### 7.1 Existing breakpoint inventory

| Breakpoint | Verified behavior |
|---|---|
| `max-width: 900px` | Navigation becomes a full-screen overlay; project grid becomes one column. |
| `max-width: 860px` | Services grid becomes one column; Contact becomes one column; stats become two columns. |
| `min-width: 721px` and `max-width: 860px` | About keeps a two-column portrait/content relationship. |
| `max-width: 720px` | Hero content loses the 46rem cap and the mark fills the available width; About becomes one column; portrait is capped at 30rem and centered; About statement uses a smaller clamp; Education becomes one column. |
| `min-width: 861px` | Services returns to two columns. |
| `min-width: 901px` | Footer copyright aligns right; navigation is desktop. |
| Hero compact mark query | `(max-width: 720px)` changes the refracted wordmark's lower glass and contour. Do not modify. |

The adjacent 860/861 and 900/901 pairs are consistent, not accidental. No breakpoint change is required for the content pass.

### 7.2 Section-specific recommendations

| Section | Mobile recommendation | Desktop recommendation |
|---|---|---|
| Hero | Keep the current composition. Reduce copy, not type size. Ensure the primary CTA is visible in the first viewport. Remove the duplicate scroll link or make it decorative. | Keep the current composition and editorial spacing. |
| Work | Keep one column. Image first. Group index, category, and status into one metadata row. Show one description sentence, then tags/action. Use progressive disclosure for the full description if desktop keeps it. | Keep two columns and the current image proportion. Retain useful editorial description. |
| About | Keep one column. Consider a less tall portrait crop (for example 4:3 instead of 4:5) or a different `object-position` to reduce the portrait's vertical dominance. Keep the statement at its current size. Make the two paragraphs expandable if needed. | Keep the two-column layout and portrait proportion. Retain the full statement and paragraphs. |
| Education | Keep one column. Merge period and status into one metadata line. Keep institution and qualification as the hierarchy. No timeline is needed because the data has no dates. | Keep the current divided list. Remove repeated status if approved. |
| Services | Keep one column. Show title, one summary line, and 3-4 labels. Put the full detail list behind `What's included`. Turn the Travel platform list into a compact row. Use one clear action pattern. | Keep two columns. Retain the fuller detail list and brand metadata. |
| Contact | Keep one column. Put email and phone before the secondary socials. Shorten or remove the body paragraph. Keep the CV link visible. | Keep the two-column layout. |
| Navigation | Keep the overlay. The 1.35rem links and 44px targets are good. Consider increasing the 0.75rem indices slightly. | Keep the current inline nav. |
| Footer | Compact to identity, `Back to top`, and copyright, or wrap the section links into a single row. Avoid repeating the full nav as a second block. | Keep the full footer and right-aligned copyright. |
| Spacing and typography | Increase metadata from 9.9-11.2px to roughly 11.5-12px; reduce tracking on mobile; keep body at 15.2px or above; do not shrink headings. | Keep the current type scale and generous spacing. |

### 7.3 What should not be done

- Do not shrink all text to fit more content. The body is already 15.2px minimum; shrinking it would make the site harder to read.
- Do not remove headings or labels to create artificial minimalism. The hierarchy is useful.
- Do not hide content from screen readers, keyboard users, or search engines to make the mobile page look shorter.
- Do not change the wordmark shader or the mobile black-hole framing as part of the content pass.
- Do not reduce global section padding to compensate for text volume. Fix the content first.
- Do not replace the middle-dot metadata separators with hyphens. They are not em dashes.

### 7.4 Desktop preservation strategy

There are two possible approaches. The user should choose one before Stage 2:

1. **Global content edit:** shorten copy everywhere. Simpler DOM, but desktop loses editorial detail. This conflicts with "desktop should remain largely unchanged."
2. **Responsive progressive disclosure:** keep one DOM with full copy, show a short version on mobile, and expand on demand. Preserves desktop detail, but needs careful accessibility and CSS/JS work.

**Recommendation:** use approach 2 for Work descriptions, Services details, and About paragraphs. Use global edits only for clear redundancy that does not add desktop value: Work support, hero sub-copy, service action labels, education status, and duplicate stats. Punctuation changes can be global because they do not change information.

---

## 8. Recommended implementation order

### Phase 0 - Approval and baseline

1. Review this report and approve the content dispositions.
2. Decide desktop preservation approach: global edit or responsive progressive disclosure.
3. Capture a full-page mobile baseline at 390x844 and a desktop baseline at 1440x900 before any change.

### Phase 1 - Punctuation-only pass (P1, low risk)

1. Replace the 17 user-facing em dashes listed in section 5.1.
2. Use colons, full stops, or parentheses where they read better than a hyphen.
3. Update `index.html` title, meta description, OG/Twitter titles, image alts, and noscript consistently.
4. Update the Nav ARIA label and ServiceCard screen-reader text.
5. Leave the 3 unused captions and 3 code comments alone until the caption decision is made.
6. Leave all hyphenated compounds, URLs, emails, CSS, filenames, and technical terms unchanged.
7. Verify build, typecheck, and a desktop screenshot diff. Text width may shift slightly; that is expected.

### Phase 2 - Remove verified redundancy (P1-P2)

1. Remove the Work support sentence.
2. Remove or replace the hero sub-copy; remove the duplicate scroll link or make it decorative.
3. Merge project status and action where they duplicate "live."
4. Remove repeated `Completed` from Education or state it once.
5. Remove the code-line stat or update it with approval; reduce stats to meaningful numbers.
6. Replace the five `Discuss this service` labels with one consistent, shorter pattern.
7. Compact the footer on mobile only if the user approves.

### Phase 3 - Mobile progressive disclosure (P2)

1. Add expandable details for Services, starting with Travel & Hospitality.
2. Add mobile disclosure for Work descriptions if desktop detail is retained.
3. Add mobile disclosure for About paragraphs.
4. Use native semantics where possible; preserve keyboard focus, `aria-expanded`, and screen-reader labels.
5. Test with JavaScript disabled if the disclosure depends on JavaScript.

### Phase 4 - Mobile layout refinements (P2)

1. Group Work metadata into one row.
2. Reconsider the About portrait crop and spacing.
3. Convert the Travel platform list into a compact row.
4. Increase metadata size and reduce tracking on mobile.
5. Keep the 44px touch targets and visible focus states.

### Phase 5 - Metadata and final QA (P2-P3)

1. Finalize SEO title and description with user approval.
2. Verify OG and Twitter previews.
3. Test at 360x740, 390x844, 402x714, 430x932, 844x390, and 1440x900.
4. Test keyboard navigation, reduced motion, screen-reader labels, and no-JavaScript fallback.
5. Run build and typecheck.
6. Confirm the working tree contains only intended content changes plus the pre-existing shader changes.

### Separate from this audit

- Physical iPhone confirmation of the wordmark rectangle fix remains pending from the prior task. It is not blocking this audit and should not be mixed with content commits.

---

## 9. Risks and information requiring approval

### 9.1 Risks

| Risk | Why it matters | Mitigation |
|---|---|---|
| Inventing facts | Dates, client names, metrics, and qualifications must be accurate. | Use only existing repository facts; ask the user for any new data. |
| Losing desktop editorial identity | Shortening copy globally changes the desktop experience. | Choose responsive progressive disclosure or approve global cuts explicitly. |
| SEO regression | Title and meta description changes affect search and social previews. | Approve exact strings; keep canonical URL and OG image unchanged. |
| Accessibility regression | Removing screen-reader text or hiding content can break assistive technology. | Preserve alt text, ARIA labels, focus states, and disclosure semantics. |
| Punctuation overreach | A global dash replacement could damage URLs, code, or compound words. | Apply the 17-item list only; do not run a blind search-and-replace. |
| Caption dead data | Captions are defined but not rendered; changing them has no visible effect. | Decide render or remove before editing. |
| Mixing with shader work | The working tree already contains unrelated shader changes. | Keep content commits separate; do not touch `SiteBackground.tsx` or `refracted-renderer.ts`. |
| Stale code metric | `4,621` lines of code will drift. | Remove it or document an update process. |
| No user testing | The audit is based on source and screenshots, not analytics or interviews. | Treat recommendations as design judgment; validate after implementation. |

### 9.2 Decisions requiring approval

- [ ] Remove the hero sub-copy, or keep a shortened version?
- [ ] Remove the hero scroll cue, or keep it as a non-interactive visual element?
- [ ] Remove the Work support sentence?
- [ ] Shorten all project descriptions globally, or use mobile-only progressive disclosure?
- [ ] Merge the `Live` status with `Visit Live Website`, or keep both?
- [ ] Drop the `Digital Experience`, duplicate `Web Development`, and `Academic Portfolio` tags?
- [ ] Rename `Campus Portfolio (PS Portfolio)` to `Campus Portfolio`, or keep the full title?
- [ ] Reduce About to the statement plus two short lines, or keep the full paragraphs on desktop?
- [ ] Keep, replace, or remove the `4,621` lines-of-code stat?
- [ ] Keep all four stats, or reduce to two?
- [ ] Remove the repeated `Completed` status from Education?
- [ ] Add dates to Education only if the user supplies them?
- [ ] Remove the Services support sentence?
- [ ] Reduce service details to 3-4 visible labels with an expandable full list?
- [ ] Replace five `Discuss this service` links with one section CTA or a shorter label?
- [ ] Shorten or remove the Contact body paragraph?
- [ ] Display the second phone number and alternate email, or keep them private?
- [ ] Compact the footer on mobile?
- [ ] Keep the `Built with plain React, Canvas & WebGL` credit?
- [ ] Approve the exact SEO title, meta description, OG description, and noscript strings?
- [ ] Clean up README en/em dashes separately?
- [ ] Render project captions, or remove the unused caption field later?

### 9.3 Safe changes that do not need individual approval

These are low-risk, factual, and reversible, but should still be reviewed in the Stage 2 diff:

- Replacing the 17 user-facing em dashes with hyphen-minus, colons, full stops, or parentheses as listed.
- Standardizing the footer identity separator to match the hero eyebrow.
- Fixing the ServiceCard screen-reader punctuation from an em dash to a colon.
- Leaving all existing hyphenated compounds, URLs, emails, CSS, and filenames unchanged.
- Leaving the CSS 1px tag marker unchanged.

---

## Stage 1 completion statement

- Every required section was inspected: Hero, Work and all four project cards, About, Education, Services and all five service cards, Contact, Navigation, and Footer.
- Mobile density was assessed at 390x844 with source verification and existing captures at 360x740, 390x844, 402x714, 430x932, and 1440x900.
- Punctuation was inventoried at exact file and line level: 17 user-facing em dashes, 0 production en dashes, 3 unused captions, and 3 code comments.
- No production file was changed. The only new file is this report.
- Stage 2 has not started. Implementation awaits review and approval of the findings above.
