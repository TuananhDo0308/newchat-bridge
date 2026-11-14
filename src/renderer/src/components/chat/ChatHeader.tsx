import React, { useState } from 'react';
import { Avatar, Button, Modal } from '@heroui/react';
import { AlertTriangle, CheckCheck, Forward, Phone, Users } from 'lucide-react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import type { Chat } from '@shared/types.js';

interface ChatHeaderProps {
  chat: Chat;
  onToggleSync: () => void;
}

export function ChatHeader({ chat, onToggleSync }: ChatHeaderProps) {
  const isZalo = chat.network === 'zalo';
  const isGroup = chat.kind === 'group';

  // HeroUI Confirmation Modal state for unsyncing
  const [isUnsyncConfirmOpen, setIsUnsyncConfirmOpen] = useState(false);

  const handleSyncButtonClick = () => {
    if (chat.selected) {
      setIsUnsyncConfirmOpen(true);
    } else {
      onToggleSync();
    }
  };

  return (
    <header className="px-4 md:px-8 py-3.5 md:py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#0a0a0a] transition-colors duration-200">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Contact Avatar */}
        <div className="relative shrink-0">
          <Avatar size="md" className="w-10 h-10 md:w-11 md:h-11 ring-2 ring-neutral-100 dark:ring-neutral-800">
            <Avatar.Image src={chat.avatar} alt={chat.name} />
            <Avatar.Fallback>{chat.name.slice(0, 2)}</Avatar.Fallback>
          </Avatar>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm md:text-base text-neutral-900 dark:text-white leading-tight truncate">
              {chat.name}
            </h3>

            {/* Clean Network Pill Badge (without raw ID in parentheses) */}
            <span
              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                isZalo
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/70 dark:border-blue-800/60'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isZalo ? 'bg-blue-500' : 'bg-emerald-500'
                }`}
              />
              {isZalo ? 'Zalo' : 'WhatsApp'}
            </span>

            {isGroup && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center gap-1 border border-neutral-200/60 dark:border-neutral-700/60">
                <Users className="w-3 h-3 text-neutral-400" />
                Group
              </span>
            )}
          </div>

          {/* Subtitle: Human-readable contact info from WhatsApp / Zalo */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1 min-w-0">
            {isGroup ? (
              <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
                <Users className="w-3 h-3 text-neutral-400" />
                {chat.memberCount || 24} members
              </span>
            ) : (
              (chat.phoneNumber || chat.account) && (
                <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
                  <Phone className="w-3 h-3 text-neutral-400" />
                  {chat.phoneNumber || chat.account}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Sync Toggle Button: Brand Green for WhatsApp, Brand Blue for Zalo */}
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <Button
          size="sm"
          variant={chat.selected ? 'primary' : 'secondary'}
          className={`text-xs font-medium flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
            chat.selected
              ? isZalo
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800'
          }`}
          onPress={handleSyncButtonClick}
        >
          {chat.selected ? (
            <>
              <CheckCheck className="w-3.5 h-3.5 text-white" />
              <span>Synced</span>
            </>
          ) : (
            <>
              <Forward className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>Sync</span>
            </>
          )}
        </Button>
      </div>

      {/* HeroUI Confirmation Modal for Unsyncing in Header with Visual Contact Card */}
      <Modal.Root
        isOpen={isUnsyncConfirmOpen}
        onOpenChange={(open) => setIsUnsyncConfirmOpen(open)}
      >
        <Modal.Backdrop className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 transition-opacity flex items-center justify-center p-4">
          <Modal.Container className="w-full max-w-md">
            <Modal.Dialog className="w-full bg-white dark:bg-[#121212] rounded-3xl p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
              <Modal.Header className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <Modal.Heading className="text-base font-bold text-neutral-900 dark:text-white">
                    Unsync Conversation
                  </Modal.Heading>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    Stop real-time message sync
                  </p>
                </div>
              </Modal.Header>

              {/* Visual Contact Card: Avatar, App Logo, Name, Phone */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#18181b] border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <Avatar size="lg" className="w-14 h-14 rounded-2xl ring-2 ring-white dark:ring-neutral-700 shadow-sm overflow-hidden">
                    <Avatar.Image src={chat.avatar} alt={chat.name} />
                    <Avatar.Fallback className="text-base font-bold bg-neutral-800 text-white">
                      {chat.name.slice(0, 2)}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#18181b] overflow-hidden bg-white shadow-xs flex items-center justify-center">
                    <img
                      src={isZalo ? zaloLogo : whatsappLogo}
                      alt={chat.network}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {chat.name}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isZalo
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                      }`}
                    >
                      {isZalo ? 'Zalo' : 'WhatsApp'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {chat.phoneNumber ? (
                      <span className="font-mono text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                        📞 {chat.phoneNumber}
                      </span>
                    ) : isGroup ? (
                      <span>👥 Group • {chat.memberCount || 24} members</span>
                    ) : (
                      <span className="font-mono text-[11px]">{chat.account}</span>
                    )}
                  </div>
                </div>
              </div>

              <Modal.Body className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed py-0.5">
                Are you sure you want to stop syncing messages for{' '}
                <strong className="text-neutral-900 dark:text-white font-semibold">{chat.name}</strong>?
                Previously synchronized messages will remain safely stored on your CRM, but future messages will no longer sync.
              </Modal.Body>

              <Modal.Footer className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                  onPress={() => setIsUnsyncConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition"
                  onPress={() => {
                    setIsUnsyncConfirmOpen(false);
                    onToggleSync();
                  }}
                >
                  Confirm Unsync
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>
    </header>
  );
}
