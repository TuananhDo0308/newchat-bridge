import React from 'react';
import { IconCheck } from './WizardIcons.js';
import type { DropNoiseFilters, DropNoiseKey } from './types.js';

interface Step2DropNoiseProps {
  dropNoiseFilters: DropNoiseFilters;
  onToggleFilter: (key: DropNoiseKey) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function Step2DropNoise({
  dropNoiseFilters,
  onToggleFilter,
  onSelectAll,
  onClearAll,
}: Step2DropNoiseProps) {
  const activeDropCount = Object.values(dropNoiseFilters).filter(Boolean).length;

  const dropNoiseBadgeList: { key: DropNoiseKey; label: string }[] = [
    { key: 'reactions', label: 'Reactions' },
    { key: 'edits', label: 'Message Edits' },
    { key: 'stickers', label: 'Stickers' },
    { key: 'stories', label: 'Stories & Status' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Control bar: Title, counter, select all / reset */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-900 dark:text-white">
            Filter Badges
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {activeDropCount} of {dropNoiseBadgeList.length} Active
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onSelectAll}
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Select All
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <button
            type="button"
            onClick={onClearAll}
            className="font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Horizontal YouTube-Style Pill Buttons */}
      <div className="flex flex-wrap gap-2 pt-0.5">
        {dropNoiseBadgeList.map((badge) => {
          const isActive = dropNoiseFilters[badge.key];
          return (
            <button
              key={badge.key}
              type="button"
              onClick={() => onToggleFilter(badge.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all select-none cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold ring-1 ring-black/10 dark:ring-white/20'
                  : 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/90 dark:border-neutral-700/80'
              }`}
            >
              {isActive ? (
                <IconCheck className="w-3 h-3 stroke-[3]" />
              ) : (
                <span className="text-neutral-400 dark:text-neutral-500 font-bold leading-none">+</span>
              )}
              <span>{badge.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface Step2DropNoisePreviewProps {
  dropNoiseFilters: DropNoiseFilters;
}

export function Step2DropNoisePreview({ dropNoiseFilters }: Step2DropNoisePreviewProps) {
  const activeDropCount = Object.values(dropNoiseFilters).filter(Boolean).length;
  const customerAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces';
  const myAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces';

  return (
    <div className="relative z-10 flex flex-col h-full justify-between gap-3 animate-in fade-in duration-300">
      {/* Top Glassy Header Bar for Customer */}
      <div className="flex items-center justify-between shrink-0 pointer-events-none px-1">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/15 text-white text-xs font-medium shadow-md">
          <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800">
            <img
              src={customerAvatar}
              alt="Alexander"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold truncate max-w-[200px]">Alexander (Customer)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5 shrink-0" />
        </div>
        <span className="text-[11px] font-mono text-neutral-200 bg-white/10 dark:bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
          {activeDropCount} Filtered
        </span>
      </div>

      {/* Glassy Floating Message Feed: Clean messages with only content and timestamp */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 py-2 scrollbar-thin scrollbar-thumb-white/10">
        {/* 1. Inbound Customer Message */}
        <div className="flex items-end gap-2.5 max-w-[88%] shrink-0">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800 shadow-sm">
            <img src={customerAvatar} alt="Alexander" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl rounded-bl-xs px-3.5 py-2.5 bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-md">
            <p className="text-xs leading-relaxed">
              Hi Alexander, could you send me the latest quotation and features for the Gradion software?
            </p>
            <span className="text-[9px] text-white/50 font-mono mt-1 block text-right">10:30 AM</span>
          </div>
        </div>

        {/* 2. Outbound Message with EDITED LINE & REACTION PILL */}
        <div className="flex items-end justify-end gap-2.5 ml-auto max-w-[90%] shrink-0">
          <div className="rounded-2xl rounded-br-xs px-3.5 py-2.5 bg-blue-600/40 backdrop-blur-md border border-blue-400/30 text-white shadow-md space-y-1.5 text-left">
            <p className="text-xs leading-relaxed">
              Hello! Absolutely, I will send the PDF proposal and enterprise license breakdown right away.
            </p>

            {/* MESSAGE EDIT: Strikethrough if active, clean font-mono */}
            <div
              className={`text-[11px] font-mono pt-1 border-t border-white/10 ${
                dropNoiseFilters.edits
                  ? 'line-through decoration-rose-400 decoration-1 text-rose-200/80'
                  : 'text-blue-200/70'
              }`}
            >
              Original [10:31 AM]: &quot;I will send the draft in 5m&quot;
            </div>

            {/* REACTION & TIMESTAMP ROW: Only reaction pill and time */}
            <div className="flex items-center justify-between text-[9px] font-mono pt-0.5">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full border transition-all ${
                  dropNoiseFilters.reactions
                    ? 'line-through decoration-rose-500 decoration-1 text-rose-300 bg-rose-950/40 border-rose-500/30'
                    : 'bg-white/10 border-white/15 text-white/90'
                }`}
              >
                👍 1
              </span>
              <span className="text-blue-200/70">10:32 AM (Edited)</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800 shadow-sm">
            <img src={myAvatar} alt="Me" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 3. STICKER MESSAGE: Clean sticker and timestamp only */}
        <div className="flex items-end gap-2.5 max-w-[85%] shrink-0">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800 shadow-sm">
            <img src={customerAvatar} alt="Alexander" className="w-full h-full object-cover" />
          </div>
          <div className="p-3 rounded-2xl rounded-bl-xs bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-md space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🐱</span>
              <span
                className={`text-xs ${
                  dropNoiseFilters.stickers
                    ? 'line-through decoration-rose-500 decoration-1 text-neutral-400'
                    : 'text-white'
                }`}
              >
                [Sticker: Animated Thumbs Up Cat]
              </span>
            </div>
            <span className="text-[9px] text-white/50 font-mono block text-right">10:33 AM</span>
          </div>
        </div>

        {/* 4. STORY REPLY MESSAGE: Clean story reply and timestamp only */}
        <div className="flex items-end gap-2.5 max-w-[85%] shrink-0">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800 shadow-sm">
            <img src={customerAvatar} alt="Alexander" className="w-full h-full object-cover" />
          </div>
          <div className="p-3 rounded-2xl rounded-bl-xs bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-md space-y-1">
            <div
              className={`text-xs space-y-0.5 ${
                dropNoiseFilters.stories
                  ? 'line-through decoration-rose-500 decoration-1 text-neutral-400'
                  : 'text-white'
              }`}
            >
              <div className="text-[10px] text-neutral-400">
                📷 Replied to your Story: &quot;Q4 Enterprise Launch 🚀&quot;
              </div>
              <p>&quot;Looks great! Let us discuss pricing on the call tomorrow.&quot;</p>
            </div>
            <span className="text-[9px] text-white/50 font-mono block text-right">10:34 AM</span>
          </div>
        </div>

        {/* 5. Inbound Customer Confirmation */}
        <div className="flex items-end gap-2.5 max-w-[88%] shrink-0">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800 shadow-sm">
            <img src={customerAvatar} alt="Alexander" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl rounded-bl-xs px-3.5 py-2.5 bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-md">
            <p className="text-xs leading-relaxed">
              Thank you! Everything looks solid. Let&apos;s arrange a quick demo call tomorrow at 10 AM.
            </p>
            <span className="text-[9px] text-white/50 font-mono mt-1 block text-right">10:34 AM</span>
          </div>
        </div>

        {/* 6. Outbound Sales Rep Closing */}
        <div className="flex items-end justify-end gap-2.5 ml-auto max-w-[88%] shrink-0">
          <div className="rounded-2xl rounded-br-xs px-3.5 py-2.5 bg-blue-600/40 backdrop-blur-md border border-blue-400/30 text-white shadow-md">
            <p className="text-xs leading-relaxed">
              Perfect! I have reserved 10:00 AM on Google Meet. See you tomorrow!
            </p>
            <span className="text-[9px] text-blue-200/70 font-mono mt-1 block text-right">10:35 AM</span>
          </div>
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800 shadow-sm">
            <img src={myAvatar} alt="Me" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Bottom glassy status line aligned with left bottom action bar */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 shrink-0 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time transcript preview</span>
        </div>
        <span className="font-mono text-[10px] text-neutral-400">
          {activeDropCount} noise rules active
        </span>
      </div>
    </div>
  );
}
