import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { AmbientWavesBackground } from './AmbientWavesBackground.js';
import { useAppStore } from '../../store/useAppStore.js';
import { useChatBridgeStore } from '../../store/useChatBridgeStore.js';
import { BrandLogo } from '../Logo.js';
import { Step1AccountConnect } from './Step1AccountConnect.js';
import { Step3SelectConversations, Step3ConversationPreview } from './Step3SelectConversations.js';
import { Step4SyncHistory } from './Step4SyncHistory.js';
import { IconArrowLeft, IconArrowRight, IconCheck, IconClose } from './WizardIcons.js';
import type {
  SyncHistoryRange,
  AccountProfile,
} from './types.js';

const AMBIENT_PAPER_COLOR = '#000000';
const AMBIENT_WAVE_COLORS: [string, string, string] = ['#ea580c', '#2563eb', '#10b981'];

export interface AddAccountModalProps {
  initialChannel?: 'zalo' | 'whatsapp';
  onClose: () => void;
  onComplete?: () => void;
}

export function AddAccountModal({
  initialChannel,
  onClose,
  onComplete,
}: AddAccountModalProps) {
  const theme = useAppStore((s) => s.theme);
  const setHistoryRange = useAppStore((s) => s.setHistoryRange);
  const chats = useChatBridgeStore((s) => s.chats);
  const messages = useChatBridgeStore((s) => s.messages);
  const batchSyncChats = useChatBridgeStore((s) => s.batchSyncChats);

  // 3-step streamlined flow:
  // Step 1: Scan 1 of 2 QR codes (Zalo or WhatsApp)
  // Step 2: Select conversations to sync
  // Step 3: Choose history range (All, 3m, 6m, 12m) and finish
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // --- STEP 1: QR CODE PAIRING ---
  const [activeFlippedChannel, setActiveFlippedChannel] = useState<'zalo' | 'whatsapp' | null>(
    initialChannel || null
  );
  const [zaloProfile, setZaloProfile] = useState<AccountProfile | null>(null);
  const [whatsAppProfile, setWhatsAppProfile] = useState<AccountProfile | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'zalo' | 'whatsapp'>(
    initialChannel || 'zalo'
  );
  const [qrCountdown, setQrCountdown] = useState<number>(60);
  const [qrSeed, setQrSeed] = useState<number>(1);

  useEffect(() => {
    if (step !== 1 || !activeFlippedChannel) return;

    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, activeFlippedChannel]);

  // Keyboard shortcut: Esc to exit modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleFlipCard = (channel: 'zalo' | 'whatsapp') => {
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
      setSelectedChannel('zalo');
    } else {
      setWhatsAppProfile({
        name: 'Sale Gradion',
        phone: '+84 988 889 999',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      });
      setSelectedChannel('whatsapp');
    }
    setActiveFlippedChannel(null);

    // Auto-advance to Step 2 immediately once 1 QR is scanned
    setStep(2);
  };

  // --- STEP 2: CONVERSATION SELECTION ---
  const displayedChats = chats.filter((c) => c.network === selectedChannel);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [previewChatId, setPreviewChatId] = useState<string>('');

  // Initialize selected chats and preview when entering step 2 or changing channel
  useEffect(() => {
    if (displayedChats.length > 0) {
      if (!previewChatId || !displayedChats.some((c) => c.id === previewChatId)) {
        setPreviewChatId(displayedChats[0].id);
      }
      if (selectedChatIds.length === 0) {
        setSelectedChatIds(displayedChats.map((c) => c.id));
      }
    }
  }, [selectedChannel, displayedChats, previewChatId, selectedChatIds.length]);

  const activePreviewChat =
    chats.find((c) => c.id === previewChatId) || displayedChats[0] || chats[0];

  const myAvatar =
    (selectedChannel === 'zalo' ? zaloProfile?.avatar : whatsAppProfile?.avatar) ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces';
  const myName =
    (selectedChannel === 'zalo' ? zaloProfile?.name : whatsAppProfile?.name) || 'You';

  const toggleChatSelect = (id: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentChannelIds = displayedChats.map((c) => c.id);
    const allSelected = currentChannelIds.every((id) => selectedChatIds.includes(id));

    if (allSelected) {
      setSelectedChatIds((prev) => prev.filter((id) => !currentChannelIds.includes(id)));
    } else {
      setSelectedChatIds((prev) => Array.from(new Set([...prev, ...currentChannelIds])));
    }
  };

  // --- STEP 3: SYNC HISTORY RANGE ---
  const [syncHistoryRange, setSyncHistoryRange] = useState<SyncHistoryRange>('all');
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      if (selectedChatIds.length > 0) {
        await batchSyncChats(selectedChatIds, true);
      }
      setHistoryRange(syncHistoryRange);
      if (onComplete) {
        onComplete();
      } else {
        onClose();
      }
    } finally {
      setIsFinishing(false);
    }
  };

  const activeProfile = selectedChannel === 'zalo' ? zaloProfile : whatsAppProfile;
  const hasConnectedCurrent = Boolean(activeProfile);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-5 select-none bg-black/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
    >
      {/* 2-Column Responsive Split Modal Card */}
      <div className="relative z-10 w-full max-w-5xl lg:max-w-6xl h-full sm:h-[680px] max-h-full sm:max-h-[94vh] bg-white/95 dark:bg-[#111113]/95 backdrop-blur-2xl border-0 sm:border border-neutral-200/90 dark:border-neutral-800 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all">
        {/* =================================================================== */}
        {/* LEFT COLUMN: 3 STEPS & NAVIGATION                                   */}
        {/* =================================================================== */}
        <div className="flex flex-col justify-between p-4 sm:p-7 overflow-y-auto relative min-h-0">
          {/* Header */}
          <div className="shrink-0 pb-2">
            <div className="flex items-center justify-between pb-1">
              <BrandLogo isDark={theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)} className="h-7 w-auto" />
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition cursor-pointer"
                title="Cancel & Close"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Progress Bar: 3 Clean Steps */}
            <div className="flex items-center gap-2 mt-4 mb-3.5">
              {[1, 2, 3].map((seg) => (
                <div
                  key={seg}
                  className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
                >
                  <div
                    className={`h-full bg-neutral-900 dark:bg-white transition-all duration-500 ${
                      step >= seg ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Step Heading and Subtitle */}
            <div className="mb-2">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {step === 1 && 'Connect Your Messaging Account'}
                {step === 2 && `Select ${selectedChannel === 'zalo' ? 'Zalo' : 'WhatsApp'} Conversations`}
                {step === 3 && 'Select Sync History Range'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                {step === 1 && 'Choose Zalo or WhatsApp below and scan its QR code to link your account.'}
                {step === 2 && 'Pick customer conversations you want to synchronize into CRM.'}
                {step === 3 && 'Choose how far back to import customer conversation history into your CRM pipeline.'}
              </p>
            </div>
          </div>

          {/* Dynamic Step Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 my-1 min-h-0">
            {step === 1 && (
              <Step1AccountConnect
                zaloProfile={zaloProfile}
                whatsAppProfile={whatsAppProfile}
                activeFlippedChannel={activeFlippedChannel}
                qrCountdown={qrCountdown}
                qrSeed={qrSeed}
                onFlipCard={handleFlipCard}
                onRegenerateQR={handleRegenerateQR}
                onSimulateScan={handleSimulateScan}
              />
            )}

            {step === 2 && (
              <Step3SelectConversations
                step3Channel={selectedChannel}
                displayedChats={displayedChats}
                selectedChatIds={selectedChatIds}
                previewChatId={previewChatId}
                onSelectChatForPreview={setPreviewChatId}
                onToggleChatSelect={toggleChatSelect}
                onToggleSelectAll={toggleSelectAll}
              />
            )}

            {step === 3 && (
              <Step4SyncHistory
                syncHistoryRange={syncHistoryRange}
                onSelectRange={setSyncHistoryRange}
              />
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <div>
              {step > 1 ? (
                <Button
                  size="sm"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center gap-1.5 cursor-pointer"
                  onPress={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
                >
                  <IconArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                  onPress={onClose}
                >
                  <span>Cancel</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {step === 1 && (
                <Button
                  size="sm"
                  className={`px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs transition ${
                    hasConnectedCurrent
                      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                      : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed opacity-60'
                  }`}
                  onPress={() => {
                    if (hasConnectedCurrent) setStep(2);
                  }}
                >
                  <span>Next: Select Chats</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}

              {step === 2 && (
                <Button
                  size="sm"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  onPress={() => setStep(3)}
                >
                  <span>Next: Sync History</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}

              {step === 3 && (
                <Button
                  size="sm"
                  isDisabled={isFinishing}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  onPress={handleFinish}
                >
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>{isFinishing ? 'Syncing...' : 'Finish & Link Account'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: PREVIEW & AMBIENT WAVES                               */}
        {/* =================================================================== */}
        <div className="relative bg-black hidden md:flex flex-col overflow-hidden border-l border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 select-none">
          <AmbientWavesBackground
            paperColor={AMBIENT_PAPER_COLOR}
            waveColors={AMBIENT_WAVE_COLORS}
          />

          {/* Step 2: Live Conversation Preview */}
          {step === 2 && activePreviewChat && (
            <Step3ConversationPreview
              activePreviewChat={activePreviewChat}
              messages={messages}
              myName={myName}
              myAvatar={myAvatar}
            />
          )}

          {/* Steps 1 & 3: Pure Ambient Waves */}
        </div>
      </div>
    </div>
  );
}
