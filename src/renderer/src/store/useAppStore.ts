import { create } from 'zustand';

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

export type AccentColor = 'orange' | 'emerald' | 'blue' | 'violet';
export type DensityMode = 'compact' | 'comfortable' | 'spacious';
export type AppLanguage = 'en' | 'vi';
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
}

interface AppState {
  appVersion: string;
  isEngineReady: boolean;
  theme: 'light' | 'dark';
  language: AppLanguage;
  isWizardOpen: boolean;
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
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: AppLanguage) => void;
  openWizard: () => void;
  closeWizard: () => void;
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
  setDropNoiseSensitivity: (sensitivity: 'relaxed' | 'balanced' | 'strict') => void;
  updateMarginceConfig: (cfg: Partial<MarginceConfig>) => void;
  updateSheetsConfig: (cfg: Partial<SheetsConfig>) => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatbridge_theme') as 'light' | 'dark';
    if (saved === 'light' || saved === 'dark') return saved;
  }
  return 'dark';
};

const getSavedLanguage = (): AppLanguage => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatbridge_language') as AppLanguage;
    if (saved === 'en' || saved === 'vi') return saved;
  }
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
  return ['khuyen mai', 'quang cao', 'vay von', 'spam alert'];
};

const normalizeTab = (tab: SettingsTab): SettingsTab => {
  if (tab === 'appearance') return 'preferences';
  if (tab === 'dropnoise') return 'noise';
  if (tab === 'destinations') return 'delivery';
  if (tab === 'system') return 'data';
  return tab;
};

export const useAppStore = create<AppState>((set, get) => ({
  appVersion: '1.0.4 Desktop Core',
  isEngineReady: true,
  theme: getInitialTheme(),
  language: getSavedLanguage(),
  // On every page reload, start wizard fresh from step 1
  isWizardOpen: true,
  isSettingsOpen: false,
  settingsTab: 'setup',

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

  openSettings: (tab = 'setup') => set({ isSettingsOpen: true, settingsTab: normalizeTab(tab) }),
  closeSettings: () => set({ isSettingsOpen: false }),
  toggleSettings: (tab) => {
    const { isSettingsOpen } = get();
    if (isSettingsOpen) {
      set({ isSettingsOpen: false });
    } else {
      set({ isSettingsOpen: true, settingsTab: normalizeTab(tab || 'setup') });
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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  setLanguage: (language) => {
    localStorage.setItem('chatbridge_language', language);
    set({ language });
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
