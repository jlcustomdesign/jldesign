/**
 * /oferta/<slug>.pdf — generates a real, downloadable PDF of the offer using
 * headless Chrome (no browser print dialog). Dev uses the local Chrome; prod
 * uses @sparticuz/chromium bundled for Vercel.
 */
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { IS_DEV } from '../../lib/admin/config';

export const prerender = false;

export async function GET(ctx: APIContext) {
  const slug = ctx.params.slug!;
  let data: any = null;
  if (IS_DEV) {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const raw = await fs.readFile(path.join(process.cwd(), 'src/content/offers', `${slug}.json`), 'utf-8').catch(() => null);
    data = raw ? JSON.parse(raw) : null;
  } else {
    const offers = await getCollection('offers');
    data = offers.find((o) => o.id === slug)?.data ?? null;
  }
  if (!data) return new Response('Ofertă inexistentă', { status: 404 });
  const origin = new URL(ctx.request.url).origin;
  const pageUrl = `${origin}/oferta/${slug}`;

  let browser: any;
  try {
    const puppeteer = (await import('puppeteer-core')).default;
    let launchOpts: any;
    if (IS_DEV) {
      const execPath =
        process.env.CHROME_PATH ||
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
      launchOpts = { executablePath: execPath, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
    } else {
      // Production (Vercel): download the full chromium pack (binary + shared
      // libs) at runtime — avoids the function-size limit and the missing-libnss3
      // problem of bundling the binary.
      const chromium = (await import('@sparticuz/chromium-min')).default;
      const PACK = 'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar';
      launchOpts = {
        executablePath: await chromium.executablePath(PACK),
        args: chromium.args,
        headless: true,
        defaultViewport: chromium.defaultViewport,
      };
    }

    browser = await puppeteer.launch(launchOpts);
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.emulateMediaType('print');
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      landscape: true,
      format: 'A4',
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    await browser.close();
    browser = null;

    const name = `Oferta-${data.clientName || slug}`.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${name}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    if (browser) try { await browser.close(); } catch {}
    return new Response(`Eroare la generarea PDF: ${e?.message || e}`, { status: 500 });
  }
}
