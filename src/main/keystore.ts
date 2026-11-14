import { safeStorage } from 'electron';

export class KeyStore {
  static isAvailable(): boolean {
    return safeStorage.isEncryptionAvailable();
  }

  static encrypt(plainText: string): string {
    if (!this.isAvailable()) {
      throw new Error('OS Keystore (safeStorage) is not available on this system.');
    }
    const buffer = safeStorage.encryptString(plainText);
    return buffer.toString('base64');
  }

  static decrypt(encryptedBase64: string): string {
    if (!this.isAvailable()) {
      throw new Error('OS Keystore (safeStorage) is not available on this system.');
    }
    const buffer = Buffer.from(encryptedBase64, 'base64');
    return safeStorage.decryptString(buffer);
  }
}

