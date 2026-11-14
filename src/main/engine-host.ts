import { utilityProcess, UtilityProcess, app } from 'electron';
import path from 'node:path';

export class EngineHost {
  private process: UtilityProcess | null = null;
  private port: number = 41234;

  constructor(private enginePath: string) {}

  start(): void {
    console.log('[Main Host] Spawning Engine UtilityProcess from:', this.enginePath);

    this.process = utilityProcess.fork(this.enginePath, [], {
      serviceName: 'chat-bridge-engine',
      env: {
        ...process.env,
        ENGINE_PORT: String(this.port),
        APP_USER_DATA: app.getPath('userData'),
      },
    });

    this.process.on('spawn', () => {
      console.log('[Main Host] Engine UtilityProcess spawned successfully (PID:', this.process?.pid, ')');
    });

    this.process.on('exit', (code) => {
      console.warn(`[Main Host] Engine UtilityProcess exited with code: ${code}`);
      this.process = null;
    });

    // Handle messages from engine
    this.process.on('message', (message) => {
      console.log('[Engine -> Main]:', message);
    });
  }

  stop(): void {
    if (this.process) {
      console.log('[Main Host] Terminating Engine UtilityProcess...');
      this.process.kill();
      this.process = null;
    }
  }

  getPort(): number {
    return this.port;
  }
}

