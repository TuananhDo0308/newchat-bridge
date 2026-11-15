import { contextBridge, ipcRenderer } from 'electron';
import type { BridgeAPI, Network } from '../shared/types.js';

const bridgeApi: BridgeAPI = {
  getAppVersion: () => ipcRenderer.invoke('bridge:get-app-version'),
  getStatus: () => ipcRenderer.invoke('bridge:get-status'),
  getSyncSnapshot: () => ipcRenderer.invoke('bridge:get-sync-snapshot'),
  getMessages: (chatId?: string) => ipcRenderer.invoke('bridge:get-messages', chatId),
  toggleChatSelection: (id: string, selected: boolean) =>
    ipcRenderer.invoke('bridge:toggle-chat-selection', id, selected),
  connectSource: (network: Network) => ipcRenderer.invoke('bridge:connect-source', network),
  disconnectSource: (network: Network) => ipcRenderer.invoke('bridge:disconnect-source', network),
  sendMessage: (chatId: string, text: string) => ipcRenderer.invoke('bridge:send-message', chatId, text),
  openExternal: (url: string) => ipcRenderer.invoke('bridge:open-external', url),
};

contextBridge.exposeInMainWorld('bridge', bridgeApi);
