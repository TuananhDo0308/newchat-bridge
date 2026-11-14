import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { EngineHost } from './engine-host.js';
import { KeyStore } from './keystore.js';

let mainWindow: BrowserWindow | null = null;
let engineHost: EngineHost | null = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.warn('Another instance is already running. Quitting.');
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    console.log('[Main Process] Starting NewChat Bridge App...');

    // 1. Start Engine (utilityProcess)
    const engineScript = path.resolve(__dirname, '../engine/index.cjs');
    engineHost = new EngineHost(engineScript);
    engineHost.start();

    // 2. Setup IPC Handlers
    setupIpcHandlers();

    // 3. Create Desktop Window
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    if (engineHost) {
      engineHost.stop();
    }
  });
}

function createWindow(): void {
  const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
  const preloadPath = path.resolve(__dirname, '../preload/index.cjs');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'Chat Bridge',
    backgroundColor: '#f7faf8',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL!);
  } else {
    mainWindow.loadFile(path.resolve(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupIpcHandlers(): void {
  const getPort = () => (engineHost ? engineHost.getPort() : 41234);

  ipcMain.handle('bridge:get-app-version', () => app.getVersion());

  ipcMain.handle('bridge:get-status', async () => {
    try {
      const res = await fetch(`http://127.0.0.1:${getPort()}/v1/status`);
      return await res.json();
    } catch {
      return { online: false, port: 41234, uptime: 0, activeSources: 0, totalMessagesSaved: 0, outboxPending: 0 };
    }
  });

  ipcMain.handle('bridge:get-sync-snapshot', async () => {
    try {
      const res = await fetch(`http://127.0.0.1:${getPort()}/v1/sync`);
      return await res.json();
    } catch {
      return { sources: [], chats: [], savedCount: 0 };
    }
  });

  ipcMain.handle('bridge:get-messages', async (_event, chatId?: string) => {
    try {
      const url = chatId
        ? `http://127.0.0.1:${getPort()}/v1/sync/messages?chatId=${encodeURIComponent(chatId)}`
        : `http://127.0.0.1:${getPort()}/v1/sync/messages`;
      const res = await fetch(url);
      return await res.json();
    } catch {
      return [];
    }
  });

  ipcMain.handle('bridge:toggle-chat-selection', async (_event, id: string, selected: boolean) => {
    try {
      const res = await fetch(`http://127.0.0.1:${getPort()}/v1/sync/chats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, selected }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  });

  ipcMain.handle('bridge:connect-source', async (_event, network: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:${getPort()}/v1/sync/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  });

  ipcMain.handle('bridge:disconnect-source', async (_event, network: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:${getPort()}/v1/sync/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  });

  ipcMain.handle('bridge:send-message', async (_event, chatId: string, text: string) => {
    const res = await fetch(`http://127.0.0.1:${getPort()}/v1/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, text }),
    });
    return await res.json();
  });

  ipcMain.handle('bridge:keystore-status', () => {
    return { available: KeyStore.isAvailable() };
  });
}
