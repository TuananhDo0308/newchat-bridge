export const networks = ['zalo', 'whatsapp', 'whatsapp-biz', 'fake'] as const;
export type Network = (typeof networks)[number];

export interface Person {
  accountId: string;
  displayName: string;
  phone?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  network: Network;
  account: string;
  thread: string;
  threadKind: 'dm' | 'group';
  direction: 'inbound' | 'outbound';
  time: string;
  from: Person;
  to: Person[];
  participants?: Person[];
  text: string;
  placeholder?: string;
  truncated?: boolean;
  isSynced?: boolean;
  isDropNoise?: boolean;
  dropNoiseReason?: string;
  metadata?: {
    type?: 'text' | 'audio' | 'image' | 'file' | 'sticker' | 'location' | 'property';
    mediaUrl?: string;
    caption?: string;
    fileName?: string;
    fileSize?: string;
    duration?: string;
    waveform?: number[];
    location?: {
      title: string;
      address: string;
      latitude?: number;
      longitude?: number;
    };
    stickerUrl?: string;
    propertySpecs?: {
      visitors?: string;
      buildingAge?: string;
      temperature?: string;
    };
    photos?: string[];
  };
}

export type ChatSummary = Pick<Message, 'id' | 'time' | 'direction' | 'text' | 'placeholder'> & {
  isDropNoise?: boolean;
};

export interface SourceState {
  network: Network;
  account?: string;
  name?: string;
  state: 'needs-login' | 'connecting' | 'connected' | 'taken-over' | 'error';
  reason: string;
  qr?: string;
}

export interface Chat {
  id: string;
  network: Network;
  account: string;
  thread: string;
  name: string;
  kind: 'dm' | 'group';
  pinOrder?: number;
  selected: boolean;
  avatar?: string;
  unreadCount?: number;
  isTyping?: boolean;
  latest?: ChatSummary | null;
  phoneNumber?: string;
  aboutStatus?: string;
  memberCount?: number;
}

export interface AccountScope {
  network: Network;
  account?: string;
}

export interface RailAccount extends AccountScope {
  key: string;
  initials: string;
  name: string;
  state?: SourceState['state'];
  detail?: string;
  avatarUrl?: string;
  unreadTotal?: number;
}

export interface SyncSnapshot {
  sources: SourceState[];
  chats: Chat[];
  savedCount: number | null;
  history?: any;
  autoHistory?: any;
}

export interface EngineStatus {
  online: boolean;
  port: number;
  uptime: number;
  activeSources: number;
  totalMessagesSaved: number;
  outboxPending: number;
}

export interface BridgeAPI {
  getStatus: () => Promise<EngineStatus>;
  getSyncSnapshot: () => Promise<SyncSnapshot>;
  getMessages: (chatId?: string) => Promise<Message[]>;
  toggleChatSelection: (id: string, selected: boolean) => Promise<{ success: boolean; chat?: Chat }>;
  connectSource: (network: Network) => Promise<{ success: boolean; qr?: string }>;
  disconnectSource: (network: Network) => Promise<{ success: boolean }>;
  sendMessage: (chatId: string, text: string) => Promise<Message>;
  getAppVersion: () => Promise<string>;
}
