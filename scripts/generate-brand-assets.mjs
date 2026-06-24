/**
 * JOBKREATORS — Brand asset generator
 * -----------------------------------
 * Source of truth: public/brand/jk-logo-original.jpg (flat JPEG, white bg)
 *
 * This script converts the flat JPEG into a transparent PNG asset family:
 *   - real alpha conversion (near-white flooded to transparent, soft edge ramp)
 *   - frame removal (the source has a thin gray rectangle around the artwork)
 *   - dynamic split of the symbol (cube + tie) from the wordmark + tagline
 *   - "light" recolors for dark surfaces (navy -> cream, cyan -> brightened cyan)
 *   - square mark icons on a solid navy background for PWA / touch / favicon
 *
 * Re-run any time the source logo changes:
 *   node scripts/generate-brand-assets.mjs
 *
 * Measured brand colors (sampled from the source JPEG):
 *   navy  = #152A37   (dominant mark + wordmark ink; darkest pixel #00121B)
 *   cyan  = #5B9FBC   (tie stripe + tagline accent)
 */

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public/brand/jk-logo-original.jpg");
const OUT = path.join(ROOT, "public/brand");

// ---- Brand palette (measured from source) --------------------------------
const BRAND_NAVY = { r: 0x15, g: 0x2a, b: 0x37 }; // #152A37  -> --brand-navy
const CREAM = { r: 0xf4, g: 0xf5, b: 0xf0 }; // #F4F5F0  navy ink on dark surfaces
const CYAN_LIGHT = { r: 0x7c, g: 0xd4, b: 0xec }; // #7CD4EC  brightened cyan on dark

// The source artwork is wrapped in a ~3px gray frame at the very edge. Inset
// past it before doing anything else; a tight trim re-tightens afterwards.
const FRAME_INSET = 8;

// Near-white -> transparent. Hard cut where every channel is above 245 (per
// brief); a short ramp below that kills the white halo on anti-aliased edges.
const ALPHA_CLEAR = 246; // min channel >= this => fully transparent
const ALPHA_SOLID = 220; // min channel <= this => fully opaque

/** Read source, strip the frame, and produce a soft-alpha RGBA image. */
async function loadProcessed() {
  const meta = await sharp(SRC).metadata();
  const left = FRAME_INSET;
  const top = FRAME_INSET;
  const width = meta.width - FRAME_INSET * 2;
  const height = meta.height - FRAME_INSET * 2;

  const { data, info } = await sharp(SRC)
    .extract({ left, top, width, height })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;
  const C = info.channels;
  const out = Buffer.alloc(W * H * 4);

  for (let p = 0, q = 0; p < data.length; p += C, q += 4) {
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const minc = Math.min(r, g, b);

    let a;
    if (minc >= ALPHA_CLEAR) a = 0;
    else if (minc <= ALPHA_SOLID) a = 255;
    else a = Math.round(((ALPHA_CLEAR - minc) / (ALPHA_CLEAR - ALPHA_SOLID)) * 255);

    out[q] = r;
    out[q + 1] = g;
    out[q + 2] = b;
    out[q + 3] = a;
  }
  return { data: out, width: W, height: H };
}

/**
 * Recolor for a "light" (dark-surface) variant.
 *   mode "original" -> keep source RGB
 *   mode "light"    -> cyan ink (B notably higher than R) becomes brightened
 *                      cyan; everything else (navy ink) becomes cream.
 * Alpha is preserved so anti-aliased edges stay smooth.
 */
function recolor(img, mode) {
  if (mode === "original") return img;
  const { data, width, height } = img;
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    // The brand navy (#152A37) is itself a dark teal — its blue already
    // exceeds its red — so blue-dominance alone is not enough to find the
    // cyan accent. The accent is also BRIGHT (max channel ~190) while navy
    // ink is DARK (max channel ~55). Require both blue-dominance and
    // brightness so navy stays cream and only the cyan stripe + tagline
    // recolor to cyan.
    const isCyan = b - r > 28 && Math.max(r, g, b) > 120;
    const c = isCyan ? CYAN_LIGHT : CREAM;
    out[i] = c.r;
    out[i + 1] = c.g;
    out[i + 2] = c.b;
  }
  return { data: out, width, height };
}

/** Tight bounding box of all pixels with alpha above a threshold. */
function bbox(img, aMin = 10) {
  const { data, width, height } = img;
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > aMin) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return { x0: 0, y0: 0, x1: width - 1, y1: height - 1 };
  return { x0, y0, x1, y1 };
}

function crop(img, { x0, y0, x1, y1 }) {
  const { data, width } = img;
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const srcStart = ((y + y0) * width + x0) * 4;
    data.copy(out, y * w * 4, srcStart, srcStart + w * 4);
  }
  return { data: out, width: w, height: h };
}

function trim(img) {
  return crop(img, bbox(img));
}

/**
 * Find the largest interior empty horizontal band — the gap between the
 * symbol and the wordmark. Returns the row to split at, or null.
 */
function findSymbolSplit(img) {
  const { data, width, height } = img;
  const coverage = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    let c = 0;
    for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3] > 10) c++;
    coverage[y] = c / width;
  }
  const EMPTY = 0.004; // < 0.4% of row width is ink => empty
  let best = null;
  let start = -1;
  for (let y = 0; y <= height; y++) {
    const empty = y < height && coverage[y] < EMPTY;
    if (empty && start < 0) start = y;
    if (!empty && start >= 0) {
      const len = y - start;
      const interior = start > 0 && y < height; // ignore top/bottom margins
      if (interior && (!best || len > best.len)) best = { start, end: y - 1, len };
      start = -1;
    }
  }
  return best ? Math.round((best.start + best.end) / 2) : null;
}

