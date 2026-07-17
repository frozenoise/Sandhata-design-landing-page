// Bake the homepage chart cards to PNGs for the WebGL bend planes
// (app/_fx/BendCanvas.tsx). Re-run whenever a card's design changes:
//   1. npm run dev (textures are captured from the live page)
//   2. node scripts/bake-bend-textures.js   (needs playwright: npm i playwright --no-save)
// Captures each card with a 20px margin (EXPAND) so box-shadows survive;
// BendCanvas expands the tracked rect by the same constant — keep in sync.
const { chromium } = require("playwright");
const path = require("path");

const OUT = path.join(__dirname, "..", "public", "assets", "bend");
const EXPAND = 20;

const TARGETS = [
  { name: "radar", sel: ".rtu-charts .rtu-card:nth-of-type(1)" },
  { name: "pie", sel: ".rtu-charts .rtu-card:nth-of-type(2)" },
  { name: "bar", sel: ".rtu-right-col .rtu-card:nth-of-type(1)" },
  { name: "trend", sel: ".rtu-right-col .rtu-card:nth-of-type(2)" },
  { name: "line", sel: ".rtu-line" },
  { name: "table", sel: ".rtu-table" },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1000);

  // trigger reveals: scroll through the ready section slowly
  await page.evaluate(() => document.querySelector(".ready").scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(2500); // let chart entrance animations finish

  require("fs").mkdirSync(OUT, { recursive: true });
  for (const t of TARGETS) {
    const el = page.locator(t.sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const box = await el.boundingBox();
    if (!box) { console.log("MISS", t.name, t.sel); continue; }
    await page.screenshot({
      path: path.join(OUT, t.name + ".png"),
      clip: {
        x: Math.max(0, box.x - EXPAND),
        y: Math.max(0, box.y - EXPAND),
        width: box.width + EXPAND * 2,
        height: box.height + EXPAND * 2,
      },
    });
    console.log("baked", t.name, Math.round(box.width) + "x" + Math.round(box.height));
  }
  await browser.close();
})();
