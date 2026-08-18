const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

const projectRoot = path.resolve(__dirname, '..');
const input = path.join(projectRoot, 'assets', 'icon.png');
const output = path.join(projectRoot, 'assets', 'icon.ico');

if (!fs.existsSync(input)) {
  console.error('Input PNG not found:', input);
  process.exit(1);
}

console.log('Generating ICO from', input);
pngToIco(input)
  .then(buffer => {
    fs.writeFileSync(output, buffer);
    console.log('Wrote', output);
  })
  .catch(err => {
    console.error('Failed to generate ICO:', err);
    process.exit(1);
  });
