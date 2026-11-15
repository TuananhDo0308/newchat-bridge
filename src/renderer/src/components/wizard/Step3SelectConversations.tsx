import React, { useEffect, useRef } from 'react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import { IconCheck, IconCheckCheck, IconUsers } from './WizardIcons.js';
import { formatChatTime, formatMessageDayDivider, getMessageDateKey } from '../../utils/formatters.js';
import { getEnrichedChatMessages } from './wizardData.js';
import type { Chat, Message } from '@shared/types.js';

interface Step3SelectConversationsProps {
  step3Channel: 'zalo' | 'whatsapp';
  displayedChats: Chat[];
  selectedChatIds: string[];
  previewChatId: string;
  onSelectChatForPreview: (id: string) => void;
  onToggleChatSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export function Step3SelectConversations({
  step3Channel,
  displayedChats,
  selectedChatIds,
  previewChatId,
  onSelectChatForPreview,
  onToggleChatSelect,
  onToggleSelectAll,
}: Step3SelectConversationsProps) {
  const isZalo = step3Channel === 'zalo';
  const currentChannelSelectedCount = displayedChats.filter((c) =>
    selectedChatIds.includes(c.id)
  ).length;

  return (
    <div className="flex flex-col h-full space-y-2.5 animate-in fade-in duration-200">
      {/* Channel sub-bar: Selected count & Select All toggle (App icon removed) */}
      <div className="flex items-center justify-between px-1 pb-1 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-900 dark:text-white">
            {isZalo ? 'Zalo Conversations' : 'WhatsApp Conversations'}{' '}
            <span className="text-neutral-400 font-normal">
              ({currentChannelSelectedCount}/{displayedChats.length})
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleSelectAll}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          {currentChannelSelectedCount === displayedChats.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* 1:1 Contact List matching main UI styling - Full height without max-h cap */}
      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 pb-2 scrollbar-thin">
        {displayedChats.map((chat) => {
          const isSelected = selectedChatIds.includes(chat.id);
          const isPreviewing = previewChatId === chat.id;

          return (
            <div
              key={chat.id}
              onClick={() => onSelectChatForPreview(chat.id)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                isPreviewing
                  ? isZalo
                    ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-400/80 dark:border-blue-500/50 shadow-sm ring-1 ring-blue-500/30'
                    : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400/80 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-white/80 dark:bg-[#161618] border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              {/* Checkbox + Avatar + Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleChatSelect(chat.id);
                  }}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? isZalo
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-800/50 hover:border-neutral-400'
                  }`}
                >
                  {isSelected && <IconCheck className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10">
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                  </div>
                  {(chat.kind === 'group' || (chat as any).isGroup) && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-neutral-900 text-white flex items-center justify-center border border-white dark:border-neutral-900 text-[8px]">
                      <IconUsers className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {chat.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {chat.latest?.text || (chat as any).lastMessageSnippet || 'No messages yet'}
                  </p>
                </div>
              </div>

              {/* Status & Time */}
              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                  {formatChatTime(chat.latest?.time || (chat as any).lastActivity || new Date().toISOString())}
                </span>
                {isSelected ? (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isZalo
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    <IconCheckCheck
                      className={`w-3 h-3 ${
                        isZalo
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    />
                    Synced
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    Unsynced
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Step3ConversationPreviewProps {
  activePreviewChat: Chat;
  messages: Message[];
  myName: string;
  myAvatar: string;
}

export function Step3ConversationPreview({
  activePreviewChat,
  messages,
  myName,
  myAvatar,
}: Step3ConversationPreviewProps) {
  const isZalo = activePreviewChat.network === 'zalo';
  const rawPreviewChatMessages = messages.filter((m) => m.thread === activePreviewChat.thread);
  const displayedMessages = getEnrichedChatMessages(activePreviewChat, rawPreviewChatMessages, myName);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      const el = messagesEndRef.current;
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
        if (el.parentElement) {
          el.parentElement.scrollTop = el.parentElement.scrollHeight;
        }
      }
    };

    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 60);
    return () => clearTimeout(timer);
  }, [activePreviewChat.id, displayedMessages.length]);

  return (
    <div className="relative z-10 flex flex-col h-full justify-between gap-3 animate-in fade-in duration-300">
      {/* Top Glassy Header Bar for Active Selected Contact */}
      <div className="flex items-center justify-between shrink-0 pointer-events-none px-1">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/15 text-white text-xs font-medium shadow-md">
          <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800">
            <img
              src={activePreviewChat.avatar}
              alt={activePreviewChat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold truncate max-w-[220px]">{activePreviewChat.name}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5 shrink-0" />
        </div>
      </div>

      {/* Real Full-Height Chat Feed Grouped Across Days */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 py-2 scrollbar-thin scrollbar-thumb-white/10">
        {displayedMessages.map((msg, index) => {
          const isMe = msg.direction === 'outbound';
          const currentDateKey = getMessageDateKey(msg.time);
          const prevMsg = displayedMessages[index - 1];
          const prevDateKey = prevMsg ? getMessageDateKey(prevMsg.time) : null;
          const showDayDivider = !prevDateKey || currentDateKey !== prevDateKey;

          return (
            <React.Fragment key={msg.id}>
              {/* Day Divider Badge */}
              {showDayDivider && (
                <div className="flex justify-center my-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/10 text-neutral-300 shadow-xs">
                    {formatMessageDayDivider(msg.time)}
                  </span>
                </div>
              )}

              {/* Message Bubble with Avatars */}
              <div
                className={`flex items-end gap-2.5 ${
                  isMe ? 'justify-end ml-auto' : 'justify-start mr-auto'
                } max-w-[90%]`}
              >
                {/* Contact Avatar (for inbound messages) */}
                {!isMe && (
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800 shadow-sm">
                    <img
                      src={activePreviewChat.avatar}
                      alt={activePreviewChat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 backdrop-blur-md shadow-lg space-y-1 ${
                    isMe
                      ? isZalo
                        ? 'rounded-br-xs bg-blue-600/40 border border-blue-400/30 text-white'
                        : 'rounded-br-xs bg-emerald-600/40 border border-emerald-400/30 text-white'
                      : 'rounded-bl-xs bg-white/10 dark:bg-black/40 border border-white/15 text-white'
                  }`}
                >
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[9px] font-mono block ${
                      isMe ? 'text-right text-blue-200/70' : 'text-right text-white/50'
                    }`}
                  >
                    {formatChatTime(msg.time)}
                  </span>
                </div>

                {/* My Avatar (for outbound messages) */}
                {isMe && (
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-neutral-800 shadow-sm">
                    <img src={myAvatar} alt={myName} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Anchor to scroll to bottom */}
        <div ref={messagesEndRef} className="h-0 w-full shrink-0" />
      </div>

      {/* Bottom glassy status line */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 shrink-0 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time transcript preview</span>
        </div>
        <span className="font-mono text-[10px] text-neutral-400">
          {displayedMessages.length} messages loaded
        </span>
      </div>
    </div>
  );
}
