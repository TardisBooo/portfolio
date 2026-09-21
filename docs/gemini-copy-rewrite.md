# Gemini bilingual copy rewrite

Date: 2026-09-21. Baseline: `59eae21`.

## Context actually supplied

The existing Gemini-compatible route was called using environment configuration
(`GEMINI_LINGSUAN_API_KEY`, `GEMINI_LINGSUAN_BASE_URL`, `GEMINI_LINGSUAN_MODEL`).
Both responses identified the configured model as `gemini-3.8-flash-high`.
Credentials were not written into prompts, source files or reports.

The first request contained 108,394 characters of text context and three screenshots:

- Complete original HTML, including all nine projects and both languages.
- 177 editable language slots with IDs, project association, role and inline markup.
- Complete CSS, README and the reference-site layout/interaction study.
- Desktop English hero, mobile Chinese hero and project-section screenshots.
- Audience, purpose, public identity, voice and CTA conventions.
- Factual boundaries: native resume vs cross-agent handoff, MCP approval restrictions,
  optional retrieval, selected prompts leaving the machine, research uncertainty,
  unquantified benchmark claims and non-medical hook behavior.
- Per-surface writing lengths, three-line hero composition, bilingual equivalence,
  preserved highlights, links, media, project names and locked preview disclosures.

## Two editorial rounds and local review

Gemini produced a complete first draft. Review rejected unsupported claims including
lock-free/slab allocation, deterministic memory behavior, guaranteed reproducibility,
cloud-service independence and already-verified extracted skills. A second request
included the full source context, first draft and slot-specific corrections, asking
for simpler language and restoration of omitted engineering details.

The second draft was applied only after validating slot coverage and unchanged markup.
Local final edits repaired English hero grammar across line fragments, shortened a
mobile Chinese subtitle, corrected entities/export wording, clarified hook execution,
and removed an absolute claim about discovering constraints only under load.
The `better-writing` review informed consistent disclosure labels and clearer wording.
Raw model drafts remain distinct from the final edited website.

Both responses needed extraction of the final JSON object because the provider
included prose or abandoned partial JSON before the complete object. That parsing
did not invent replacement copy; HTML structure is validated before application.

## Verification and storage

`node tools/verify-copy-contract.cjs` verifies original link destinations, media paths,
anchor IDs, all project names, preview caveats and bilingual slot coverage.
`node tools/verify-portfolio.cjs` checks four viewport widths in both languages,
images, overflow, language persistence, keyboard disclosures, navigation, video,
reduced motion and the no-JavaScript fallback. Both passed; screenshots were reviewed.

Authoring: `node tools/rewrite-copy-gemini.cjs` (requires the configured environment).
Browser tools accept `PLAYWRIGHT_PATH`; set `COPY_AUDIT_DIR` for authoring/contract
evidence and `AUDIT_DIR` for browser screenshots. These are development-only scripts,
not part of the site's runtime. `GEMINI_REUSE_RESPONSE=1` reparses a saved response;
`GEMINI_REVISION=1` submits the saved draft and `revision-request.md` for revision.

Review tree: `E:\Workspaces\_audits\portfolio-copy-20260921`, retained for review.
Durable model context, both raw responses, drafts and request metadata:
`D:\DataVault\portfolio\editorial\gemini-copy-20260921`.
Eight files / 251,332 bytes were copied successfully; the review originals remain.
No accepted deliverable designation or source deletion was performed.
