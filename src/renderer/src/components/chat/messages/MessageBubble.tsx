import React from 'react';
import { Avatar } from '@heroui/react';
import { CheckCheck, Clock } from 'lucide-react';
import type { Message } from '@shared/types.js';
import { formatChatTime } from '../../../utils/formatters.js';

interface MessageBubbleProps {
  message: Message;
  senderAvatar?: string;
  senderName?: string;
  isSynced?: boolean;
  isZalo?: boolean;
}

export function MessageBubble({
  message,
  senderAvatar,
  senderName,
  isSynced,
  isZalo = false,
}: MessageBubbleProps) {
  const isOutbound = message.direction === 'outbound';
  const isDropNoise = message.isDropNoise;
  const synced = isDropNoise ? false : (isSynced ?? message.isSynced ?? true);

  if (isOutbound) {
    return (
      <div className="flex flex-col items-end">
        <div
          className={`shadow-xs rounded-[20px] rounded-tr-xs px-4 py-2.5 text-xs md:text-sm leading-relaxed max-w-[85%] sm:max-w-md md:max-w-lg break-words border ${
            isDropNoise
              ? 'bg-neutral-100/80 dark:bg-[#18181b]/80 border-neutral-200/80 dark:border-neutral-800 opacity-75'
              : isZalo
              ? 'bg-blue-600/10 dark:bg-blue-950/30 border-blue-500/20 dark:border-blue-800/40 text-neutral-900 dark:text-blue-100'
              : 'bg-emerald-700/10 dark:bg-emerald-950/30 border-emerald-500/20 dark:border-emerald-800/40 text-neutral-900 dark:text-emerald-100'
          }`}
        >
          <p className={isDropNoise ? 'line-through text-neutral-500 dark:text-neutral-400 italic' : ''}>
            {message.text}
          </p>
          {isDropNoise && (
            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic mt-1 text-right">
              Removed by dropnoise
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 mr-2 mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
          <span>{formatChatTime(message.time)}</span>
          {synced ? (
            <span className={`inline-flex items-center gap-0.5 font-medium ${isZalo ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              <CheckCheck className="w-3 h-3" />
              <span>Synced</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-2.5 h-2.5" />
              <span>Not synced</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 max-w-[85%] sm:max-w-md md:max-w-lg">
      <Avatar size="sm" className="w-8 h-8 shrink-0 mt-1 ring-1 ring-neutral-200/80 dark:ring-neutral-800">
        <Avatar.Image src={senderAvatar} alt={senderName} />
        <Avatar.Fallback>{(senderName || 'U').slice(0, 2)}</Avatar.Fallback>
      </Avatar>

      <div className="flex flex-col items-start min-w-0">
        {message.threadKind === 'group' && (
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1 ml-1 truncate">
            {message.from.displayName}
          </span>
        )}

        <div
          className={`shadow-xs text-xs md:text-sm rounded-[20px] rounded-tl-xs px-4 py-2.5 leading-relaxed break-words border ${
            isDropNoise
              ? 'bg-neutral-100/80 dark:bg-[#18181b]/80 border-neutral-200/80 dark:border-neutral-800 opacity-75'
              : 'bg-white dark:bg-[#18181b] border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100'
          }`}
        >
          <p className={isDropNoise ? 'line-through text-neutral-500 dark:text-neutral-400 italic' : ''}>
            {message.text}
          </p>
          {isDropNoise && (
            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic mt-1">
              Removed by dropnoise
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-1 mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
          <span>{formatChatTime(message.time)}</span>
          {synced ? (
            <span className={`inline-flex items-center gap-0.5 font-medium ${isZalo ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              <CheckCheck className="w-3 h-3" />
              <span>Synced</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-2.5 h-2.5" />
              <span>Not synced</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
