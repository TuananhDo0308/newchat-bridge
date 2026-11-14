import React, { useEffect, useState } from 'react';
import { AmbientWavesBackground } from './AmbientWavesBackground.js';
import { useAppStore } from '../../store/useAppStore.js';
import { useChatBridgeStore } from '../../store/useChatBridgeStore.js';
import { WizardHeader } from './WizardHeader.js';
import { WizardFooter } from './WizardFooter.js';
import { Step1AccountConnect } from './Step1AccountConnect.js';
import { Step2DropNoise, Step2DropNoisePreview } from './Step2DropNoise.js';
import { Step3SelectConversations, Step3ConversationPreview } from './Step3SelectConversations.js';
import { Step4SyncHistory } from './Step4SyncHistory.js';
import { Step5Destinations } from './Step5Destinations.js';
import { Step5SheetsPreview } from './Step5SheetsPreview.js';
import type {
  WizardStep,
  DropNoiseFilters,
  DropNoiseKey,
  SyncHistoryRange,
  AccountProfile,
  SelectedDestinations,
  OnboardingWizardProps,
} from './types.js';

// Static theme colors for AmbientWavesBackground matching ChatBridge brand + channels
const AMBIENT_PAPER_COLOR = '#000000';
const AMBIENT_WAVE_COLORS: [string, string, string] = ['#ea580c', '#2563eb', '#10b981'];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const theme = useAppStore((s) => s.theme);
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const chats = useChatBridgeStore((s) => s.chats);
  const messages = useChatBridgeStore((s) => s.messages);
  const batchSyncChats = useChatBridgeStore((s) => s.batchSyncChats);

  // 5 Dedicated Steps
  const [step, setStep] = useState<WizardStep>(1);

  // --- STEP 1: ACCOUNT SCANNING / FLIP CARD STATE ---
  const [activeFlippedChannel, setActiveFlippedChannel] = useState<'zalo' | 'whatsapp' | null>(null);
  const [zaloProfile, setZaloProfile] = useState<AccountProfile | null>(null);
  const [whatsAppProfile, setWhatsAppProfile] = useState<AccountProfile | null>(null);
  const [qrCountdown, setQrCountdown] = useState<number>(60);
  const [qrSeed, setQrSeed] = useState<number>(1);

  const hasConnectedAtLeastOne = Boolean(zaloProfile || whatsAppProfile);
  const hasBothAccounts = Boolean(zaloProfile && whatsAppProfile);

  useEffect(() => {
    if (step !== 1 || !activeFlippedChannel) return;

    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, activeFlippedChannel]);

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

  // --- STEP 2: DROPNOISE FILTER BADGES ---
  const [dropNoiseFilters, setDropNoiseFilters] = useState<DropNoiseFilters>({
    reactions: true,
    edits: true,
    stickers: true,
    stories: true,
  });

  const toggleDropNoise = (key: DropNoiseKey) => {
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

  // --- STEP 3: CONVERSATION SYNC SCOPE ---
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

  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([
    'zalo-grad-david',
    'zalo-pers-alex',
    'wa-grad-marcus',
    'zalo-grad-amanda',
  ]);

  const [previewChatId, setPreviewChatId] = useState<string>('zalo-grad-david');

  useEffect(() => {
    const cur = chats.find((c) => c.id === previewChatId);
    if (!cur || cur.network !== step3Channel) {
      const firstInChannel = displayedChats[0];
      if (firstInChannel) {
        setPreviewChatId(firstInChannel.id);
      }
    }
  }, [step3Channel, displayedChats, previewChatId, chats]);

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
  const [syncHistoryRange, setSyncHistoryRange] = useState<SyncHistoryRange>('all');

  // --- STEP 5: DESTINATION SELECTION ---
  const [selectedDestinations, setSelectedDestinations] = useState<SelectedDestinations>({
    margince: false,
    sheets: false,
  });

  const hasConnectedDestination = Boolean(
    selectedDestinations.margince || selectedDestinations.sheets
  );

  const toggleDestination = (key: keyof SelectedDestinations) => {
    setSelectedDestinations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinishWizard = async () => {
    if (selectedChatIds.length > 0) {
      await batchSyncChats(selectedChatIds, true);
    }
    onComplete();
  };

  const handleBack = () => {
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
      setStep((s) => (s > 1 ? ((s - 1) as WizardStep) : s));
    }
  };

  const handleNext = () => {
    if (step === 1 && hasConnectedAtLeastOne) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (hasBothAccounts && step3Channel === 'zalo') {
        setStep3Channel('whatsapp');
      } else {
        setStep(4);
      }
    } else if (step === 4) {
      setStep(5);
    }
  };

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

      {/* 2-Column Responsive Split Modal Card */}
      <div className="relative z-10 w-full max-w-5xl lg:max-w-6xl h-[680px] max-h-[94vh] bg-white dark:bg-[#111113] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all">
        {/* =================================================================== */}
        {/* LEFT COLUMN: STEPS & CONTROLS                                       */}
        {/* =================================================================== */}
        <div className="flex flex-col justify-between p-6 sm:p-7 overflow-y-auto relative min-h-0">
          <WizardHeader
            step={step}
            isDark={theme === 'dark'}
            hasConnectedAtLeastOne={hasConnectedAtLeastOne}
            hasBothAccounts={hasBothAccounts}
            step3Channel={step3Channel}
          />

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
              <Step2DropNoise
                dropNoiseFilters={dropNoiseFilters}
                onToggleFilter={toggleDropNoise}
                onSelectAll={selectAllDropNoise}
                onClearAll={clearAllDropNoise}
              />
            )}

            {step === 3 && (
              <Step3SelectConversations
                step3Channel={step3Channel}
                displayedChats={displayedChats}
                selectedChatIds={selectedChatIds}
                previewChatId={previewChatId}
                onSelectChatForPreview={setPreviewChatId}
                onToggleChatSelect={toggleChatSelect}
                onToggleSelectAll={toggleSelectCurrentChannel}
              />
            )}

            {step === 4 && (
              <Step4SyncHistory
                syncHistoryRange={syncHistoryRange}
                onSelectRange={setSyncHistoryRange}
              />
            )}

            {step === 5 && (
              <Step5Destinations
                selectedDestinations={selectedDestinations}
                onToggleDestination={toggleDestination}
              />
            )}
          </div>

          <WizardFooter
            step={step}
            hasConnectedAtLeastOne={hasConnectedAtLeastOne}
            hasBothAccounts={hasBothAccounts}
            step3Channel={step3Channel}
            hasConnectedDestination={hasConnectedDestination}
            onBack={handleBack}
            onNext={handleNext}
            onFinish={handleFinishWizard}
          />
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: DYNAMIC PREVIEW & AMBIENT WAVES (RESPONSIVE MD:FLEX)  */}
        {/* =================================================================== */}
        <div className="relative bg-black hidden md:flex flex-col overflow-hidden border-l border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 select-none">
          {/* Dynamic 60fps Ambient Waves Canvas Background */}
          <AmbientWavesBackground
            paperColor={AMBIENT_PAPER_COLOR}
            waveColors={AMBIENT_WAVE_COLORS}
          />

          {/* Step 2 Preview: Clean Chat Dialogue with DropNoise Filters */}
          {step === 2 && (
            <Step2DropNoisePreview dropNoiseFilters={dropNoiseFilters} />
          )}

          {/* Step 3 Preview: Active Selected Conversation */}
          {step === 3 && activePreviewChat && (
            <Step3ConversationPreview
              activePreviewChat={activePreviewChat}
              messages={messages}
              myName={myName}
              myAvatar={myAvatar}
            />
          )}

          {/* Steps 1, 4: Pure Ambient Waves */}
          {step === 1 && null}
          {step === 4 && null}

          {/* Step 5 Preview: Live Google Sheets Spreadsheet Preview */}
          {step === 5 && selectedDestinations.sheets && (
            <Step5SheetsPreview
              columns={sheetsConfig.columns}
              selectedFileName={sheetsConfig.selectedFileName}
              preset={sheetsConfig.preset}
              includeContactsTab={sheetsConfig.includeContactsTab}
              googleAccount={sheetsConfig.googleAccount}
              isMarginceActive={selectedDestinations.margince}
            />
          )}
        </div>
      </div>
    </div>
  );
}
