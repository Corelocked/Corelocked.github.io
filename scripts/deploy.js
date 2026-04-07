const { execSync } = require('child_process');

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

function getOutput(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

try {
  const currentBranch = getOutput('git rev-parse --abbrev-ref HEAD');

  run('git add docs');

  let hasDocsChanges = true;
  try {
    execSync('git diff --cached --quiet --exit-code', { stdio: 'ignore' });
    hasDocsChanges = false;
  } catch {
    // There are staged docs changes, continue with commit.
  }

  if (hasDocsChanges) {
    run('git commit -m "chore: deploy docs [skip ci]"');
    console.log(`Committed docs changes on ${currentBranch}.`);
  } else {
    console.log('No docs changes to deploy.');
  }

  console.log(`Next step: git push origin ${currentBranch}`);
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
