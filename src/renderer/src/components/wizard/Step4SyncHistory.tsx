import React from 'react';
import type { SyncHistoryRange } from './types.js';

interface Step4SyncHistoryProps {
  syncHistoryRange: SyncHistoryRange;
  onSelectRange: (range: SyncHistoryRange) => void;
}

export function Step4SyncHistory({
  syncHistoryRange,
  onSelectRange,
}: Step4SyncHistoryProps) {
  const options: { id: SyncHistoryRange; label: string; sub: string }[] = [
    { id: 'all', label: 'All', sub: 'Complete lifetime archive' },
    { id: '12m', label: '12 Months', sub: 'Past 365 days' },
    { id: '6m', label: '6 Months', sub: 'Past 180 days' },
    { id: '3m', label: '3 Months', sub: 'Past 90 days' },
  ];

  return (
    <div className="space-y-2.5 animate-in fade-in duration-200 pt-1">
      {options.map((item) => {
        const isSelected = syncHistoryRange === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectRange(item.id)}
            className={`w-full px-4 py-3 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer select-none ${
              isSelected
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md ring-1 ring-black/10 dark:ring-white/20'
                : 'bg-neutral-50/70 dark:bg-neutral-900/40 border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                  isSelected
                    ? 'border-white dark:border-neutral-900 bg-transparent'
                    : 'border-neutral-400 dark:border-neutral-600'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white dark:bg-neutral-900" />
                )}
              </div>
              <span className="font-semibold text-sm tracking-wide">{item.label}</span>
            </div>

            <span
              className={`text-xs ${
                isSelected
                  ? 'text-neutral-300 dark:text-neutral-600 font-medium'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              {item.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
