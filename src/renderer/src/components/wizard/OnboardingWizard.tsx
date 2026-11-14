import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import marginceLogo from '../../assets/margince-logo.svg';
import { BrandLogo } from '../Logo.js';
import { AmbientWavesBackground } from './AmbientWavesBackground.js';
import { useAppStore } from '../../store/useAppStore.js';
import { useChatBridgeStore } from '../../store/useChatBridgeStore.js';
import { formatChatTime, formatMessageDayDivider, getMessageDateKey } from '../../utils/formatters.js';
import type { Chat, Message } from '@shared/types.js';

// --- CUSTOM CLEAN INLINE SVG ICONS (NO LUCIDE-REACT DEPENDENCY) ---
function IconGoogleSheets({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 4H12C9.79 4 8 5.79 8 8V40C8 42.21 9.79 44 12 44H36C38.21 44 40 42.21 40 40V14L30 4Z" fill="#107C41" />
      <path d="M30 4V14H40L30 4Z" fill="#0C592E" />
      <rect x="15" y="20" width="18" height="16" rx="1.5" fill="white" fillOpacity="0.95" />
      <path d="M15 25.5H33M15 31H33M21 20V36M27 20V36" stroke="#107C41" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCheckCheck({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-7.5 7.5L13 16" />
    </svg>
  );
}

function IconUsers({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconArrowLeft({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconClose({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconQrCode({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconRotateCcw({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function IconSmartphone({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function IconBuilding({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="18" />
      <line x1="15" y1="22" x2="15" y2="18" />
      <line x1="9" y1="6" x2="9.01" y2="6" />
      <line x1="15" y1="6" x2="15.01" y2="6" />
      <line x1="9" y1="10" x2="9.01" y2="10" />
      <line x1="15" y1="10" x2="15.01" y2="10" />
      <line x1="9" y1="14" x2="9.01" y2="14" />
      <line x1="15" y1="14" x2="15.01" y2="14" />
    </svg>
  );
}

function IconSheet({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function IconRocket({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </svg>
  );
}

function IconSparkle({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
    </svg>
  );
}

function IconAlertCircle({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconUser({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// --- MAIN WIZARD COMPONENT ---
// Static theme colors for AmbientWavesBackground matching ChatBridge brand + channels
const AMBIENT_PAPER_COLOR = '#000000';
const AMBIENT_WAVE_COLORS: [string, string, string] = ['#ea580c', '#2563eb', '#10b981'];

// Generate long realistic conversation history grouped across days with both user's avatar & contact's avatar
function getEnrichedChatMessages(chat: Chat, existingMessages: Message[], myName: string): Message[] {
  if (existingMessages.length >= 6) {
    return existingMessages;
  }

  const contactFirst = chat.name.split(' ')[0];

  return [
    // Day 1: Yesterday
    {
      id: `${chat.id}-m1`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'inbound',
      time: '2026-11-13T09:15:00.000Z',
      from: { accountId: chat.thread, displayName: chat.name },
      to: [{ accountId: 'self', displayName: myName }],
      text: `Hi ${myName.split(' ')[0]}! Could you please send over the latest quotation, SLA terms, and integration specs for our engineering team?`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m2`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'outbound',
      time: '2026-11-13T09:22:00.000Z',
      from: { accountId: 'self', displayName: myName },
      to: [{ accountId: chat.thread, displayName: chat.name }],
      text: `Hello ${contactFirst}! Absolutely. I have compiled the complete technical documentation, security compliance sheet, and enterprise pricing breakdown.`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m4`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'inbound',
      time: '2026-11-13T10:05:00.000Z',
      from: { accountId: chat.thread, displayName: chat.name },
      to: [{ accountId: 'self', displayName: myName }],
      text: `Thanks for the swift turnaround! Our VP of Product and technical leads are reviewing the SLA right now.`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m5`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'outbound',
      time: '2026-11-13T10:18:00.000Z',
      from: { accountId: 'self', displayName: myName },
      to: [{ accountId: chat.thread, displayName: chat.name }],
      text: `Sounds great. Let me know if you would like a brief 15-minute walkthrough of the sandbox environment as well.`,
      isSynced: true,
    },
    // Day 2: Today
    {
      id: `${chat.id}-m6`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'inbound',
      time: '2026-11-14T08:30:00.000Z',
      from: { accountId: chat.thread, displayName: chat.name },
      to: [{ accountId: 'self', displayName: myName }],
      text: `Good morning ${myName.split(' ')[0]}! We reviewed the pricing proposal with leadership this morning. Everything looks approved and ready for sign-off.`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m8`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'outbound',
      time: '2026-11-14T09:10:00.000Z',
      from: { accountId: 'self', displayName: myName },
      to: [{ accountId: chat.thread, displayName: chat.name }],
      text: `That is fantastic news! I have prepared the contract agreement and live deployment schedule. Let's arrange a kickoff call tomorrow at 10:00 AM.`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m9`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'inbound',
      time: '2026-11-14T09:25:00.000Z',
      from: { accountId: chat.thread, displayName: chat.name },
      to: [{ accountId: 'self', displayName: myName }],
      text: `10:00 AM works perfectly for our whole department. Please send over the calendar invite and final DocuSign link!`,
      isSynced: true,
    },
  ];
}

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const theme = useAppStore((s) => s.theme);
  const chats = useChatBridgeStore((s) => s.chats);
  const messages = useChatBridgeStore((s) => s.messages);
  const batchSyncChats = useChatBridgeStore((s) => s.batchSyncChats);

  // 5 Dedicated Steps:
  // Step 1: Connect Account (Clean flip card -> QR -> Logged in profile)
  // Step 2: DropNoise Filters (Reactions, Message Edits, Stickers, Stories)
  // Step 3: Select Conversations (Zalo & WhatsApp with 1:1 contact list)
  // Step 4: Sync History Range (3, 6, 12 months, All Time)
  // Step 5: Choose Destination (Margince CRM / Google Sheets / Skip)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // --- STEP 1: MUTUALLY EXCLUSIVE FLIP CARD STATE ---
  const [activeFlippedChannel, setActiveFlippedChannel] = useState<'zalo' | 'whatsapp' | null>(null);

  // Independent connected profiles: 1 Zalo slot + 1 WhatsApp slot (starts null so user can test scanning!)
  const [zaloProfile, setZaloProfile] = useState<{
    name: string;
    phone: string;
    avatar: string;
  } | null>(null);

  const [whatsAppProfile, setWhatsAppProfile] = useState<{
    name: string;
    phone: string;
    avatar: string;
  } | null>(null);

  const [qrCountdown, setQrCountdown] = useState<number>(60);
  const [qrSeed, setQrSeed] = useState<number>(1);

  const hasConnectedAtLeastOne = Boolean(zaloProfile || whatsAppProfile);
  const hasBothAccounts = Boolean(zaloProfile && whatsAppProfile);

  // Countdown timer when a card is flipped to QR
  useEffect(() => {
    if (step !== 1 || !activeFlippedChannel) return;

    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, activeFlippedChannel]);

  // Flip handlers: Clicking one automatically flips the other back
  const handleFlipCard = (channel: 'zalo' | 'whatsapp') => {
    if (channel === 'zalo' && zaloProfile) return;
    if (channel === 'whatsapp' && whatsAppProfile) return;

    setActiveFlippedChannel(channel);
    setQrCountdown(60);
  };

  const handleRegenerateQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQrCountdown(60);
    setQrSeed((s) => s + 1);
  };

  const handleSimulateScan = (channel: 'zalo' | 'whatsapp') => {
    if (channel === 'zalo') {
      setZaloProfile({
        name: 'Sale Personal',
        phone: '+84 901 123 456',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      });
    } else {
      setWhatsAppProfile({
        name: 'Sale Gradion',
        phone: '+84 988 889 999',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      });
    }

    setActiveFlippedChannel(null);
  };

  // --- STEP 2: DROPNOISE FILTER BADGES (Reactions, Edits, Stickers, Stories) ---
  const [dropNoiseFilters, setDropNoiseFilters] = useState<{
    reactions: boolean;
    edits: boolean;
    stickers: boolean;
    stories: boolean;
  }>({
    reactions: true,
    edits: true,
    stickers: true,
    stories: true,
  });

  const toggleDropNoise = (key: keyof typeof dropNoiseFilters) => {
    setDropNoiseFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAllDropNoise = () => {
    setDropNoiseFilters({
      reactions: true,
      edits: true,
      stickers: true,
      stories: true,
    });
  };

  const clearAllDropNoise = () => {
    setDropNoiseFilters({
      reactions: false,
      edits: false,
      stickers: false,
      stories: false,
    });
  };

  const activeDropCount = Object.values(dropNoiseFilters).filter(Boolean).length;

  const dropNoiseBadgeList = [
    { key: 'reactions' as const, label: 'Reactions' },
    { key: 'edits' as const, label: 'Message Edits' },
    { key: 'stickers' as const, label: 'Stickers' },
    { key: 'stories' as const, label: 'Stories & Status' },
  ];

  // --- STEP 3: CONVERSATION SYNC SCOPE ---
  // Channel state: If both are logged in, flow goes Zalo -> WhatsApp. If single channel, only that channel is shown.
  const [step3Channel, setStep3Channel] = useState<'zalo' | 'whatsapp'>('zalo');

  useEffect(() => {
    if (zaloProfile) {
      setStep3Channel('zalo');
    } else if (whatsAppProfile) {
      setStep3Channel('whatsapp');
    }
  }, [zaloProfile, whatsAppProfile]);

  const zaloChats = chats.filter((c) => c.network === 'zalo');
  const whatsAppChats = chats.filter((c) => c.network === 'whatsapp');
  const displayedChats = step3Channel === 'zalo' ? zaloChats : whatsAppChats;
  const isZaloChannel = step3Channel === 'zalo';

  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([
    'zalo-grad-david',
    'zalo-pers-alex',
    'wa-grad-marcus',
    'zalo-grad-amanda',
  ]);

  // Selected chat for preview on the right pane in Step 3
  const [previewChatId, setPreviewChatId] = useState<string>('zalo-grad-david');

  // Auto-switch preview chat when step3Channel changes or if previewChatId is invalid
  useEffect(() => {
    const cur = chats.find((c) => c.id === previewChatId);
    if (!cur || cur.network !== step3Channel) {
      const firstInChannel = displayedChats[0];
      if (firstInChannel) {
        setPreviewChatId(firstInChannel.id);
      }
    }
  }, [step3Channel, displayedChats, previewChatId, chats]);

  // Ensure previewChatId points to a valid chat
  const activePreviewChat =
    chats.find((c) => c.id === previewChatId) || displayedChats[0] || chats[0];

  const myAvatar =
    (step3Channel === 'zalo' ? zaloProfile?.avatar : whatsAppProfile?.avatar) ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces';
  const myName =
    (step3Channel === 'zalo' ? zaloProfile?.name : whatsAppProfile?.name) || 'You';

  const toggleChatSelect = (id: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectCurrentChannel = () => {
    const currentChannelIds = displayedChats.map((c) => c.id);
    const allSelected = currentChannelIds.every((id) => selectedChatIds.includes(id));

    if (allSelected) {
      setSelectedChatIds((prev) => prev.filter((id) => !currentChannelIds.includes(id)));
    } else {
      setSelectedChatIds((prev) => Array.from(new Set([...prev, ...currentChannelIds])));
    }
  };

  // --- STEP 4: SYNC HISTORY RANGE ---
  const [syncHistoryRange, setSyncHistoryRange] = useState<'3m' | '6m' | '12m' | 'all'>('6m');

  // --- STEP 5: DESTINATION SELECTION ---
  const [selectedDestinations, setSelectedDestinations] = useState<{
    margince: boolean;
    sheets: boolean;
  }>({
    margince: false,
    sheets: false,
  });

  const hasConnectedDestination = Boolean(
    selectedDestinations.margince || selectedDestinations.sheets
  );

  const handleFinishWizard = async () => {
    if (selectedChatIds.length > 0) {
      await batchSyncChats(selectedChatIds, true);
    }
    onComplete();
  };

  // Retrieve messages for activePreviewChat in Step 3
  const rawPreviewChatMessages = messages.filter((m) => m.thread === activePreviewChat?.thread);
  const displayedMessages = activePreviewChat
    ? getEnrichedChatMessages(activePreviewChat, rawPreviewChatMessages, myName)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none bg-[#07080a] overflow-hidden animate-in fade-in duration-300">
      {/* Dedicated First-Run Ambient Lighting Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[520px] h-[520px] rounded-full bg-orange-600/12 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[640px] h-[640px] rounded-full bg-emerald-600/12 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full bg-blue-600/8 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Top subtle setup badge */}
      <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl text-[11px] text-neutral-400 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium tracking-wide">ChatBridge Core • Initial Setup</span>
      </div>

      {/* 2-Column Split Modal Card: 50% Left & 50% Right Equal Width */}
      <div className="relative z-10 w-full max-w-5xl lg:max-w-6xl h-[680px] max-h-[94vh] bg-white dark:bg-[#111113] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all">
        {/* =================================================================== */}
        {/* LEFT COLUMN: STEPS & CONTROLS (EQUAL 50% WIDTH)                    */}
        {/* =================================================================== */}
        <div className="flex flex-col justify-between p-6 sm:p-7 overflow-y-auto relative min-h-0">
          <div>
            {/* Top Bar: Brand Logo (No exit/skip button: User must complete onboarding) */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center">
                <BrandLogo isDark={theme === 'dark'} className="h-7 w-auto" />
              </div>
            </div>

            {/* Segmented Progress Bar: 5 Full Steps */}
            <div className="flex items-center gap-2 mt-4 mb-3.5">
              {/* Segment 1 */}
              <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full bg-neutral-900 dark:bg-white transition-all duration-500 ${
                    step >= 1 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Segment 2 */}
              <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full bg-neutral-900 dark:bg-white transition-all duration-500 ${
                    step >= 2 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Segment 3: Loads 1/2 if 2 accounts logged in on first account (Zalo), fills to 100% on WhatsApp */}
              <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full bg-neutral-900 dark:bg-white transition-all duration-500 ${
                    step > 3
                      ? 'w-full'
                      : step === 3
                      ? hasBothAccounts
                        ? step3Channel === 'zalo'
                          ? 'w-1/2'
                          : 'w-full'
                        : 'w-full'
                      : 'w-0'
                  }`}
                />
              </div>

              {/* Segment 4: Sync History Range */}
              <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full bg-neutral-900 dark:bg-white transition-all duration-500 ${
                    step >= 4 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Segment 5: Forwarding Destination */}
              <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full bg-neutral-900 dark:bg-white transition-all duration-500 ${
                    step >= 5 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            </div>

            {/* Step Heading and Subtitle */}
            <div className="mb-3">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {step === 1 && 'Connect Your Messaging Account'}
                {step === 2 && 'DropNoise Filters'}
                {step === 3 &&
                  (hasBothAccounts
                    ? step3Channel === 'zalo'
                      ? 'Select Zalo Conversations'
                      : 'Select WhatsApp Conversations'
                    : `Select ${step3Channel === 'zalo' ? 'Zalo' : 'WhatsApp'} Conversations`)}
                {step === 4 && 'Select Sync History Range'}
                {step === 5 && 'Choose Forwarding Destination'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                {step === 1 &&
                  (hasConnectedAtLeastOne
                    ? 'Account connected. You can link the second channel or proceed to DropNoise.'
                    : 'Click Zalo or WhatsApp below to scan its QR code and link your account.')}
                {step === 2 &&
                  'Filter clutter, keep message edit audit trails, and strip non-sales noise.'}
                {step === 3 &&
                  (hasBothAccounts
                    ? step3Channel === 'zalo'
                      ? 'Pick customer conversations you want to synchronize into CRM (Stage 1: Zalo).'
                      : 'Pick customer conversations you want to synchronize into CRM (Stage 2: WhatsApp).'
                    : `Pick ${step3Channel === 'zalo' ? 'Zalo' : 'WhatsApp'} customer conversations you want to synchronize into CRM.`)}
                {step === 4 &&
                  'Choose how far back to import customer conversation history into your CRM pipeline.'}
                {step === 5 &&
                  'Route synchronized leads and conversations to Margince CRM or Google Sheets.'}
              </p>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 my-1 min-h-0">
            {/* =============================================================== */}
            {/* STEP 1: MUTUALLY EXCLUSIVE FLIP CARD (SCAN & FLIP TO PROFILE)    */}
            {/* =============================================================== */}
            {step === 1 && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* CARD 1: ZALO FLIP CARD */}
                  <div
                    onClick={() => handleFlipCard('zalo')}
                    className={`relative h-[290px] w-full perspective-1000 ${
                      zaloProfile ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <div
                      className={`w-full h-full duration-700 transform-style-3d transition-transform ${
                        activeFlippedChannel === 'zalo' ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* FRONT FACE: Initial Invitation OR Logged In Profile */}
                      <div
                        className={`absolute inset-0 backface-hidden rounded-2xl p-4 border flex flex-col justify-between transition-all group shadow-xs ${
                          zaloProfile
                            ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-500/80 dark:border-blue-500/80 ring-2 ring-blue-500/20'
                            : 'border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#161618] hover:border-blue-500/80 hover:bg-blue-50/20 dark:hover:bg-blue-950/20'
                        }`}
                      >
                        {zaloProfile ? (
                          // 1. LOGGED IN PROFILE VIEW (Clean, No Tech Jargon)
                          <div className="flex-1 flex flex-col justify-between animate-in zoom-in-95 duration-300">
                            <div className="flex items-start justify-between">
                              <div className="relative">
                                <img
                                  src={zaloProfile.avatar}
                                  alt={zaloProfile.name}
                                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white p-0.5 shadow-sm">
                                  <img src={zaloLogo} alt="Zalo" className="w-full h-full object-cover rounded-full" />
                                </div>
                              </div>
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            </div>

                            <div className="space-y-1 pt-3">
                              <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                                {zaloProfile.name}
                              </h4>
                              <p className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400">
                                {zaloProfile.phone}
                              </p>
                            </div>

                            <div className="pt-2 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Ready to sync</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setZaloProfile(null);
                                  handleFlipCard('zalo');
                                }}
                                className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                              >
                                Re-scan
                              </button>
                            </div>
                          </div>
                        ) : (
                          // 2. INITIAL UNCONNECTED INVITATION VIEW
                          <>
                            <div className="flex items-start justify-between">
                              <div className="w-12 h-12 rounded-xl bg-white shadow-xs p-1 ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center overflow-hidden">
                                <img src={zaloLogo} alt="Zalo" className="w-full h-full object-cover rounded-lg" />
                              </div>
                            </div>

                            <div>
                              <h4 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                Zalo Account
                              </h4>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                Pair your personal sales account or official OA to start syncing.
                              </p>
                            </div>

                            <div className="w-full py-2.5 px-3 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition">
                              <IconQrCode className="w-3.5 h-3.5" />
                              <span>Click to Pair Zalo</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* BACK FACE: QR Code Pairing View */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-3 border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-[#18181b] flex flex-col items-center justify-between shadow-md cursor-default"
                      >
                        <div className="w-full flex items-center justify-between px-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                          <div className="flex items-center gap-1.5">
                            <img src={zaloLogo} alt="Zalo" className="w-3.5 h-3.5 rounded-full" />
                            <span>Zalo QR Code</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-neutral-400">
                              {qrCountdown > 0 ? `00:${qrCountdown < 10 ? `0${qrCountdown}` : qrCountdown}` : 'Expired'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFlippedChannel(null);
                              }}
                              className="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer px-1 py-0.5 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Crisp SVG QR Code Grid */}
                        <div className="relative w-36 h-36 rounded-xl bg-neutral-900 dark:bg-white p-2 flex flex-wrap gap-1 shadow-inner overflow-hidden">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-[23px] h-[23px] rounded-xs ${
                                (i % 2 === 0 && (i + qrSeed) % 3 !== 0) || i === 0 || i === 4 || i === 20
                                  ? 'bg-white dark:bg-neutral-900'
                                  : 'bg-transparent'
                              }`}
                            />
                          ))}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 rounded-lg bg-white p-0.5 ring-2 ring-neutral-900 dark:ring-white shadow-md flex items-center justify-center">
                              <img src={zaloLogo} alt="Zalo" className="w-full h-full object-cover rounded-md" />
                            </div>
                          </div>

                          {qrCountdown === 0 && (
                            <div className="absolute inset-0 bg-black/85 backdrop-blur-2xs flex flex-col items-center justify-center p-2 text-center">
                              <IconAlertCircle className="w-5 h-5 text-amber-400 mb-1" />
                              <span className="text-[10px] font-bold text-white">Expired</span>
                              <button
                                onClick={handleRegenerateQR}
                                className="mt-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <IconRotateCcw className="w-2.5 h-2.5" />
                                <span>Regen</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Back Actions: Refresh + Simulate Scan */}
                        <div className="w-full flex items-center gap-1.5 pt-1">
                          <button
                            onClick={handleRegenerateQR}
                            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[10px] font-medium transition cursor-pointer"
                            title="Regenerate code"
                          >
                            <IconRotateCcw className="w-4 h-4" />
                          </button>
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                            onPress={() => handleSimulateScan('zalo')}
                          >
                            <IconSmartphone className="w-3.5 h-3.5" />
                            <span>Simulate Scan</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: WHATSAPP FLIP CARD */}
                  <div
                    onClick={() => handleFlipCard('whatsapp')}
                    className={`relative h-[290px] w-full perspective-1000 ${
                      whatsAppProfile ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <div
                      className={`w-full h-full duration-700 transform-style-3d transition-transform ${
                        activeFlippedChannel === 'whatsapp' ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* FRONT FACE: Initial Invitation OR Logged In Profile */}
                      <div
                        className={`absolute inset-0 backface-hidden rounded-2xl p-4 border flex flex-col justify-between transition-all group shadow-xs ${
                          whatsAppProfile
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/80 dark:border-emerald-500/80 ring-2 ring-emerald-500/20'
                            : 'border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#161618] hover:border-emerald-500/80 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20'
                        }`}
                      >
                        {whatsAppProfile ? (
                          // 1. LOGGED IN PROFILE VIEW (Clean, No Tech Jargon)
                          <div className="flex-1 flex flex-col justify-between animate-in zoom-in-95 duration-300">
                            <div className="flex items-start justify-between">
                              <div className="relative">
                                <img
                                  src={whatsAppProfile.avatar}
                                  alt={whatsAppProfile.name}
                                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white p-0.5 shadow-sm">
                                  <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
                                </div>
                              </div>
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Connected</span>
                              </span>
                            </div>

                            <div className="space-y-1 pt-3">
                              <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                                {whatsAppProfile.name}
                              </h4>
                              <p className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                {whatsAppProfile.phone}
                              </p>
                            </div>

                            <div className="pt-2 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Ready to sync</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWhatsAppProfile(null);
                                  handleFlipCard('whatsapp');
                                }}
                                className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                              >
                                Re-scan
                              </button>
                            </div>
                          </div>
                        ) : (
                          // 2. INITIAL UNCONNECTED INVITATION VIEW
                          <>
                            <div className="flex items-start justify-between">
                              <div className="w-12 h-12 rounded-xl bg-white shadow-xs p-1 ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center overflow-hidden">
                                <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-cover rounded-lg" />
                              </div>
                            </div>

                            <div>
                              <h4 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                                WhatsApp Account
                              </h4>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                Link international WhatsApp personal or business profiles.
                              </p>
                            </div>

                            <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition">
                              <IconQrCode className="w-3.5 h-3.5" />
                              <span>Click to Pair WhatsApp</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* BACK FACE: QR Code Pairing View */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-3 border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-[#18181b] flex flex-col items-center justify-between shadow-md cursor-default"
                      >
                        <div className="w-full flex items-center justify-between px-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                          <div className="flex items-center gap-1.5">
                            <img src={whatsappLogo} alt="WhatsApp" className="w-3.5 h-3.5 rounded-full" />
                            <span>WhatsApp QR Code</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-neutral-400">
                              {qrCountdown > 0 ? `00:${qrCountdown < 10 ? `0${qrCountdown}` : qrCountdown}` : 'Expired'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFlippedChannel(null);
                              }}
                              className="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer px-1 py-0.5 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Crisp SVG QR Code Grid */}
                        <div className="relative w-36 h-36 rounded-xl bg-neutral-900 dark:bg-white p-2 flex flex-wrap gap-1 shadow-inner overflow-hidden">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-[23px] h-[23px] rounded-xs ${
                                (i % 2 === 0 && (i + qrSeed) % 3 !== 0) || i === 0 || i === 4 || i === 20
                                  ? 'bg-white dark:bg-neutral-900'
                                  : 'bg-transparent'
                              }`}
                            />
                          ))}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 rounded-lg bg-white p-0.5 ring-2 ring-neutral-900 dark:ring-white shadow-md flex items-center justify-center">
                              <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-cover rounded-md" />
                            </div>
                          </div>

                          {qrCountdown === 0 && (
                            <div className="absolute inset-0 bg-black/85 backdrop-blur-2xs flex flex-col items-center justify-center p-2 text-center">
                              <IconAlertCircle className="w-5 h-5 text-amber-400 mb-1" />
                              <span className="text-[10px] font-bold text-white">Expired</span>
                              <button
                                onClick={handleRegenerateQR}
                                className="mt-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <IconRotateCcw className="w-2.5 h-2.5" />
                                <span>Regen</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Back Actions: Refresh + Simulate Scan */}
                        <div className="w-full flex items-center gap-1.5 pt-1">
                          <button
                            onClick={handleRegenerateQR}
                            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[10px] font-medium transition cursor-pointer"
                            title="Regenerate code"
                          >
                            <IconRotateCcw className="w-4 h-4" />
                          </button>
                          <Button
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                            onPress={() => handleSimulateScan('whatsapp')}
                          >
                            <IconSmartphone className="w-3.5 h-3.5" />
                            <span>Simulate Scan</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* STEP 2: YOUTUBE-STYLE HORIZONTAL PILL BADGES                     */}
            {/* =============================================================== */}
            {step === 2 && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Control bar: Title, counter, select all / reset */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Filter Badges
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {activeDropCount} of {dropNoiseBadgeList.length} Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={selectAllDropNoise}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <button
                      onClick={clearAllDropNoise}
                      className="font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Horizontal YouTube-Style Pill Buttons */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {dropNoiseBadgeList.map((badge) => {
                    const isActive = dropNoiseFilters[badge.key];
                    return (
                      <button
                        key={badge.key}
                        type="button"
                        onClick={() => toggleDropNoise(badge.key)}
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
            )}

            {/* =============================================================== */}
            {/* STEP 3: CONVERSATION SELECTION SCOPE                            */}
            {/* NO 2 TABS! DIRECT CHANNEL DISPLAY + 1:1 MAIN UI CONTACT LIST    */}
            {/* =============================================================== */}
            {step === 3 && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Channel sub-bar: Selected count & Select All toggle (Removed redundant text) */}
                <div className="flex items-center justify-between px-1 pb-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={isZaloChannel ? zaloLogo : whatsappLogo}
                      alt={isZaloChannel ? 'Zalo' : 'WhatsApp'}
                      className="w-5 h-5 rounded-full object-cover shrink-0 shadow-xs"
                    />
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {displayedChats.filter((c) => selectedChatIds.includes(c.id)).length} of {displayedChats.length} Selected
                    </span>
                    {hasBothAccounts && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isZaloChannel
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {isZaloChannel ? 'Stage 1: Zalo' : 'Stage 2: WhatsApp'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={toggleSelectCurrentChannel}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {displayedChats.every((c) => selectedChatIds.includes(c.id))
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>

                {/* Conversation List: Styled 1:1 like ChatListItem in Main UI */}
                <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                  {displayedChats.map((chat) => {
                    const isChecked = selectedChatIds.includes(chat.id);
                    const isPreviewed = activePreviewChat?.id === chat.id;
                    const isZalo = chat.network === 'zalo';
                    const isGroup = chat.kind === 'group';

                    return (
                      <div
                        key={chat.id}
                        onClick={() => setPreviewChatId(chat.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition flex items-center gap-3 select-none ${
                          isChecked
                            ? isZalo
                              ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-400 dark:border-blue-600 shadow-xs'
                              : 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-600 shadow-xs'
                            : isPreviewed
                            ? 'bg-white dark:bg-[#18181b] shadow-sm border border-neutral-300 dark:border-neutral-700 ring-1 ring-blue-500/20'
                            : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 border border-transparent'
                        }`}
                      >
                        {/* Batch Select Checkbox for Conversations */}
                        <div
                          className="shrink-0 flex items-center justify-center pl-0.5 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChatSelect(chat.id);
                          }}
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                              isChecked
                                ? isZalo
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs scale-105'
                                  : 'bg-emerald-600 border-emerald-600 text-white shadow-2xs scale-105'
                                : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
                            }`}
                          >
                            {isChecked && <IconCheck className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Clean Contact Avatar (w-11 h-11 with ring-2) */}
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white dark:ring-neutral-800 bg-neutral-200 dark:bg-neutral-800">
                            <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                          </div>
                        </div>

                        {/* Contact Name & Latest Snippet */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {isGroup && <IconUsers className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />}
                            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white truncate">{chat.name}</h4>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p
                              className={`text-xs truncate ${
                                chat.latest?.isDropNoise
                                  ? 'line-through text-neutral-400 dark:text-neutral-500 italic'
                                  : 'text-neutral-500 dark:text-neutral-400'
                              }`}
                            >
                              {chat.latest?.text || 'No messages yet'}
                            </p>
                          </div>
                          {chat.latest?.isDropNoise && (
                            <span className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic block">
                              Removed by dropnoise
                            </span>
                          )}
                        </div>

                        {/* Time & Sync Status */}
                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{formatChatTime(chat.latest?.time)}</span>

                          <div className="flex items-center gap-1">
                            {isChecked ? (
                              <span
                                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  isZalo
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                }`}
                              >
                                <IconCheckCheck className={`w-3 h-3 ${isZalo ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                                Synced
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                                Unsynced
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* STEP 4: SYNC HISTORY RANGE (3, 6, 12 MONTHS, ALL)               */}
            {/* =============================================================== */}
            {step === 4 && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    {
                      id: '3m' as const,
                      badge: '3 Months',
                      title: 'Recent Pipeline',
                      desc: 'Imports active deals and recent lead follow-ups.',
                      time: '~25s sync',
                      stats: '~1,250 msgs • 15 MB',
                      tag: 'Fastest',
                    },
                    {
                      id: '6m' as const,
                      badge: '6 Months',
                      title: 'Semi-Annual',
                      desc: 'Balanced window for quotation and proposal histories.',
                      time: '~1m 15s sync',
                      stats: '~3,400 msgs • 45 MB',
                      tag: 'Recommended',
                    },
                    {
                      id: '12m' as const,
                      badge: '12 Months',
                      title: 'Full Annual Audit',
                      desc: '1-year historical transcript for auditing and accounting.',
                      time: '~2m 40s sync',
                      stats: '~7,800 msgs • 110 MB',
                      tag: 'Annual',
                    },
                    {
                      id: 'all' as const,
                      badge: 'All Time',
                      title: 'Complete Archive',
                      desc: 'Syncs all past messages, documents and media since inception.',
                      time: '~4m+ sync',
                      stats: 'All records • Full DB',
                      tag: 'Lifetime Archive',
                    },
                  ].map((item) => {
                    const isSelected = syncHistoryRange === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSyncHistoryRange(item.id)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between select-none ${
                          isSelected
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md ring-2 ring-neutral-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#111113]'
                            : 'bg-neutral-50/70 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isSelected
                                  ? 'bg-white/20 text-white dark:bg-black/10 dark:text-neutral-900 border-transparent'
                                  : item.id === '6m'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-transparent'
                              }`}
                            >
                              {item.badge}
                            </span>
                            <span
                              className={`text-[10px] font-mono ${
                                isSelected
                                  ? 'text-white/80 dark:text-neutral-700'
                                  : 'text-neutral-400 dark:text-neutral-500'
                              }`}
                            >
                              {item.time}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm">{item.title}</h4>
                          <p
                            className={`text-xs mt-1 leading-relaxed ${
                              isSelected
                                ? 'text-white/85 dark:text-neutral-700'
                                : 'text-neutral-500 dark:text-neutral-400'
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>

                        <div
                          className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                            isSelected
                              ? 'border-white/20 dark:border-black/10 text-white/90 dark:text-neutral-800'
                              : 'border-neutral-200/70 dark:border-neutral-800 text-neutral-400'
                          }`}
                        >
                          <span>{item.stats}</span>
                          <span className="font-sans font-bold text-[10px] uppercase tracking-wider">{item.tag}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* STEP 5: SELECT DESTINATION (VERTICAL ROWS: MARGINCE & SHEETS)    */}
            {/* =============================================================== */}
            {step === 5 && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="flex flex-col gap-3 pt-1">
                  {/* ROW 1: MARGINCE CRM */}
                  <div
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      selectedDestinations.margince
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/80 dark:border-emerald-500/80 shadow-xs'
                        : 'bg-neutral-50/60 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white p-0.5">
                        <img src={marginceLogo} alt="Margince CRM" className="w-full h-full object-contain rounded-xl" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                            Margince CRM
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                            Primary CRM
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed truncate">
                          Forward leads, deals, and customer conversations directly to Margince.
                        </p>
                      </div>
                    </div>

                    {/* Connect Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDestinations((prev) => ({ ...prev, margince: !prev.margince }))
                      }
                      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer select-none flex items-center gap-1.5 shadow-xs ${
                        selectedDestinations.margince
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700'
                      }`}
                    >
                      {selectedDestinations.margince ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <span>Connect</span>
                      )}
                    </button>
                  </div>

                  {/* ROW 2: GOOGLE SHEETS */}
                  <div
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      selectedDestinations.sheets
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/80 dark:border-emerald-500/80 shadow-xs'
                        : 'bg-neutral-50/60 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white p-1">
                        <IconGoogleSheets className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                            Google Sheets
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                            Spreadsheet
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed truncate">
                          Auto-stream new transcripts and contact phone numbers into a live spreadsheet.
                        </p>
                      </div>
                    </div>

                    {/* Connect Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDestinations((prev) => ({ ...prev, sheets: !prev.sheets }))
                      }
                      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer select-none flex items-center gap-1.5 shadow-xs ${
                        selectedDestinations.sheets
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700'
                      }`}
                    >
                      {selectedDestinations.sheets ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <span>Connect</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <div>
              {step > 1 && (
                <Button
                  size="sm"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center gap-1.5 cursor-pointer"
                  onPress={() => {
                    if (step === 3 && hasBothAccounts && step3Channel === 'whatsapp') {
                      setStep3Channel('zalo');
                    } else if (step === 4) {
                      if (hasBothAccounts) {
                        setStep(3);
                        setStep3Channel('whatsapp');
                      } else {
                        setStep(3);
                      }
                    } else if (step === 5) {
                      setStep(4);
                    } else {
                      setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5) : s));
                    }
                  }}
                >
                  <IconArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {step === 1 && (
                <Button
                  size="sm"
                  className={`px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs transition ${
                    hasConnectedAtLeastOne
                      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                      : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed opacity-60'
                  }`}
                  onPress={() => {
                    if (hasConnectedAtLeastOne) setStep(2);
                  }}
                >
                  <span>Next: DropNoise Filters</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}

              {step === 2 && (
                <Button
                  size="sm"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  onPress={() => setStep(3)}
                >
                  <span>Next: Select Chats</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}

              {step === 3 && (
                hasBothAccounts && step3Channel === 'zalo' ? (
                  <Button
                    size="sm"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    onPress={() => setStep3Channel('whatsapp')}
                  >
                    <span>Next: WhatsApp Sync</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    onPress={() => setStep(4)}
                  >
                    <span>Next: Sync History</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )
              )}

              {step === 4 && (
                <Button
                  size="sm"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  onPress={() => setStep(5)}
                >
                  <span>Next: Destination</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}

              {step === 5 && (
                hasConnectedDestination ? (
                  <Button
                    size="sm"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                    onPress={handleFinishWizard}
                  >
                    <span>Explore ChatBridge</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer transition"
                    onPress={onComplete}
                  >
                    <span>Skip for Now</span>
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: DYNAMIC GRADIENT WAVES WITH PURE GLASSY CHAT BUBBLES */}
        {/* EXACT EQUAL 50% WIDTH                                              */}
        {/* =================================================================== */}
        <div className="hidden md:flex relative overflow-hidden bg-black rounded-2xl m-3 flex-col justify-between p-4 sm:p-5 pb-3.5 border border-neutral-800/80 shadow-inner">
          {/* WebGL2 Dynamic Shader Waves Canvas */}
          <AmbientWavesBackground
            paperColor={AMBIENT_PAPER_COLOR}
            waveColors={AMBIENT_WAVE_COLORS}
          />

          {/* ================================================================= */}
          {/* STEP 1: PURE DYNAMIC BACKGROUND ONLY                              */}
          {/* ================================================================= */}
          {step === 1 && null}

          {/* ================================================================= */}
          {/* STEP 2: DROPNOISE LIVE DEMO PREVIEW (Glassy floating chat)         */}
          {/* Strikethrough on active noise filters + realtime preview           */}
          {/* ================================================================= */}
          {step === 2 && (
            <div className="relative z-10 flex flex-col h-full justify-between gap-3 animate-in fade-in duration-300">
              {/* Top Glassy Header Pill */}
              <div className="flex items-center justify-between shrink-0 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 text-white text-xs font-medium shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Alexander (Customer)</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-200 bg-white/10 dark:bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                  {activeDropCount} Filtered
                </span>
              </div>

              {/* Glassy Floating Message Feed */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-0 flex flex-col justify-center py-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {/* 1. Customer Message */}
                <div className="flex items-end gap-2.5 max-w-[90%]">
                  <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <IconUser className="w-3.5 h-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-xs px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-lg space-y-1">
                    <p className="text-xs leading-relaxed">
                      Hi Alexander, could you send me the latest quotation and features for the Gradion software?
                    </p>
                    <span className="text-[9px] text-white/50 font-mono block text-right">10:30 AM</span>
                  </div>
                </div>

                {/* 2. Sales Rep Bubble with EDITED MESSAGE */}
                <div className="flex items-end justify-end gap-2.5 ml-auto max-w-[90%]">
                  <div className="rounded-2xl rounded-br-xs px-3.5 py-2.5 bg-blue-600/35 backdrop-blur-md border border-blue-400/30 text-white shadow-lg space-y-1.5">
                    <p className="text-xs leading-relaxed">
                      Hello! Absolutely, I will send the PDF proposal and enterprise license breakdown right away.
                    </p>
                    {dropNoiseFilters.edits ? (
                      <div className="p-2 rounded-xl bg-blue-950/50 border border-rose-500/35 text-xs font-mono space-y-1">
                        <div className="line-through decoration-rose-500 decoration-2 text-rose-300/80">
                          Original [10:31 AM]: &quot;I will send the draft in 5m&quot;
                        </div>
                        <div className="flex items-center justify-between text-[10px] pt-0.5">
                          <span className="text-emerald-300 font-semibold flex items-center gap-1">
                            ✓ Audit: Kept both Original &amp; Revised version
                          </span>
                          <span className="text-rose-400 font-semibold">✕ Noise Replaced</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-blue-950/25 border border-blue-400/20 text-xs font-mono text-neutral-300 space-y-1">
                        <div>Original [10:31 AM]: &quot;I will send the draft in 5m&quot;</div>
                        <div className="flex items-center justify-between text-[10px] pt-0.5">
                          <span className="text-amber-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                            Unfiltered
                          </span>
                          <span className="text-neutral-400">Overwritten without audit</span>
                        </div>
                      </div>
                    )}
                    <span className="text-[9px] text-blue-200/70 font-mono block text-right">10:32 AM (Edited)</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-sm">
                    <IconUser className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 3. REACTIONS ITEM */}
                <div
                  className={`rounded-xl px-3.5 py-2 backdrop-blur-md transition-all space-y-1 shadow-md ${
                    dropNoiseFilters.reactions
                      ? 'border border-rose-500/35 bg-rose-950/30'
                      : 'border border-white/15 bg-white/10'
                  }`}
                >
                  <div
                    className={`text-xs font-mono ${
                      dropNoiseFilters.reactions
                        ? 'line-through decoration-rose-500 decoration-2 text-neutral-400'
                        : 'text-neutral-200'
                    }`}
                  >
                    👍 Customer reacted to &quot;Hello! Absolutely...&quot;
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                    {dropNoiseFilters.reactions ? (
                      <>
                        <span className="text-rose-400 flex items-center gap-1 font-semibold">
                          ✕ Removed by DropNoise
                        </span>
                        <span className="text-neutral-400">Unsynced</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                          Unfiltered
                        </span>
                        <span className="text-neutral-300">Sync</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 4. STICKERS ITEM */}
                <div
                  className={`rounded-xl px-3.5 py-2 backdrop-blur-md transition-all space-y-1 shadow-md ${
                    dropNoiseFilters.stickers
                      ? 'border border-rose-500/35 bg-rose-950/30'
                      : 'border border-white/15 bg-white/10'
                  }`}
                >
                  <div
                    className={`text-xs font-mono flex items-center gap-2 ${
                      dropNoiseFilters.stickers
                        ? 'line-through decoration-rose-500 decoration-2 text-neutral-400'
                        : 'text-neutral-200'
                    }`}
                  >
                    <span className="text-base">🐱</span>
                    <span>[Sticker: Animated Thumbs Up Cat]</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                    {dropNoiseFilters.stickers ? (
                      <>
                        <span className="text-rose-400 flex items-center gap-1 font-semibold">
                          ✕ Removed by DropNoise
                        </span>
                        <span className="text-neutral-400">Unsynced</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                          Unfiltered
                        </span>
                        <span className="text-neutral-300">Sync</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 5. STORIES & STATUS ITEM */}
                <div
                  className={`rounded-xl px-3.5 py-2 backdrop-blur-md transition-all space-y-1 shadow-md ${
                    dropNoiseFilters.stories
                      ? 'border border-rose-500/35 bg-rose-950/30'
                      : 'border border-white/15 bg-white/10'
                  }`}
                >
                  <div
                    className={`text-xs font-mono flex items-center gap-2 ${
                      dropNoiseFilters.stories
                        ? 'line-through decoration-rose-500 decoration-2 text-neutral-400'
                        : 'text-neutral-200'
                    }`}
                  >
                    <span className="text-base">📷</span>
                    <span>Replied to your Story: &quot;Q4 Enterprise Launch 🚀&quot;</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                    {dropNoiseFilters.stories ? (
                      <>
                        <span className="text-rose-400 flex items-center gap-1 font-semibold">
                          ✕ Removed by DropNoise
                        </span>
                        <span className="text-neutral-400">Unsynced</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-400 flex items-center gap-1.5 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                          Unfiltered
                        </span>
                        <span className="text-neutral-300">Sync</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 6. Customer Message */}
                <div className="flex items-end gap-2.5 max-w-[90%]">
                  <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <IconUser className="w-3.5 h-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-xs px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-lg space-y-1">
                    <p className="text-xs leading-relaxed">
                      Thank you! Everything looks solid. Let&apos;s arrange a quick demo call tomorrow at 10 AM.
                    </p>
                    <span className="text-[9px] text-white/50 font-mono block text-right">10:33 AM</span>
                  </div>
                </div>

                {/* 7. Sales Rep Closing */}
                <div className="flex items-end justify-end gap-2.5 ml-auto max-w-[90%]">
                  <div className="rounded-2xl rounded-br-xs px-3.5 py-2 bg-blue-600/35 backdrop-blur-md border border-blue-400/30 text-white shadow-lg space-y-1">
                    <p className="text-xs leading-relaxed">
                      Perfect! I have reserved 10:00 AM on Google Meet. See you tomorrow!
                    </p>
                    <span className="text-[9px] text-blue-200/70 font-mono block text-right">10:35 AM</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-sm">
                    <IconUser className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: LIVE CONVERSATION PREVIEW OF SELECTED PERSON               */}
          {/* Real avatars for both 'me' and 'them', day grouping, full height    */}
          {/* ================================================================= */}
          {step === 3 && activePreviewChat && (
            <div className="relative z-10 flex flex-col h-full justify-between gap-3 animate-in fade-in duration-300">
              {/* Top Glassy Header Bar for Active Selected Contact */}
              <div className="flex items-center justify-between shrink-0 pointer-events-none">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/15 text-white text-xs font-medium shadow-md">
                  <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800">
                    <img
                      src={activePreviewChat.avatar}
                      alt={activePreviewChat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold truncate max-w-[220px]">{activePreviewChat.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5 shrink-0" />
                </div>
              </div>

              {/* Glassy Floating Message Dialogue Grouped by Day */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 flex flex-col justify-start py-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {displayedMessages.map((msg, idx) => {
                  const isOutbound = msg.direction === 'outbound';

                  // Group by Day Divider
                  const currentDateKey = getMessageDateKey(msg.time);
                  const prevDateKey = idx > 0 ? getMessageDateKey(displayedMessages[idx - 1].time) : null;
                  const isNewDay = currentDateKey !== prevDateKey;

                  return (
                    <React.Fragment key={msg.id || idx}>
                      {/* Day Divider Pill */}
                      {isNewDay && (
                        <div className="flex items-center justify-center my-2 shrink-0">
                          <span className="px-3.5 py-1 rounded-full bg-white/10 dark:bg-black/50 backdrop-blur-md text-[11px] font-semibold text-neutral-200 border border-white/15 shadow-2xs">
                            {formatMessageDayDivider(msg.time)}
                          </span>
                        </div>
                      )}

                      {isOutbound ? (
                        /* Outbound: Bubble on the right with MY AVATAR on the far right */
                        <div className="flex items-end justify-end gap-2.5 ml-auto max-w-[92%] shrink-0">
                          <div
                            className={`rounded-2xl rounded-br-xs px-3.5 py-2.5 backdrop-blur-md border text-white shadow-lg ${
                              isZaloChannel
                                ? 'bg-blue-600/35 border-blue-400/30'
                                : 'bg-emerald-600/35 border-emerald-400/30'
                            }`}
                          >
                            <p className="text-xs leading-relaxed">{msg.text}</p>
                            <span className="text-[9px] text-white/60 font-mono mt-1 block text-right">
                              {formatChatTime(msg.time)}
                            </span>
                          </div>
                          {/* MY AVATAR */}
                          <div
                            className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 shadow-sm bg-neutral-800"
                            title={myName}
                          >
                            <img src={myAvatar} alt={myName} className="w-full h-full object-cover" />
                          </div>
                        </div>
                      ) : (
                        /* Inbound: OTHER PERSON'S AVATAR on the left with Bubble */
                        <div className="flex items-end gap-2.5 max-w-[92%] shrink-0">
                          {/* OTHER PERSON'S AVATAR */}
                          <div
                            className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 shadow-sm bg-neutral-800"
                            title={activePreviewChat.name}
                          >
                            <img
                              src={activePreviewChat.avatar}
                              alt={activePreviewChat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="rounded-2xl rounded-bl-xs px-3.5 py-2.5 bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-lg">
                            <p className="text-xs leading-relaxed">{msg.text}</p>
                            <span className="text-[9px] text-white/50 font-mono mt-1 block text-right">
                              {formatChatTime(msg.time)}
                            </span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Bottom glassy status line aligned with left bottom action bar */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-time transcript preview</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400">
                  {displayedMessages.length} messages loaded
                </span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: HISTORICAL SYNC SCOPE PREVIEW                             */}
          {/* ================================================================= */}
          {step === 4 && (
            <div className="relative z-10 flex flex-col h-full justify-between gap-3 animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 text-white text-xs font-medium shadow-md w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sync History Scope</span>
              </div>

              {/* Glassy Timeline and Metrics Card */}
              <div className="flex-1 flex flex-col justify-center space-y-3 p-4 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 shadow-xl">
                {/* Visual Timeline Bar */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                    <span>
                      {syncHistoryRange === '3m' && 'Aug 2026 (Past 90 Days)'}
                      {syncHistoryRange === '6m' && 'May 2026 (Past 180 Days)'}
                      {syncHistoryRange === '12m' && 'Nov 2025 (Past 1 Year)'}
                      {syncHistoryRange === 'all' && 'Account Inception (Full Lifetime)'}
                    </span>
                    <span className="text-emerald-400 font-bold">Today (Nov 2026)</span>
                  </div>

                  {/* Gradient Range Bar */}
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden relative">
                    <div
                      className={`h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ${
                        syncHistoryRange === '3m'
                          ? 'w-1/4 ml-auto'
                          : syncHistoryRange === '6m'
                          ? 'w-1/2 ml-auto'
                          : syncHistoryRange === '12m'
                          ? 'w-3/4 ml-auto'
                          : 'w-full'
                      }`}
                    />
                  </div>
                </div>

                {/* Scope Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-neutral-400 block">Monitored Threads</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{selectedChatIds.length} Conversations</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-neutral-400 block">DropNoise Rules</span>
                    <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{activeDropCount} Active Filters</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Estimated Sync Volume</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      {syncHistoryRange === '3m' && 'Fast import: ~1,250 verified messages'}
                      {syncHistoryRange === '6m' && 'Balanced import: ~3,400 verified messages'}
                      {syncHistoryRange === '12m' && 'Annual archive: ~7,800 verified messages'}
                      {syncHistoryRange === 'all' && 'Complete archive: All past customer messages'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2 py-1 rounded-lg border border-teal-500/20">
                    {syncHistoryRange === '3m' && '15 MB'}
                    {syncHistoryRange === '6m' && '45 MB'}
                    {syncHistoryRange === '12m' && '110 MB'}
                    {syncHistoryRange === 'all' && 'Full DB'}
                  </span>
                </div>
              </div>

              {/* Bottom security assurance */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Local SQLite encrypted database</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-500">
                  Ready to route
                </span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 5 RIGHT PANE: PURE DYNAMIC BACKGROUND WAVES ONLY             */}
          {/* ================================================================= */}
          {step === 5 && null}
        </div>
      </div>
    </div>
  );
}
