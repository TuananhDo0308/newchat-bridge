import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { FileSpreadsheet, Eye, Plus, ExternalLink, Sun, Moon, Laptop, Globe, Check } from 'lucide-react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import marginceLogo from '../../assets/margince-logo.svg';
import {
  useAppStore,
  SettingsTab,
  AccentColor,
} from '../../store/useAppStore.js';
import { useChatBridgeStore } from '../../store/useChatBridgeStore.js';
import { GoogleSheetsStudio } from './sheets/GoogleSheetsStudio.js';
import { AddAccountModal } from '../wizard/AddAccountModal.js';
import { UnlinkConfirmModal } from './UnlinkConfirmModal.js';
import { UnlinkSheetsConfirmModal, UnlinkSheetsTarget } from './UnlinkSheetsConfirmModal.js';
import { Step2DropNoisePreview } from '../wizard/Step2DropNoise.js';
import { AmbientWavesBackground } from '../wizard/AmbientWavesBackground.js';
import type { SheetColumn, SheetLayoutPreset } from './sheets/sheetsData.js';

// SVG Icons for Navigation & Controls
function IconUsers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconSend(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconFilter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function IconPalette(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconGoogleSheets(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M30 4H12a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V14L30 4z" fill="#0F9D58" />
      <path d="M30 4v10h10L30 4z" fill="#87CEAC" />
      <path d="M14 22h20v18H14V22z" fill="#FFFFFF" fillOpacity="0.25" />
      <path d="M14 26h20v2H14v-2zm0 6h20v2H14v-2zm0 6h20v2H14v-2z" fill="#FFFFFF" />
      <path d="M22 22h4v18h-4V22z" fill="#FFFFFF" fillOpacity="0.6" />
    </svg>
  );
}

function IconEye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// 4 Active Settings Sections
interface SectionItem {
  id: SettingsTab;
  title: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge: (state: any) => string;
}

const SETTINGS_SECTIONS: SectionItem[] = [
  {
    id: 'accounts',
    title: 'Accounts',
    subtitle: 'Zalo, WhatsApp Business sessions and pairings',
    icon: IconUsers,
    badge: (s) => `${s.sourcesCount} Connected`,
  },
  {
    id: 'delivery',
    title: 'Where to Send',
    subtitle: 'Margince CRM webhook & Google Sheets output',
    icon: IconSend,
    badge: (s) => (s.crmActive ? '2 Targets Ready' : '1 Target Ready'),
  },
  {
    id: 'noise',
    title: 'Drop Noise',
    subtitle: 'Rules for messages that should not be forwarded',
    icon: IconFilter,
    badge: (s) => `${s.activeDropCount} Rules Active`,
  },
  {
    id: 'preferences',
    title: 'Preferences',
    subtitle: 'Appearance and language configuration',
    icon: IconPalette,
    badge: (s) => (s.theme === 'dark' ? 'Dark Mode' : s.theme === 'light' ? 'Light Mode' : 'System Theme'),
  },
];

const DROP_NOISE_OPTIONS: {
  key: 'reactions' | 'edits' | 'stickers' | 'stories';
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    key: 'reactions',
    label: 'Emoji Reactions',
    desc: 'Discard single emoji reactions (thumbs up, heart, smile)',
    icon: '👍',
  },
  {
    key: 'edits',
    label: 'Message Edit History',
    desc: 'Keep only final amended text to prevent duplicate records',
    icon: '✏️',
  },
  {
    key: 'stickers',
    label: 'Animated Stickers',
    desc: 'Drop visual stickers without contextual message text',
    icon: '🎭',
  },
  {
    key: 'stories',
    label: 'Status & Story Replies',
    desc: 'Ignore ephemeral 24h story reply chatter',
    icon: '📱',
  },
];

