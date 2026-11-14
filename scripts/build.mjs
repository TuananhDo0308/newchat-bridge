import esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const externals = [
  'electron',
  'better-sqlite3-multiple-ciphers',
  'better-sqlite3',
  '@whiskeysockets/baileys',
  'zca-js',
];

async function buildMain() {
  console.log('Building Electron Main, Preload & Engine...');

  // 1. Build Main Process
  await esbuild.build({
    entryPoints: [path.resolve(rootDir, 'src/main/index.ts')],
    outfile: path.resolve(rootDir, 'dist/main/index.cjs'),
    bundle: true,
    platform: 'node',
    target: 'node24',
    format: 'cjs',
    external: externals,
    sourcemap: true,
  });

  // 2. Build Preload Script
  await esbuild.build({
    entryPoints: [path.resolve(rootDir, 'src/preload/index.ts')],
    outfile: path.resolve(rootDir, 'dist/preload/index.cjs'),
    bundle: true,
    platform: 'node',
    target: 'node24',
    format: 'cjs',
    external: ['electron'],
    sourcemap: true,
  });

  // 3. Build Engine Process (utilityProcess)
  await esbuild.build({
    entryPoints: [path.resolve(rootDir, 'src/engine/index.ts')],
    outfile: path.resolve(rootDir, 'dist/engine/index.cjs'),
    bundle: true,
    platform: 'node',
    target: 'node24',
    format: 'cjs',
    external: externals,
    sourcemap: true,
  });

  console.log(' Main, Preload & Engine built successfully!');
}

buildMain().catch((err) => {
  console.error('Build error:', err);
  process.exit(1);
});

