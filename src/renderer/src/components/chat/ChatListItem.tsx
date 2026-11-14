import React from 'react';
import { Avatar, Tooltip } from '@heroui/react';
import { Check, CheckCheck, Users } from 'lucide-react';
import type { Chat } from '@shared/types.js';
import { formatChatTime } from '../../utils/formatters.js';

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
  onToggleSync: () => void;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onToggleCheck?: () => void;
  isZalo?: boolean;
}

export function ChatListItem({
  chat,
  isSelected,
  onSelect,
  onToggleSync,
  showCheckbox = false,
  isChecked = false,
  onToggleCheck,
  isZalo = false,
}: ChatListItemProps) {
  const isGroup = chat.kind === 'group';

  return (
    <div
      onClick={() => {
        if (showCheckbox) {
          onToggleCheck?.();
        } else {
          onSelect();
        }
      }}
      className={`p-3 rounded-2xl cursor-pointer transition flex items-center gap-3 select-none ${
        isChecked
          ? isZalo
            ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-400 dark:border-blue-600 shadow-xs'
            : 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-600 shadow-xs'
          : isSelected
          ? 'bg-white dark:bg-[#18181b] shadow-sm border border-neutral-200/80 dark:border-neutral-800'
          : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60'
      }`}
    >
      {/* Batch Select Checkbox for Unsynced Conversations */}
      {showCheckbox && (
        <div className="shrink-0 flex items-center justify-center pl-0.5">
          <div
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
              isChecked
                ? isZalo
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs scale-105'
                  : 'bg-emerald-600 border-emerald-600 text-white shadow-2xs scale-105'
                : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
            }`}
          >
            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>
      )}

      {/* Clean Contact Avatar without app badge */}
      <div className="relative shrink-0">
        <Avatar size="md" className="w-11 h-11 ring-2 ring-white dark:ring-neutral-800">
          <Avatar.Image src={chat.avatar} alt={chat.name} />
          <Avatar.Fallback>{chat.name.slice(0, 2)}</Avatar.Fallback>
        </Avatar>
      </div>

      {/* Contact Name & Latest Snippet */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {isGroup && <Users className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0" />}
          <h4 className="font-semibold text-sm text-neutral-900 dark:text-white truncate">{chat.name}</h4>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <p
            className={`text-xs truncate ${
              chat.latest?.isDropNoise
                ? 'line-through text-neutral-400 dark:text-neutral-500 italic'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {chat.latest?.text || 'No messages yet'}
          </p>
        </div>
        {chat.latest?.isDropNoise && (
          <span className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic block">
            Removed by dropnoise
          </span>
        )}
      </div>

      {/* Time & Sync Status */}
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{formatChatTime(chat.latest?.time)}</span>

        <div className="flex items-center gap-1">
          {chat.selected ? (
            <Tooltip>
              <Tooltip.Trigger>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSync();
                  }}
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition ${
                    isZalo
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCheck className={`w-3 h-3 ${isZalo ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  Synced
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content
                placement="top"
                className="py-1 px-2.5 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs shadow-md border border-neutral-200/80 dark:border-neutral-800 font-medium"
              >
                Click to Unsync
              </Tooltip.Content>
            </Tooltip>
          ) : (
            <span
              onClick={(e) => {
                if (showCheckbox) return;
                e.stopPropagation();
                onToggleSync();
              }}
              className="text-[10px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition"
            >
              Unsynced
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
