import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting PDF Generation for JL Custom Design Brandbook...');
  
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: "new",
  });
  
  const page = await browser.newPage();
  
  // Set viewport for high quality
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
  });

  const url = 'http://localhost:4321/brandbook?print=true';
  
  console.log(`🌐 Navigating to ${url}...`);
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 90000,
    });
    
    // Wait for all GSAP/ScrollTrigger settle and variable fonts to render
    console.log('⏳ Waiting for assets to settle...');
    await new Promise(r => setTimeout(r, 5000));
    
    console.log('📄 Generating PDF (Multi-page A4)...');
    
    await page.pdf({
      path: 'brandbook-jl-custom.pdf',
      format: 'A4',
      landscape: true, // Switched to landscape for a more formal brandbook feel
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true, // Respect CSS @media print breaks if any
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('✅ Multi-page Landscape PDF successfully created: brandbook-jl-custom.pdf');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    console.log('💡 Tip: Make sure your local dev server (npm run dev) is running at http://localhost:4321');
  } finally {
    await browser.close();
  }
})();
