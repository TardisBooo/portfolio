const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PLAYWRIGHT_PATH ||
    "D:/SOFTWARE_DATA/Codex/Home/skills/guizang-social-card-skill/node_modules/playwright",
);
const audit =
  process.env.COPY_AUDIT_DIR || "E:/Workspaces/_audits/portfolio-copy-20260921";
(async () => {
  const context = JSON.parse(
    fs.readFileSync(path.join(audit, "gemini-context.json"), "utf8"),
  );
  const current = fs.readFileSync(
    path.join(__dirname, "../index.html"),
    "utf8",
  );
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ javaScriptEnabled: false });
  const inspect = async (html) => {
    await page.setContent(html);
    return page.evaluate(() => ({
      links: [...document.querySelectorAll("a")].map((e) =>
        e.getAttribute("href"),
      ),
      assets: [...document.querySelectorAll("[src]")].map((e) =>
        e.getAttribute("src"),
      ),
      anchors: [...document.querySelectorAll("[id]")].map((e) => e.id),
      projects: [...document.querySelectorAll("article h3")].map(
        (e) => e.textContent,
      ),
      caveats: [...document.querySelectorAll(".evidence-details")].map((e) =>
        e.textContent.replace(/\s+/g, " ").trim(),
      ),
      languageSlots: document.querySelectorAll(".lang-en,.lang-zh").length,
      hero: [...document.querySelectorAll("#profile-title .lang-en")]
        .map((e) => e.textContent)
        .join(""),
    }));
  };
  const before = await inspect(context.source_html);
  const after = await inspect(current);
  for (const key of [
    "links",
    "assets",
    "anchors",
    "projects",
    "caveats",
    "languageSlots",
  ])
    assert.deepEqual(after[key], before[key], `Changed ${key}`);
  const report = {
    passed: [
      "All link destinations preserved",
      "All media sources preserved",
      "All anchors preserved",
      "All nine project names preserved",
      "Locked preview caveats unchanged",
      "Bilingual slot coverage preserved",
    ],
    hero: after.hero,
  };
  fs.writeFileSync(
    path.join(audit, "copy-contract-verification.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
