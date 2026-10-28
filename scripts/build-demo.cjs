const { spawnSync } = require('node:child_process');
const path = require('node:path');

const architectures = process.argv[2] || 'arm64-v8a,x86_64';
const allowed = new Set(['arm64-v8a', 'x86_64', 'armeabi-v7a', 'x86']);
if (!architectures.split(',').every(value => allowed.has(value))) {
  process.stderr.write(
    'Invalid architectures. Use arm64-v8a or x86_64, separated by commas.\n',
  );
  process.exit(1);
}
const result = spawnSync(
  process.platform === 'win32' ? 'gradlew.bat' : './gradlew',
  [
    ':app:assembleDemo',
    `-PreactNativeArchitectures=${architectures}`,
    '--console=plain',
  ],
  {
    cwd: path.join(__dirname, '..', 'android'),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);
if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
}
process.exit(result.status ?? 1);
