import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { ShieldAlert, AlertTriangle, Check, ArrowRight, ArrowLeft, X } from 'lucide-react';

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

export interface UnlinkSheetsTarget {
  type: 'account' | 'sheet';
  name: string;
  sheetId?: string;
}

interface UnlinkSheetsConfirmModalProps {
  target: UnlinkSheetsTarget;
  onClose: () => void;
  onConfirm: () => void;
}

export function UnlinkSheetsConfirmModal({
  target,
  onClose,
  onConfirm,
}: UnlinkSheetsConfirmModalProps) {
  // 2-Step Confirmation Flow:
  // Step 1: Warning & Impact Review
  // Step 2: Final Verification & Checkbox Acknowledgement
  const [step, setStep] = useState<1 | 2>(1);
  const [checkSyncHalt, setCheckSyncHalt] = useState(false);
  const [checkPermRevoke, setCheckPermRevoke] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleFinalConfirm = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  const isAccount = target.type === 'account';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-neutral-900 dark:text-white">
        {/* Top Header with Progress Bars & Close Button */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Security Authorization
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2-Step Segmented Bar */}
          <div className="flex items-center gap-2 mt-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
              >
                <div
                  className={`h-full bg-rose-500 transition-all duration-300 ${
                    step >= s ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: IMPACT & CONSEQUENCES REVIEW */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {isAccount ? 'Disconnect Google Sheets Account?' : `Unlink Spreadsheet Link?`}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Step 1 of 2: Please review the operational consequences before unlinking this integration.
              </p>
            </div>

            {/* Target Card Preview */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white p-1 ring-1 ring-neutral-300 dark:ring-neutral-700 shadow-xs flex items-center justify-center shrink-0">
                  <IconGoogleSheets className="w-full h-full" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate">{target.name}</h4>
                  <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate block">
                    {isAccount ? 'Google OAuth Authorization' : `ID: ${target.sheetId?.slice(0, 16)}...`}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                To Be Unlinked
              </span>
            </div>

            {/* Consequences List */}
            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Immediate Consequences:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-rose-800/80 dark:text-rose-300/80 space-y-1 pl-1 leading-relaxed">
                {isAccount ? (
                  <>
                    <li>Live transcript streaming to all connected Google Sheets will pause.</li>
                    <li>OAuth refresh tokens and Drive write permissions will be revoked.</li>
                    <li>Existing rows and formulas in Google Drive will remain preserved.</li>
                  </>
                ) : (
                  <>
                    <li>New message rows will no longer append to this spreadsheet file.</li>
                    <li>Tab mapping and column schema bindings will be disconnected.</li>
                    <li>Existing historical transcripts in Google Drive remain safe.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                size="sm"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-1.5 shadow-xs cursor-pointer"
                onPress={() => setStep(2)}
              >
                <span>Proceed to Confirm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: FINAL CONFIRMATION & EXPLICIT ACKNOWLEDGEMENT */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold tracking-tight text-rose-600 dark:text-rose-400">
                Final Confirmation
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Step 2 of 2: Confirm both statements below to authorize permanent unlinking.
              </p>
            </div>

            {/* Checkbox 1 */}
            <div
              onClick={() => setCheckSyncHalt(!checkSyncHalt)}
              className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 flex items-start gap-3 cursor-pointer select-none hover:border-neutral-300 dark:hover:border-neutral-700 transition"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 mt-0.5 ${
                  checkSyncHalt
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'border-neutral-300 dark:border-neutral-700 bg-transparent'
                }`}
              >
                {checkSyncHalt && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                I understand that conversation logs will no longer sync or append to <strong className="text-neutral-900 dark:text-white">{target.name}</strong>.
              </p>
            </div>

            {/* Checkbox 2 */}
            <div
              onClick={() => setCheckPermRevoke(!checkPermRevoke)}
              className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 flex items-start gap-3 cursor-pointer select-none hover:border-neutral-300 dark:hover:border-neutral-700 transition"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 mt-0.5 ${
                  checkPermRevoke
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'border-neutral-300 dark:border-neutral-700 bg-transparent'
                }`}
              >
                {checkPermRevoke && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {isAccount
                  ? 'I understand that reconnecting will require granting Google OAuth permissions again.'
                  : 'I understand that re-linking will require re-configuring table presets and column mapping.'}
              </p>
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                size="sm"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center gap-1.5 cursor-pointer"
                onPress={() => setStep(1)}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Button>

              <Button
                size="sm"
                isDisabled={!checkSyncHalt || !checkPermRevoke || isProcessing}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition flex items-center gap-1.5 ${
                  checkSyncHalt && checkPermRevoke
                    ? 'bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-rose-500/20'
                    : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed opacity-50'
                }`}
                onPress={handleFinalConfirm}
              >
                <span>{isProcessing ? 'Unlinking...' : 'Confirm & Unlink Destination'}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

