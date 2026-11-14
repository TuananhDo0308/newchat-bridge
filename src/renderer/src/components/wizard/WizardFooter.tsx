import React from 'react';
import { Button } from '@heroui/react';
import { IconArrowLeft, IconArrowRight } from './WizardIcons.js';
import type { WizardStep } from './types.js';

interface WizardFooterProps {
  step: WizardStep;
  hasConnectedAtLeastOne: boolean;
  hasBothAccounts: boolean;
  step3Channel: 'zalo' | 'whatsapp';
  hasConnectedDestination: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export function WizardFooter({
  step,
  hasConnectedAtLeastOne,
  hasBothAccounts,
  step3Channel,
  hasConnectedDestination,
  onBack,
  onNext,
  onFinish,
}: WizardFooterProps) {
  return (
    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0">
      <div>
        {step > 1 && (
          <Button
            size="sm"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center gap-1.5 cursor-pointer"
            onPress={onBack}
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
              if (hasConnectedAtLeastOne) onNext();
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
            onPress={onNext}
          >
            <span>Next: Select Chats</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}

        {step === 3 && (
          <Button
            size="sm"
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            onPress={onNext}
          >
            <span>
              {hasBothAccounts && step3Channel === 'zalo'
                ? 'Next: WhatsApp Sync'
                : 'Next: Sync History'}
            </span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}

        {step === 4 && (
          <Button
            size="sm"
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            onPress={onNext}
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
              onPress={onFinish}
            >
              <span>Explore ChatBridge</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition cursor-pointer"
              onPress={onFinish}
            >
              <span>Skip for now</span>
            </Button>
          )
        )}
      </div>
    </div>
  );
}
