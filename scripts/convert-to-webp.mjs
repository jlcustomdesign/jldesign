/**
 * convert-to-webp.mjs — Automatic WebP conversion with EXIF rotation fix.
 *
 * Runs as a prebuild step. Finds ALL jpg/jpeg/png files in public/,
 * converts them to .webp using sharp (which auto-rotates based on EXIF),
 * then deletes the originals.
 *
 * Usage: node scripts/convert-to-webp.mjs
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.bmp', '.tiff']);
const QUALITY = 80;

let converted = 0;
let skipped = 0;
let errors = 0;

/**
 * Recursively walk a directory and yield file paths.
 */
async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
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
 * Convert a single image file to WebP.
 * - sharp.rotate() with no args auto-rotates based on EXIF orientation.
 * - This fixes the 90° rotation issue caused by phone photos.
 */
async function convertFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!EXTENSIONS.has(ext)) return;

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
      .rotate()          // Auto-rotate based on EXIF orientation
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    // Delete the original after successful conversion
    await unlink(filePath);

    const name = basename(filePath);
    console.log(`  ✓ ${name} → ${basename(webpPath)}`);
    converted++;
  } catch (err) {
    console.error(`  ✗ ${basename(filePath)}: ${err.message}`);
    errors++;
  }
}

// --- Main ---
console.log('\n🖼️  WebP Auto-Converter (with EXIF rotation fix)\n');
console.log(`  Scanning: ${PUBLIC_DIR}`);

const startTime = Date.now();

for await (const filePath of walk(PUBLIC_DIR)) {
  await convertFile(filePath);
}

// --- Phase 2: Patch content files (.mdoc) to reference .webp ---
const CONTENT_DIR = join(__dirname, '..', 'src', 'content');
const { readFile, writeFile } = await import('node:fs/promises');
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
console.log(`\n  Done in ${elapsed}s — ${converted} images converted, ${skipped} skipped, ${patched} content files patched, ${errors} errors\n`);

if (errors > 0) {
  process.exit(1);
}
