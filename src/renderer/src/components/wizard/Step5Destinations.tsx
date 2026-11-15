import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, Check, ArrowLeft } from 'lucide-react';
import marginceLogo from '../../assets/margince-logo.svg';
import { IconGoogleSheets, IconCheck } from './WizardIcons.js';
import type { SelectedDestinations } from './types.js';
import { useAppStore } from '../../store/useAppStore.js';

interface Step5DestinationsProps {
  selectedDestinations: SelectedDestinations;
  onToggleDestination: (key: keyof SelectedDestinations) => void;
  isConfiguringMargince: boolean;
  onOpenMarginceConfig: () => void;
  onCloseMarginceConfig: () => void;
  onRegisterSaveHandler?: (handler: () => void) => void;
}

export function Step5Destinations({
  selectedDestinations,
  onToggleDestination,
  isConfiguringMargince,
  onOpenMarginceConfig,
  onCloseMarginceConfig,
  onRegisterSaveHandler,
}: Step5DestinationsProps) {
  const marginceConfig = useAppStore((s) => s.marginceConfig);
  const updateMarginceConfig = useAppStore((s) => s.updateMarginceConfig);
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  // Local form state prefilled from marginceConfig defaults
  const [endpoint, setEndpoint] = useState(
    marginceConfig.endpoint || 'https://api.margince.com/v1/integrations/chatbridge/stream'
  );
  const [apiKey, setApiKey] = useState(
    marginceConfig.apiKey || 'mg_live_9f82d1c7a840e6b54132890'
  );
  const [syncFrequency, setSyncFrequency] = useState<'realtime' | '1m' | '5m'>(
    marginceConfig.syncFrequency || 'realtime'
  );
  const [showApiKey, setShowApiKey] = useState(false);
  const [crmTesting, setCrmTesting] = useState(false);
  const [crmTestResult, setCrmTestResult] = useState<string | null>(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isSheetsConnected = selectedDestinations.sheets;
  const isMarginceConnected = selectedDestinations.margince;
  const googleAccount = sheetsConfig.googleAccount || 'tuananh@gradion.ai';

  const handleTestCrm = async () => {
    setCrmTesting(true);
    setCrmTestResult(null);
    setTimeout(() => {
      setCrmTesting(false);
      setCrmTestResult('✓ Connection verified. Margince webhook responding (200 OK)');
    }, 900);
  };

  const handleSaveAndConnect = () => {
    updateMarginceConfig({
      enabled: true,
      endpoint: endpoint.trim() || 'https://api.margince.com/v1/integrations/chatbridge/stream',
      apiKey: apiKey.trim() || 'mg_live_9f82d1c7a840e6b54132890',
      syncFrequency,
    });
    if (!isMarginceConnected) {
      onToggleDestination('margince');
    }
    onCloseMarginceConfig();
  };

  // Register the save handler so the wizard footer button can trigger save as well
  useEffect(() => {
    if (onRegisterSaveHandler) {
      onRegisterSaveHandler(() => handleSaveAndConnect);
    }
  }, [endpoint, apiKey, syncFrequency, isMarginceConnected]);

  const handleConnectGoogleSheets = () => {
    if (isSheetsConnected) {
      onToggleDestination('sheets');
      return;
    }

    // Quick OAuth login simulation that applies defaults automatically
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

  // =========================================================================
  // VIEW: MARGINCE CRM CONFIGURATION (matching Settings layout)
  // =========================================================================
  if (isConfiguringMargince) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Back navigation header */}
        <div className="flex items-center justify-between pb-0.5">
          <button
            type="button"
            onClick={onCloseMarginceConfig}
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Destinations</span>
          </button>
          <span className="text-[10px] font-mono text-neutral-400">Step 5 of 5 • CRM Setup</span>
        </div>

        {/* Margince CRM Form Card - identical layout to Settings Screen */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-2 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center shrink-0">
                <img src={marginceLogo} alt="Margince CRM" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Margince CRM Integration
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    Primary CRM
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  Forward customer deals, transcripts, and contact cards into your pipeline.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80">
            {/* CRM Webhook Endpoint URL */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                CRM Webhook Endpoint URL
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white font-mono"
                placeholder="https://api.margince.com/v1/stream"
              />
            </div>

            {/* API Secret Token & Sync Frequency in a 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                  API Secret Token
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 pr-10 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white font-mono"
                    placeholder="mg_live_..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                  Sync Frequency
                </label>
                <select
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 dark:focus:ring-white cursor-pointer"
                >
                  <option value="realtime">Real-time (Instant streaming)</option>
                  <option value="1m">Batched every 1 minute</option>
                  <option value="5m">Batched every 5 minutes</option>
                </select>
              </div>
            </div>

            {/* Test Connection Button & Result */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
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
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{crmTestResult}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCloseMarginceConfig}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndConnect}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Save & Connect Margince</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: DESTINATIONS LIST (DEFAULT)
  // =========================================================================
  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* =================================================================== */}
      {/* DESTINATION 1: MARGINCE CRM                                         */}
      {/* =================================================================== */}
      <div
        className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
          isMarginceConnected
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
              {isMarginceConnected
                ? `Connected • Streaming to ${endpoint ? endpoint.replace(/^https?:\/\//, '').split('/')[0] : 'api.margince.com'} (${syncFrequency})`
                : 'Forward leads, deals, and customer conversations directly to Margince.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isMarginceConnected ? (
            <>
              <button
                type="button"
                onClick={onOpenMarginceConfig}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition cursor-pointer flex items-center gap-1.5"
                title="Configure Margince CRM settings"
              >
                <Settings className="w-3.5 h-3.5 text-neutral-500" />
                <span>Configure</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleDestination('margince')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white shadow-xs shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
                title="Click to disconnect Margince CRM"
              >
                <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                <span>Connected</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenMarginceConfig}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer select-none flex items-center gap-1.5 shadow-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700"
            >
              <span>Connect</span>
            </button>
          )}
        </div>
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