/** sharp pipeline from a raw RGBA image. */
function toSharp(img) {
  return sharp(img.data, {
    raw: { width: img.width, height: img.height, channels: 4 },
  });
}

// The 31 KB source JPEG is small, so every downscale re-encodes soft edges.
// Two sharpness passes (applied here, after trim + alpha conversion, before the
// final PNG write): (1) upscale once with lanczos3 when the source long edge is
// under this threshold, so the target downscale samples from a crisper raster;
// (2) a mild unsharp mask on the way out.
const UPSCALE_FLOOR = 2000;
const SHARPEN = { sigma: 0.8, m1: 1, m2: 2 };

/** Save a transparent PNG, optionally resized to a target width. */
async function savePNG(img, file, { width } = {}) {
  let pipe = toSharp(img);
  const longEdge = Math.max(img.width, img.height);
  if (longEdge < UPSCALE_FLOOR) {
    // Upscale once (lanczos3) to ~2000px on the long edge before the target
    // downscale — reduces the re-encoding softness of going straight to size.
    pipe = pipe.resize({ width: Math.round((UPSCALE_FLOOR / longEdge) * img.width), kernel: "lanczos3" });
  }
  if (width) {
    pipe = pipe.resize({ width, kernel: "lanczos3" });
  }
  pipe = pipe.sharpen(SHARPEN);
  await pipe.png({ compressionLevel: 9 }).toFile(path.join(OUT, file));
}

/** Center the (already trimmed) mark on a square canvas. */
async function saveSquare(img, file, size, { background = null, padRatio = 0.1 } = {}) {
  const inner = Math.round(size * (1 - padRatio * 2));
  let pipe = toSharp(img);
  const longEdge = Math.max(img.width, img.height);
  if (longEdge < UPSCALE_FLOOR) {
    pipe = pipe.resize({ width: Math.round((UPSCALE_FLOOR / longEdge) * img.width), kernel: "lanczos3" });
  }
  const resized = await pipe
    .resize({ width: inner, height: inner, fit: "contain", kernel: "lanczos3",
      background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .sharpen(SHARPEN)
    .png()
    .toBuffer();

  let canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background
        ? { ...background, alpha: 1 }
        : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite([{ input: resized, gravity: "center" }]);

  if (background) canvas = canvas.flatten({ background });
  await canvas.png({ compressionLevel: 9 }).toFile(path.join(OUT, file));
}

async function main() {
  const processed = await loadProcessed();

  // Full lockup (trim outer whitespace / frame remnants).
  const lockup = trim(processed);

  // Split symbol vs wordmark on the original-color image, then reuse the
  // same crop boxes so original + light variants line up exactly.
  const splitY = findSymbolSplit(processed);
  if (splitY == null) throw new Error("Could not locate symbol/wordmark gap");

  const symbolRegion = trim(crop(processed, { x0: 0, y0: 0, x1: processed.width - 1, y1: splitY }));
  const wordmarkRegion = trim(
    crop(processed, { x0: 0, y0: splitY, x1: processed.width - 1, y1: processed.height - 1 })
  );

  const lockupLight = trim(recolor(processed, "light"));
  const symbolLight = trim(recolor(crop(processed, { x0: 0, y0: 0, x1: processed.width - 1, y1: splitY }), "light"));
  const wordmarkLight = trim(
    recolor(crop(processed, { x0: 0, y0: splitY, x1: processed.width - 1, y1: processed.height - 1 }), "light")
  );

  // a/b — full lockups (~1600px wide)
  await savePNG(lockup, "jk-lockup.png", { width: 1600 });
  await savePNG(lockupLight, "jk-lockup-light.png", { width: 1600 });

  // c/d — symbol only, square 1024
  await saveSquare(symbolRegion, "jk-mark.png", 1024, { padRatio: 0.08 });
  await saveSquare(symbolLight, "jk-mark-light.png", 1024, { padRatio: 0.08 });

  // e/f — wordmark + tagline, trimmed (~1400px wide)
  await savePNG(wordmarkRegion, "jk-wordmark.png", { width: 1400 });
  await savePNG(wordmarkLight, "jk-wordmark-light.png", { width: 1400 });

  // g–j — mark on brand-navy background (PWA / touch / favicon fallbacks)
  await saveSquare(symbolLight, "jk-mark-512.png", 512, { background: BRAND_NAVY, padRatio: 0.16 });
  await saveSquare(symbolLight, "jk-mark-180.png", 180, { background: BRAND_NAVY, padRatio: 0.16 });
  await saveSquare(symbolLight, "jk-mark-32.png", 32, { background: BRAND_NAVY, padRatio: 0.1 });
  await saveSquare(symbolLight, "jk-mark-16.png", 16, { background: BRAND_NAVY, padRatio: 0.08 });

  // Report
  const files = [
    "jk-lockup.png", "jk-lockup-light.png",
    "jk-mark.png", "jk-mark-light.png",
    "jk-wordmark.png", "jk-wordmark-light.png",
    "jk-mark-512.png", "jk-mark-180.png", "jk-mark-32.png", "jk-mark-16.png",
  ];
  console.log("Generated brand assets in public/brand/:\n");
  for (const f of files) {
    const stat = await fs.stat(path.join(OUT, f));
    const meta = await sharp(path.join(OUT, f)).metadata();
    console.log(
      `  ${f.padEnd(22)} ${`${meta.width}x${meta.height}`.padEnd(11)} ${(stat.size / 1024).toFixed(1)} KB`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
