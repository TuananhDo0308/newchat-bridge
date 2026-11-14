import { Generated } from 'kysely';

export interface ChannelTable {
  id: string; // 'zalo' | 'whatsapp'
  name: string;
  status: string;
  account_name: string | null;
  phone_number: string | null;
  last_sync_at: string | null;
  updated_at: string;
}

export interface MessageTable {
  id: string;
  channel: string;
  sender_name: string;
  sender_id: string;
  content: string;
  direction: string;
  status: string;
  created_at: string;
}

export interface OutboxTable {
  id: Generated<number>;
  message_id: string;
  destination: string;
  payload: string;
  status: string;
  attempts: number;
  next_retry_at: string | null;
  created_at: string;
}

export interface DatabaseSchema {
  channels: ChannelTable;
  messages: MessageTable;
  outbox: OutboxTable;
}

