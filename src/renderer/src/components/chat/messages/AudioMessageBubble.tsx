import React, { useState } from 'react';
import { Avatar } from '@heroui/react';
import { CheckCheck, Clock, Mic, Pause, Play } from 'lucide-react';
import type { Message } from '@shared/types.js';
import { formatChatTime } from '../../../utils/formatters.js';

interface AudioMessageBubbleProps {
  message: Message;
  senderAvatar?: string;
  senderName?: string;
  isSynced?: boolean;
  isZalo?: boolean;
}

export function AudioMessageBubble({
  message,
  senderAvatar,
  senderName,
  isSynced,
  isZalo = false,
}: AudioMessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isOutbound = message.direction === 'outbound';
  const defaultWaveform = [6, 12, 18, 10, 24, 16, 20, 26, 14, 8, 22, 28, 16, 20, 26, 14, 10, 16];
  const waveform: number[] = message.metadata?.waveform || defaultWaveform;
  const duration = message.metadata?.duration || '0:38';
  const isDropNoise = message.isDropNoise;
  const synced = isDropNoise ? false : (isSynced ?? message.isSynced ?? true);

  if (isOutbound) {
    return (
      <div className="flex flex-col items-end">
        <div
          className={`shadow-sm rounded-2xl rounded-tr-xs px-4 py-3 flex flex-col gap-1 max-w-[85%] sm:max-w-sm border ${
            isDropNoise
              ? 'bg-neutral-100/80 dark:bg-[#18181b]/80 border-neutral-200/80 dark:border-neutral-800 opacity-75'
              : isZalo
              ? 'bg-blue-600/10 dark:bg-blue-950/30 border-blue-500/20 dark:border-blue-800/40'
              : 'bg-emerald-700/10 dark:bg-emerald-950/30 border-emerald-500/20 dark:border-emerald-800/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs hover:scale-105 transition ${
                isZalo ? 'bg-blue-600' : 'bg-emerald-600'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <div className="flex items-center gap-[2.5px] h-6 flex-1">
              {waveform.map((height: number, i: number) => (
                <span
                  key={i}
                  style={{ height: `${height}px` }}
                  className={`w-[2.5px] rounded-full transition-all ${
                    isPlaying && i < waveform.length / 2
                      ? isZalo ? 'bg-blue-600' : 'bg-emerald-600'
                      : 'bg-neutral-400 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Mic className={`w-3.5 h-3.5 ${isZalo ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span className={`text-xs font-mono font-medium ${isDropNoise ? 'line-through text-neutral-500' : 'text-neutral-700 dark:text-neutral-200'}`}>
                {duration}
              </span>
            </div>
          </div>
          {isDropNoise && (
            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic text-right mt-0.5">
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
          className={`shadow-sm rounded-2xl rounded-tl-xs px-4 py-3 flex flex-col gap-1 w-full border ${
            isDropNoise
              ? 'bg-neutral-100/80 dark:bg-[#18181b]/80 border-neutral-200/80 dark:border-neutral-800 opacity-75'
              : 'bg-white dark:bg-[#18181b] border-neutral-200/80 dark:border-neutral-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center shrink-0 shadow-xs hover:scale-105 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <div className="flex items-center gap-[2.5px] h-6 flex-1">
              {waveform.map((height: number, i: number) => (
                <span
                  key={i}
                  style={{ height: `${height}px` }}
                  className={`w-[2.5px] rounded-full transition-all ${
                    isPlaying && i < waveform.length / 2
                      ? 'bg-neutral-900 dark:bg-neutral-100'
                      : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Mic className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span className={`text-xs font-mono font-medium ${isDropNoise ? 'line-through text-neutral-500' : 'text-neutral-700 dark:text-neutral-200'}`}>
                {duration}
              </span>
            </div>
          </div>
          {isDropNoise && (
            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium italic mt-0.5">
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
