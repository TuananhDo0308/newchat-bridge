import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function runDev() {
  console.log('Starting Vite Dev Server...');

  // Start Vite dev server
  const viteProcess = spawn('npx', ['vite', '--host'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  // Build main once
  console.log('Building Electron processes for development...');
  const buildProcess = spawn('node', ['scripts/build.mjs'], {
    cwd: rootDir,
    stdio: 'inherit',
  });

  buildProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Initial build failed');
      return;
    }

    console.log('Starting Electron...');
    const electronProcess = spawn('npx', ['electron', '.'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        VITE_DEV_SERVER_URL: 'http://localhost:5173',
      },
    });

    electronProcess.on('close', () => {
      viteProcess.kill();
      process.exit(0);
    });
  });
}

runDev();

