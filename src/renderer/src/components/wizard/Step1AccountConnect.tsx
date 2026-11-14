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
            className={`w-full h-full relative transition-transform duration-700 transform-style-3d ${
              activeFlippedChannel === 'zalo' ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE: Connected Profile or Connect Prompt */}
            <div
              className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl p-4 flex flex-col justify-between border select-none transition-all ${
                zaloProfile
                  ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 shadow-sm'
                  : 'bg-neutral-50/60 dark:bg-neutral-900/40 border-neutral-200/90 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center p-1.5 border border-blue-500/20">
                    <img src={zaloLogo} alt="Zalo" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Zalo Personal</h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Vietnam Messenger</p>
                  </div>
                </div>

                {zaloProfile ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <IconCheck className="w-3 h-3 stroke-[3]" />
                    <span>Linked</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800">
                    Not connected
                  </span>
                )}
              </div>

              {zaloProfile ? (
                <div className="p-3 rounded-xl bg-white/90 dark:bg-neutral-900/80 border border-blue-200/60 dark:border-blue-900/40 flex items-center gap-3 shadow-xs">
                  <img
                    src={zaloProfile.avatar}
                    alt={zaloProfile.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {zaloProfile.name}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      {zaloProfile.phone}
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                      ✓ Active session
                    </span>
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center py-4 space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto mb-2 border border-neutral-200 dark:border-neutral-700">
                    <IconQrCode className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Click to reveal QR Code
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    Scan with Zalo mobile app
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>Direct OAuth Core</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {zaloProfile ? 'Re-scan' : 'Tap to scan →'}
                </span>
              </div>
            </div>

            {/* BACK FACE: Dedicated QR Code with Countdown */}
            <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden rounded-2xl p-4 bg-white dark:bg-[#151518] border border-blue-500/40 shadow-xl flex flex-col justify-between items-center text-center">
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <img src={zaloLogo} alt="Zalo" className="w-3.5 h-3.5 object-contain" />
                  <span>Scan Zalo QR</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {qrCountdown}s
                </span>
              </div>

              <div className="relative p-2.5 bg-white rounded-xl shadow-inner border border-neutral-200 my-1">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=chatbridge-zalo-auth-${qrSeed}`}
                  alt="Zalo QR"
                  className="w-28 h-28 object-contain"
                />
              </div>

              <div className="w-full flex items-center gap-1.5 pt-1">
                <button
                  type="button"
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
            className={`w-full h-full relative transition-transform duration-700 transform-style-3d ${
              activeFlippedChannel === 'whatsapp' ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE: WhatsApp Profile or Connect Prompt */}
            <div
              className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl p-4 flex flex-col justify-between border select-none transition-all ${
                whatsAppProfile
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 shadow-sm'
                  : 'bg-neutral-50/60 dark:bg-neutral-900/40 border-neutral-200/90 dark:border-neutral-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center p-1.5 border border-emerald-500/20">
                    <img src={whatsappLogo} alt="WhatsApp" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">WhatsApp Business</h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Global Customer Base</p>
                  </div>
                </div>

                {whatsAppProfile ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <IconCheck className="w-3 h-3 stroke-[3]" />
                    <span>Linked</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800">
                    Not connected
                  </span>
                )}
              </div>

              {whatsAppProfile ? (
                <div className="p-3 rounded-xl bg-white/90 dark:bg-neutral-900/80 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center gap-3 shadow-xs">
                  <img
                    src={whatsAppProfile.avatar}
                    alt={whatsAppProfile.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {whatsAppProfile.name}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      {whatsAppProfile.phone}
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Active session
                    </span>
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center py-4 space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto mb-2 border border-neutral-200 dark:border-neutral-700">
                    <IconQrCode className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Click to reveal QR Code
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    Scan with WhatsApp Linked Devices
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>Multi-Device Bridge</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {whatsAppProfile ? 'Re-scan' : 'Tap to scan →'}
                </span>
              </div>
            </div>

            {/* BACK FACE: Dedicated WhatsApp QR */}
            <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden rounded-2xl p-4 bg-white dark:bg-[#151518] border border-emerald-500/40 shadow-xl flex flex-col justify-between items-center text-center">
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <img src={whatsappLogo} alt="WhatsApp" className="w-3.5 h-3.5 object-contain" />
                  <span>Scan WhatsApp QR</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {qrCountdown}s
                </span>
              </div>

              <div className="relative p-2.5 bg-white rounded-xl shadow-inner border border-neutral-200 my-1">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=chatbridge-wa-auth-${qrSeed}`}
                  alt="WhatsApp QR"
                  className="w-28 h-28 object-contain"
                />
              </div>

              <div className="w-full flex items-center gap-1.5 pt-1">
                <button
                  type="button"
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
