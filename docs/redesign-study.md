# Reference study and redesign

Reference: https://www.arjun-r.com/ (inspected 2026-09-21 in Chromium).

## Observed layout and visual language

- Warm off-white canvas, charcoal text, rust-orange marker highlights.
- Centered, spacious introduction with left-aligned multiline display type.
  Measured desktop headings: Inter, 64px/64px, weight 700; project statements:
  40px/44px. The intro uses handwriting, a selection outline and highlighted words.
- Persistent top navigation; large whitespace before the project story.
- Alternating text/media rows with rounded, slightly rotated images and soft shadows.
- Narrative transitions connect work, testimonials, experiments and design principles.
- Animated intro layers, scroll entrances and interactive calls to action. Sampled
  screenshots capture different entrance/scroll states, not exact easing parameters.
- The reference clipped the headline in a resized 390px viewport. Our implementation
  deliberately reflows text and stacks project rows at small widths.

## Mapping to this portfolio

The prior site was a green-accented, dense project index. Preserve all nine projects,
original source/product links, media credits, project anchors, metadata and bilingual
descriptions. Keep the static HTML/CSS/JavaScript deployment with no runtime dependency.

Use the reference's light canvas, large type, handwritten accents, orange emphasis,
alternating project rows and tilted media. System sans-serif keeps the site offline
capable; handwriting uses available platform fonts. Exact font rendering will vary
across operating systems. The light theme intentionally follows the supplied reference.
Design settings: variance 7, motion 5, density 3.

Replace personal endorsements and biography with a project-grounded “How I think”
section. Do not borrow the reference's identity, testimonials or project imagery.
CLI-only projects receive labeled workflow diagrams, not fabricated screenshots.
Full descriptions become native disclosures only after JavaScript initializes;
without JavaScript the full text remains readable.

## Motion and accessibility

- Hero lines enter in a 120ms stagger, 850ms ease-out: establish reading order.
  The first line stays opaque while moving so primary content is immediately visible.
- Project sections reveal once through IntersectionObserver: guide progression.
- Media rotates back on hover over 550ms: acknowledge the pointer; no custom cursor.
- Native keyboard-operable details expose technical depth and working principles.
- Active navigation is marked with `aria-current`; focus rings and skip link retained.
- Reduced motion disables movement and leaves all content visible.
- Video is user initiated and pauses when it leaves the viewport.
- No scroll interception, animation library, external analytics or automatic video.

## Verification and evidence

Run `python -m http.server 4173 --bind 127.0.0.1`, then
`node tools/verify-portfolio.cjs`. Set `PLAYWRIGHT_PATH` to an installed Playwright
module, `PREVIEW_URL` for another host and `AUDIT_DIR` for another evidence folder.
`tools/inspect-reference.cjs` records reference screenshots and measured typography.

Checks cover 1440/768/390/320px in English and Chinese, all nine projects, image
loading, horizontal overflow, query/localStorage language persistence, keyboard
disclosures, section navigation, real video playback, offscreen pause, reduced motion
and JavaScript-disabled fallback. Runtime and local HTTP errors fail verification.

Local Chromium verification passed all cases above, with zero runtime/asset errors.
Lighthouse 12.8.2 mobile audit: performance 94, accessibility 100, best practices 100,
SEO 100; LCP 3.1s and CLS 0. These are local lab results, not field measurements.
The plain local HTTP server has no compression/cache policy; hosting is separately
provided by GitHub Pages. The latest Lighthouse requires a newer Node version than
this workstation's Node 20.9, so the compatible 12.8.2 release was used.

Checks executed: `node --check script.js`, `node --check tools/verify-portfolio.cjs`,
`node --check tools/inspect-reference.cjs`, `node tools/verify-portfolio.cjs`,
`git diff --check`, and `npx --yes lighthouse@12.8.2 http://127.0.0.1:4173`
with headless Chrome, JSON output and performance/accessibility/best-practices/SEO.

Generated evidence: `E:\Workspaces\_audits\portfolio-redesign-20260921`.
This temporary tree belongs to `E:\Workspaces\portfolio` and is **retained for review**.
It contains regenerable screenshots/reports, not unique source or accepted deliverables.
The existing project media stays versioned in this repository. No new immutable data
or accepted artifact has been designated by the user in this redesign.
