const fs = require('fs');
const path = require('path');

const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/qZkAAAAASUVORK5CYII=',
  'base64',
);

const iconNames = ['arrow-down.png', 'arrow-up.png', 'tick.png', 'close.png'];
const themeDirs = [
  path.join(__dirname, '..', 'node_modules', 'react-native-dropdown-picker', 'src', 'themes', 'light', 'icons'),
  path.join(__dirname, '..', 'node_modules', 'react-native-dropdown-picker', 'src', 'themes', 'dark', 'icons'),
];

for (const dir of themeDirs) {
  fs.mkdirSync(dir, { recursive: true });

  for (const iconName of iconNames) {
    const filePath = path.join(dir, iconName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, transparentPng);
    }
  }
}

console.log('react-native-dropdown-picker icon assets restored.');
