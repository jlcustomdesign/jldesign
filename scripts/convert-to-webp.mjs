/**
 * convert-to-webp.mjs — Automatic WebP conversion + resize + EXIF rotation fix.
 *
 * Runs as a prebuild step. Does TWO things:
 * 1. Converts any JPG/PNG/BMP/TIFF → WebP (with auto-rotation & resize)
 * 2. Re-compresses existing oversized WebP files (> MAX_DIMENSION)
 *
 * Usage: node scripts/convert-to-webp.mjs [--resize-existing]
 */
import { readdir, stat, unlink, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const CONTENT_DIR = join(__dirname, '..', 'src', 'content');

// --- Config ---
const NON_WEBP_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.bmp', '.tiff']);
const QUALITY = 75;            // WebP quality (slightly more aggressive for perf)
const MAX_DIMENSION = 1600;    // Max width OR height — covers 2× retina at ~800px display

const RESIZE_EXISTING = process.argv.includes('--resize-existing');

let converted = 0;
let resized = 0;
let skipped = 0;
let errors = 0;

/**
 * Recursively walk a directory and yield file paths.
 */
async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

/**
 * Convert a non-WebP image to WebP with resize + rotation.
 */
async function convertFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!NON_WEBP_EXTENSIONS.has(ext)) return;

  const webpPath = filePath.replace(/\.[^.]+$/, '.webp');

  // Skip if .webp already exists and is newer than the source
  try {
    const srcStat = await stat(filePath);
    const dstStat = await stat(webpPath);
    if (dstStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++;
      return;
    }
  } catch {
    // .webp doesn't exist yet — proceed
  }

  try {
    await sharp(filePath)
      .rotate()                                       // Fix EXIF orientation
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    await unlink(filePath);
    console.log(`  ✓ ${basename(filePath)} → ${basename(webpPath)}`);
    converted++;
  } catch (err) {
    console.error(`  ✗ ${basename(filePath)}: ${err.message}`);
    errors++;
  }
}

/**
 * Re-compress and resize an existing WebP file if it exceeds MAX_DIMENSION.
 */
async function optimizeExistingWebp(filePath) {
  if (extname(filePath).toLowerCase() !== '.webp') return;

  try {
    const meta = await sharp(filePath).metadata();
    if (!meta.width || !meta.height) return;

    // Skip if already within limits
    if (meta.width <= MAX_DIMENSION && meta.height <= MAX_DIMENSION) return;

    const buf = await sharp(filePath)
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    await writeFile(filePath, buf);

    const oldKB = Math.round((await stat(filePath)).size / 1024);
    console.log(`  📐 ${basename(filePath)}  ${meta.width}×${meta.height} → ≤${MAX_DIMENSION}px  (${oldKB} KB)`);
    resized++;
  } catch {
    // Skip non-image files
  }
}

// --- Main ---
console.log('\n🖼️  WebP Converter + Optimizer\n');
console.log(`  Directory: ${PUBLIC_DIR}`);
console.log(`  Max dimension: ${MAX_DIMENSION}px | Quality: ${QUALITY}`);
if (RESIZE_EXISTING) console.log('  Mode: --resize-existing (will optimize all WebP files)');
console.log('');

const startTime = Date.now();

// Phase 1: Convert non-WebP files
for await (const filePath of walk(PUBLIC_DIR)) {
  await convertFile(filePath);
}

// Phase 2: Resize existing oversized WebP files (always runs)
for await (const filePath of walk(PUBLIC_DIR)) {
  if (extname(filePath).toLowerCase() === '.webp') {
    await optimizeExistingWebp(filePath);
  }
}

// Phase 3: Patch .mdoc content files to reference .webp
let patched = 0;
try {
  for await (const filePath of walk(CONTENT_DIR)) {
    if (!filePath.endsWith('.mdoc')) continue;
    const content = await readFile(filePath, 'utf-8');
    const updated = content.replace(/\.(jpg|jpeg|png)/gi, '.webp');
    if (updated !== content) {
      await writeFile(filePath, updated);
      console.log(`  📝 Patched: ${basename(filePath)}`);
      patched++;
    }
  }
} catch {
  // Content dir may not exist yet
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n  Done in ${elapsed}s — ${converted} converted, ${resized} resized, ${skipped} skipped, ${patched} patched, ${errors} errors\n`);

if (errors > 0) {
  process.exit(1);
}
