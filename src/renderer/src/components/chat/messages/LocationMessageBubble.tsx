import React from 'react';
import { Avatar } from '@heroui/react';
import { CheckCheck, Clock, MapPin } from 'lucide-react';
import type { Message } from '@shared/types.js';
import { formatChatTime } from '../../../utils/formatters.js';

interface LocationMessageBubbleProps {
  message: Message;
  senderAvatar?: string;
  senderName?: string;
  isSynced?: boolean;
  isZalo?: boolean;
}

export function LocationMessageBubble({
  message,
  senderAvatar,
  senderName,
  isSynced,
  isZalo = false,
}: LocationMessageBubbleProps) {
  const isOutbound = message.direction === 'outbound';
  const location = message.metadata?.location || {
    title: 'Showroom & Sales Gallery',
    address: '12 Nguyen Van Huong, Thao Dien, District 2, HCMC',
  };
  const isDropNoise = message.isDropNoise;
  const synced = isDropNoise ? false : (isSynced ?? message.isSynced ?? true);

  if (isOutbound) {
    return (
      <div className="flex flex-col items-end">
        <div
          className={`shadow-sm rounded-2xl rounded-tr-xs p-1.5 max-w-[85%] sm:max-w-sm border ${
            isDropNoise
              ? 'bg-neutral-100/80 dark:bg-[#18181b]/80 border-neutral-200/80 dark:border-neutral-800 opacity-75'
              : isZalo
              ? 'bg-blue-600/10 dark:bg-blue-950/30 border-blue-500/20 dark:border-blue-800/40'
              : 'bg-emerald-700/10 dark:bg-emerald-950/30 border-emerald-500/20 dark:border-emerald-800/40'
          }`}
        >
          {/* Map Preview Graphic */}
          <div className="h-32 rounded-xl bg-neutral-200 dark:bg-[#18181b] relative overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=250&fit=crop"
              alt="Map Preview"
              className={`w-full h-full object-cover ${isDropNoise ? 'grayscale opacity-60' : ''}`}
            />
            <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                <MapPin className="w-5 h-5 fill-white" />
              </div>
            </div>
          </div>

          <div className="p-2.5">
            <h5 className={`font-semibold text-xs ${isDropNoise ? 'line-through text-neutral-500 italic' : 'text-neutral-900 dark:text-white'}`}>
              {location.title}
            </h5>
            <p className={`text-[11px] mt-0.5 leading-relaxed ${isDropNoise ? 'line-through text-neutral-400 italic' : 'text-neutral-500 dark:text-neutral-400'}`}>
              {location.address}
            </p>
            {isDropNoise && (
              <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic mt-1">
                Removed by dropnoise
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-1.5 px-1.5 pb-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">
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
    <div className="flex items-start gap-3 max-w-[85%] sm:max-w-sm">
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

        <div
          className={`shadow-sm rounded-2xl rounded-tl-xs p-1.5 w-full border ${
            isDropNoise
              ? 'bg-neutral-100/80 dark:bg-[#18181b]/80 border-neutral-200/80 dark:border-neutral-800 opacity-75'
              : 'bg-white dark:bg-[#18181b] border-neutral-200/80 dark:border-neutral-800'
          }`}
        >
          <div className="h-32 rounded-xl bg-neutral-200 dark:bg-[#18181b] relative overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=250&fit=crop"
              alt="Map Preview"
              className={`w-full h-full object-cover ${isDropNoise ? 'grayscale opacity-60' : ''}`}
            />
            <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                <MapPin className="w-5 h-5 fill-white" />
              </div>
            </div>
          </div>

          <div className="p-2.5">
            <h5 className={`font-semibold text-xs ${isDropNoise ? 'line-through text-neutral-500 italic' : 'text-neutral-900 dark:text-white'}`}>
              {location.title}
            </h5>
            <p className={`text-[11px] mt-0.5 leading-relaxed ${isDropNoise ? 'line-through text-neutral-400 italic' : 'text-neutral-500 dark:text-neutral-400'}`}>
              {location.address}
            </p>
            {isDropNoise && (
              <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic mt-1">
                Removed by dropnoise
              </p>
            )}
          </div>
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
