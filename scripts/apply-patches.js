const fs = require('fs');
const path = require('path');

function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) return;
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Patched ${dest}`);
}

const root = process.cwd();
const srcBase = path.join(root, 'patches_src');
const destBase = path.join(root, 'node_modules');

// react-native-screens fix
copyIfExists(
  path.join(srcBase, 'react-native-screens', 'src', 'fabric', 'SearchBarNativeComponent.ts'),
  path.join(destBase, 'react-native-screens', 'src', 'fabric', 'SearchBarNativeComponent.ts')
);

console.log('apply-patches finished');
