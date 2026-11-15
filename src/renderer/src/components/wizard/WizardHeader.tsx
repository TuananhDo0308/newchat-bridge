import React from 'react';
import { BrandLogo } from '../Logo.js';
import type { WizardStep } from './types.js';

interface WizardHeaderProps {
  step: WizardStep;
  isDark: boolean;
  hasConnectedAtLeastOne: boolean;
  hasBothAccounts: boolean;
  step3Channel: 'zalo' | 'whatsapp';
  isConfiguringMargince?: boolean;
}

export function WizardHeader({
  step,
  isDark,
  hasConnectedAtLeastOne,
  hasBothAccounts,
  step3Channel,
  isConfiguringMargince = false,
}: WizardHeaderProps) {
  return (
    <div className="shrink-0 pb-2">
      {/* Top Bar: Brand Logo */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center">
          <BrandLogo isDark={isDark} className="h-7 w-auto" />
        </div>
      </div>

      {/* Segmented Progress Bar: 5 Full Steps */}
      <div className="flex items-center gap-2 mt-4 mb-3.5">
        {[1, 2, 3, 4, 5].map((seg) => (
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
          {step === 2 && 'DropNoise Filters'}
          {step === 3 &&
            (hasBothAccounts
              ? step3Channel === 'zalo'
                ? 'Select Zalo Conversations'
                : 'Select WhatsApp Conversations'
              : `Select ${step3Channel === 'zalo' ? 'Zalo' : 'WhatsApp'} Conversations`)}
          {step === 4 && 'Select Sync History Range'}
          {step === 5 &&
            (isConfiguringMargince ? 'Configure Margince CRM' : 'Choose Forwarding Destination')}
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
            (isConfiguringMargince
              ? 'Enter your webhook endpoint URL and API secret token to forward deals and conversations.'
              : 'Route synchronized leads and conversations to Margince CRM or Google Sheets.')}
        </p>
      </div>
    </div>
  );
}
