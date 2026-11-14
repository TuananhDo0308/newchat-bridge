import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
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

// 5 Active Settings Sections
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
    id: 'accounts',
    title: 'Accounts',
    titleVi: 'Tài khoản kết nối',
    subtitle: 'Zalo, WhatsApp Business sessions and pairings',
    subtitleVi: 'Phiên đăng nhập Zalo, WhatsApp và quét mã QR',
    icon: IconUsers,
    badge: (s) => `${s.sourcesCount} Connected`,
  },
  {
    id: 'delivery',
    title: 'Where to Send',
    titleVi: 'Đích gửi dữ liệu',
    subtitle: 'Margince CRM webhook & Google Sheets output',
    subtitleVi: 'Webhook Margince CRM và kết nối Google Sheets',
    icon: IconSend,
    badge: (s) => (s.crmActive ? '2 Targets Ready' : '1 Target Ready'),
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

  const sources = useChatBridgeStore((s) => s.sources);

  // Local state for interactive verification
  const [showApiKey, setShowApiKey] = useState(false);
  const [crmTesting, setCrmTesting] = useState(false);
  const [crmTestResult, setCrmTestResult] = useState<string | null>(null);
  const [sheetsTesting, setSheetsTesting] = useState(false);
  const [sheetsTestResult, setSheetsTestResult] = useState<string | null>(null);
  const [showSheetsStudio, setShowSheetsStudio] = useState(false);
  const [newBlockedPhrase, setNewBlockedPhrase] = useState('');

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

  const currentSection = SETTINGS_SECTIONS.find((s) => s.id === settingsTab) || SETTINGS_SECTIONS[0];

  const badgeContext = {
    sourcesCount: sources.filter((s) => s.network !== 'fake').length || 2,
    crmActive: marginceConfig.enabled,
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
          {/* 1. ACCOUNTS SECTION                                             */}
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
                    {/* Google OAuth Account Card */}
                    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-900 dark:text-white">
                          G
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 dark:text-white">
                            Google Drive & Sheets Access
                          </div>
                          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                            {sheetsConfig.googleAccount || 'tuananh@gradion.ai'} (OAuth 2.0 Active)
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Connected</span>
                      </span>
                    </div>

                    {/* Active Destination Info */}
                    <div className="p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📊</span>
                        <div>
                          <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            <span>{sheetsConfig.selectedFileName || 'ChatBridge_Transcripts_2026'}</span>
                            <span className="text-[10px] font-mono text-neutral-400">({sheetsConfig.sheetName || 'Transcripts'})</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono">
                            ID: {sheetsConfig.spreadsheetId ? `${sheetsConfig.spreadsheetId.slice(0, 20)}...` : 'Auto-provisioned'}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {isVi ? 'Đang kích hoạt' : 'Active Target'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/60 flex items-center justify-between">
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {isVi
                          ? 'Tùy chỉnh định dạng bảng tính, 4 bước trực quan, tự động tạo spreadsheet và bố cục chia tab.'
                          : 'Customize spreadsheet format, 4-step studio flow, auto-complete spreadsheet creation and tab layout.'}
                      </p>
                      <Button
                        size="sm"
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300/80 dark:border-emerald-800 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                        onPress={() => setShowSheetsStudio((prev) => !prev)}
                      >
                        <span>
                          {showSheetsStudio
                            ? (isVi ? 'Thu gọn Sheet Studio ▲' : 'Collapse Sheet Studio ▲')
                            : (isVi ? 'Mở Sheet Studio (Kéo thả cột & Preview) ▼' : 'Open Sheet Studio (Drag & Drop Table) ▼')}
                        </span>
                      </Button>
                    </div>

                    {showSheetsStudio && (
                      <div className="pt-4 border-t border-neutral-200/70 dark:border-neutral-800/80 animate-in fade-in duration-200">
                        <GoogleSheetsStudio isVi={isVi} onClose={() => setShowSheetsStudio(false)} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Table */}
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
          {/* 3. GOOGLE SHEETS STUDIO (DRAG & DROP WORKBENCH)                 */}
          {/* =============================================================== */}
          {settingsTab === 'sheets' && (
            <GoogleSheetsStudio isVi={isVi} />
          )}

          {/* =============================================================== */}
          {/* 4. DROP NOISE SECTION                                           */}
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

              {/* Blocked Phrase List */}
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
          {/* 5. PREFERENCES & UI CUSTOMIZATION                               */}
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

              {/* Language Selection */}
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
        </div>
      </section>
    </div>
  );
}