export function SettingsScreen() {
  const closeSettings = useAppStore((s) => s.closeSettings);
  const settingsTab = useAppStore((s) => s.settingsTab);
  const setSettingsTab = useAppStore((s) => s.setSettingsTab);
  const openWizard = useAppStore((s) => s.openWizard);
  const openAddAccountModal = useAppStore((s) => s.openAddAccountModal);

  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const accentColor = useAppStore((s) => s.accentColor);
  const setAccentColor = useAppStore((s) => s.setAccentColor);
  const density = useAppStore((s) => s.density);
  const setDensity = useAppStore((s) => s.setDensity);
  const soundNotifications = useAppStore((s) => s.soundNotifications);
  const setSoundNotifications = useAppStore((s) => s.setSoundNotifications);

  const blockedPhrases = useAppStore((s) => s.blockedPhrases);
  const addBlockedPhrase = useAppStore((s) => s.addBlockedPhrase);
  const removeBlockedPhrase = useAppStore((s) => s.removeBlockedPhrase);

  const dropNoiseConfig = useAppStore((s) => s.dropNoiseConfig);
  const toggleDropNoiseRule = useAppStore((s) => s.toggleDropNoiseRule);
  const setDropNoiseRules = useAppStore((s) => s.setDropNoiseRules);
  const setDropNoiseSensitivity = useAppStore((s) => s.setDropNoiseSensitivity);

  const marginceConfig = useAppStore((s) => s.marginceConfig);
  const updateMarginceConfig = useAppStore((s) => s.updateMarginceConfig);
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  const sources = useChatBridgeStore((s) => s.sources);

  // Connected accounts state with multi-step unlink confirmation
  const [connectedAccounts, setConnectedAccounts] = useState({
    zalo: {
      connected: true,
      name: 'Sale Personal',
      phone: '+84 988 889 999',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    },
    whatsapp: {
      connected: true,
      name: 'Sale Gradion',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    },
  });
  const [unlinkTarget, setUnlinkTarget] = useState<'zalo' | 'whatsapp' | null>(null);
  const [selectedLang, setSelectedLang] = useState<'en' | 'vi'>('en');

  // Mobile responsive view state: 'menu' (shows aside list) or 'content' (shows active tab pane)
  const [mobileView, setMobileView] = useState<'menu' | 'content'>('menu');

  // Local state for interactive verification
  const [showApiKey, setShowApiKey] = useState(false);
  const [crmTesting, setCrmTesting] = useState(false);
  const [crmTestResult, setCrmTestResult] = useState<string | null>(null);
  const [sheetsTesting, setSheetsTesting] = useState(false);
  const [sheetsTestResult, setSheetsTestResult] = useState<string | null>(null);
  const [showSheetsStudio, setShowSheetsStudio] = useState(false);
  const [studioConfig, setStudioConfig] = useState<{
    isReadOnly: boolean;
    sheetName?: string;
    sheetId?: string;
    preset?: SheetLayoutPreset;
    columns?: SheetColumn[];
  }>({
    isReadOnly: false,
  });

  const [connectedSheets, setConnectedSheets] = useState([
    {
      id: '1C7719830219842189014',
      name: 'APAC_Client_Communications_Log',
      tab: 'Transcripts',
      status: 'Active Target',
      preset: 'network' as SheetLayoutPreset,
      columns: ['time', 'network', 'chat', 'sender', 'text'] as SheetColumn[],
    },
    {
      id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      name: 'ChatBridge_Transcripts_2026',
      tab: 'Messages',
      status: 'Syncing',
      preset: 'single' as SheetLayoutPreset,
      columns: ['time', 'network', 'chat', 'direction', 'sender', 'text'] as SheetColumn[],
    },
    {
      id: '1A98BCx2309kLMNz8943184',
      name: 'Q4_Enterprise_Sales_Pipeline',
      tab: 'Deals',
      status: 'Syncing',
      preset: 'monthly' as SheetLayoutPreset,
      columns: ['time', 'chat', 'sender', 'phone', 'text'] as SheetColumn[],
    },
  ]);
  const [unlinkSheetsTarget, setUnlinkSheetsTarget] = useState<UnlinkSheetsTarget | null>(null);

  // Keyboard shortcut: Esc to return to chats
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSettings]);

  const activeDropCount = [
    dropNoiseConfig.reactions,
    dropNoiseConfig.edits,
    dropNoiseConfig.stickers,
    dropNoiseConfig.stories,
  ].filter(Boolean).length;

  const handleSelectAllDropNoise = () => {
    setDropNoiseRules({
      reactions: true,
      edits: true,
      stickers: true,
      stories: true,
    });
  };

  const handleClearAllDropNoise = () => {
    setDropNoiseRules({
      reactions: false,
      edits: false,
      stickers: false,
      stories: false,
    });
  };

  const currentSection = SETTINGS_SECTIONS.find((s) => s.id === settingsTab) || SETTINGS_SECTIONS[0];

  const badgeContext = {
    sourcesCount: (connectedAccounts.zalo.connected ? 1 : 0) + (connectedAccounts.whatsapp.connected ? 1 : 0),
    crmActive: marginceConfig.enabled,
    activeDropCount,
    theme,
  };

  const handleTestCrm = async () => {
    setCrmTesting(true);
    setCrmTestResult(null);
    setTimeout(() => {
      setCrmTesting(false);
      setCrmTestResult('✓ Connection verified. Margince webhook responding (200 OK)');
    }, 900);
  };

  const handleTestSheets = async () => {
    setSheetsTesting(true);
    setSheetsTestResult(null);
    setTimeout(() => {
      setSheetsTesting(false);
      setSheetsTestResult('✓ Google Sheets connected. Read/Write permissions verified.');
    }, 900);
  };

  const handleOpenSheet = (sheetId: string) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    if (window.bridge?.openExternal) {
      window.bridge.openExternal(url);
    } else {
      window.open(url, '_blank', 'noreferrer');
    }
  };

  // Dedicated Full-Page Google Sheets Studio View
  if (showSheetsStudio || settingsTab === 'sheets') {
    return (
      <GoogleSheetsStudio
        isReadOnly={studioConfig.isReadOnly}
        initialSheetName={studioConfig.sheetName}
        initialSheetId={studioConfig.sheetId}
        initialPreset={studioConfig.preset}
        initialColumns={studioConfig.columns}
        onClose={() => {
          setShowSheetsStudio(false);
          setStudioConfig({ isReadOnly: false });
          if (settingsTab === 'sheets') {
            setSettingsTab('delivery');
          }
        }}
      />
    );
  }

  return (
    <div className="flex-1 h-full flex overflow-hidden bg-[#f7faf8] dark:bg-black text-neutral-900 dark:text-neutral-100 select-none animate-in fade-in duration-200">
      {/* ===================================================================== */}
      {/* LEFT COLUMN: FULL-PAGE SETTINGS NAVIGATION LIST (ASIDE)               */}
      {/* ===================================================================== */}
      <aside className={`w-full md:w-80 shrink-0 border-r border-neutral-200/80 dark:border-neutral-800 bg-[#edf3f0]/50 dark:bg-[#0c0d0e] flex-col h-full min-h-0 transition-colors ${
        mobileView === 'menu' ? 'flex' : 'hidden md:flex'
      }`}>
        {/* Top Header with Back to Chats Button */}
        <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 shrink-0 space-y-3">
          <button
            onClick={closeSettings}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Return to Chats</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400">
              Esc
            </kbd>
          </button>

          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
              Settings & Preferences
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              App configuration, accounts & integrations
            </p>
          </div>
        </div>

        {/* Scrollable Navigation Sections List */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin">
          {SETTINGS_SECTIONS.map((sec) => {
            const isActive = settingsTab === sec.id;
            const Icon = sec.icon;
            const badgeText = sec.badge(badgeContext);

            return (
              <button
                key={sec.id}
                onClick={() => {
                  setSettingsTab(sec.id);
                  setMobileView('content');
                }}
                className={`w-full p-2.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2.5 cursor-pointer select-none group ${
                  isActive
                    ? 'bg-white dark:bg-[#18181b] border-neutral-300 dark:border-neutral-700 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-neutral-900/50 hover:border-neutral-200/50 dark:hover:border-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <strong className={`block text-xs font-semibold truncate ${
                      isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {sec.title}
                    </strong>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono block truncate">
                      {badgeText}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Rail Version Footer */}
        <div className="p-3.5 border-t border-neutral-200/80 dark:border-neutral-800 shrink-0 flex items-center text-[11px] text-neutral-400 font-mono">
          <span className="text-neutral-500 dark:text-neutral-500">Version 1.0.4</span>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* RIGHT COLUMN: FULL-PAGE ACTIVE SECTION CONTENT PANE                   */}
      {/* ===================================================================== */}
      <section className={`flex-1 h-full min-h-0 flex-col bg-white dark:bg-[#111113] overflow-hidden ${
        mobileView === 'content' ? 'flex' : 'hidden md:flex'
      }`}>
        {/* Section Top Header Bar */}
        <header className="p-4 sm:p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-800/80 shrink-0 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* Mobile Back Button to Return to Settings Aside Menu */}
            <button
              type="button"
              onClick={() => setMobileView('menu')}
              className="md:hidden -ml-1 p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer shrink-0"
              title="Back to Settings Menu"
            >
              <IconArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
                  <currentSection.icon className="w-4 h-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight truncate">
                  {currentSection.title}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 sm:mt-1.5 leading-relaxed truncate sm:whitespace-normal">
                {currentSection.subtitle}
              </p>
            </div>
          </div>
        </header>

        {/* Section Dynamic Body Content (Full Height Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin max-w-6xl">
          {/* =============================================================== */}
          {/* 1. ACCOUNTS SECTION                                             */}
          {/* =============================================================== */}
          {settingsTab === 'accounts' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Zalo Account Card */}
                {connectedAccounts.zalo.connected ? (
                  <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <img
                          src={connectedAccounts.zalo.avatar}
                          alt={connectedAccounts.zalo.name}
                          className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xs"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white p-0.5 shadow-xs">
                          <img src={zaloLogo} alt="Zalo" className="w-full h-full object-cover rounded-full" />
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Connected</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                        {connectedAccounts.zalo.name}
                      </h4>
                      <p className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                        {connectedAccounts.zalo.phone}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Ready to sync</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                          onPress={() => openAddAccountModal('zalo')}
                        >
                          Re-scan QR
                        </Button>
                        <Button
                          size="sm"
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 cursor-pointer"
                          onPress={() => setUnlinkTarget('zalo')}
                        >
                          Unlink
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20 flex flex-col justify-between space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-2 flex items-center justify-center opacity-60">
                        <img src={zaloLogo} alt="Zalo" className="w-full h-full object-contain grayscale" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-neutral-500/10 text-neutral-500 border border-neutral-500/20">
                        Disconnected
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Zalo Personal</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">Session revoked. Pair QR to reconnect.</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded-xl cursor-pointer"
                      onPress={() => openAddAccountModal('zalo')}
                    >
                      Connect Zalo
                    </Button>
                  </div>
                )}

                {/* WhatsApp Account Card */}
                {connectedAccounts.whatsapp.connected ? (
                  <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <img
                          src={connectedAccounts.whatsapp.avatar}
                          alt={connectedAccounts.whatsapp.name}
                          className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white p-0.5 shadow-xs">
                          <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Connected</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                        {connectedAccounts.whatsapp.name}
                      </h4>
                      <p className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {connectedAccounts.whatsapp.phone}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Ready to sync</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                          onPress={() => openAddAccountModal('whatsapp')}
                        >
                          Re-scan QR
                        </Button>
                        <Button
                          size="sm"
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 cursor-pointer"
                          onPress={() => setUnlinkTarget('whatsapp')}
                        >
                          Unlink
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20 flex flex-col justify-between space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-2 flex items-center justify-center opacity-60">
                        <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-contain grayscale" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-neutral-500/10 text-neutral-500 border border-neutral-500/20">
                        Disconnected
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">WhatsApp Business</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">Session revoked. Pair QR to reconnect.</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-xl cursor-pointer"
                      onPress={() => openAddAccountModal('whatsapp')}
                    >
                      Connect WhatsApp
                    </Button>
                  </div>
                )}
              </div>

              {/* Add Additional Channel Button */}
              <button
                onClick={() => openAddAccountModal()}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-800 dark:hover:border-neutral-500 flex items-center justify-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
              >
                <span>+</span>
                <span>Link Additional Messaging Account</span>
              </button>
            </div>
          )}

          {/* =============================================================== */}
          {/* 2. WHERE TO SEND (DELIVERY) SECTION                             */}
          {/* =============================================================== */}
          {settingsTab === 'delivery' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Margince CRM Form */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-2 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center">
                      <img src={marginceLogo} alt="Margince CRM" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Margince CRM Integration</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Forward customer deals, transcripts, and contact cards into your pipeline.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => updateMarginceConfig({ enabled: !marginceConfig.enabled })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      marginceConfig.enabled ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white block transition-transform absolute top-0.5 ${
                        marginceConfig.enabled ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {marginceConfig.enabled && (
                  <div className="space-y-3.5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                        CRM Webhook Endpoint URL
                      </label>
                      <input
                        type="text"
                        value={marginceConfig.endpoint}
                        onChange={(e) => updateMarginceConfig({ endpoint: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white font-mono"
                        placeholder="https://api.margince.com/v1/stream"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                          API Secret Token
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={marginceConfig.apiKey}
                            onChange={(e) => updateMarginceConfig({ apiKey: e.target.value })}
                            className="w-full px-3 py-2 pr-10 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                          >
                            {showApiKey ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                          Sync Frequency
                        </label>
                        <select
                          value={marginceConfig.syncFrequency}
                          onChange={(e) => updateMarginceConfig({ syncFrequency: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white cursor-pointer"
                        >
                          <option value="realtime">Real-time (Instant streaming)</option>
                          <option value="1m">Batched every 1 minute</option>
                          <option value="5m">Batched every 5 minutes</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleTestCrm}
                        disabled={crmTesting}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        {crmTesting ? (
                          <>
                            <span className="w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 border-t-transparent animate-spin" />
                            <span>Testing endpoint...</span>
                          </>
                        ) : (
                          <span>Test CRM Connection</span>
                        )}
                      </button>

                      {crmTestResult && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                          {crmTestResult}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Google Sheets Form */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center">
                      <IconGoogleSheets className="w-full h-full" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Google Sheets Export</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Append new conversation transcripts into live spreadsheets.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => updateSheetsConfig({ enabled: !sheetsConfig.enabled })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      sheetsConfig.enabled ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white block transition-transform absolute top-0.5 ${
                        sheetsConfig.enabled ? 'left-5.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {sheetsConfig.enabled && (
                  <div className="space-y-3.5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80">
                    {/* Google OAuth Account Row */}
                    {sheetsConfig.oauthConnected !== false ? (
                      <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-900 dark:text-white">
                            G
                          </div>
                          <div className="text-xs font-semibold text-neutral-900 dark:text-white font-mono">
                            {sheetsConfig.googleAccount || 'tuananh@gradion.ai'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Connected</span>
                          </span>
                          <Button
                            size="sm"
                            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 cursor-pointer"
                            onPress={() =>
                              setUnlinkSheetsTarget({
                                type: 'account',
                                name: sheetsConfig.googleAccount || 'tuananh@gradion.ai',
                              })
                            }
                          >
                            Unlink
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-500">
                            G
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            No Google Account linked
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                          onPress={() =>
                            updateSheetsConfig({
                              oauthConnected: true,
                              googleAccount: 'tuananh@gradion.ai',
                            })
                          }
                        >
                          Connect Google Account
                        </Button>
                      </div>
                    )}

                    {/* Vertical list of Connected Sheet Files */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          Connected Spreadsheet Links
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {connectedSheets.length} spreadsheets
                        </span>
                      </div>

                      <div className="space-y-2">
                        {connectedSheets.map((file) => (
                          <div
                            key={file.id}
                            className="p-3 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition gap-3"
                          >
                            <a
                              href={`https://docs.google.com/spreadsheets/d/${file.id}/edit`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenSheet(file.id);
                              }}
                              className="flex items-center gap-3 min-w-0 flex-1 group/link cursor-pointer"
                              title="Open in Google Sheets"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/link:bg-emerald-500/20 transition-colors">
                                <FileSpreadsheet className="w-4 h-4" />
                              </div>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover/link:text-emerald-600 dark:group-hover/link:text-emerald-400 group-hover/link:underline truncate">
                                  {file.name}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover/link:text-emerald-500 shrink-0 transition-colors" />
                              </div>
                            </a>

                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition cursor-pointer flex items-center gap-1.5"
                                onPress={() => {
                                  setStudioConfig({
                                    isReadOnly: true,
                                    sheetName: file.name,
                                    sheetId: file.id,
                                    preset: file.preset,
                                    columns: file.columns,
                                  });
                                  setShowSheetsStudio(true);
                                }}
                              >
                                <Eye className="w-3.5 h-3.5 text-neutral-500" />
                                <span>View Config</span>
                              </Button>

                              <Button
                                size="sm"
                                className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition cursor-pointer"
                                onPress={() =>
                                  setUnlinkSheetsTarget({
                                    type: 'sheet',
                                    name: file.name,
                                    sheetId: file.id,
                                  })
                                }
                              >
                                Unlink
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Create New Sheet Link Button */}
                      <Button
                        size="sm"
                        className="w-full py-2.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 flex items-center justify-center gap-2 transition cursor-pointer"
                        onPress={() => {
                          setStudioConfig({ isReadOnly: false });
                          setShowSheetsStudio(true);
                        }}
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Create New Sheet Link</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 3. DROP NOISE SECTION (SPLIT: OPTIONS ON LEFT, PREVIEW ON RIGHT) */}
          {/* =============================================================== */}
          {settingsTab === 'noise' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-in fade-in duration-200">
              {/* LEFT COLUMN: CONTROLS & SELECTION */}
              <div className="space-y-4">
                {/* Control bar: Title, counter, select all / clear */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Filter Badges
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {activeDropCount} of {DROP_NOISE_OPTIONS.length} Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllDropNoise}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <button
                      type="button"
                      onClick={handleClearAllDropNoise}
                      className="font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Horizontal YouTube-Style Pill Badges matching Wizard */}
                <div className="flex flex-wrap gap-2">
                  {DROP_NOISE_OPTIONS.map((badge) => {
                    const isActive = dropNoiseConfig[badge.key];
                    return (
                      <button
                        key={badge.key}
                        type="button"
                        onClick={() => toggleDropNoiseRule(badge.key)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all select-none cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                          isActive
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold ring-1 ring-black/10 dark:ring-white/20'
                            : 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/90 dark:border-neutral-700/80'
                        }`}
                      >
                        {isActive ? (
                          <IconCheck className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <span className="text-neutral-400 dark:text-neutral-500 font-bold leading-none">+</span>
                        )}
                        <span>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: PREVIEW IDENTICAL TO WIZARD */}
              <div className="relative bg-black rounded-3xl h-[440px] sm:h-[500px] md:h-[560px] flex flex-col overflow-hidden border border-neutral-200/80 dark:border-neutral-800 p-4 sm:p-6 select-none shadow-xl">
                {/* Dynamic 60fps Ambient Waves Canvas Background */}
                <AmbientWavesBackground
                  paperColor="#000000"
                  waveColors={['#ea580c', '#2563eb', '#10b981']}
                />

                {/* Live Interactive Preview */}
                <Step2DropNoisePreview
                  dropNoiseFilters={{
                    reactions: dropNoiseConfig.reactions,
                    edits: dropNoiseConfig.edits,
                    stickers: dropNoiseConfig.stickers,
                    stories: dropNoiseConfig.stories,
                  }}
                />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 4. PREFERENCES & UI CUSTOMIZATION                               */}
          {/* =============================================================== */}
          {settingsTab === 'preferences' && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
              {/* Top Heading matching reference */}
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                  Appearance
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  Choose how Scylla looks on your screen. Supports automatic synchronization with your system settings.
                </p>
              </div>

              {/* 1. Interface Theme Card Block */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#151618] overflow-hidden shadow-xs">
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                      Interface Theme
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Select your preferred visual theme for the Scylla interface.
                    </p>
                  </div>

                  {/* 3 Theme Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                    {/* Light */}
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer select-none ${
                        theme === 'light'
                          ? 'border-2 border-orange-500 bg-orange-500/[0.04] dark:bg-orange-500/[0.06] shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                          <span className="font-semibold text-xs text-neutral-900 dark:text-white">Light</span>
                        </div>
                        {theme === 'light' && <Check className="w-4 h-4 text-orange-500 stroke-[2.5]" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">
                        Crisp high-contrast layout
                      </p>
                    </button>

                    {/* Dark */}
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer select-none ${
                        theme === 'dark'
                          ? 'border-2 border-orange-500 bg-orange-500/[0.04] dark:bg-orange-500/[0.06] shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                          <span className="font-semibold text-xs text-neutral-900 dark:text-white">Dark</span>
                        </div>
                        {theme === 'dark' && <Check className="w-4 h-4 text-orange-500 stroke-[2.5]" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">
                        Easy on the eyes in low light
                      </p>
                    </button>

                    {/* System */}
                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer select-none ${
                        theme === 'system'
                          ? 'border-2 border-orange-500 bg-orange-500/[0.04] dark:bg-orange-500/[0.06] shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                          <span className="font-semibold text-xs text-neutral-900 dark:text-white">System</span>
                        </div>
                        {theme === 'system' && <Check className="w-4 h-4 text-orange-500 stroke-[2.5]" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">
                        Matches your OS preference
                      </p>
                    </button>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="px-6 py-3.5 bg-neutral-50 dark:bg-[#111214] border-t border-neutral-100 dark:border-neutral-800/80">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Theme applies immediately across all pages and components.
                  </span>
                </div>
              </div>

              {/* 2. Display Language Card Block (UI Only, No Logic) */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#151618] overflow-hidden shadow-xs">
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
                      Display Language
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Select your preferred language for the interface.
                    </p>
                  </div>

                  {/* Language Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* English (US) */}
                    <button
                      type="button"
                      onClick={() => setSelectedLang('en')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer select-none ${
                        selectedLang === 'en'
                          ? 'border-2 border-orange-500 bg-orange-500/[0.04] dark:bg-orange-500/[0.06] shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                          <span className="font-semibold text-xs text-neutral-900 dark:text-white">English (US)</span>
                        </div>
                        {selectedLang === 'en' && <Check className="w-4 h-4 text-orange-500 stroke-[2.5]" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">
                        Default international standard
                      </p>
                    </button>

                    {/* Vietnamese */}
                    <button
                      type="button"
                      onClick={() => setSelectedLang('vi')}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer select-none ${
                        selectedLang === 'vi'
                          ? 'border-2 border-orange-500 bg-orange-500/[0.04] dark:bg-orange-500/[0.06] shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                          <span className="font-semibold text-xs text-neutral-900 dark:text-white">Vietnamese</span>
                        </div>
                        {selectedLang === 'vi' && <Check className="w-4 h-4 text-orange-500 stroke-[2.5]" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">
                        Tieng Viet localization pack
                      </p>
                    </button>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="px-6 py-3.5 bg-neutral-50 dark:bg-[#111214] border-t border-neutral-100 dark:border-neutral-800/80">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Language updates labels, formatting, and date localization.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Multi-Step Security Authorization Unlink Modal */}
      {unlinkTarget && (
        <UnlinkConfirmModal
          channel={unlinkTarget}
          accountName={connectedAccounts[unlinkTarget].name}
          phone={connectedAccounts[unlinkTarget].phone}
          avatar={connectedAccounts[unlinkTarget].avatar}
          onClose={() => setUnlinkTarget(null)}
          onConfirm={() => {
            setConnectedAccounts((prev) => ({
              ...prev,
              [unlinkTarget]: { ...prev[unlinkTarget], connected: false },
            }));
            setUnlinkTarget(null);
          }}
        />
      )}

      {/* Multi-Step Google Sheets Unlink Confirmation Modal */}
      {unlinkSheetsTarget && (
        <UnlinkSheetsConfirmModal
          target={unlinkSheetsTarget}
          onClose={() => setUnlinkSheetsTarget(null)}
          onConfirm={() => {
            if (unlinkSheetsTarget.type === 'account') {
              updateSheetsConfig({ oauthConnected: false, googleAccount: '' });
            } else if (unlinkSheetsTarget.type === 'sheet') {
              setConnectedSheets((prev) =>
                prev.filter((f) => f.id !== unlinkSheetsTarget.sheetId)
              );
            }
            setUnlinkSheetsTarget(null);
          }}
        />
      )}
    </div>
  );
}
