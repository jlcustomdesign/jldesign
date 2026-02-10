import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Manual Optimized Images (Keep existing logic)
const manualImages = [
    {
        input: 'public/Images/Proiecte-JL Custom Design-02.jpg',
        output: 'public/Images/optimized/Proiecte-JL-Custom-Design-02.webp',
        width: 1920,
        quality: 80
    },
    {
        input: 'public/Images/Proiecte-JL Custom Design-09.jpg',
        output: 'public/Images/optimized/Proiecte-JL-Custom-Design-09.webp',
        width: 1920,
        quality: 80
    },
    {
        input: 'public/Images/Gemini_Generated_Image_s64ql8s64ql8s64q.png',
        output: 'public/Images/optimized/Gemini_Generated_Image_s64ql8s64ql8s64q.webp',
        width: 1920,
        quality: 80
    },
    {
        input: 'public/Images/hero-image.jpg',
        output: 'public/Images/optimized/hero-image.webp',
        width: 1920,
        quality: 80
    }
];

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

async function processManualImages() {
    ensureDir('public/Images/optimized');
    console.log('--- Processing Manual Images ---');
    
    for (const img of manualImages) {
        try {
            if (!fs.existsSync(img.input)) {
                // Skip silently if input missing (might already be optimized or moved)
                continue;
            }
            // Check if output exists to avoid re-work
            if (fs.existsSync(img.output)) {
                 // console.log(`Skipping ${img.output}, already exists.`);
                 // continue;
            }

            console.log(`Processing ${img.input}...`);
            await sharp(img.input)
                .resize({ width: img.width, withoutEnlargement: true })
                .webp({ quality: img.quality })
                .toFile(img.output);
            
            console.log(`Saved to ${img.output}`);
        } catch (error) {
            console.error(`Error processing ${img.input}:`, error);
        }
    }
}

// Recursive Portfolio Optimization
async function processPortfolioAssets(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await processPortfolioAssets(filePath);
        } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
            // Check file size (greater than 500KB needed optimization)
            if (stat.size > 500 * 1024) { 
                console.log(`Optimizing heavy asset: ${filePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
                
                try {
                    // Create a temporary buffer
                    const buffer = await sharp(filePath)
                        .resize({ width: 1920, withoutEnlargement: true })
                        .jpeg({ quality: 80, mozjpeg: true }) // Convert/Compress to JPEG for compatibility
                        .toBuffer();

                    // Overwrite original file
                    fs.writeFileSync(filePath, buffer);
                    
                    const newSize = fs.statSync(filePath).size;
                    console.log(`-> Reduced to ${(newSize / 1024 / 1024).toFixed(2)} MB`);
                } catch (err) {
                    console.error(`Failed to optimize ${filePath}:`, err);
                }
            }
        }
    }
}

async function main() {
    await processManualImages();
    
    console.log('\n--- Scanning Portfolio Assets for Optimization ---');
    const portfolioDir = 'public/assets/portfolio';
    if (fs.existsSync(portfolioDir)) {
        await processPortfolioAssets(portfolioDir);
    } else {
        console.warn(`Directory ${portfolioDir} not found.`);
    }
    console.log('\nDone.');
}

main();
