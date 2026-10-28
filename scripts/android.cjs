const { spawn, execFileSync } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');
const { bin: cli } = require('@react-native-community/cli');

const projectRoot = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const portOption = args.findIndex(
  arg => arg === '--port' || arg.startsWith('--port='),
);
const port =
  portOption < 0
    ? process.env.RCT_METRO_PORT || '8081'
    : args[portOption].split('=')[1] || args[portOption + 1];
const children = new Set();
let stopping = false;
let metroMonitor;

function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  clearInterval(metroMonitor);
  for (const child of children) {
    if (!child.pid) continue;
    try {
      if (process.platform === 'win32') {
        execFileSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
          stdio: 'ignore',
        });
      } else {
        // Stop the CLI and its Metro workers / Gradle process together.
        process.kill(-child.pid, 'SIGTERM');
      }
    } catch (error) {
      if (error.code !== 'ESRCH') console.error(error.message);
    }
  }
}

function run(commandArgs) {
  const child = spawn(process.execPath, [cli, ...commandArgs], {
    cwd: projectRoot,
    stdio: 'inherit',
    detached: process.platform !== 'win32',
  });
  children.add(child);
  child.on('exit', () => children.delete(child));
  child.on('error', error => {
    console.error(error.message);
    stop(1);
  });
  return child;
}

function metroStatus(waitingForStartup = false) {
  return new Promise((resolve, reject) => {
    const request = http.get(`http://127.0.0.1:${port}/status`, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        body += chunk;
      });
      response.on('error', reject);
      response.on('end', () => {
        const root = response.headers['x-react-native-project-root'];
        if (
          body !== 'packager-status:running' ||
          !root ||
          path.resolve(root) !== projectRoot
        ) {
          reject(
            new Error(
              `Port ${port} is used by another server/project. Pass --port <number>.`,
            ),
          );
        } else {
          resolve(true);
        }
      });
    });
    request.setTimeout(1000, () => {
      const error = new Error('Metro status timed out.');
      error.code = 'ETIMEDOUT';
      request.destroy(error);
    });
    request.on('error', error => {
      if (
        error.code === 'ECONNREFUSED' ||
        (waitingForStartup && ['ETIMEDOUT', 'ECONNRESET'].includes(error.code))
      )
        resolve(false);
      else reject(error);
    });
  });
}

async function main() {
  if (
    !Number.isInteger(Number(port)) ||
    Number(port) < 1 ||
    Number(port) > 65535
  ) {
    throw new Error('Metro port must be an integer between 1 and 65535.');
  }

  // Preserve CLI help and explicit builds that do not need Metro.
  if (
    args.includes('--help') ||
    args.includes('-h') ||
    args.includes('--no-packager')
  ) {
    run(['run-android', ...args]).on('exit', code => stop(code ?? 1));
    return;
  }

  const running = await metroStatus();
  if (stopping) return;
  if (!running) {
    console.log(`[android] Starting Metro on port ${port} in this terminal...`);
    run([
      'start',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--no-interactive',
    ]).on('exit', code => {
      if (!stopping) {
        console.error('[android] Metro stopped.');
        stop(code || 1);
      }
    });
    const deadline = Date.now() + 120000;
    while (!stopping && !(await metroStatus(true))) {
      if (Date.now() > deadline)
        throw new Error('Metro did not become ready within 120 seconds.');
      await delay(250);
    }
    if (stopping) return;
  } else {
    console.log(`[android] Using this project's Metro on port ${port}.`);
    console.log(
      '[android] Metro logs remain in its original terminal; this session monitors the server.',
    );
    // The build CLI exits after installation. Keep this session alive while an
    // external Metro serves the app, and report if that server becomes unavailable.
    metroMonitor = setInterval(() => {
      metroStatus()
        .then(isRunning => {
          if (!stopping && !isRunning) {
            console.error(
              '[android] Existing Metro stopped. Run pnpm android again.',
            );
            stop(1);
          }
        })
        .catch(error => {
          if (!stopping) {
            console.error(`[android] ${error.message}`);
            stop(1);
          }
        });
    }, 2000);
  }

  run(['run-android', ...args, '--no-packager', '--port', String(port)]).on(
    'exit',
    code => {
      if (stopping) return;
      if (code !== 0) stop(code ?? 1);
      else
        console.log(
          '[android] App launched. Session active; press Ctrl+C to exit.',
        );
    },
  );
}

process.on('SIGINT', () => stop(130));
process.on('SIGTERM', () => stop(143));
main().catch(error => {
  if (!stopping) console.error(`[android] ${error.message}`);
  stop(1);
});
