/// <reference types="vite/client" />
import type { BridgeAPI } from '../../shared/types.js';

declare global {
  interface Window {
    bridge?: BridgeAPI;
  }
}

