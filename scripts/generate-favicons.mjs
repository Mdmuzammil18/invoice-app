import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 32, 48, 72, 96, 144, 192, 256, 384, 512];
const publicPath = path.join(__dirname, '../public');

// Create favicons using canvas
function generateFavicons() {
  console.log('Generating favicons...');
  
  try {
    // Generate PNG favicons
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw a colored background
      ctx.fillStyle = '#646cff';
      ctx.fillRect(0, 0, size, size);
      
      // Draw a white border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = Math.max(1, size / 16);
      ctx.strokeRect(
        ctx.lineWidth / 2, 
        ctx.lineWidth / 2, 
        size - ctx.lineWidth, 
        size - ctx.lineWidth
      );
      
      // Draw document lines
      const lineHeight = size / 8;
      const startY = size / 4;
      
      for (let i = 0; i < 3; i++) {
        const y = startY + (i * lineHeight * 1.5);
        const lineWidth = size * 0.5;
        const padding = (size - lineWidth) / 2;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(
          padding,
          y,
          lineWidth,
          lineHeight / 2
        );
      }
      
      // Save the PNG
      const buffer = canvas.toBuffer('image/png');
      const filename = `favicon-${size}x${size}.png`;
      fs.writeFileSync(path.join(publicPath, filename), buffer);
      
      console.log(`Generated ${filename}`);
    }
    
    // Copy the 32x32 favicon as favicon.ico
    const favicon32 = fs.readFileSync(path.join(publicPath, 'favicon-32x32.png'));
    fs.writeFileSync(path.join(publicPath, 'favicon.ico'), favicon32);
    
    console.log('Favicon generation complete!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

// Run the function
generateFavicons();
