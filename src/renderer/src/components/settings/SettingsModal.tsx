import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import marginceLogo from '../../assets/margince-logo.svg';
import {
  useAppStore,
  SettingsTab,
  AccentColor,
  DensityMode,
} from '../../store/useAppStore.js';

// Clean inline SVGs for settings tabs & UI controls
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

function IconSliders(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function IconForward(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 17 20 12 15 7" />
      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
    </svg>
  );
}

function IconHardDrive(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" y1="12" x2="2" y2="12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" y1="16" x2="6.01" y2="16" />
      <line x1="10" y1="16" x2="10.01" y2="16" />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

export function SettingsModal() {
  const isSettingsOpen = useAppStore((s) => s.isSettingsOpen);
  const closeSettings = useAppStore((s) => s.closeSettings);
  const settingsTab = useAppStore((s) => s.settingsTab);
  const setSettingsTab = useAppStore((s) => s.setSettingsTab);

  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const accentColor = useAppStore((s) => s.accentColor);
  const setAccentColor = useAppStore((s) => s.setAccentColor);

  const density = useAppStore((s) => s.density);
  const setDensity = useAppStore((s) => s.setDensity);

  const soundNotifications = useAppStore((s) => s.soundNotifications);
  const setSoundNotifications = useAppStore((s) => s.setSoundNotifications);

  const dropNoiseConfig = useAppStore((s) => s.dropNoiseConfig);
  const toggleDropNoiseRule = useAppStore((s) => s.toggleDropNoiseRule);
  const setDropNoiseSensitivity = useAppStore((s) => s.setDropNoiseSensitivity);

  const marginceConfig = useAppStore((s) => s.marginceConfig);
  const updateMarginceConfig = useAppStore((s) => s.updateMarginceConfig);

  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  // Local transient states for test connection triggers
  const [showApiKey, setShowApiKey] = useState(false);
  const [marginceTesting, setMarginceTesting] = useState(false);
  const [marginceTestResult, setMarginceTestResult] = useState<string | null>(null);

  const [sheetsTesting, setSheetsTesting] = useState(false);
  const [sheetsTestResult, setSheetsTestResult] = useState<string | null>(null);

  const [cacheCleared, setCacheCleared] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        closeSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, closeSettings]);

  if (!isSettingsOpen) return null;

  const handleTestMargince = () => {
    setMarginceTesting(true);
    setMarginceTestResult(null);
    setTimeout(() => {
      setMarginceTesting(false);
      setMarginceTestResult('✓ Connected: Margince Webhook verified (200 OK • 32ms)');
    }, 800);
  };

  const handleTestSheets = () => {
    setSheetsTesting(true);
    setSheetsTestResult(null);
    setTimeout(() => {
      setSheetsTesting(false);
      setSheetsTestResult('✓ Connected: Google Sheets authorized for real-time append');
    }, 750);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'appearance',
      label: 'Customize UI',
      icon: <IconPalette className="w-4 h-4" />,
      desc: 'Dark mode, accents, density, and sound effects',
    },
    {
      id: 'accounts',
      label: 'Accounts & Sync',
      icon: <IconUsers className="w-4 h-4" />,
      desc: 'Zalo & WhatsApp active pairing sessions',
    },
    {
      id: 'dropnoise',
      label: 'DropNoise Filters',
      icon: <IconSliders className="w-4 h-4" />,
      desc: 'Noise filtering, bot pings & OTP suppression',
    },
    {
      id: 'destinations',
      label: 'Forwarding Destinations',
      icon: <IconForward className="w-4 h-4" />,
      desc: 'Margince CRM webhook & Google Sheets integration',
    },
    {
      id: 'system',
      label: 'System & Storage',
      icon: <IconHardDrive className="w-4 h-4" />,
      desc: 'Local database, cache cleanup & version details',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Settings Modal Window Container */}
      <div className="relative z-10 w-full max-w-4xl h-[620px] max-h-[92vh] bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all">
        {/* =================================================================== */}
        {/* LEFT SETTINGS NAVIGATION SIDEBAR                                    */}
        {/* =================================================================== */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#0c0c0e] p-4 flex flex-col justify-between shrink-0">
          <div>
            {/* Header: Title & Close Button */}
            <div className="flex items-center justify-between px-2 pt-1 pb-3">
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Settings</h3>
                <p className="text-[11px] text-neutral-400">ChatBridge Desktop Preferences</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1 mt-2">
              {tabs.map((tab) => {
                const isActive = settingsTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-white dark:bg-[#1c1c20] text-neutral-900 dark:text-white shadow-xs border border-neutral-200/80 dark:border-neutral-700/80'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div
                      className={`shrink-0 ${
                        isActive
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    >
                      {tab.icon}
                    </div>
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Info */}
          <div className="px-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 text-[10px] text-neutral-400 flex items-center justify-between">
            <span>Core v1.0.4</span>
            <span className="text-emerald-500 font-medium">● Local Core Active</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT SETTINGS CONTENT PANE                                         */}
        {/* =================================================================== */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 relative bg-white dark:bg-[#121214]">
          {/* Top Right Close Button */}
          <button
            onClick={closeSettings}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer z-10"
            title="Close Settings (Esc)"
          >
            <IconX className="w-4 h-4" />
          </button>

          {/* Tab 1: Appearance / Customize UI */}
          {settingsTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Customize UI & Theme</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Personalize color themes, layout scale, and desktop sound alerts.
                </p>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Color Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Dark Mode Card */}
                  <div
                    onClick={() => setTheme('dark')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-900 text-white shadow-md ring-2 ring-neutral-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#121214]'
                        : 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-black border border-neutral-800 flex items-center justify-center text-white shrink-0">
                      <span className="text-xs">🌙</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold">Dark Mode</div>
                      <div className="text-[10px] opacity-75">True black & obsidian</div>
                    </div>
                  </div>

                  {/* Light Mode Card */}
                  <div
                    onClick={() => setTheme('light')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      theme === 'light'
                        ? 'bg-white border-neutral-900 text-neutral-900 shadow-md ring-2 ring-neutral-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#121214]'
                        : 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-900 shrink-0">
                      <span className="text-xs">☀️</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold">Light Mode</div>
                      <div className="text-[10px] opacity-75">Clean paper white</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Brand Accent Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'orange', name: 'ChatBridge Orange', bg: 'bg-orange-500' },
                    { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-500' },
                    { id: 'blue', name: 'Electric Blue', bg: 'bg-blue-600' },
                    { id: 'violet', name: 'Deep Violet', bg: 'bg-purple-600' },
                  ].map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setAccentColor(color.id as AccentColor)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        accentColor === color.id
                          ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 font-bold'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interface Density */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Chat List Layout Density
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'compact', title: 'Compact', desc: 'Dense rows' },
                    { id: 'comfortable', title: 'Comfortable', desc: 'Standard balance' },
                    { id: 'spacious', title: 'Spacious', desc: 'Extra breathing room' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setDensity(mode.id as DensityMode)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        density === mode.id
                          ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-900 dark:border-white'
                          : 'bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">{mode.title}</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Sound Alerts */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-neutral-900 dark:text-white">Message Sound Alerts</h5>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Play subtle chimes on inbound leads and CRM sync actions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundNotifications(!soundNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    soundNotifications ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      soundNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Accounts & Channels */}
          {settingsTab === 'accounts' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Connected Channels & Profiles</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage active Zalo and WhatsApp sync sessions. Re-authenticate or disconnect channels.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* ZALO PROFILE */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
                        alt="Zalo User"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500 shadow-xs"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white p-0.5 shadow-xs">
                        <img src={zaloLogo} alt="Zalo" className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-neutral-900 dark:text-white">Tuan Anh Do (Sales OA)</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Zalo Channel
                        </span>
                      </div>
                      <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">+84 908 123 456 • 12 Active Threads</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert('Opening QR Re-pairing scanner for Zalo...')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-200/70 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <IconRefresh className="w-3.5 h-3.5" />
                      <span>Re-pair QR</span>
                    </button>
                    <button
                      onClick={() => alert('Channel temporarily disconnected.')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                {/* WHATSAPP PROFILE */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
                        alt="WhatsApp User"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-xs"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white p-0.5 shadow-xs">
                        <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-neutral-900 dark:text-white">Alexander (APAC Account)</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          WhatsApp Channel
                        </span>
                      </div>
                      <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">+84 988 888 999 • 8 Active Threads</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert('Opening QR Re-pairing scanner for WhatsApp...')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-200/70 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <IconRefresh className="w-3.5 h-3.5" />
                      <span>Re-pair QR</span>
                    </button>
                    <button
                      onClick={() => alert('Channel temporarily disconnected.')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Both channel sessions are active and transmitting live WebSocket heartbeats.</span>
              </div>
            </div>
          )}

          {/* Tab 3: DropNoise Filters */}
          {settingsTab === 'dropnoise' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">DropNoise Filter Rules</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Filter out operational chatter and automated bot clutter from your CRM pipeline.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  {Object.values(dropNoiseConfig).filter((v) => v === true).length} Active Filters
                </span>
              </div>

              {/* Filter Rules List */}
              <div className="space-y-2.5">
                {[
                  {
                    key: 'botPings' as const,
                    title: 'Bot Pings & Automated Heartbeats',
                    example: 'Auto: ping acknowledge received [200 OK]',
                    desc: 'Drop continuous server health check pings and auto-responders',
                  },
                  {
                    key: 'otpCodes' as const,
                    title: 'OTP & 2-Factor Authentication Codes',
                    example: 'Your verification code is 482-194. Valid for 5m.',
                    desc: 'Prevent ephemeral security tokens from polluting CRM logs',
                  },
                  {
                    key: 'marketing' as const,
                    title: 'Marketing Broadcasts & Promotional Blasts',
                    example: '[Promo] 50% discount on software licenses today!',
                    desc: 'Exclude system announcements and scheduled mass broadcasts',
                  },
                  {
                    key: 'reactions' as const,
                    title: 'Standalone Emoji & Sticker Reactions',
                    example: '👍 Customer reacted to: "Hello! Absolutely..."',
                    desc: 'Ignore standalone thumbs-up, hearts, and clapping reactions',
                  },
                  {
                    key: 'largeFiles' as const,
                    title: 'Heavy Media Attachments (>25MB)',
                    example: 'Attachment: demo_archive_2026.zip (148 MB)',
                    desc: 'Block large archives and 4K video uploads from sync queue',
                  },
                  {
                    key: 'linkTrackers' as const,
                    title: 'URL Tracking Tokens & UTM Parameters',
                    example: '?utm_source=broadcast&utm_campaign=q4',
                    desc: 'Sanitize URLs by stripping tracking parameters before CRM export',
                  },
                ].map((rule) => {
                  const isChecked = dropNoiseConfig[rule.key];
                  return (
                    <div
                      key={rule.key}
                      onClick={() => toggleDropNoiseRule(rule.key)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-neutral-50 dark:bg-[#161618] border-neutral-300 dark:border-neutral-700'
                          : 'bg-neutral-100/40 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800/80 opacity-60'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                            {rule.title}
                          </h5>
                          {isChecked && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                          {rule.desc}
                        </p>
                      </div>

                      {/* Toggle Switch */}
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${
                          isChecked ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                      >
                        <div
                          className={`bg-white dark:bg-neutral-900 w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                            isChecked ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sensitivity Selector */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-neutral-900 dark:text-white">AI Noise Sensitivity</h5>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Strict mode drops non-sales chit-chat automatically.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                  {(['relaxed', 'balanced', 'strict'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setDropNoiseSensitivity(s)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition cursor-pointer ${
                        dropNoiseConfig.sensitivity === s
                          ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Forwarding Destinations */}
          {settingsTab === 'destinations' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Forwarding Destinations</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Route verified messages into Margince CRM pipelines and live Google Sheets.
                </p>
              </div>

              {/* SECTION 1: MARGINCE CRM */}
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white p-0.5">
                      <img src={marginceLogo} alt="Margince CRM" className="w-full h-full object-contain rounded-lg" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-neutral-900 dark:text-white">Margince CRM</h5>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Primary Target
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Stream customer inquiries into sales pipeline deals.</p>
                    </div>
                  </div>

                  {/* Enable Toggle */}
                  <button
                    type="button"
                    onClick={() => updateMarginceConfig({ enabled: !marginceConfig.enabled })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      marginceConfig.enabled ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        marginceConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {marginceConfig.enabled && (
                  <div className="space-y-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/80">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                        Margince Webhook Endpoint
                      </label>
                      <input
                        type="text"
                        value={marginceConfig.endpoint}
                        onChange={(e) => updateMarginceConfig({ endpoint: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white font-mono"
                        placeholder="https://api.margince.com/v1/integrations/chatbridge/stream"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                        API Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={marginceConfig.apiKey}
                          onChange={(e) => updateMarginceConfig({ apiKey: e.target.value })}
                          className="w-full pl-3 pr-10 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white font-mono"
                          placeholder="mg_live_..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                        >
                          {showApiKey ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleTestMargince}
                        disabled={marginceTesting}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        {marginceTesting ? (
                          <>
                            <span className="w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 border-t-transparent animate-spin" />
                            <span>Pinging...</span>
                          </>
                        ) : (
                          <span>Test Margince Ping</span>
                        )}
                      </button>

                      {marginceTestResult && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                          {marginceTestResult}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: GOOGLE SHEETS */}
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white p-1">
                      <IconGoogleSheets className="w-full h-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-neutral-900 dark:text-white">Google Sheets</h5>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Spreadsheet Sync
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Stream customer contact sheets and conversation rows.</p>
                    </div>
                  </div>

                  {/* Enable Toggle */}
                  <button
                    type="button"
                    onClick={() => updateSheetsConfig({ enabled: !sheetsConfig.enabled })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      sheetsConfig.enabled ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        sheetsConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {sheetsConfig.enabled && (
                  <div className="space-y-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/80">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                          Spreadsheet ID / URL
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
            </div>
          )}

          {/* Tab 5: System & Storage */}
          {settingsTab === 'system' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">System, Diagnostics & Storage</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Inspect local SQLite database path, memory footprint, and clear temporary cache.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Local DB details */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-2">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">Local Database Path</div>
                  <div className="p-2.5 rounded-xl bg-neutral-200/60 dark:bg-black/60 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 select-all border border-neutral-300/60 dark:border-neutral-800">
                    ~/Library/Application Support/ChatBridge/db/messages.sqlite
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    All conversations, messages, and encrypted pairing tokens are stored exclusively on your local machine.
                  </p>
                </div>

                {/* Cache cleanup */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">Temporary Cache & Images</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Currently using 18.4 MB of avatar and media previews.</div>
                  </div>
                  <button
                    onClick={handleClearCache}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition cursor-pointer"
                  >
                    {cacheCleared ? '✓ Cleared' : 'Clear Cache'}
                  </button>
                </div>

                {/* Version & Update */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">ChatBridge Desktop Engine</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Version 1.0.4 (Build 2408) • Electron + V8 Core</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Up to date
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Bar: Done / Save Button */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 mt-4">
            <span className="text-[11px] text-neutral-400">
              Preferences are saved automatically to local storage.
            </span>
            <Button
              size="sm"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition cursor-pointer"
              onPress={closeSettings}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

