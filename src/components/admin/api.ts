/** api.ts — client helpers for the admin React app. */

export interface Entry {
  slug: string;
  data: Record<string, any>;
  body: string;
}

export interface AllData {
  portfolio: Entry[];
  blog: Entry[];
  categories: Entry[];
  offers: Entry[];
}

export async function fetchData(): Promise<AllData> {
  const res = await fetch('/api/admin/data');
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Eroare la încărcare');
  return res.json();
}

export async function saveEntry(payload: {
  collection: 'portfolio' | 'blog' | 'categories' | 'offers';
  slug?: string;
  data: Record<string, any>;
  body?: string;
}): Promise<{ slug: string; viewUrl?: string }> {
  const res = await fetch('/api/admin/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Salvarea a eșuat');
  return json;
}

export async function deleteEntry(collection: string, slug: string): Promise<void> {
  const res = await fetch('/api/admin/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collection, slug }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Ștergerea a eșuat');
}

/**
 * Read a File, downscale it on the client (cap longest side) and return a
 * JPEG data URL. Keeps the upload payload small; the server re-encodes to WebP.
 */
export function fileToDataUrl(file: File, maxSide = 2000, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxSide || height > maxSide) {
        const scale = maxSide / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas indisponibil'));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Imagine invalidă'));
    };
    img.src = url;
  });
}
