import React from 'react';
import { Avatar } from '@heroui/react';
import { CheckCheck, Clock } from 'lucide-react';
import type { Message } from '@shared/types.js';
import { formatChatTime } from '../../../utils/formatters.js';

interface StickerMessageBubbleProps {
  message: Message;
  senderAvatar?: string;
  senderName?: string;
  isSynced?: boolean;
  isZalo?: boolean;
}

export function StickerMessageBubble({
  message,
  senderAvatar,
  senderName,
  isSynced,
  isZalo = false,
}: StickerMessageBubbleProps) {
  const isOutbound = message.direction === 'outbound';
  const stickerUrl =
    message.metadata?.stickerUrl ||
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Cat%20with%20Wry%20Smile.png';
  const isDropNoise = message.isDropNoise;
  const synced = isDropNoise ? false : (isSynced ?? message.isSynced ?? true);

  if (isOutbound) {
    return (
      <div className="flex flex-col items-end">
        <div className="p-1 max-w-[160px] flex flex-col items-end">
          <img
            src={stickerUrl}
            alt="Sticker"
            className={`w-32 h-32 object-contain drop-shadow-sm transition-transform ${isDropNoise ? 'grayscale opacity-50' : 'hover:scale-105'}`}
          />
          {isDropNoise && (
            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic mt-1 mr-1">
              Removed by dropnoise
            </p>
          )}
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 mr-1">
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

  return (
    <div className="flex items-start gap-3 max-w-[180px]">
      <Avatar size="sm" className="w-8 h-8 shrink-0 mt-1 ring-1 ring-neutral-200/80 dark:ring-neutral-800">
        <Avatar.Image src={senderAvatar} alt={senderName} />
        <Avatar.Fallback>{(senderName || 'U').slice(0, 2)}</Avatar.Fallback>
      </Avatar>

      <div className="flex flex-col items-start flex-1 min-w-0">
        {message.threadKind === 'group' && (
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1 ml-1 truncate">
            {message.from.displayName}
          </span>
        )}

        <img
          src={stickerUrl}
          alt="Sticker"
          className={`w-32 h-32 object-contain drop-shadow-sm transition-transform ${isDropNoise ? 'grayscale opacity-50' : 'hover:scale-105'}`}
        />
        {isDropNoise && (
          <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic mt-1">
            Removed by dropnoise
          </p>
        )}

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
