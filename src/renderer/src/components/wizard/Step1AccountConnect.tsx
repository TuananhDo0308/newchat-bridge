import React from 'react';
import { Button } from '@heroui/react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import { IconCheck, IconQrCode, IconRotateCcw, IconSmartphone } from './WizardIcons.js';
import type { AccountProfile } from './types.js';

interface Step1AccountConnectProps {
  zaloProfile: AccountProfile | null;
  whatsAppProfile: AccountProfile | null;
  activeFlippedChannel: 'zalo' | 'whatsapp' | null;
  qrCountdown: number;
  qrSeed: number;
  onFlipCard: (channel: 'zalo' | 'whatsapp') => void;
  onRegenerateQR: (e: React.MouseEvent) => void;
  onSimulateScan: (channel: 'zalo' | 'whatsapp') => void;
}

export function Step1AccountConnect({
  zaloProfile,
  whatsAppProfile,
  activeFlippedChannel,
  qrCountdown,
  qrSeed,
  onFlipCard,
  onRegenerateQR,
  onSimulateScan,
}: Step1AccountConnectProps) {
  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* CARD 1: ZALO FLIP CARD */}
        <div
          onClick={() => onFlipCard('zalo')}
          className={`relative h-[290px] w-full perspective-1000 ${
            zaloProfile ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          <div
            className={`w-full h-full duration-700 transform-style-3d transition-transform ${
              activeFlippedChannel === 'zalo' ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE: Connected Profile OR Initial Pair Prompt */}
            <div
              className={`absolute inset-0 backface-hidden rounded-2xl p-4 border flex flex-col justify-between transition-all group shadow-xs ${
                zaloProfile
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-500/80 dark:border-blue-500/80 ring-2 ring-blue-500/20'
                  : 'border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#161618] hover:border-blue-500/80 hover:bg-blue-50/20 dark:hover:bg-blue-950/20'
              }`}
            >
              {zaloProfile ? (
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
                        onFlipCard('zalo');
                      }}
                      className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                    >
                      Re-scan
                    </button>
                  </div>
                </div>
              ) : (
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

            {/* BACK FACE: Dedicated QR Code Pairing View */}
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
                      onFlipCard('zalo');
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
              </div>

              {/* Back Actions: Refresh + Simulate Scan */}
              <div className="w-full flex items-center gap-1.5 pt-1">
                <button
                  onClick={onRegenerateQR}
                  className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[10px] font-medium transition cursor-pointer"
                  title="Regenerate code"
                >
                  <IconRotateCcw className="w-4 h-4" />
                </button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                  onPress={() => onSimulateScan('zalo')}
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
          onClick={() => onFlipCard('whatsapp')}
          className={`relative h-[290px] w-full perspective-1000 ${
            whatsAppProfile ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          <div
            className={`w-full h-full duration-700 transform-style-3d transition-transform ${
              activeFlippedChannel === 'whatsapp' ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE: Connected Profile OR Initial Pair Prompt */}
            <div
              className={`absolute inset-0 backface-hidden rounded-2xl p-4 border flex flex-col justify-between transition-all group shadow-xs ${
                whatsAppProfile
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/80 dark:border-emerald-500/80 ring-2 ring-emerald-500/20'
                  : 'border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#161618] hover:border-emerald-500/80 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20'
              }`}
            >
              {whatsAppProfile ? (
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
                        onFlipCard('whatsapp');
                      }}
                      className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                    >
                      Re-scan
                    </button>
                  </div>
                </div>
              ) : (
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

            {/* BACK FACE: Dedicated QR Code Pairing View */}
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
                      onFlipCard('whatsapp');
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
              </div>

              {/* Back Actions: Refresh + Simulate Scan */}
              <div className="w-full flex items-center gap-1.5 pt-1">
                <button
                  onClick={onRegenerateQR}
                  className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[10px] font-medium transition cursor-pointer"
                  title="Regenerate code"
                >
                  <IconRotateCcw className="w-4 h-4" />
                </button>
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                  onPress={() => onSimulateScan('whatsapp')}
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
  );
}
