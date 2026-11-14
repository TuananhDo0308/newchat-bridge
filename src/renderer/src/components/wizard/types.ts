import type { Chat, Message } from '@shared/types.js';

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export type DropNoiseKey = 'reactions' | 'edits' | 'stickers' | 'stories';

export interface DropNoiseFilters {
  reactions: boolean;
  edits: boolean;
  stickers: boolean;
  stories: boolean;
}

export type SyncHistoryRange = '3m' | '6m' | '12m' | 'all';

export interface AccountProfile {
  name: string;
  phone: string;
  avatar: string;
}

export interface SelectedDestinations {
  margince: boolean;
  sheets: boolean;
}

export interface OnboardingWizardProps {
  onComplete: () => void;
}
