const { EventEmitter } = require('node:events');
const path = require('node:path');

describe('Android command with an existing Metro', () => {
  const originalArgv = process.argv;
  const originalExitCode = process.exitCode;
  let child;
  let signals;
  let serverRoot;
  let kill;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    process.argv = ['node', 'scripts/android.cjs'];
    signals = {};
    serverRoot = path.resolve(__dirname, '..');
    child = new EventEmitter();
    child.pid = 987654;
    kill = jest.spyOn(process, 'kill').mockImplementation(() => true);
    const originalOn = process.on.bind(process);
    jest.spyOn(process, 'on').mockImplementation((event, listener) => {
      if (event === 'SIGINT' || event === 'SIGTERM') signals[event] = listener;
      else originalOn(event, listener);
      return process;
    });
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.doMock('@react-native-community/cli', () => ({ bin: 'fake-cli.js' }));
    jest.doMock('node:child_process', () => ({
      spawn: jest.fn(() => child),
      execFileSync: jest.fn(),
    }));
    jest.doMock('node:http', () => ({
      get: jest.fn((url, callback) => {
        const response = new EventEmitter();
        response.headers = { 'x-react-native-project-root': serverRoot };
        response.setEncoding = jest.fn();
        callback(response);
        response.emit('data', 'packager-status:running');
        response.emit('end');
        const request = new EventEmitter();
        request.setTimeout = jest.fn();
        return request;
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    process.argv = originalArgv;
    process.exitCode = originalExitCode;
  });

  async function launch() {
    require('../scripts/android.cjs');
    await Promise.resolve();
  }

  test('keeps the session alive after installation until Ctrl+C', async () => {
    await launch();
    child.emit('exit', 0);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Session active'),
    );
    expect(jest.getTimerCount()).toBe(1);
    await jest.advanceTimersByTimeAsync(4000);
    expect(jest.getTimerCount()).toBe(1);
    expect(kill).not.toHaveBeenCalled();

    signals.SIGINT();
    expect(jest.getTimerCount()).toBe(0);
    expect(process.exitCode).toBe(130);
    expect(kill).not.toHaveBeenCalled();
  });

  test('exits with an error when Metro no longer serves this project', async () => {
    await launch();
    child.emit('exit', 0);
    serverRoot = '/another-project';
    await jest.advanceTimersByTimeAsync(2000);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('another server/project'),
    );
    expect(jest.getTimerCount()).toBe(0);
    expect(process.exitCode).toBe(1);
    expect(kill).not.toHaveBeenCalled();
  });

  test('cleans up the monitor after a failed build without stopping external Metro', async () => {
    await launch();
    child.emit('exit', 1);

    expect(jest.getTimerCount()).toBe(0);
    expect(process.exitCode).toBe(1);
    expect(kill).not.toHaveBeenCalled();
  });
});
