/**
 * content.ts — Pure helpers for turning admin form data into repo files.
 * No I/O here; just slugs, frontmatter (de)serialization and image encoding.
 */
import YAML from 'yaml';
import sharp from 'sharp';

const DIACRITICS: Record<string, string> = {
  ă: 'a', â: 'a', î: 'i', ș: 's', ş: 's', ț: 't', ţ: 't',
  Ă: 'a', Â: 'a', Î: 'i', Ș: 's', Ş: 's', Ț: 't', Ţ: 't',
};

/** Romanian-aware slugify: diacritics → ascii, lowercase, hyphenated. */
export function slugify(input: string): string {
  return (input || '')
    .replace(/[ăâîșşțţĂÂÎȘŞȚŢ]/g, (c) => DIACRITICS[c] || c)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

/** Build a `.mdoc` (markdown + YAML frontmatter) file body. */
export function serializeEntry(frontmatter: Record<string, unknown>, body = ''): string {
  // Drop empty/undefined keys so the YAML stays clean.
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(frontmatter)) {
    if (v !== undefined && v !== null && v !== '') clean[k] = v;
  }
  const fm = YAML.stringify(clean).trimEnd();
  const content = (body || '').trim();
  return `---\n${fm}\n---\n${content ? `\n${content}\n` : '\n'}`;
}

/** Parse a `.mdoc`/markdown file into { data, body }. */
export function parseEntry(raw: string): { data: Record<string, any>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };
  let data: Record<string, any> = {};
  try {
    data = YAML.parse(match[1]) || {};
  } catch {
    data = {};
  }
  return { data, body: (match[2] || '').trim() };
}

/** Decode a `data:` URL (or raw base64) into a Buffer + detected extension. */
export function decodeDataUrl(dataUrl: string): { buffer: Buffer; mime: string } {
  const m = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl);
  if (m) return { buffer: Buffer.from(m[2], 'base64'), mime: m[1] };
  return { buffer: Buffer.from(dataUrl, 'base64'), mime: 'application/octet-stream' };
}

/**
 * Normalize an uploaded image to web-friendly WebP (auto-rotate, cap at 2560px).
 * Returns the encoded bytes; the caller decides the stored path/filename.
 */
export async function toWebp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}

/** Convert "Familia Flucuș" → "familia-flucus" with a uniqueness suffix when needed. */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const root = slugify(base);
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}
