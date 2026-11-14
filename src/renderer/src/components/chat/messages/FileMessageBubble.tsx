import React from 'react';
import { Avatar } from '@heroui/react';
import { CheckCheck, Clock, Download, FileSpreadsheet, FileText } from 'lucide-react';
import type { Message } from '@shared/types.js';
import { formatChatTime } from '../../../utils/formatters.js';

interface FileMessageBubbleProps {
  message: Message;
  senderAvatar?: string;
  senderName?: string;
  isSynced?: boolean;
  isZalo?: boolean;
}

export function FileMessageBubble({
  message,
  senderAvatar,
  senderName,
  isSynced,
  isZalo = false,
}: FileMessageBubbleProps) {
  const isOutbound = message.direction === 'outbound';
  const fileName = message.metadata?.fileName || message.text || 'Document.pdf';
  const fileSize = message.metadata?.fileSize || '1.8 MB';
  const isSheet = fileName.endsWith('.xlsx') || fileName.endsWith('.csv');
  const isDropNoise = message.isDropNoise;
  const synced = isDropNoise ? false : (isSynced ?? message.isSynced ?? true);

  if (isOutbound) {
    return (
      <div className="flex flex-col items-end">
        <div
          className={`shadow-sm rounded-2xl rounded-tr-xs p-3.5 max-w-[85%] sm:max-w-sm flex flex-col gap-1 border ${
            isDropNoise
              ? 'bg-neutral-100/80 dark:bg-[#18181b]/80 border-neutral-200/80 dark:border-neutral-800 opacity-75'
              : isZalo
              ? 'bg-blue-600/10 dark:bg-blue-950/30 border-blue-500/20 dark:border-blue-800/40'
              : 'bg-emerald-700/10 dark:bg-emerald-950/30 border-emerald-500/20 dark:border-emerald-800/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs ${
                isZalo ? 'bg-blue-600' : 'bg-emerald-600'
              }`}
            >
              {isSheet ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className={`font-semibold text-xs truncate ${isDropNoise ? 'line-through text-neutral-500 italic' : 'text-neutral-900 dark:text-white'}`}>
                {fileName}
              </h5>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">{fileSize}</span>
            </div>

            <button className="w-8 h-8 rounded-full bg-white dark:bg-[#18181b] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shadow-xs hover:scale-105 transition">
              <Download className="w-4 h-4" />
            </button>
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
          className={`shadow-sm rounded-2xl rounded-tl-xs p-3.5 flex flex-col gap-1 w-full border ${
            isDropNoise
              ? 'bg-neutral-100/80 dark:bg-[#18181b]/80 border-neutral-200/80 dark:border-neutral-800 opacity-75'
              : 'bg-white dark:bg-[#18181b] border-neutral-200/80 dark:border-neutral-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center shrink-0 shadow-xs">
              {isSheet ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className={`font-semibold text-xs truncate ${isDropNoise ? 'line-through text-neutral-500 italic' : 'text-neutral-900 dark:text-white'}`}>
                {fileName}
              </h5>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">{fileSize}</span>
            </div>

            <button className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shadow-xs hover:scale-105 transition">
              <Download className="w-4 h-4" />
            </button>
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
