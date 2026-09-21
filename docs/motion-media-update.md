# Owner-directed media, identity and motion update

## Follow-up: supplied GIF and compact benchmark cards

Final owner correction: the green screen is an extraction background. The site now
uses `资源/tardis-rotation-transparent.gif`, not the unprocessed original described
below. FFmpeg processing: `crop=144:180:88:0,format=rgba,colorkey=0x00d600:0.28:0.08,
despill=type=green:mix=0.5`, followed by transparent palette generation/use (alpha
threshold 128). All 55 frames and 3.67-second duration are retained. The subject
crop excludes the right-hand watermark. Reviewed a 55-frame contact sheet and
the cutout against the site's actual background. Original source remains preserved.

The owner subsequently supplied `C:\Users\MSI-NB\Downloads\x6IRTA.gif` and asked
for direct replacement. The site now serves the unmodified GIF (601,353 bytes),
including its green background and watermark. A static canvas frame replaces its
visible animation when paused, offscreen, in a hidden tab or under reduced motion.
The original is preserved as `tardis-rotation-user.gif` in the media vault below.

The owner also requested the prewalk section match the other projects' footprint.
The large full-width benchmark panel was removed in favor of a four-card carousel
inside the existing project visual: workflow, adaptations, core fork/packet metrics,
and the frontier one-shot cost/time trade-off. The original evidence link remains.
Navigation supports arrow buttons, keyboard left/right and touch swipes, without
autoplay. The full table remains available in the linked source, not duplicated here.
`tools/verify-motion.cjs` now verifies GIF playback/pause and all carousel cards in
both languages at desktop and narrow widths. The following sections record the
earlier implementation and unchanged source provenance.

2026-09-21. The owner's latest wording overrides the narrower earlier Gemini intro:
systems development, AI models and frontier agent research. Removed the supporting
subtitle, changed the hero link to “我的产品” / “My products”, and updated the daily
report statement to automatic collection and summarization of yesterday's sessions.

## Media provenance

The previous site film was 2,187,500 bytes. The current official product-site media
and `E:\Workspaces\Mobius\film-src\v3\out\mobius-film-en.mp4` both identify the
32,555,032-byte launch film (modified 2026-09-17). `ffprobe` measures 109.312 seconds.
Copied the official site file to `资源/mobius-product-film-launch.mp4`; extracted its
poster at 2.5 seconds with ffmpeg. Existing fictional-demo/scripted-output disclosures
remain. The older site assets remain in Git; no cleanup was requested or performed.

Möbius artwork: copied `apps/website/public/brand/mobius-ribbon-hero.png` from the
desktop repository. The portfolio masks native CSS scan lines with its actual alpha
silhouette, preserving the brand's blind/scan-line treatment behind mobius-connect.

`资源/harness-daily-mark.svg` is a new editable vector mark: overlapping conversation
and report pages, a sunrise and report lines. `资源/tardis-face.svg` is original vector
artwork guided by the user's Doctor Who reference. It is mapped onto four CSS 3D faces,
with roof and lamp geometry. The reference photograph itself is not published.

Durable media/reference copies: `D:\DataVault\portfolio\media\20260921`.
4 files / 33,837,184 bytes copied successfully; all source files remain in place.

## Reference animation study and implementation

Revisited arjun-r.com in Chromium, sampling the intro over time and the page at
700/1100/1600/3800/5800px scroll positions. Main observed motifs: sequential text
placement, a temporary editor-like label, outline/marker drawing, portrait with
hand-drawn rays, angled project entrances and layered image movement.

Reconstructed these motifs with CSS keyframes, IntersectionObserver and progressive
CSS view timelines. Durations are tuned reproductions from visual observation, not
claimed source-code or frame-exact copies. The Tardis replaces the reference portrait;
the reference owner's testimonials, project content and personal assets are not copied.
Tardis rotation takes 14 seconds per turn and pauses offscreen, in hidden tabs, by the
user's button, or under reduced motion. Mobile project entrances move vertically to
avoid sideways overflow. No scroll interception, runtime dependency or custom cursor.

## Prewalk: adaptations and benchmark evidence

Source: local clean repository `E:\Workspaces\prewalk\repos\prewalk`, commit
`561ae57841ad7c9d3a72789c398f7f64b6877312`, README “What we built” and “Benchmark”.
The site links to that exact public revision. Records describe an independent
implementation of Can Bölük's technique: common engine, native Codex/Claude adapters,
Codex trajectory inheritance, Claude packet-seeded executor, checkpoint reject/retry,
planner mutation budgets, atomic recovery states and capability-checked routing.

The displayed results are the repository's published historical 13-instance,
5-arm / 65-run experiment, not a benchmark rerun in this portfolio task. All five
rows, models, host environment, sample composition and limitations are shown.
Fork vs packet: cost -14.3%, time -19.6%. Fork vs frontier one-shot: cost -16.4%,
but 743s vs 522s, hence slower. The source's narrative elsewhere says both cost and
duration beat frontier one-shot; that conflicts with its table. The portfolio follows
the table and explicitly avoids repeating that claim. No full-suite generalization.

## Acceptance

- `node --check motion.js`: passed.
- `node tools/verify-portfolio.cjs`: passed at 1440/768/390/320px in both languages;
  all nine projects/media, language persistence, keyboard controls, video playback,
  reduced motion and no-JavaScript fallback; zero local asset/runtime errors.
- `node tools/verify-motion.cjs`: passed rotation progression, pause/keyboard resume,
  reduced-motion static state, 109.312s video, five benchmark rows and mobile overflow.
- Reviewed hero, Tardis, logos, prewalk results and mobile screenshots.
- `git diff --check`: passed.

Evidence: `E:\Workspaces\_audits\portfolio-motion-20260921`, retained for review.
Its source is this repository; screenshots/reports are regenerable. Historical
copy-contract snapshots document the earlier Gemini rewrite, not this changed scope.
