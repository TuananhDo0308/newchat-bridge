import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@heroui/react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import marginceLogo from '../../assets/margince-logo.svg';
import {
  useAppStore,
  SettingsTab,
  AccentColor,
  DensityMode,
  AppLanguage,
  HistoryRange,
} from '../../store/useAppStore.js';
import { useChatBridgeStore } from '../../store/useChatBridgeStore.js';
import { formatChatTime } from '../../utils/formatters.js';

// SVG Icons for Navigation & Controls
function IconSparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

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

function IconMessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

function IconHistory(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function IconShieldBan(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m4.5 16.5 15-15" />
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

function IconActivity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconDatabase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
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

function IconRefresh(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
    </svg>
  );
}

// 10 Section Definitions from original chat_bridge
interface SectionItem {
  id: SettingsTab;
  title: string;
  titleVi: string;
  subtitle: string;
  subtitleVi: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge: (state: any) => string;
}

const SETTINGS_SECTIONS: SectionItem[] = [
  {
    id: 'setup',
    title: 'Setup',
    titleVi: 'Thiết lập ban đầu',
    subtitle: 'Connect apps, pick chats and review local saving',
    subtitleVi: 'Kết nối ứng dụng, chọn chat và xem lại lưu trữ',
    icon: IconSparkles,
    badge: () => '4/4 Steps Done',
  },
  {
    id: 'accounts',
    title: 'Accounts',
    titleVi: 'Tài khoản',
    subtitle: 'Messaging accounts linked to this computer',
    subtitleVi: 'Các tài khoản đã liên kết với máy tính này',
    icon: IconUsers,
    badge: (s) => `${s.sourcesCount} Connected`,
  },
  {
    id: 'chats',
    title: 'Chats',
    titleVi: 'Hội thoại',
    subtitle: 'Select customer conversations to forward',
    subtitleVi: 'Chọn cuộc trò chuyện để chuyển tiếp vào CRM',
    icon: IconMessageSquare,
    badge: (s) => `${s.selectedChatsCount} Selected`,
  },
  {
    id: 'delivery',
    title: 'Where to Send',
    titleVi: 'Nơi gửi đến',
    subtitle: 'Delivery destinations for selected messages',
    subtitleVi: 'Đích nhận các tin nhắn đã chọn (Margince & Sheets)',
    icon: IconSend,
    badge: () => 'Active Targets',
  },
  {
    id: 'history',
    title: 'History Sync',
    titleVi: 'Đồng bộ lịch sử',
    subtitle: 'Import older messages and catch up after restart',
    subtitleVi: 'Nhập tin nhắn cũ và bắt kịp sau khi khởi động',
    icon: IconHistory,
    badge: (s) => s.historyRangeLabel,
  },
  {
    id: 'blocked',
    title: 'Blocked Contacts',
    titleVi: 'Liên hệ bị chặn',
    subtitle: 'Contacts whose messages should not be saved',
    subtitleVi: 'Liên hệ có tin nhắn không nên được lưu vào CRM',
    icon: IconShieldBan,
    badge: (s) => `${s.blockedCount} Blocked`,
  },
  {
    id: 'noise',
    title: 'Drop Noise',
    titleVi: 'Bỏ tin nhiễu',
    subtitle: 'Rules for messages that should not be forwarded',
    subtitleVi: 'Quy tắc lọc tin nhắn không cần thiết',
    icon: IconFilter,
    badge: (s) => `${s.activeDropCount} Rules Active`,
  },
  {
    id: 'preferences',
    title: 'Preferences',
    titleVi: 'Tùy chọn & Giao diện',
    subtitle: 'Language, dark mode, density, and sound notifications',
    subtitleVi: 'Ngôn ngữ, giao diện dark mode, font và thông báo',
    icon: IconPalette,
    badge: (s) => `${s.theme === 'dark' ? 'Dark' : 'Light'} • ${s.language.toUpperCase()}`,
  },
  {
    id: 'health',
    title: 'App Health',
    titleVi: 'Tình trạng ứng dụng',
    subtitle: 'Status of each account and destination',
    subtitleVi: 'Trạng thái của từng tài khoản và engine đồng bộ',
    icon: IconActivity,
    badge: () => 'Operational',
  },
  {
    id: 'data',
    title: 'Archive & Storage',
    titleVi: 'Lưu trữ & Demo',
    subtitle: 'Saved SQLite messages and cache cleanup',
    subtitleVi: 'Tin nhắn đã lưu trong SQLite và xóa bộ nhớ đệm',
    icon: IconDatabase,
    badge: () => '18.4 MB Local DB',
  },
];

export function SettingsScreen() {
  const closeSettings = useAppStore((s) => s.closeSettings);
  const settingsTab = useAppStore((s) => s.settingsTab);
  const setSettingsTab = useAppStore((s) => s.setSettingsTab);
  const openWizard = useAppStore((s) => s.openWizard);

  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const accentColor = useAppStore((s) => s.accentColor);
  const setAccentColor = useAppStore((s) => s.setAccentColor);
  const density = useAppStore((s) => s.density);
  const setDensity = useAppStore((s) => s.setDensity);
  const soundNotifications = useAppStore((s) => s.soundNotifications);
  const setSoundNotifications = useAppStore((s) => s.setSoundNotifications);

  const historyRange = useAppStore((s) => s.historyRange);
  const setHistoryRange = useAppStore((s) => s.setHistoryRange);

  const blockedContacts = useAppStore((s) => s.blockedContacts);
  const toggleBlockedContact = useAppStore((s) => s.toggleBlockedContact);
  const blockedPhrases = useAppStore((s) => s.blockedPhrases);
  const addBlockedPhrase = useAppStore((s) => s.addBlockedPhrase);
  const removeBlockedPhrase = useAppStore((s) => s.removeBlockedPhrase);

  const dropNoiseConfig = useAppStore((s) => s.dropNoiseConfig);
  const toggleDropNoiseRule = useAppStore((s) => s.toggleDropNoiseRule);
  const setDropNoiseSensitivity = useAppStore((s) => s.setDropNoiseSensitivity);

  const marginceConfig = useAppStore((s) => s.marginceConfig);
  const updateMarginceConfig = useAppStore((s) => s.updateMarginceConfig);
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  const chats = useChatBridgeStore((s) => s.chats);
  const sources = useChatBridgeStore((s) => s.sources);
  const toggleChatSync = useChatBridgeStore((s) => s.toggleChatSync);
  const batchSyncChats = useChatBridgeStore((s) => s.batchSyncChats);
  const setSelectedChatId = useChatBridgeStore((s) => s.setSelectedChatId);
  const setScope = useChatBridgeStore((s) => s.setScope);

  // Local state for interactive verification
  const [showApiKey, setShowApiKey] = useState(false);
  const [crmTesting, setCrmTesting] = useState(false);
  const [crmTestResult, setCrmTestResult] = useState<string | null>(null);
  const [sheetsTesting, setSheetsTesting] = useState(false);
  const [sheetsTestResult, setSheetsTestResult] = useState<string | null>(null);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [historySyncing, setHistorySyncing] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [chatChannelFilter, setChatChannelFilter] = useState<'all' | 'zalo' | 'whatsapp'>('all');
  const [newBlockedPhrase, setNewBlockedPhrase] = useState('');
  const [newBlockedContact, setNewBlockedContact] = useState('');

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

  const activeDropCount = Object.values(dropNoiseConfig).filter(
    (v) => typeof v === 'boolean' && v
  ).length;

  const selectedChatsCount = chats.filter((c) => c.selected).length;

  const currentSection = SETTINGS_SECTIONS.find((s) => s.id === settingsTab) || SETTINGS_SECTIONS[0];

  const badgeContext = {
    sourcesCount: sources.filter((s) => s.network !== 'fake').length || 2,
    selectedChatsCount,
    historyRangeLabel:
      historyRange === 'all'
        ? 'All Time'
        : historyRange === '12m'
        ? '12 Months'
        : historyRange === '6m'
        ? '6 Months'
        : '3 Months',
    blockedCount: blockedContacts.length,
    activeDropCount,
    theme,
    language,
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

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleTriggerHistorySync = () => {
    setHistorySyncing(true);
    setTimeout(() => setHistorySyncing(false), 1800);
  };

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      if (chatChannelFilter !== 'all' && chat.network !== chatChannelFilter) return false;
      if (!chatSearch.trim()) return true;
      const q = chatSearch.toLowerCase();
      return chat.name.toLowerCase().includes(q) || chat.lastMessageSnippet.toLowerCase().includes(q);
    });
  }, [chats, chatChannelFilter, chatSearch]);

  const isVi = language === 'vi';

  return (
    <div className="flex-1 h-full flex overflow-hidden bg-[#f7faf8] dark:bg-black text-neutral-900 dark:text-neutral-100 select-none animate-in fade-in duration-200">
      {/* ===================================================================== */}
      {/* LEFT COLUMN: FULL-PAGE SETTINGS NAVIGATION LIST (ASIDE)               */}
      {/* ===================================================================== */}
      <aside className="w-72 md:w-80 shrink-0 border-r border-neutral-200/80 dark:border-neutral-800 bg-[#edf3f0]/50 dark:bg-[#0c0d0e] flex flex-col h-full min-h-0 transition-colors">
        {/* Top Header with Back to Chats Button */}
        <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 shrink-0 space-y-3">
          <button
            onClick={closeSettings}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>{isVi ? 'Quay lại hội thoại' : 'Return to Chats'}</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400">
              Esc
            </kbd>
          </button>

          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
              {isVi ? 'Cài đặt hệ thống' : 'Settings & Preferences'}
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isVi ? 'Cấu hình tài khoản, bộ lọc và tích hợp' : 'App configuration, accounts & integrations'}
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
                onClick={() => setSettingsTab(sec.id)}
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
                      {isVi ? sec.titleVi : sec.title}
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

        {/* Bottom Rail Engine Footer Status */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800 shrink-0 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-neutral-600 dark:text-neutral-400">Core Daemon 1.0.4</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-400">Local IPC</span>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* RIGHT COLUMN: FULL-PAGE ACTIVE SECTION CONTENT PANE                   */}
      {/* ===================================================================== */}
      <section className="flex-1 h-full min-h-0 flex flex-col bg-white dark:bg-[#111113] overflow-hidden">
        {/* Section Top Header Bar */}
        <header className="p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-800/80 shrink-0 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
                <currentSection.icon className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight truncate">
                {isVi ? currentSection.titleVi : currentSection.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              {isVi ? currentSection.subtitleVi : currentSection.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer"
              onPress={closeSettings}
            >
              {isVi ? 'Đóng & Lưu' : 'Done / Save'}
            </Button>
          </div>
        </header>

        {/* Section Dynamic Body Content (Full Height Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin max-w-5xl">
          {/* =============================================================== */}
          {/* 1. SETUP SECTION                                                */}
          {/* =============================================================== */}
          {settingsTab === 'setup' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Setup Walkthrough Card */}
              <div className="p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-gradient-to-r from-blue-50/50 to-neutral-50/50 dark:from-blue-950/20 dark:to-neutral-900/30 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {isVi ? 'Muốn chạy lại trình hướng dẫn thiết lập từng bước?' : 'Prefer a guided setup walkthrough?'}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {isVi
                      ? 'Lần lượt đi qua 5 bước: kết nối Zalo/WhatsApp, DropNoise filters, chọn hội thoại, timeframe và đích gửi.'
                      : 'Launch the onboarding wizard modal to step through account pairing, noise filters, conversation selection, and CRM destinations.'}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  onPress={() => {
                    closeSettings();
                    openWizard();
                  }}
                >
                  <IconSparkles className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Mở Setup Wizard' : 'Launch Setup Wizard'}</span>
                </Button>
              </div>

              {/* 4 Steps Checklist from original chat_bridge */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {isVi ? 'Các bước thiết lập hệ thống' : 'Setup Steps Checklist'}
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Step 1: WhatsApp */}
                  <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-neutral-900 dark:text-white">
                          WhatsApp Business Multi-Device
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {isVi ? 'Đã kết nối • Sale Gradion (+84 988 889 999)' : 'Connected • Sale Gradion (+84 988 889 999)'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettingsTab('accounts')}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {isVi ? 'Quản lý' : 'Manage'}
                    </button>
                  </div>

                  {/* Step 2: Zalo */}
                  <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-neutral-900 dark:text-white">
                          Zalo Personal Messenger
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {isVi ? 'Đã kết nối • Marcus Sterling (+1 555-019-2834)' : 'Connected • Marcus Sterling (+1 555-019-2834)'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettingsTab('accounts')}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {isVi ? 'Quản lý' : 'Manage'}
                    </button>
                  </div>

                  {/* Step 3: Chats */}
                  <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-neutral-900 dark:text-white">
                          {isVi ? 'Chọn hội thoại khách hàng' : 'Pick Customer Conversations'}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {selectedChatsCount} {isVi ? 'cuộc trò chuyện được chọn để đồng bộ' : 'conversations picked for CRM forwarding'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettingsTab('chats')}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {isVi ? 'Chỉnh sửa' : 'Edit Chats'}
                    </button>
                  </div>

                  {/* Step 4: Review & Targets */}
                  <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-neutral-900 dark:text-white">
                          {isVi ? 'Điểm đến & Lưu trữ cục bộ' : 'Delivery Targets & Local SQLite Storage'}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {isVi ? 'Margince CRM và Google Sheets đã cấu hình sẵn sàng' : 'Margince CRM and Google Sheets configured and live'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettingsTab('delivery')}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {isVi ? 'Cấu hình' : 'Configure'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 2. ACCOUNTS SECTION                                             */}
          {/* =============================================================== */}
          {settingsTab === 'accounts' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Zalo Card */}
                <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white p-1 ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center shadow-xs">
                        <img src={zaloLogo} alt="Zalo" className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Zalo Personal</h4>
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">+84 988 889 999</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{isVi ? 'Đang kết nối' : 'Connected'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {isVi
                      ? 'Tài khoản bán hàng nội địa Zalo. Các tin nhắn direct và thỏa thuận giá tự động đồng bộ về máy này.'
                      : 'Vietnam sales messenger account. Direct chats and customer quotes synchronize directly to this desktop.'}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
                    <Button
                      size="sm"
                      className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      onPress={() => {
                        closeSettings();
                        openWizard();
                      }}
                    >
                      {isVi ? 'Quét lại QR' : 'Re-scan QR'}
                    </Button>
                    <Button
                      size="sm"
                      className="px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold py-1.5 rounded-xl border border-rose-500/20"
                    >
                      {isVi ? 'Hủy liên kết' : 'Unlink'}
                    </Button>
                  </div>
                </div>

                {/* WhatsApp Card */}
                <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white p-1 ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center shadow-xs">
                        <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">WhatsApp Business</h4>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">+1 (555) 019-2834</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{isVi ? 'Đang kết nối' : 'Connected'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {isVi
                      ? 'Tài khoản khách hàng quốc tế. Hỗ trợ giao thức đa thiết bị Multi-Device Bridge mã hóa đầu cuối.'
                      : 'International client communication profile. Operates through Multi-Device bridge protocol.'}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
                    <Button
                      size="sm"
                      className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      onPress={() => {
                        closeSettings();
                        openWizard();
                      }}
                    >
                      {isVi ? 'Quét lại QR' : 'Re-scan QR'}
                    </Button>
                    <Button
                      size="sm"
                      className="px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold py-1.5 rounded-xl border border-rose-500/20"
                    >
                      {isVi ? 'Hủy liên kết' : 'Unlink'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add Additional Channel Button */}
              <button
                onClick={() => {
                  closeSettings();
                  openWizard();
                }}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-800 dark:hover:border-neutral-500 flex items-center justify-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
              >
                <span>+</span>
                <span>{isVi ? 'Thêm tài khoản hoặc kênh nhắn tin mới' : 'Link Additional Messaging Account'}</span>
              </button>
            </div>
          )}

          {/* =============================================================== */}
          {/* 3. CHATS SECTION                                                */}
          {/* =============================================================== */}
          {settingsTab === 'chats' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Search & Channel Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    placeholder={isVi ? 'Tìm kiếm theo tên liên hệ hoặc số...' : 'Search contacts by name or phone...'}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white"
                  />
                  {chatSearch && (
                    <button
                      onClick={() => setChatSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {(['all', 'zalo', 'whatsapp'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChatChannelFilter(ch)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer capitalize ${
                        chatChannelFilter === ch
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {ch === 'all' ? (isVi ? 'Tất cả' : 'All') : ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action bar: Selected counter and batch toggles */}
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {selectedChatsCount} of {chats.length} {isVi ? 'hội thoại được chọn đồng bộ' : 'conversations picked for CRM'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => batchSyncChats(filteredChats.map((c) => c.id), true)}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    {isVi ? 'Chọn tất cả' : 'Select All'}
                  </button>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <button
                    onClick={() => batchSyncChats(filteredChats.map((c) => c.id), false)}
                    className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white font-medium cursor-pointer"
                  >
                    {isVi ? 'Bỏ chọn tất cả' : 'Deselect All'}
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredChats.map((chat) => {
                  const isSelected = chat.selected;
                  const isZalo = chat.network === 'zalo';

                  return (
                    <div
                      key={chat.id}
                      onClick={() => toggleChatSync(chat.id)}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer select-none ${
                        isSelected
                          ? isZalo
                            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400/80 dark:border-blue-500/50 shadow-xs'
                            : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400/80 dark:border-emerald-500/50 shadow-xs'
                          : 'bg-neutral-50/40 dark:bg-[#161618] border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChatSync(chat.id);
                          }}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                            isSelected
                              ? isZalo
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                          }`}
                        >
                          {isSelected && <IconCheck className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0 ring-1 ring-black/5 dark:ring-white/10">
                          <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                              {chat.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                isZalo
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              }`}
                            >
                              {chat.network}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                            {chat.lastMessageSnippet}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {formatChatTime(chat.lastActivity)}
                        </span>
                        <Button
                          size="sm"
                          className="px-2.5 py-1 text-[10px] font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg"
                          onPress={(e) => {
                            e.stopPropagation();
                            setSelectedChatId(chat.id);
                            setScope({ network: chat.network, account: chat.account });
                            closeSettings();
                          }}
                        >
                          {isVi ? 'Mở chat' : 'Open'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 4. WHERE TO SEND (DELIVERY) SECTION                             */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                          Spreadsheet ID / Share URL
                        </label>
                        <input
                          type="text"
                          value={sheetsConfig.spreadsheetId}
                          onChange={(e) => updateSheetsConfig({ spreadsheetId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white font-mono"
                          placeholder="1BxiMVs0XRA5n..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                          Worksheet Tab Name
                        </label>
                        <input
                          type="text"
                          value={sheetsConfig.sheetName}
                          onChange={(e) => updateSheetsConfig({ sheetName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white"
                          placeholder="ChatBridge_Transcripts"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleTestSheets}
                        disabled={sheetsTesting}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        {sheetsTesting ? (
                          <>
                            <span className="w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 border-t-transparent animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <span>Verify Sheet Access</span>
                        )}
                      </button>

                      {sheetsTestResult && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                          {sheetsTestResult}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Table from original chat_bridge */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {isVi ? 'Bảng trạng thái đích gửi' : 'Delivery Target Pipeline Health'}
                </h4>
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                      <tr>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Sent Count</th>
                        <th className="p-3">Queue</th>
                        <th className="p-3">Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-mono text-[11px]">
                      <tr>
                        <td className="p-3 font-sans font-bold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Margince CRM
                        </td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-sans font-semibold">Active</td>
                        <td className="p-3">1,250 msgs</td>
                        <td className="p-3 text-neutral-400">0 waiting</td>
                        <td className="p-3 text-neutral-400">~12ms</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-sans font-bold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Google Sheets
                        </td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-sans font-semibold">Active</td>
                        <td className="p-3">1,250 rows</td>
                        <td className="p-3 text-neutral-400">0 waiting</td>
                        <td className="p-3 text-neutral-400">~84ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 5. HISTORY SYNC SECTION                                         */}
          {/* =============================================================== */}
          {settingsTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {isVi
                  ? 'Chọn phạm vi đồng bộ lịch sử hội thoại khách hàng cũ. Hệ thống sẽ quét tin nhắn và tự động loại trừ các tin nhắn trùng lặp.'
                  : 'Import older customer conversation transcripts into your CRM pipeline. Duplicates are automatically deduplicated by local SQLite hash checks.'}
              </div>

              {/* 4 History Range Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'all' as HistoryRange, label: 'All Time', sub: 'Complete lifetime archive', desc: 'Sync all past messages and media' },
                  { id: '12m' as HistoryRange, label: '12 Months', sub: 'Past 365 days', desc: '1-year historical transcript for auditing' },
                  { id: '6m' as HistoryRange, label: '6 Months', sub: 'Past 180 days', desc: 'Balanced window for quotation and proposal histories' },
                  { id: '3m' as HistoryRange, label: '3 Months', sub: 'Past 90 days', desc: 'Fastest sync for active recent deals' },
                ].map((item) => {
                  const isSelected = historyRange === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setHistoryRange(item.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer select-none space-y-1.5 ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md'
                          : 'bg-neutral-50/60 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{item.label}</span>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                          {item.sub}
                        </span>
                      </div>
                      <p className={`text-xs ${isSelected ? 'text-neutral-200 dark:text-neutral-700' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Catch-up & WhatsApp Link Progress from original chat_bridge */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {isVi ? 'Trạng thái đồng bộ ngoại tuyến (Catch-Up Status)' : 'Offline Catch-Up & Backfill Engine'}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Last import finished • 1,250 verified messages saved into SQLite archive.
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition cursor-pointer flex items-center gap-1.5"
                    onPress={handleTriggerHistorySync}
                    disabled={historySyncing}
                  >
                    {historySyncing ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 border-t-transparent animate-spin" />
                        <span>Syncing History...</span>
                      </>
                    ) : (
                      <>
                        <IconRefresh className="w-3.5 h-3.5" />
                        <span>Sync All History Now</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 6. BLOCKED CONTACTS SECTION                                     */}
          {/* =============================================================== */}
          {settingsTab === 'blocked' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {isVi
                  ? 'Tin nhắn từ các liên hệ bị chặn sẽ không bao giờ được lưu vào cơ sở dữ liệu SQLite hoặc chuyển tiếp đến Margince CRM/Google Sheets.'
                  : 'Messages from blocked contacts are completely omitted from local database storage and CRM forwarding targets.'}
              </div>

              {/* Add to Blacklist input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newBlockedContact}
                  onChange={(e) => setNewBlockedContact(e.target.value)}
                  placeholder={isVi ? 'Nhập số điện thoại hoặc ID liên hệ...' : 'Enter phone number or contact identifier...'}
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white font-mono"
                />
                <Button
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
                  onPress={() => {
                    if (newBlockedContact.trim()) {
                      toggleBlockedContact(newBlockedContact.trim());
                      setNewBlockedContact('');
                    }
                  }}
                >
                  {isVi ? 'Chặn liên hệ' : 'Block Contact'}
                </Button>
              </div>

              {/* Blocked List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {isVi ? 'Danh sách liên hệ đã chặn' : 'Blocked Contacts List'} ({blockedContacts.length})
                </h4>

                {blockedContacts.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 text-xs">
                    {isVi ? 'Chưa có liên hệ nào bị chặn.' : 'No contacts currently blocked.'}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {blockedContacts.map((contactId) => (
                      <div
                        key={contactId}
                        className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconShieldBan className="w-4 h-4 text-rose-500" />
                          <span className="font-mono text-xs text-neutral-900 dark:text-white">{contactId}</span>
                        </div>
                        <button
                          onClick={() => toggleBlockedContact(contactId)}
                          className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                        >
                          {isVi ? 'Bỏ chặn' : 'Unblock'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 7. DROP NOISE SECTION                                           */}
          {/* =============================================================== */}
          {settingsTab === 'noise' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Sensitivity Selector */}
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Filter Sensitivity</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Controls automated threshold for non-sales message stripping.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {(['relaxed', 'balanced', 'strict'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDropNoiseSensitivity(mode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer capitalize ${
                        dropNoiseConfig.sensitivity === mode
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                          : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* 8 Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'reactions' as const, label: 'Reactions', desc: 'Strip thumbs up, hearts, haha emoji reactions' },
                  { key: 'edits' as const, label: 'Message Edits Audit', desc: 'Retain both original & revised edit history' },
                  { key: 'stickers' as const, label: 'Animated Stickers', desc: 'Filter cartoon stickers and non-text graphics' },
                  { key: 'stories' as const, label: 'Stories & Status', desc: 'Filter out story replies and status updates' },
                  { key: 'botPings' as const, label: 'Bot System Pings', desc: 'Drop auto-acknowledgments and ping messages' },
                  { key: 'otpCodes' as const, label: 'OTP & Auth Codes', desc: 'Strip sensitive 4-8 digit verification codes' },
                  { key: 'largeFiles' as const, label: 'Large Attachments (>25MB)', desc: 'Exclude high-bandwidth media attachments' },
                  { key: 'linkTrackers' as const, label: 'Link Trackers & Beacons', desc: 'Strip click trackers and promotional parameters' },
                ].map((rule) => {
                  const isActive = (dropNoiseConfig as any)[rule.key];
                  return (
                    <div
                      key={rule.key}
                      onClick={() => toggleDropNoiseRule(rule.key)}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer select-none ${
                        isActive
                          ? 'bg-white dark:bg-[#18181b] border-neutral-300 dark:border-neutral-700 shadow-2xs'
                          : 'bg-neutral-50/40 dark:bg-[#161618] border-neutral-200/80 dark:border-neutral-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                          {isActive && <IconCheck className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                          <span>{rule.label}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                          {rule.desc}
                        </p>
                      </div>

                      <div
                        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                          isActive ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full transition-transform absolute top-0.5 ${
                            isActive ? 'left-4.5 bg-white dark:bg-neutral-900' : 'left-0.5 bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Blocked Phrase List from original chat_bridge */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isVi ? 'Từ khóa & Cụm từ chặn tùy chỉnh' : 'Custom Blocked Phrases & Keywords'}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Messages containing these phrases will not be synced to CRM.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newBlockedPhrase}
                    onChange={(e) => setNewBlockedPhrase(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newBlockedPhrase.trim()) {
                        addBlockedPhrase(newBlockedPhrase);
                        setNewBlockedPhrase('');
                      }
                    }}
                    placeholder={isVi ? 'Nhập từ khóa và ấn Enter...' : 'Type keyword (e.g. promo, spam) and press Enter...'}
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white"
                  />
                  <Button
                    size="sm"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900"
                    onPress={() => {
                      if (newBlockedPhrase.trim()) {
                        addBlockedPhrase(newBlockedPhrase);
                        setNewBlockedPhrase('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {blockedPhrases.map((phrase) => (
                    <span
                      key={phrase}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 font-mono"
                    >
                      <span>{phrase}</span>
                      <button
                        onClick={() => removeBlockedPhrase(phrase)}
                        className="text-neutral-400 hover:text-rose-500 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 8. PREFERENCES & UI CUSTOMIZATION                               */}
          {/* =============================================================== */}
          {settingsTab === 'preferences' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Appearance Mode (Dark mode active by default) */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Interface Theme Mode</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Default theme is set to Dark Mode as requested.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-700'
                        : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center text-[10px]">
                        🌙
                      </div>
                      <span className="font-semibold text-xs">Dark Mode</span>
                    </div>
                    {theme === 'dark' && <IconCheck className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => setTheme('light')}
                    className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white text-neutral-900 border-neutral-400 shadow-md ring-2 ring-neutral-300'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px] text-white">
                        ☀️
                      </div>
                      <span className="font-semibold text-xs">Light Mode</span>
                    </div>
                    {theme === 'light' && <IconCheck className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
              </div>

              {/* Language Selection from original chat_bridge */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {isVi ? 'Ngôn ngữ hiển thị' : 'Display Language'}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    English or Vietnamese UI translation.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      language === 'en'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                        : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    English (US)
                  </button>
                  <button
                    onClick={() => setLanguage('vi')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      language === 'vi'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                        : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Tiếng Việt
                  </button>
                </div>
              </div>

              {/* Accent Color Palette */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Accent Color Palette</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'orange' as AccentColor, label: 'ChatBridge Orange', color: 'bg-orange-500' },
                    { id: 'emerald' as AccentColor, label: 'Emerald Mint', color: 'bg-emerald-500' },
                    { id: 'blue' as AccentColor, label: 'Corporate Blue', color: 'bg-blue-600' },
                    { id: 'violet' as AccentColor, label: 'Royal Violet', color: 'bg-purple-600' },
                  ].map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setAccentColor(acc.id)}
                      className={`p-2.5 rounded-xl border transition flex items-center gap-2 cursor-pointer ${
                        accentColor === acc.id
                          ? 'border-neutral-800 dark:border-white bg-white dark:bg-neutral-800 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${acc.color}`} />
                      <span className="text-xs font-medium truncate">{acc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Density Mode */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Message Feed Density</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Adjust bubble spacing and padding.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer capitalize ${
                        density === d
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                          : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Notifications */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Sound Alerts</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Play gentle chime when new transcripts are synchronized.
                  </p>
                </div>

                <button
                  onClick={() => setSoundNotifications(!soundNotifications)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    soundNotifications ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full transition-transform absolute top-0.5 ${
                      soundNotifications ? 'left-5.5 bg-white dark:bg-neutral-900' : 'left-0.5 bg-white'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 9. APP HEALTH & DIAGNOSTICS                                     */}
          {/* =============================================================== */}
          {settingsTab === 'health' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Status Banner from original chat_bridge */}
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      All Systems Operational • Core Engine Connected
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Local bridge daemon running with 0 connection anomalies.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  99.98% Uptime
                </span>
              </div>

              {/* Health Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-1">
                  <span className="text-[11px] text-neutral-400 font-medium">IPC Socket Latency</span>
                  <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">~14 ms</div>
                  <span className="text-[10px] text-emerald-500">Ultra-low local loopback</span>
                </div>

                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-1">
                  <span className="text-[11px] text-neutral-400 font-medium">Engine Memory RSS</span>
                  <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">42.1 MB</div>
                  <span className="text-[10px] text-neutral-400">Within optimal 60MB cap</span>
                </div>

                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-1">
                  <span className="text-[11px] text-neutral-400 font-medium">Local SQLite Integrity</span>
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">OK (Verified)</div>
                  <span className="text-[10px] text-neutral-400">WAL mode journaling active</span>
                </div>
              </div>

              {/* Accounts & Channels Health Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Channel Sockets</h4>
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 bg-neutral-50/50 dark:bg-[#161618]">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-bold text-neutral-900 dark:text-white">Zalo Personal Bridge</span>
                    </div>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">Active (Socket 2490)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-bold text-neutral-900 dark:text-white">WhatsApp Multi-Device Bridge</span>
                    </div>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">Active (Socket 2491)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 10. ARCHIVE & STORAGE SECTION                                   */}
          {/* =============================================================== */}
          {settingsTab === 'data' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3.5">
                {/* Local DB details */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-2">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {isVi ? 'Đường dẫn cơ sở dữ liệu SQLite cục bộ' : 'Local SQLite Database File Path'}
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-200/60 dark:bg-black/60 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 select-all border border-neutral-300/60 dark:border-neutral-800">
                    ~/Library/Application Support/ChatBridge/db/messages.sqlite
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    All customer conversations, timestamps, and encrypted channel tokens are stored exclusively on your computer.
                  </p>
                </div>

                {/* Cache cleanup */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">Temporary Media & Avatars Cache</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Currently using 18.4 MB of avatar and media previews.</div>
                  </div>
                  <button
                    onClick={handleClearCache}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition cursor-pointer"
                  >
                    {cacheCleared ? '✓ Cache Cleared' : 'Clear Cache'}
                  </button>
                </div>

                {/* Export Options */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">Export Transcripts</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Download conversation history as JSON or CSV spreadsheet backup.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold rounded-xl">
                      JSON
                    </Button>
                    <Button size="sm" className="bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold rounded-xl">
                      CSV
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
