import { create } from 'zustand';
import type { SheetColumn, SheetLayoutPreset } from '../components/settings/sheets/sheetsData.js';

export type SettingsTab =
  | 'setup'
  | 'accounts'
  | 'chats'
  | 'delivery'
  | 'sheets'
  | 'history'
  | 'blocked'
  | 'noise'
  | 'preferences'
  | 'health'
  | 'data'
  // Backward compatibility aliases
  | 'appearance'
  | 'dropnoise'
  | 'destinations'
  | 'system';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'orange' | 'emerald' | 'blue' | 'violet';
export type DensityMode = 'compact' | 'comfortable' | 'spacious';
export type AppLanguage = 'en';
export type HistoryRange = '3m' | '6m' | '12m' | 'all';

export interface DropNoiseConfig {
  botPings: boolean;
  otpCodes: boolean;
  marketing: boolean;
  reactions: boolean;
  edits: boolean;
  stickers: boolean;
  stories: boolean;
  largeFiles: boolean;
  linkTrackers: boolean;
  sensitivity: 'relaxed' | 'balanced' | 'strict';
}

export interface MarginceConfig {
  enabled: boolean;
  endpoint: string;
  apiKey: string;
  syncFrequency: 'realtime' | '1m' | '5m';
}

export interface SheetsConfig {
  enabled: boolean;
  spreadsheetId: string;
  sheetName: string;
  autoSync: boolean;
  googleAccount: string;
  oauthConnected: boolean;
  selectedFileName: string;
  createMode: 'new' | 'existing';
  columns: SheetColumn[];
  preset: SheetLayoutPreset;
  includeContactsTab: boolean;
}

interface AppState {
  appVersion: string;
  isEngineReady: boolean;
  theme: ThemeMode;
  language: AppLanguage;
  isWizardOpen: boolean;
  isAddAccountModalOpen: boolean;
  addAccountInitialChannel?: 'zalo' | 'whatsapp';
  isSettingsOpen: boolean;
  settingsTab: SettingsTab;

  // Customization & Settings State
  accentColor: AccentColor;
  density: DensityMode;
  soundNotifications: boolean;
  historyRange: HistoryRange;
  blockedContacts: string[];
  blockedPhrases: string[];

  dropNoiseConfig: DropNoiseConfig;
  marginceConfig: MarginceConfig;
  sheetsConfig: SheetsConfig;

  // Actions
  setAppVersion: (v: string) => void;
  setEngineReady: (ready: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  openWizard: () => void;
  closeWizard: () => void;
  openAddAccountModal: (channel?: 'zalo' | 'whatsapp') => void;
  closeAddAccountModal: () => void;
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
  toggleSettings: (tab?: SettingsTab) => void;
  setSettingsTab: (tab: SettingsTab) => void;

  setAccentColor: (color: AccentColor) => void;
  setDensity: (density: DensityMode) => void;
  setSoundNotifications: (enabled: boolean) => void;
  setHistoryRange: (range: HistoryRange) => void;
  toggleBlockedContact: (contactId: string) => void;
  addBlockedPhrase: (phrase: string) => void;
  removeBlockedPhrase: (phrase: string) => void;

  toggleDropNoiseRule: (rule: keyof Omit<DropNoiseConfig, 'sensitivity'>) => void;
  setDropNoiseRules: (rules: Partial<DropNoiseConfig>) => void;
  setDropNoiseSensitivity: (sensitivity: 'relaxed' | 'balanced' | 'strict') => void;
  updateMarginceConfig: (cfg: Partial<MarginceConfig>) => void;
  updateSheetsConfig: (cfg: Partial<SheetsConfig>) => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatbridge_theme') as ThemeMode;
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  }
  return 'dark';
};

const getSavedLanguage = (): AppLanguage => {
  return 'en';
};

const getSavedDropNoise = (): DropNoiseConfig => {
  const defaults: DropNoiseConfig = {
    botPings: true,
    otpCodes: true,
    marketing: true,
    reactions: true,
    edits: true,
    stickers: true,
    stories: true,
    largeFiles: true,
    linkTrackers: true,
    sensitivity: 'balanced',
  };
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('chatbridge_dropnoise');
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {}
  }
  return defaults;
};

const getSavedMargince = (): MarginceConfig => {
  const defaults: MarginceConfig = {
    enabled: true,
    endpoint: 'https://api.margince.com/v1/integrations/chatbridge/stream',
    apiKey: 'mg_live_9f82d1c7a840e6b54132890',
    syncFrequency: 'realtime',
  };
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('chatbridge_margince');
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {}
  }
  return defaults;
};

const getSavedSheets = (): SheetsConfig => {
  const defaults: SheetsConfig = {
    enabled: true,
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    sheetName: 'ChatBridge_Transcripts',
    autoSync: true,
    googleAccount: 'tuananh@gradion.ai',
    oauthConnected: true,
    selectedFileName: 'ChatBridge_Transcripts_2026',
    createMode: 'new',
    columns: ['time', 'network', 'chat', 'sender', 'direction', 'text'],
    preset: 'single',
    includeContactsTab: true,
  };
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('chatbridge_sheets');
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {}
  }
  return defaults;
};

const getSavedBlockedPhrases = (): string[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('chatbridge_blocked_phrases');
      if (saved) return JSON.parse(saved);
    } catch {}
  }
  return ['promo', 'discount', 'loan offer', 'spam alert'];
};

