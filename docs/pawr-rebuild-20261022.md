# 2026-10-22 portfolio rebuild

## Scope and sources

The owner requested a layout based on <https://pawr.link/max>, restoration of
research, current GitHub Star counts, a Xiaohongshu link, a five-step journey,
three revised ideas, the AgentTect course note, and removal of the memory-pool
card. The GitHub profile must no longer link to the portfolio.

The layout follows the reference's centered profile, rounded social cards,
muted surfaces and compact typography. It does not copy its identity, product
claims, images, followers, crypto activity or other third-party data.

The existing portfolio supplies project facts, video, screenshots and credit
links. The owner's current resume supplies the seven public paper links.
Only ColorMedGAN is marked first author. The journey uses the five stages
provided by the owner. No degree subtype, dates, school names or employer
names were inferred. The small course note is an explicit owner request.

The profile repository had a newer remote commit `44532ac` removing four
project entries. It was fast-forwarded while clean. Only the portfolio link
section is removed from that current README; the reduced project list stays.

## Runtime data

GitHub API reference:
<https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user>.

One paginated listing supplies the account total and project badges. Forks
are excluded. Original archived repositories are included. A zero count is
valid. Missing, invalid, partial or unavailable data must not become zero.
The cache has a seven-day upper age and a visible cached state. An eight-second
timeout bounds refresh. The client contains no credentials.

GitHub account and repository settings are changed only after validating the
authenticated login as `TardisBooo`. The profile blog and profile-repository
homepage fields are cleared. The portfolio repository's own homepage stays.
Credentials are obtained through the existing Git credential manager, used in
memory for GitHub, and never printed, saved or placed in browser code.

## Acceptance

Automated Star-data checks cover original/fork scope, true zero counts,
pagination and duplicate rows, partial rate-limited listings, unexpected next
hosts, invalid values, a wrong owner, and cache corruption or expiration.

Browser acceptance covers desktop and 390px mobile layout, both languages,
research and journey links, the three ideas, course note, project disclosures,
video controls, current Stars and refresh. The final verification record is
retained with screenshots in the audit directory named in README.

No raw data, history or unused media is deleted. Earlier design files remain
in Git. Temporary research and build helpers belong to this task and are
retained as rebuildable review material, not as the canonical site source.
