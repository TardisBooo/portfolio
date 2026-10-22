# Tardis · projects, research and ideas

Live site: <https://tardisbooo.github.io/portfolio/>.

A buildless, bilingual personal page. The 2026-10-22 owner-directed rebuild
uses the narrow profile, soft cards and restrained typography of
[pawr.link/max](https://pawr.link/max) as its layout reference. The content,
assets, navigation and interactions belong to this portfolio.

## Current content

- Eight project cards, including Möbius, ViewAtom and AgentTect.
- Seven research papers from 2021–2023, with original publication links.
- The owner's five-stage journey: communications undergraduate studies,
  AI research master's studies, game-engine development, computer vision
  for VR glasses, and industrial software development.
- Three ideas: use agents well, build agents, and Just Ship it.
- GitHub and the owner's Xiaohongshu profile.

The AgentTect course note says “给女朋友设计的课程”. The memory-pool project
is no longer displayed. No school names, employment dates or private contact
details were added. Research authorship is linked through the public papers.

## Live GitHub Stars

`stars.mjs` reads the public GitHub REST repository listing, follows pagination
and sums `stargazers_count` across the owner's public, non-fork repositories.
Archived original repositories are included. This is received Stars, not
repositories the owner has starred. Project badges use the same response.

The page fetches when opened, on explicit refresh, and when it becomes visible
after at least five minutes. Counts are never hard-coded. The page shows an
update time. A failed request may use a validated cache no older than seven
days, clearly marked as cached. Without usable data it shows an unknown count,
not zero. No access token or secret is shipped to the browser.

## Preview and checks

Serve over HTTP because the JavaScript uses native ES modules:

```text
python -m http.server 8000 --bind 127.0.0.1
node --check script.js
node --check stars.mjs
node --test tools/stars.test.mjs
```

The site deploys from `main` through `.github/workflows/pages.yml`.
The project video is a demonstration with fictional projects and scripted agent
output. Its existing media credits remain linked beside the video.

## Durable records

- Active source: `E:\Workspaces\portfolio`.
- Before-edit snapshot: `D:\DataVault\portfolio\snapshots\20261022-before-pawr-rebuild`.
- Source and Git bundles: `D:\DataVault\portfolio\current-20261022`.
- Accepted static-site package: `D:\AcceptedArtifacts\portfolio\2026-10-22`.
- Review screenshots and checks: `E:\Workspaces\_audits\portfolio-pawr-rebuild-20261022`, retained for review.

See [the rebuild record](docs/pawr-rebuild-20261022.md) for content provenance,
acceptance results and the GitHub profile link removal. Earlier design studies
and unused media remain available for historical reference.
