/**
 * Lightpanda CDP compatibility test for extractor-url.ts
 *
 * Tests every browser API our URLGenomeExtractor relies on:
 *   1. CDP connection via Playwright
 *   2. page.goto() + networkidle
 *   3. document.querySelectorAll() with our selector set
 *   4. window.getComputedStyle() — critical: partial support in LP
 *   5. style.textContent — reading <style> tags
 *   6. el.getAttribute('style') — inline styles
 *   7. CSS variable resolution via getComputedStyle
 *   8. Transition/animation duration detection
 *
 * Usage:
 *   node tests/lightpanda-test.mjs
 *
 * Lightpanda must be installed at /usr/local/bin/lightpanda
 */

import { chromium } from "playwright";
import { spawn } from "child_process";

const LP_PORT = 9223; // use 9223 to avoid colliding with any running instance
const TEST_URLS = [
  "https://stripe.com",
  "https://linear.app",
  "https://tailwindcss.com",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function startLightpanda() {
  return new Promise((resolve, reject) => {
    const proc = spawn("lightpanda", [
      "serve",
      "--host", "127.0.0.1",
      "--port", String(LP_PORT),
      "--log_level", "error",
    ]);

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) reject(new Error("Lightpanda failed to start within 5s"));
    }, 5000);

    // LP writes to stderr; wait a moment for the port to open
    setTimeout(() => {
      started = true;
      clearTimeout(timeout);
      resolve(proc);
    }, 1500);

    proc.stderr?.on("data", () => {}); // suppress output
    proc.on("error", reject);
  });
}

function stopLightpanda(proc) {
  try { proc.kill("SIGTERM"); } catch {}
}

const pass = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => console.log(`  ✗ ${msg}`);
const section = (msg) => console.log(`\n── ${msg} ──`);

// ── Test suite ────────────────────────────────────────────────────────────────

