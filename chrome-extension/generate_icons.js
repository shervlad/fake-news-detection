const fs = require('fs');
const { createCanvas } = require('canvas');

// Icon sizes needed for Chrome extension
const sizes = [16, 32, 48, 128];

// Create directory if it doesn't exist
if (!fs.existsSync('./images')) {
  fs.mkdirSync('./images');
}

// Generate icons for each size
sizes.forEach(size => {
  // Create canvas with the specified size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#4285F4'; // Google blue
  ctx.fillRect(0, 0, size, size);

  // Draw a "FN" text (Fake News)
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FN', size / 2, size / 2);

  // Draw a red slash across (indicating "no fake news")
  ctx.strokeStyle = '#EA4335'; // Google red
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  ctx.moveTo(size * 0.2, size * 0.2);
  ctx.lineTo(size * 0.8, size * 0.8);
  ctx.stroke();

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`./images/icon-${size}.png`, buffer);
  
  console.log(`Generated icon-${size}.png`);
});

console.log('All icons generated successfully!');

