import React, { useMemo, useEffect, useRef } from 'react';
import { ScrollShadow } from '@heroui/react';
import { useChatBridgeStore } from '../../store/useChatBridgeStore.js';
import { formatMessageDayDivider, getMessageDateKey } from '../../utils/formatters.js';
import { ChatHeader } from '../chat/ChatHeader.js';
import { MessageBubble } from '../chat/messages/MessageBubble.js';
import { AudioMessageBubble } from '../chat/messages/AudioMessageBubble.js';
import { ImageMessageBubble } from '../chat/messages/ImageMessageBubble.js';
import { FileMessageBubble } from '../chat/messages/FileMessageBubble.js';
import { StickerMessageBubble } from '../chat/messages/StickerMessageBubble.js';
import { LocationMessageBubble } from '../chat/messages/LocationMessageBubble.js';

export function ChatArea() {
  const chats = useChatBridgeStore((s) => s.chats);
  const messages = useChatBridgeStore((s) => s.messages);
  const selectedChatId = useChatBridgeStore((s) => s.selectedChatId);
  const isMobileChatOpen = useChatBridgeStore((s) => s.isMobileChatOpen);
  const toggleChatSync = useChatBridgeStore((s) => s.toggleChatSync);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active chat
  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === selectedChatId) || chats[0];
  }, [chats, selectedChatId]);

  const isZalo = activeChat?.network === 'zalo';

  // Messages in active conversation
  const activeMessages = useMemo(() => {
    if (!activeChat) return [];
    return messages.filter(
      (m) =>
        m.network === activeChat.network &&
        m.account === activeChat.account &&
        m.thread === activeChat.thread
    );
  }, [messages, activeChat]);

  // Automatically scroll to bottom so the latest/bottom-most messages are visible first
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
  }, [selectedChatId, activeMessages.length]);

  // 30-day sync window cutoff (Simulated current date: Nov 14, 2026 -> 30 days ago is Oct 15, 2026)
  const isWithin30Days = (timeStr: string) => {
    const msgTime = new Date(timeStr).getTime();
    const thirtyDaysAgo = new Date('2026-10-15T00:00:00.000Z').getTime();
    return msgTime >= thirtyDaysAgo;
  };

  if (!activeChat) {
    return (
      <main className="flex-1 min-w-0 bg-white dark:bg-black flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500">
        <p className="text-sm">Select a conversation to view messages</p>
      </main>
    );
  }

  return (
    <main className={`flex-1 min-w-0 bg-white dark:bg-black flex-col overflow-hidden transition-colors duration-200 ${
      isMobileChatOpen ? 'flex w-full' : 'hidden md:flex'
    }`}>
      {/* Top Active Chat Header with Unsync Confirmation */}
      <ChatHeader
        chat={activeChat}
        onToggleSync={() => toggleChatSync(activeChat.id)}
      />

      {/* Message Thread Feed: Brand Green for WhatsApp, Brand Blue for Zalo */}
      <ScrollShadow
        className={`flex-1 p-4 sm:p-6 md:p-8 space-y-4 md:space-y-5 overflow-y-auto ${
          isZalo
            ? 'bg-gradient-to-b from-blue-50/20 via-white to-white dark:from-blue-950/20 dark:via-black dark:to-black'
            : 'bg-gradient-to-b from-emerald-50/20 via-white to-white dark:from-emerald-950/20 dark:via-black dark:to-black'
        }`}
      >
        {activeMessages.map((msg, idx) => {
          const type = msg.metadata?.type;
          const isMsgSynced = msg.isDropNoise
            ? false
            : msg.isSynced !== undefined
            ? msg.isSynced
            : activeChat.selected && isWithin30Days(msg.time);

          // Group by Day Divider
          const currentDateKey = getMessageDateKey(msg.time);
          const prevDateKey = idx > 0 ? getMessageDateKey(activeMessages[idx - 1].time) : null;
          const isNewDay = currentDateKey !== prevDateKey;

          return (
            <React.Fragment key={msg.id}>
              {/* Day Divider Pill */}
              {isNewDay && (
                <div className="flex items-center justify-center my-3">
                  <span className="px-3.5 py-1 rounded-full bg-neutral-100 dark:bg-[#18181b] text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
                    {formatMessageDayDivider(msg.time)}
                  </span>
                </div>
              )}

              {/* Message Bubbles (Passing isZalo for network branding color) */}
              {type === 'audio' ? (
                <AudioMessageBubble
                  message={msg}
                  senderAvatar={activeChat.avatar}
                  senderName={activeChat.name}
                  isSynced={isMsgSynced}
                  isZalo={isZalo}
                />
              ) : type === 'image' ? (
                <ImageMessageBubble
                  message={msg}
                  senderAvatar={activeChat.avatar}
                  senderName={activeChat.name}
                  isSynced={isMsgSynced}
                  isZalo={isZalo}
                />
              ) : type === 'file' ? (
                <FileMessageBubble
                  message={msg}
                  senderAvatar={activeChat.avatar}
                  senderName={activeChat.name}
                  isSynced={isMsgSynced}
                  isZalo={isZalo}
                />
              ) : type === 'sticker' ? (
                <StickerMessageBubble
                  message={msg}
                  senderAvatar={activeChat.avatar}
                  senderName={activeChat.name}
                  isSynced={isMsgSynced}
                  isZalo={isZalo}
                />
              ) : type === 'location' ? (
                <LocationMessageBubble
                  message={msg}
                  senderAvatar={activeChat.avatar}
                  senderName={activeChat.name}
                  isSynced={isMsgSynced}
                  isZalo={isZalo}
                />
              ) : (
                <MessageBubble
                  message={msg}
                  senderAvatar={activeChat.avatar}
                  senderName={activeChat.name}
                  isSynced={isMsgSynced}
                  isZalo={isZalo}
                />
              )}
            </React.Fragment>
          );
        })}

        {activeMessages.length === 0 && (
          <div className="py-20 text-center text-neutral-400 dark:text-neutral-500 text-xs">
            No messages in this conversation yet.
          </div>
        )}

        {/* Anchor to scroll to bottom */}
        <div ref={messagesEndRef} className="h-0 w-full shrink-0" />
      </ScrollShadow>
    </main>
  );
}
