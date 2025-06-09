const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const distDir = path.resolve(__dirname, '../dist');
const outputZip = path.resolve(__dirname, '../fake-news-detector-extension.zip');
const manifestPath = path.resolve(distDir, 'manifest.json');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Read manifest to get version
let version = '1.0.0';
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  version = manifest.version;
  console.log(`Packaging extension version ${version}`);
} catch (error) {
  console.error('Error reading manifest.json:', error);
  process.exit(1);
}

// Create zip file
try {
  // Remove existing zip if it exists
  if (fs.existsSync(outputZip)) {
    fs.unlinkSync(outputZip);
  }
  
  // Create zip using command line (more reliable than node zip libraries)
  const command = process.platform === 'win32'
    ? `cd "${distDir}" && powershell Compress-Archive -Path * -DestinationPath "${outputZip}"`
    : `cd "${distDir}" && zip -r "${outputZip}" *`;
  
  execSync(command);
  
  console.log(`Successfully packaged extension to: ${outputZip}`);
} catch (error) {
  console.error('Error creating zip file:', error);
  process.exit(1);
}

