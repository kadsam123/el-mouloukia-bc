import { spawnSync } from 'node:child_process';

const REQUIRED_COMMANDS = [
  { label: 'Security diagnostics', cmd: 'npm', args: ['run', 'diag:security'] },
  { label: 'Test suite', cmd: 'npm', args: ['run', 'test'] },
  { label: 'Production build', cmd: 'npm', args: ['run', 'build'] }
];

function runCommand(step) {
  console.log(`\n[preflight] ${step.label}`);
  console.log(`[preflight] Running: ${step.cmd} ${step.args.join(' ')}`);

  const result = spawnSync(step.cmd, step.args, {
    stdio: 'inherit',
    shell: true
  });

  if (result.status !== 0) {
    throw new Error(`${step.label} failed with exit code ${result.status}`);
  }
}

try {
  console.log('[preflight] Release preflight started');

  REQUIRED_COMMANDS.forEach(runCommand);

  console.log('\n[preflight] Release preflight passed');
  process.exit(0);
} catch (error) {
  console.error(`\n[preflight] Release preflight failed: ${error.message}`);
  process.exit(1);
}