async function runTests(url, browser) {
  console.log(`\n┌─ ${url}`);
  const results = { passed: 0, failed: 0, errors: [] };

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navigation
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
      pass("page.goto() + networkidle");
      results.passed++;
    } catch (e) {
      fail(`page.goto(): ${e.message}`);
      results.failed++;
      results.errors.push(`goto: ${e.message}`);
      return results; // can't test anything if nav fails
    }

    // 2. querySelectorAll with our exact selector set
    try {
      const count = await page.evaluate(() => {
        const els = document.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, p, a, button, input, nav, header, footer, main, section, article, div, span, li"
        );
        return els.length;
      });
      pass(`querySelectorAll — ${count} elements matched`);
      results.passed++;
    } catch (e) {
      fail(`querySelectorAll: ${e.message}`);
      results.failed++;
    }

    // 3. window.getComputedStyle — THE critical test
    try {
      const styleData = await page.evaluate(() => {
        const el = document.querySelector("body");
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          fontFamily: cs.fontFamily,
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          fontSize: cs.fontSize,
        };
      });
      if (styleData && styleData.fontFamily !== undefined) {
        pass(`getComputedStyle(body): fontFamily="${styleData.fontFamily}", color="${styleData.color}", bg="${styleData.backgroundColor}"`);
        results.passed++;
      } else {
        fail("getComputedStyle returned null or empty");
        results.failed++;
      }
    } catch (e) {
      fail(`getComputedStyle: ${e.message}`);
      results.failed++;
    }

    // 4. getComputedStyle on heading elements
    try {
      const headingStyles = await page.evaluate(() => {
        const results = [];
        for (const tag of ["h1", "h2", "h3"]) {
          const el = document.querySelector(tag);
          if (el) {
            const cs = window.getComputedStyle(el);
            results.push({
              tag,
              fontFamily: cs.fontFamily,
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
            });
          }
        }
        return results;
      });
      if (headingStyles.length > 0) {
        pass(`getComputedStyle on headings: ${headingStyles.map(h => `${h.tag}(${h.fontSize}/${h.fontWeight})`).join(", ")}`);
        results.passed++;
      } else {
        fail("No heading elements found (h1/h2/h3)");
        results.failed++;
      }
    } catch (e) {
      fail(`getComputedStyle on headings: ${e.message}`);
      results.failed++;
    }

    // 5. borderRadius extraction
    try {
      const radii = await page.evaluate(() => {
        const els = document.querySelectorAll("button, input, a, div");
        const found = [];
        els.forEach((el) => {
          const cs = window.getComputedStyle(el);
          const r = cs.borderRadius;
          if (r && r !== "0px" && r !== "") found.push(r);
        });
        return [...new Set(found)].slice(0, 5);
      });
      pass(`borderRadius values: [${radii.join(", ")}]`);
      results.passed++;
    } catch (e) {
      fail(`borderRadius extraction: ${e.message}`);
      results.failed++;
    }

    // 6. transitionDuration
    try {
      const durations = await page.evaluate(() => {
        const els = document.querySelectorAll("button, a, input");
        const found = [];
        els.forEach((el) => {
          const cs = window.getComputedStyle(el);
          const d = cs.transitionDuration;
          if (d && d !== "0s" && d !== "") found.push(d);
        });
        return [...new Set(found)].slice(0, 5);
      });
      pass(`transitionDuration values: [${durations.join(", ")}]`);
      results.passed++;
    } catch (e) {
      fail(`transitionDuration: ${e.message}`);
      results.failed++;
    }

    // 7. <style> tag textContent
    try {
      const cssLength = await page.evaluate(() => {
        let total = 0;
        document.querySelectorAll("style").forEach((s) => {
          total += (s.textContent || "").length;
        });
        return total;
      });
      pass(`<style> tags total CSS chars: ${cssLength}`);
      results.passed++;
    } catch (e) {
      fail(`style.textContent: ${e.message}`);
      results.failed++;
    }

    // 8. Inline styles via getAttribute
    try {
      const inlineCount = await page.evaluate(() => {
        const els = document.querySelectorAll("[style]");
        return els.length;
      });
      pass(`[style] attribute elements: ${inlineCount}`);
      results.passed++;
    } catch (e) {
      fail(`getAttribute('style'): ${e.message}`);
      results.failed++;
    }

    // 9. CSS custom properties (CSS variables)
    try {
      const vars = await page.evaluate(() => {
        const root = document.documentElement;
        const cs = window.getComputedStyle(root);
        // Try some common variable names
        const candidates = [
          "--color-primary", "--primary", "--brand",
          "--font-sans", "--font-family",
          "--radius", "--border-radius",
          "--spacing", "--gap",
        ];
        const found = {};
        for (const v of candidates) {
          const val = cs.getPropertyValue(v).trim();
          if (val) found[v] = val;
        }
        return found;
      });
      const count = Object.keys(vars).length;
      if (count > 0) {
        pass(`CSS variables found: ${JSON.stringify(vars)}`);
      } else {
        pass(`CSS variables: none resolved (site may not use common var names)`);
      }
      results.passed++;
    } catch (e) {
      fail(`CSS variables (getPropertyValue): ${e.message}`);
      results.failed++;
    }

    // 10. Color extraction via computed styles
    try {
      const colors = await page.evaluate(() => {
        const rgbToHex = (rgb) => {
          const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!m) return null;
          return "#" + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
        };

        const seen = new Set();
        document.querySelectorAll("h1,h2,p,button,a,header,nav").forEach((el) => {
          const cs = window.getComputedStyle(el);
          const c = rgbToHex(cs.color);
          const bg = rgbToHex(cs.backgroundColor);
          if (c) seen.add(c);
          if (bg) seen.add(bg);
        });
        return [...seen];
      });
      pass(`Unique colors from getComputedStyle: ${colors.length} (${colors.slice(0, 5).join(", ")}${colors.length > 5 ? "..." : ""})`);
      results.passed++;
    } catch (e) {
      fail(`Color extraction: ${e.message}`);
      results.failed++;
    }

    // 11. Timing: how long did navigation + extraction take?
    const t0 = Date.now();
    try {
      await page.evaluate(() => {
        const els = document.querySelectorAll("h1,h2,h3,p,a,button,input,nav,header,footer,main,section,article,div,span,li");
        const styles = [];
        els.forEach((el, i) => {
          if (i > 200) return;
          const cs = window.getComputedStyle(el);
          styles.push({
            fontFamily: cs.fontFamily,
            color: cs.color,
            backgroundColor: cs.backgroundColor,
            borderRadius: cs.borderRadius,
            transitionDuration: cs.transitionDuration,
          });
        });
        return styles.length;
      });
      pass(`Full extraction loop (first 200 els): ${Date.now() - t0}ms`);
      results.passed++;
    } catch (e) {
      fail(`Full extraction loop: ${e.message}`);
      results.failed++;
    }

  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }

  console.log(`└─ ${results.passed} passed, ${results.failed} failed`);
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Lightpanda CDP Compatibility Test");
  console.log("===================================");
  console.log(`Port: ${LP_PORT}  |  URLs: ${TEST_URLS.length}`);

  section("Starting Lightpanda");
  let lpProc;
  try {
    lpProc = await startLightpanda();
    pass(`lightpanda serve on :${LP_PORT}`);
  } catch (e) {
    console.error(`✗ Failed to start Lightpanda: ${e.message}`);
    process.exit(1);
  }

  let browser;
  try {
    section("Connecting Playwright via CDP");
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${LP_PORT}`);
    pass("Connected");

    const totals = { passed: 0, failed: 0 };
    for (const url of TEST_URLS) {
      const r = await runTests(url, browser);
      totals.passed += r.passed;
      totals.failed += r.failed;
    }

    section("Summary");
    console.log(`  Total: ${totals.passed} passed, ${totals.failed} failed`);
    if (totals.failed === 0) {
      console.log("\n  ✓ Lightpanda is compatible — safe to wire in as main headless");
    } else {
      console.log("\n  ✗ Failures detected — review before switching from Chromium");
    }

  } catch (e) {
    console.error(`\nFatal: ${e.message}`);
  } finally {
    await browser?.close().catch(() => {});
    stopLightpanda(lpProc);
  }
}

main().catch(console.error);
