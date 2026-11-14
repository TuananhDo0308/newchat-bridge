import React, { useMemo } from 'react';
import { Avatar, Tooltip } from '@heroui/react';
import { Plus, Settings } from 'lucide-react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import { LogoIcon } from '../Logo.js';
import {
  selectRailAccounts,
  useChatBridgeStore,
} from '../../store/useChatBridgeStore.js';
import { useAppStore } from '../../store/useAppStore.js';

export function AccountRail() {
  const sources = useChatBridgeStore((s) => s.sources);
  const chats = useChatBridgeStore((s) => s.chats);
  const scope = useChatBridgeStore((s) => s.scope);
  const setScope = useChatBridgeStore((s) => s.setScope);

  const openSettings = useAppStore((s) => s.openSettings);
  const closeSettings = useAppStore((s) => s.closeSettings);
  const toggleSettings = useAppStore((s) => s.toggleSettings);
  const isSettingsOpen = useAppStore((s) => s.isSettingsOpen);

  const railList = useMemo(() => selectRailAccounts(sources, chats), [sources, chats]);

  return (
    <aside className="drag-region w-[70px] md:w-[78px] shrink-0 border-r border-neutral-200/80 dark:border-neutral-800 bg-[#edf3f0] dark:bg-[#0a0a0a] flex flex-col items-center justify-between py-6 transition-colors duration-200">
      <div className="no-drag flex flex-col items-center gap-4 w-full">
        {/* Brand Logo - Completely static without hover scaling */}
        <Tooltip>
          <Tooltip.Trigger>
            <div
              onClick={() => {
                if (isSettingsOpen) closeSettings();
                if (railList[0]) setScope({ network: railList[0].network, account: railList[0].account });
              }}
              className="w-11 h-11 cursor-pointer flex items-center justify-center"
            >
              <LogoIcon
                className="w-full h-full"
                withShadow={true}
              />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content
            placement="right"
            className="py-1 px-2.5 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs shadow-md border border-neutral-200/80 dark:border-neutral-800 font-semibold"
          >
            Chat Bridge Desktop
          </Tooltip.Content>
        </Tooltip>

        <div className="w-8 h-[1px] bg-neutral-300/60 dark:bg-neutral-800 my-1" />

        {/* Dynamic Accounts */}
        <div className="flex flex-col items-center gap-3.5 w-full">
          {railList.map((account) => {
            const isCurrent =
              !isSettingsOpen &&
              scope?.network === account.network &&
              scope?.account === account.account;
            const isZalo = account.network === 'zalo';

            return (
              <div key={account.key} className="relative flex items-center justify-center w-full group">
                {isCurrent && (
                  <span className="absolute left-0 w-1.5 h-8 bg-neutral-900 dark:bg-white rounded-r-full" />
                )}

                <Tooltip>
                  <Tooltip.Trigger>
                    <button
                      onClick={() => {
                        if (isSettingsOpen) closeSettings();
                        setScope({ network: account.network, account: account.account });
                      }}
                      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'ring-2 ring-neutral-900 dark:ring-white ring-offset-2 ring-offset-[#edf3f0] dark:ring-offset-[#0a0a0a] shadow-md scale-105'
                          : 'hover:scale-105 opacity-85 hover:opacity-100'
                      }`}
                    >
                      {/* Main User Avatar */}
                      <Avatar
                        size="md"
                        className="w-full h-full rounded-2xl ring-1 ring-neutral-200/80 dark:ring-neutral-800 overflow-hidden shadow-xs"
                      >
                        <Avatar.Image src={account.avatarUrl} alt={account.name} />
                        <Avatar.Fallback className="font-bold text-xs bg-neutral-900 text-white">
                          {account.initials}
                        </Avatar.Fallback>
                      </Avatar>

                      {/* Small Zalo / WhatsApp Logo Corner Badge */}
                      <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full ring-2 ring-[#edf3f0] dark:ring-[#0a0a0a] overflow-hidden shadow-xs bg-white flex items-center justify-center">
                        <img
                          src={isZalo ? zaloLogo : whatsappLogo}
                          alt={isZalo ? 'Zalo' : 'WhatsApp'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Online Status Dot in top corner */}
                      {account.state === 'connected' && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#edf3f0] dark:ring-[#0a0a0a]" />
                      )}
                    </button>
                  </Tooltip.Trigger>

                  {/* Tooltip */}
                  <Tooltip.Content
                    placement="right"
                    className="py-1.5 px-3 rounded-xl bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs shadow-md border border-neutral-200/80 dark:border-neutral-800 font-medium"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className={isZalo ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                        {isZalo ? 'Zalo' : 'WhatsApp'}
                      </span>
                      <span className="text-neutral-300 dark:text-neutral-600">•</span>
                      <span className="text-neutral-700 dark:text-neutral-200">{account.name}</span>
                    </div>
                  </Tooltip.Content>
                </Tooltip>
              </div>
            );
          })}

          {/* Add Account (+) Button -> Opens Accounts Setting */}
          <Tooltip>
            <Tooltip.Trigger>
              <button
                onClick={() => openSettings('accounts')}
                className="w-11 h-11 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-800 dark:hover:border-neutral-500 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-all hover:bg-white/60 dark:hover:bg-neutral-900/60 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              placement="right"
              className="py-1 px-2.5 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs shadow-md border border-neutral-200/80 dark:border-neutral-800 font-semibold"
            >
              Manage Channels & Accounts
            </Tooltip.Content>
          </Tooltip>
        </div>
      </div>

      {/* Bottom Rail: Settings Button (Toggles Full Page Settings) */}
      <div className="no-drag flex flex-col items-center">
        <Tooltip>
          <Tooltip.Trigger>
            <button
              onClick={() => toggleSettings('setup')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer group ${
                isSettingsOpen
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md scale-105'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800/80'
              }`}
              aria-label="Open Settings"
            >
              <Settings className={`w-5 h-5 stroke-[1.8] transition-transform duration-300 ${
                isSettingsOpen ? 'rotate-90' : 'group-hover:rotate-45'
              }`} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content
            placement="right"
            className="py-1 px-2.5 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs shadow-md border border-neutral-200/80 dark:border-neutral-800 font-semibold"
          >
            {isSettingsOpen ? 'Close Settings (Esc)' : 'Settings & Preferences'}
          </Tooltip.Content>
        </Tooltip>
      </div>
    </aside>
  );
}
