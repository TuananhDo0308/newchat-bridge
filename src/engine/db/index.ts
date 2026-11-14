import Database from 'better-sqlite3-multiple-ciphers';
import { Kysely, SqliteDialect } from 'kysely';
import type { DatabaseSchema } from './schema.js';
import path from 'node:path';
import fs from 'node:fs';

export class DatabaseManager {
  private static db: Kysely<DatabaseSchema> | null = null;

  static init(userDataDir: string, encryptionKey?: string): Kysely<DatabaseSchema> {
    if (this.db) return this.db;

    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }

    const dbPath = path.resolve(userDataDir, 'chat_bridge.enc.db');
    console.log('[Engine DB] Initializing SQLite Database at:', dbPath);

    const nativeDb = new Database(dbPath);

    // Apply encryption cipher if key is provided
    if (encryptionKey) {
      nativeDb.pragma(`key = '${encryptionKey}'`);
      nativeDb.pragma(`cipher = 'chacha20'`);
    }

    nativeDb.pragma('journal_mode = WAL');
    nativeDb.pragma('foreign_keys = ON');

    // Create tables if not exist
    nativeDb.exec(`
      CREATE TABLE IF NOT EXISTS channels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        account_name TEXT,
        phone_number TEXT,
        last_sync_at TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        channel TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        content TEXT NOT NULL,
        direction TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS outbox (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id TEXT NOT NULL,
        destination TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL,
        attempts INTEGER DEFAULT 0,
        next_retry_at TEXT,
        created_at TEXT NOT NULL
      );
    `);

    this.db = new Kysely<DatabaseSchema>({
      dialect: new SqliteDialect({
        database: nativeDb,
      }),
    });

    return this.db;
  }

  static get(): Kysely<DatabaseSchema> {
    if (!this.db) throw new Error('Database not initialized! Call DatabaseManager.init() first.');
    return this.db;
  }
}

