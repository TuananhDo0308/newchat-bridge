import React, { useState } from 'react';
import marginceLogo from '../../assets/margince-logo.svg';
import { IconGoogleSheets, IconCheck } from './WizardIcons.js';
import type { SelectedDestinations } from './types.js';
import { useAppStore } from '../../store/useAppStore.js';

interface Step5DestinationsProps {
  selectedDestinations: SelectedDestinations;
  onToggleDestination: (key: keyof SelectedDestinations) => void;
}

export function Step5Destinations({
  selectedDestinations,
  onToggleDestination,
}: Step5DestinationsProps) {
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isSheetsConnected = selectedDestinations.sheets;
  const googleAccount = sheetsConfig.googleAccount || 'tuananh@gradion.ai';

  const handleConnectGoogleSheets = () => {
    if (isSheetsConnected) {
      onToggleDestination('sheets');
      return;
    }

    // Quick OAuth login simulation that applies all defaults automatically
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      updateSheetsConfig({
        enabled: true,
        oauthConnected: true,
        googleAccount: 'tuananh@gradion.ai',
        selectedFileName: 'ChatBridge_Transcripts_2026',
        sheetName: 'Transcripts',
        columns: ['time', 'network', 'chat', 'sender', 'direction', 'text'],
        preset: 'single',
        includeContactsTab: true,
      });
      if (!selectedDestinations.sheets) {
        onToggleDestination('sheets');
      }
    }, 450);
  };

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* =================================================================== */}
      {/* DESTINATION 1: MARGINCE CRM                                         */}
      {/* =================================================================== */}
      <div
        className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
          selectedDestinations.margince
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/80 dark:border-emerald-500/80 shadow-xs'
            : 'bg-neutral-50/60 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800'
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white p-2">
            <img src={marginceLogo} alt="Margince CRM" className="w-full h-full object-contain" />
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

        <button
          type="button"
          onClick={() => onToggleDestination('margince')}
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

      {/* =================================================================== */}
      {/* DESTINATION 2: GOOGLE SHEETS (LOGIN GOOGLE & AUTO-DEFAULTS)         */}
      {/* =================================================================== */}
      <div
        className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
          isSheetsConnected
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
                Google OAuth
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed truncate">
              {isSheetsConnected
                ? `Logged in as ${googleAccount} • Auto-created ChatBridge_Transcripts_2026`
                : 'Sign in with Google to auto-create and stream to your default spreadsheet.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConnectGoogleSheets}
          disabled={isLoggingIn}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer select-none flex items-center gap-2 shadow-xs ${
            isSheetsConnected
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700'
          }`}
        >
          {isLoggingIn ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>Logging in...</span>
            </>
          ) : isSheetsConnected ? (
            <>
              <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
              <span>Connected</span>
            </>
          ) : (
            <>
              {/* Google G mini icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Login with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
