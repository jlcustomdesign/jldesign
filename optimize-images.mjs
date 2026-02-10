import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
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

async function processImages() {
    ensureDir('public/Images/optimized');
    
    for (const img of images) {
        try {
            if (!fs.existsSync(img.input)) {
                console.error(`Input file not found: ${img.input}`);
                continue;
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

processImages();
