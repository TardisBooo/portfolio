const { chromium } = require(
  process.env.PLAYWRIGHT_PATH ||
    "D:/SOFTWARE_DATA/Codex/Home/skills/guizang-social-card-skill/node_modules/playwright",
);
const assert = require("node:assert/strict");
const fs = require("node:fs");
const output =
  process.env.AUDIT_DIR || "E:/Workspaces/_audits/portfolio-redesign-20260921";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().startsWith(base))
      errors.push(`${r.status()} ${r.url()}`);
  });
  const checks = [];
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    for (const lang of ["en", "zh"]) {
      await page.goto(`${base}/?lang=${lang}`);
      await page.waitForTimeout(1300);
      assert.equal(await page.locator(".project-card").count(), 9);
      assert.equal(
        await page.locator("html").getAttribute("lang"),
        lang === "zh" ? "zh-CN" : "en",
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `overflow: ${width} ${lang}`,
      );
      await page.screenshot({
        path: `${output}/portfolio-${width}-${lang}.png`,
      });
      for (const card of await page.locator(".project-card").all()) {
        await card.scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
      }
      assert(
        await page.evaluate(() =>
          [...document.images].every((i) => i.complete && i.naturalWidth > 0),
        ),
        `broken image ${width} ${lang}`,
      );
      checks.push(
        `${width}px ${lang}: 9 projects, no overflow, all images loaded`,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.locator("[data-language=zh]").click();
  assert((await page.url()).includes("lang=zh"));
  await page.reload();
  assert.equal(await page.locator("body").getAttribute("data-lang"), "zh");
  await page.goto(base);
  assert.equal(await page.locator("body").getAttribute("data-lang"), "zh");
  await page.locator("[data-language=en]").click();
  await page.locator('a.nav-link[href="#projects"]').click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${output}/portfolio-projects.png` });
  const summary = page.locator("#mobius .project-description summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  assert(
    await page.locator("#mobius .project-description").evaluate((e) => e.open),
  );
  const video = page.locator("video");
  await video.evaluate((v) => v.play());
  await page.waitForTimeout(500);
  assert(await video.evaluate((v) => v.currentTime > 0 && !v.paused));
  await page.locator('a.nav-link[href="#thinking"]').click();
  await page.waitForTimeout(1500);
  assert(await video.evaluate((v) => v.paused));
  await page.screenshot({ path: `${output}/portfolio-thinking.png` });
  const principle = page.locator(".principles details").nth(1);
  await principle.locator("summary").focus();
  await page.keyboard.press("Enter");
  assert(await principle.evaluate((e) => e.open));
  checks.push(
    "Language query/storage persistence, keyboard disclosures, section navigation, video playback and offscreen pause",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  assert.equal(
    await page
      .locator(".hero-line")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  assert.equal(
    await page
      .locator(".project-card")
      .last()
      .evaluate((e) => getComputedStyle(e).opacity),
    "1",
  );
  checks.push("Reduced motion: animation disabled, all content visible");
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await nojs.newPage();
  await fallback.goto(base);
  assert.equal(await fallback.locator(".project-card").count(), 9);
  assert(
    (await fallback.locator("#mobius .project-card-body > p").count()) > 1,
  );
  checks.push(
    "No JavaScript: all projects and full descriptions remain available",
  );
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    `${output}/verification.json`,
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