const normalizeTab = (tab: SettingsTab): SettingsTab => {
  if (tab === 'appearance') return 'preferences';
  if (tab === 'dropnoise') return 'noise';
  if (tab === 'destinations') return 'delivery';
  if (tab === 'setup' || tab === 'chats') return 'accounts';
  if (tab === 'history' || tab === 'health' || tab === 'data' || tab === 'system' || tab === 'blocked') return 'preferences';
  return tab;
};

export const useAppStore = create<AppState>((set, get) => ({
  appVersion: '1.0.4 Desktop Core',
  isEngineReady: true,
  theme: getInitialTheme(),
  language: getSavedLanguage(),
  // On every page reload, start wizard fresh from step 1
  isWizardOpen: true,
  isAddAccountModalOpen: false,
  addAccountInitialChannel: undefined,
  isSettingsOpen: false,
  settingsTab: 'accounts',

  accentColor: (typeof window !== 'undefined' && (localStorage.getItem('chatbridge_accent') as AccentColor)) || 'orange',
  density: (typeof window !== 'undefined' && (localStorage.getItem('chatbridge_density') as DensityMode)) || 'comfortable',
  soundNotifications: true,
  historyRange: 'all',
  blockedContacts: [],
  blockedPhrases: getSavedBlockedPhrases(),

  dropNoiseConfig: getSavedDropNoise(),
  marginceConfig: getSavedMargince(),
  sheetsConfig: getSavedSheets(),

  setAppVersion: (appVersion) => set({ appVersion }),
  setEngineReady: (isEngineReady) => set({ isEngineReady }),
  openWizard: () => set({ isWizardOpen: true }),
  closeWizard: () => set({ isWizardOpen: false }),
  openAddAccountModal: (channel) => set({ isAddAccountModalOpen: true, addAccountInitialChannel: channel }),
  closeAddAccountModal: () => set({ isAddAccountModalOpen: false, addAccountInitialChannel: undefined }),

  openSettings: (tab = 'accounts') => set({ isSettingsOpen: true, settingsTab: normalizeTab(tab) }),
  closeSettings: () => set({ isSettingsOpen: false }),
  toggleSettings: (tab) => {
    const { isSettingsOpen } = get();
    if (isSettingsOpen) {
      set({ isSettingsOpen: false });
    } else {
      set({ isSettingsOpen: true, settingsTab: normalizeTab(tab || 'accounts') });
    }
  },
  setSettingsTab: (settingsTab) => set({ settingsTab: normalizeTab(settingsTab) }),

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('chatbridge_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  },

  setTheme: (theme) => {
    localStorage.setItem('chatbridge_theme', theme);
    const resolvedDark =
      theme === 'dark' ||
      (theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (resolvedDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  setLanguage: (language: AppLanguage = 'en') => {
    localStorage.setItem('chatbridge_language', 'en');
    set({ language: 'en' });
  },

  setAccentColor: (accentColor) => {
    localStorage.setItem('chatbridge_accent', accentColor);
    set({ accentColor });
  },

  setDensity: (density) => {
    localStorage.setItem('chatbridge_density', density);
    set({ density });
  },

  setSoundNotifications: (soundNotifications) => set({ soundNotifications }),
  setHistoryRange: (historyRange) => set({ historyRange }),

  toggleBlockedContact: (contactId) => {
    const current = get().blockedContacts;
    const next = current.includes(contactId)
      ? current.filter((id) => id !== contactId)
      : [...current, contactId];
    set({ blockedContacts: next });
  },

  addBlockedPhrase: (phrase) => {
    const trimmed = phrase.trim().toLowerCase();
    if (!trimmed) return;
    const current = get().blockedPhrases;
    if (current.includes(trimmed)) return;
    const next = [...current, trimmed];
    localStorage.setItem('chatbridge_blocked_phrases', JSON.stringify(next));
    set({ blockedPhrases: next });
  },

  removeBlockedPhrase: (phrase) => {
    const next = get().blockedPhrases.filter((p) => p !== phrase);
    localStorage.setItem('chatbridge_blocked_phrases', JSON.stringify(next));
    set({ blockedPhrases: next });
  },

  toggleDropNoiseRule: (rule) => {
    const next = {
      ...get().dropNoiseConfig,
      [rule]: !get().dropNoiseConfig[rule],
    };
    localStorage.setItem('chatbridge_dropnoise', JSON.stringify(next));
    set({ dropNoiseConfig: next });
  },

  setDropNoiseRules: (rules) => {
    const next = { ...get().dropNoiseConfig, ...rules };
    localStorage.setItem('chatbridge_dropnoise', JSON.stringify(next));
    set({ dropNoiseConfig: next });
  },

  setDropNoiseSensitivity: (sensitivity) => {
    const next = { ...get().dropNoiseConfig, sensitivity };
    localStorage.setItem('chatbridge_dropnoise', JSON.stringify(next));
    set({ dropNoiseConfig: next });
  },

  updateMarginceConfig: (cfg) => {
    const next = { ...get().marginceConfig, ...cfg };
    localStorage.setItem('chatbridge_margince', JSON.stringify(next));
    set({ marginceConfig: next });
  },

  updateSheetsConfig: (cfg) => {
    const next = { ...get().sheetsConfig, ...cfg };
    localStorage.setItem('chatbridge_sheets', JSON.stringify(next));
    set({ sheetsConfig: next });
  },
}));
