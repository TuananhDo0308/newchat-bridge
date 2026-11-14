import React from 'react';
import marginceLogo from '../../assets/margince-logo.svg';
import { IconGoogleSheets, IconCheck } from './WizardIcons.js';
import type { SelectedDestinations } from './types.js';

interface Step5DestinationsProps {
  selectedDestinations: SelectedDestinations;
  onToggleDestination: (key: keyof SelectedDestinations) => void;
}

export function Step5Destinations({
  selectedDestinations,
  onToggleDestination,
}: Step5DestinationsProps) {
  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      <div className="space-y-3 pt-1">
        {/* ROW 1: MARGINCE CRM */}
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

          <button
            type="button"
            onClick={() => onToggleDestination('sheets')}
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
  );
}
