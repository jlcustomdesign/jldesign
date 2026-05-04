import { existsSync } from "node:fs";
import { extname, join } from "node:path";

const CONVERTIBLE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".bmp", ".tiff"]);

export function preferWebp(publicPath?: string | null): string | undefined {
  if (!publicPath) return undefined;

  const cleanPath = publicPath.split("?")[0];
  const ext = extname(cleanPath).toLowerCase();
  if (!CONVERTIBLE_EXTENSIONS.has(ext)) return publicPath;

  const webpPath = cleanPath.replace(/\.[^.]+$/, ".webp");
  const relativePublicPath = webpPath.startsWith("/") ? webpPath.slice(1) : webpPath;
  const absolutePath = join(process.cwd(), "public", relativePublicPath);

  return existsSync(absolutePath) ? webpPath : publicPath;
}