import { createFastifyServer } from './server.js';
import { DatabaseManager } from './db/index.js';
import path from 'node:path';
import os from 'node:os';

async function bootstrapEngine() {
  const port = parseInt(process.env.ENGINE_PORT || '41234', 10);
  const userDataDir = process.env.APP_USER_DATA || path.resolve(os.homedir(), '.newchat-bridge');

  console.log('[Engine Process] Starting Engine with PID:', process.pid);

  // 1. Initialize SQLite + Kysely
  try {
    DatabaseManager.init(userDataDir);
    console.log('[Engine Process] Database initialized.');
  } catch (err) {
    console.warn('[Engine Process] Could not initialize native SQLite cipher, falling back to in-memory mode:', err);
  }

  // 2. Start Loopback HTTP Server
  const server = createFastifyServer();

  try {
    await server.listen({ port, host: '127.0.0.1' });
    console.log(`[Engine Process] Fastify server listening on http://127.0.0.1:${port}`);

    // If spawned by Electron utilityProcess, send ready signal
    if (process.parentPort) {
      process.parentPort.postMessage({ type: 'ENGINE_READY', port });
    }
  } catch (err) {
    console.error('[Engine Process] Failed to bind server:', err);
    process.exit(1);
  }
}

bootstrapEngine();

