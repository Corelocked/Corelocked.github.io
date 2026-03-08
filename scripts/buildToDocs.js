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

  // Try rename with retries. On Windows EPERM/EACCES or cross-device errors, fall back to copy+remove.
  const tryRename = () => {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        fs.renameSync(buildDir, docsDir);
        return true;
      } catch (err) {
        if (attempt < maxAttempts) {
          // small delay and retry
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150 * attempt);
          continue;
        }
        throw err;
      }
    }
    return false;
  };

  try {
    tryRename();
  } catch (err) {
    // If rename failed due to permissions, locked files, or EXDEV (cross-device), fallback to copy
    if (err && (err.code === 'EPERM' || err.code === 'EACCES' || err.code === 'EXDEV')) {
      console.warn('Rename failed, falling back to copy+remove due to:', err.code);
      // Node 16.7+ has fs.cpSync
      if (typeof fs.cpSync === 'function') {
        fs.cpSync(buildDir, docsDir, { recursive: true });
      } else {
        // Fallback manual copy
        const copyRecursive = (src, dest) => {
          const stat = fs.statSync(src);
          if (stat.isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest);
            for (const entry of fs.readdirSync(src)) {
              copyRecursive(path.join(src, entry), path.join(dest, entry));
            }
          } else {
            fs.copyFileSync(src, dest);
          }
        };
        copyRecursive(buildDir, docsDir);
      }

      // Remove the original build directory
      rmDir(buildDir);
    } else {
      throw err;
    }
  }

  // Create .no-jekyll file to ensure GitHub Pages serves static files
  const noJekyllPath = path.join(docsDir, '.no-jekyll');
  if (!fs.existsSync(noJekyllPath)) fs.writeFileSync(noJekyllPath, '', 'utf8');

  console.log('Moved build/ to docs/ and created .no-jekyll');
} catch (err) {
  console.error(err);
  process.exit(1);
}
