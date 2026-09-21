const { chromium } = require(
  process.env.PLAYWRIGHT_PATH ||
    "D:/SOFTWARE_DATA/Codex/Home/skills/guizang-social-card-skill/node_modules/playwright",
);
const fs = require("node:fs");
(async () => {
  const out = "E:/Workspaces/_audits/portfolio-motion-20260921";
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto("https://www.arjun-r.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  const samples = [];
  for (const t of [500, 2000, 5000]) {
    await p.waitForTimeout(t);
    samples.push(
      await p.evaluate(() =>
        [...document.querySelectorAll("h1,h2")]
          .filter((e) => e.getBoundingClientRect().width)
          .slice(0, 7)
          .map((e) => ({
            text: e.textContent,
            transform: getComputedStyle(e.parentElement).transform,
            opacity: getComputedStyle(e.parentElement).opacity,
          })),
      ),
    );
    await p.screenshot({ path: `${out}/reference-intro-${t}.png` });
  }
  for (const y of [700, 1100, 1600, 3800, 5800]) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(1000);
    await p.screenshot({ path: `${out}/reference-scroll-${y}.png` });
  }
  fs.writeFileSync(
    `${out}/reference-motion.json`,
    JSON.stringify(samples, null, 2),
  );
  await b.close();
  console.log("Reference motion captured");
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
