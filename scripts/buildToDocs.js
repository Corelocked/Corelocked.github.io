const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const buildDir = path.join(cwd, 'build');
const docsDir = path.join(cwd, 'docs');

function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

try {
  if (!fs.existsSync(buildDir)) {
    console.error('No build directory found at', buildDir);
    process.exit(1);
  }

  // Remove any existing docs directory and move build -> docs
  rmDir(docsDir);
  fs.renameSync(buildDir, docsDir);

  // Create .no-jekyll file to ensure GitHub Pages serves static files
  const noJekyllPath = path.join(docsDir, '.no-jekyll');
  if (!fs.existsSync(noJekyllPath)) fs.writeFileSync(noJekyllPath, '', 'utf8');

  console.log('Moved build/ to docs/ and created .no-jekyll');
} catch (err) {
  console.error(err);
  process.exit(1);
}
