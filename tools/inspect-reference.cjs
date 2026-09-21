const { chromium } = require(
  process.env.PLAYWRIGHT_PATH ||
    "D:/SOFTWARE_DATA/Codex/Home/skills/guizang-social-card-skill/node_modules/playwright",
);
const fs = require("node:fs");
const out = "E:/Workspaces/_audits/portfolio-redesign-20260921";
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto("https://www.arjun-r.com/", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${out}/reference-hero.png` });
  console.log(
    await page.evaluate(() =>
      [...document.querySelectorAll("h1,h2,nav")]
        .filter((e) => e.getBoundingClientRect().width)
        .slice(0, 20)
        .map((e) => ({
          text: e.innerText,
          font: getComputedStyle(e).font,
          color: getComputedStyle(e).color,
          rect: {
            x: e.getBoundingClientRect().x,
            y: e.getBoundingClientRect().y,
            width: e.getBoundingClientRect().width,
          },
        })),
    ),
  );
  for (const y of [950, 1900, 3200, 5000]) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${out}/reference-${y}.png` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/reference-mobile.png` });
  await browser.close();
})();
