const sharp = require('sharp');
const path = require('path');

async function optimizeLogo() {
  try {
    await sharp('public/logo.jpg')
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile('public/logo.png');

    console.log('Logo optimized successfully!');
  } catch (error) {
    console.error('Error optimizing logo:', error);
  }
}

optimizeLogo(); 