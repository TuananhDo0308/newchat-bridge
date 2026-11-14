import { create } from 'zustand';

export type SettingsTab = 'appearance' | 'accounts' | 'dropnoise' | 'destinations' | 'system';
export type AccentColor = 'orange' | 'emerald' | 'blue' | 'violet';
export type DensityMode = 'compact' | 'comfortable' | 'spacious';

export interface DropNoiseConfig {
  botPings: boolean;
  otpCodes: boolean;
  marketing: boolean;
  reactions: boolean;
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
  isWizardOpen: boolean;
  isSettingsOpen: boolean;
  settingsTab: SettingsTab;

  // Customization & Settings State
  accentColor: AccentColor;
  density: DensityMode;
  soundNotifications: boolean;
  dropNoiseConfig: DropNoiseConfig;
  marginceConfig: MarginceConfig;
  sheetsConfig: SheetsConfig;

  // Actions
  setAppVersion: (v: string) => void;
  setEngineReady: (ready: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  openWizard: () => void;
  closeWizard: () => void;
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
  setSettingsTab: (tab: SettingsTab) => void;

  setAccentColor: (color: AccentColor) => void;
  setDensity: (density: DensityMode) => void;
  setSoundNotifications: (enabled: boolean) => void;
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

const getSavedDropNoise = (): DropNoiseConfig => {
  const defaults: DropNoiseConfig = {
    botPings: true,
    otpCodes: true,
    marketing: true,
    reactions: true,
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

export const useAppStore = create<AppState>((set, get) => ({
  appVersion: '1.0.4 Desktop Core',
  isEngineReady: true,
  theme: getInitialTheme(),
  // On every page reload, start wizard fresh from step 1
  isWizardOpen: true,
  isSettingsOpen: false,
  settingsTab: 'appearance',

  accentColor: (typeof window !== 'undefined' && (localStorage.getItem('chatbridge_accent') as AccentColor)) || 'orange',
  density: (typeof window !== 'undefined' && (localStorage.getItem('chatbridge_density') as DensityMode)) || 'comfortable',
  soundNotifications: true,
  dropNoiseConfig: getSavedDropNoise(),
  marginceConfig: getSavedMargince(),
  sheetsConfig: getSavedSheets(),

  setAppVersion: (appVersion) => set({ appVersion }),
  setEngineReady: (isEngineReady) => set({ isEngineReady }),
  openWizard: () => set({ isWizardOpen: true }),
  closeWizard: () => set({ isWizardOpen: false }),

  openSettings: (tab = 'appearance') => set({ isSettingsOpen: true, settingsTab: tab }),
  closeSettings: () => set({ isSettingsOpen: false }),
  setSettingsTab: (settingsTab) => set({ settingsTab }),

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

  setAccentColor: (accentColor) => {
    localStorage.setItem('chatbridge_accent', accentColor);
    set({ accentColor });
  },

  setDensity: (density) => {
    localStorage.setItem('chatbridge_density', density);
    set({ density });
  },

  setSoundNotifications: (soundNotifications) => set({ soundNotifications }),

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
