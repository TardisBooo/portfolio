const { chromium } = require(
  process.env.PLAYWRIGHT_PATH ||
    "D:/SOFTWARE_DATA/Codex/Home/skills/guizang-social-card-skill/node_modules/playwright",
);
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const out = "E:/Workspaces/_audits/portfolio-motion-20260921";
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173/?lang=zh");
  await page.waitForTimeout(2200);
  assert.equal(await page.locator(".profile-summary").count(), 0);
  assert((await page.locator("h1").innerText()).includes("关于系统开发"));
  await page.screenshot({ path: `${out}/final-hero.png` });
  await page.locator(".tardis-stage").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const box = page.locator(".tardis-scene");
  const transform = async () => (await box.screenshot()).toString("base64");
  const a = await transform();
  await page.waitForTimeout(700);
  assert.notEqual(await transform(), a, "Tardis must rotate");
  await page.screenshot({ path: `${out}/final-tardis.png` });
  await page.locator(".motion-toggle").click();
  const paused = await transform();
  await page.waitForTimeout(350);
  assert.equal(await transform(), paused, "Pause must stop rotation");
  await page.locator(".motion-toggle").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  assert.notEqual(await transform(), paused, "Keyboard must resume rotation");
  for (const id of ["mobius-connect", "harness-daily", "prewalk"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${out}/final-${id}.png` });
  }
  assert.equal(await page.locator(".benchmark-panel").count(), 0);
  const carousel = page.locator(".prewalk-carousel");
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ["en", "zh"]) {
      await page.locator(`[data-language=${lang}]`).click();
      await carousel.scrollIntoViewIfNeeded();
      for (let i = 0; i < 4; i++) {
        assert.equal(
          await carousel.locator(".prewalk-slide:visible").count(),
          1,
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        );
        await carousel.locator(".carousel-next").click();
      }
      await carousel.focus();
      await page.keyboard.press("ArrowLeft");
      assert.equal(
        await carousel.locator(".carousel-status").textContent(),
        "4 / 4",
      );
      await page.keyboard.press("ArrowRight");
      assert.equal(
        await carousel.locator(".carousel-status").textContent(),
        "1 / 4",
      );
    }
  }
  await page.locator("#mobius video").evaluate((v) => v.load());
  await page.waitForFunction(
    () => document.querySelector("video").duration > 100,
  );
  assert(
    Math.abs(
      (await page.locator("video").evaluate((v) => v.duration)) - 109.312,
    ) < 1,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".tardis-stage").scrollIntoViewIfNeeded();
  assert(await page.locator(".tardis-still").isVisible());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:4173/?lang=zh");
  await page.locator(".tardis-stage").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({ path: `${out}/final-tardis-mobile.png` });
  await page.locator(".prewalk-carousel").scrollIntoViewIfNeeded();
  await page.locator(".carousel-next").click();
  await page.locator(".carousel-next").click();
  await page.screenshot({ path: `${out}/final-benchmark-mobile.png` });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    `${out}/motion-verification.json`,
    JSON.stringify(
      {
        passed: [
          "Requested hero/subtitle changes",
          "User-provided GIF animates",
          "Pause and keyboard resume",
          "Reduced-motion static rendering",
          "Latest video duration 109.312s",
          "Four compact carousel cards, bilingual, keyboard and arrow navigation",
          "Mobile Tardis and benchmark without page overflow",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log("All motion and media checks passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
