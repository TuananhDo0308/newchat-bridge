import React, { useMemo, useState } from 'react';
import { Avatar, Button, Modal, ScrollShadow } from '@heroui/react';
import {
  AlertTriangle,
  Check,
  CheckCheck,
  CheckSquare,
  Search,
  User,
  Users,
} from 'lucide-react';
import zaloLogo from '../../assets/zalo-logo.png';
import whatsappLogo from '../../assets/whatsapp-logo.png';
import type { Chat } from '@shared/types.js';
import {
  selectRailAccounts,
  useChatBridgeStore,
} from '../../store/useChatBridgeStore.js';
import { ChatListItem } from '../chat/ChatListItem.js';
import { LogoText } from '../Logo.js';

export function ConversationSidebar() {
  const sources = useChatBridgeStore((s) => s.sources);
  const chats = useChatBridgeStore((s) => s.chats);
  const scope = useChatBridgeStore((s) => s.scope);
  const selectedChatId = useChatBridgeStore((s) => s.selectedChatId);
  const searchQuery = useChatBridgeStore((s) => s.searchQuery);
  const syncFilter = useChatBridgeStore((s) => s.syncFilter);
  const kindFilter = useChatBridgeStore((s) => s.kindFilter);
  const isMobileChatOpen = useChatBridgeStore((s) => s.isMobileChatOpen);

  const setSelectedChatId = useChatBridgeStore((s) => s.setSelectedChatId);
  const setSearchQuery = useChatBridgeStore((s) => s.setSearchQuery);
  const setSyncFilter = useChatBridgeStore((s) => s.setSyncFilter);
  const setKindFilter = useChatBridgeStore((s) => s.setKindFilter);
  const toggleChatSync = useChatBridgeStore((s) => s.toggleChatSync);
  const batchSyncChats = useChatBridgeStore((s) => s.batchSyncChats);

  const isZalo = scope?.network === 'zalo';

  // Multi-select mode state for Unsynced list
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);

  // HeroUI Confirmation Modal state for syncing & unsyncing
  const [syncConfirmTarget, setSyncConfirmTarget] = useState<{
    chat: Chat;
    action: 'sync' | 'unsync';
  } | null>(null);

  // Active rail account info
  const railList = useMemo(() => selectRailAccounts(sources, chats), [sources, chats]);
  const currentRailAccount = useMemo(() => {
    if (!scope) return undefined;
    return railList.find(
      (a) =>
        a.network === scope.network &&
        (scope.account === undefined || a.account === scope.account)
    );
  }, [railList, scope]);

  // Real-time counts for Synced / Unsynced tabs
  const { syncedCount, unsyncedCount } = useMemo(() => {
    let synced = 0;
    let unsynced = 0;
    chats.forEach((chat) => {
      const inScope =
        !scope ||
        (chat.network === scope.network &&
          (scope.account === undefined || chat.account === scope.account));
      if (inScope) {
        if (chat.selected) synced++;
        else unsynced++;
      }
    });
    return { syncedCount: synced, unsyncedCount: unsynced };
  }, [chats, scope]);

  // Filtered conversation list
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const inScope =
        !scope ||
        (chat.network === scope.network &&
          (scope.account === undefined || chat.account === scope.account));

      const inSearch =
        !searchQuery ||
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.latest?.text || '').toLowerCase().includes(searchQuery.toLowerCase());

      const inSync =
        (syncFilter === 'sync' && chat.selected) ||
        (syncFilter === 'unsync' && !chat.selected);

      const inKind =
        kindFilter === 'all' ||
        (kindFilter === 'dm' && chat.kind === 'dm') ||
        (kindFilter === 'group' && chat.kind === 'group');

      return inScope && inSearch && inSync && inKind;
    });
  }, [chats, scope, searchQuery, syncFilter, kindFilter]);

  // Batch selection helpers
  const allFilteredSelected =
    filteredChats.length > 0 &&
    filteredChats.every((c) => selectedBatchIds.includes(c.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedBatchIds([]);
    } else {
      setSelectedBatchIds(filteredChats.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchSyncAll = async () => {
    if (selectedBatchIds.length === 0) return;
    await batchSyncChats(selectedBatchIds, true);
    setSelectedBatchIds([]);
    setIsSelectMode(false);
  };

  const handleToggleSyncRequest = (chat: Chat) => {
    setSyncConfirmTarget({
      chat,
      action: chat.selected ? 'unsync' : 'sync',
    });
  };

  return (
    <section className={`flex-1 md:flex-initial w-full md:w-[350px] lg:w-[370px] shrink-0 border-r border-neutral-200/80 dark:border-neutral-800 bg-[#fafcfb] dark:bg-[#0a0a0a] flex-col transition-colors duration-200 ${
      isMobileChatOpen ? 'hidden md:flex' : 'flex'
    }`}>
      {/* Top Header: Brand Wordmark "chatbridge" on top, App Name below */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 h-7">
            <LogoText className="h-6 w-auto" />
          </div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 capitalize mt-1">
            {isZalo ? 'Zalo' : 'WhatsApp'}
            {currentRailAccount?.name ? ` • ${currentRailAccount.name}` : ''}
          </p>
        </div>
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-0.5 rounded-full self-start mt-1">
          {filteredChats.length}
        </span>
      </div>

      {/* Search & Filter Controls */}
      <div className="px-4 py-2 space-y-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-full pl-10 pr-4 py-2 text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-xs outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition"
          />
        </div>

        {/* 1. Sync Filter Tabs (Synced | Unsynced) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100/90 dark:bg-neutral-900 rounded-xl text-xs">
          <button
            onClick={() => {
              setSyncFilter('sync');
              setIsSelectMode(false);
              setSelectedBatchIds([]);
            }}
            className={`flex-1 py-1.5 rounded-lg font-medium transition text-center flex items-center justify-center gap-1.5 ${
              syncFilter === 'sync'
                ? isZalo
                  ? 'bg-white dark:bg-black text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                  : 'bg-white dark:bg-black text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <CheckCheck className={`w-3.5 h-3.5 ${isZalo ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
            Synced ({syncedCount})
          </button>
          <button
            onClick={() => {
              setSyncFilter('unsync');
              setIsSelectMode(false);
              setSelectedBatchIds([]);
            }}
            className={`flex-1 py-1.5 rounded-lg font-medium transition text-center ${
              syncFilter === 'unsync'
                ? 'bg-white dark:bg-black text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Unsynced ({unsyncedCount})
          </button>
        </div>

        {/* 2. Chat Kind Filter Chips & "Select" Button (Exact same size px-3 py-1 text-[11px]) */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => setKindFilter('all')}
              className={`px-3 py-1 rounded-full font-medium transition border ${
                kindFilter === 'all'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setKindFilter('dm')}
              className={`px-3 py-1 rounded-full font-medium transition border flex items-center gap-1 ${
                kindFilter === 'dm'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <User className="w-3 h-3" />
              Direct
            </button>
            <button
              onClick={() => setKindFilter('group')}
              className={`px-3 py-1 rounded-full font-medium transition border flex items-center gap-1 ${
                kindFilter === 'group'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <Users className="w-3 h-3" />
              Groups
            </button>
          </div>

          {/* Select Button: Same height and subtle styling as the other chips */}
          {syncFilter === 'unsync' && filteredChats.length > 0 && (
            <button
              onClick={() => {
                setIsSelectMode((prev) => !prev);
                if (isSelectMode) setSelectedBatchIds([]);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition border flex items-center gap-1 ${
                isSelectMode
                  ? isZalo
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>{isSelectMode ? 'Cancel' : 'Select'}</span>
            </button>
          )}
        </div>

        {/* 3. Batch Action Toolbar: Active when Select mode is ON */}
        {syncFilter === 'unsync' && isSelectMode && filteredChats.length > 0 && (
          <div
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs mt-1 animate-in fade-in duration-150 shadow-2xs border ${
              isZalo
                ? 'bg-blue-50/90 dark:bg-blue-950/30 border-blue-200/90 dark:border-blue-800/40'
                : 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200/90 dark:border-emerald-800/40'
            }`}
          >
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700 dark:text-neutral-200 select-none hover:text-neutral-900 dark:hover:text-white"
            >
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                  allFilteredSelected
                    ? isZalo
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {allFilteredSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs font-medium">Select all ({filteredChats.length})</span>
            </button>

            <Button
              size="sm"
              variant="primary"
              className={`text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition disabled:opacity-50 disabled:pointer-events-none ${
                isZalo
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
              isDisabled={selectedBatchIds.length === 0}
              onPress={handleBatchSyncAll}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>
                Sync {selectedBatchIds.length > 0 ? `(${selectedBatchIds.length})` : ''}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Scrollable Chat List */}
      <ScrollShadow className="flex-1 px-3 space-y-1 overflow-y-auto mt-1">
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={chat.id === selectedChatId}
            onSelect={() => setSelectedChatId(chat.id)}
            onToggleSync={() => handleToggleSyncRequest(chat)}
            showCheckbox={syncFilter === 'unsync' && isSelectMode}
            isChecked={selectedBatchIds.includes(chat.id)}
            onToggleCheck={() => toggleSelectOne(chat.id)}
            isZalo={isZalo}
          />
        ))}

        {filteredChats.length === 0 && (
          <div className="py-12 text-center text-neutral-400 dark:text-neutral-500 text-xs">
            No conversations match your filters
          </div>
        )}
      </ScrollShadow>

      {/* HeroUI Built-in Confirmation Modal for Syncing & Unsyncing with Visual Contact Card */}
      <Modal.Root
        isOpen={!!syncConfirmTarget}
        onOpenChange={(open) => {
          if (!open) setSyncConfirmTarget(null);
        }}
      >
        <Modal.Backdrop className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 transition-opacity flex items-center justify-center p-4">
          <Modal.Container className="w-full max-w-md">
            <Modal.Dialog className="w-full bg-white dark:bg-[#121212] rounded-3xl p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <Modal.Header className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    syncConfirmTarget?.action === 'unsync'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400'
                      : syncConfirmTarget?.chat.network === 'zalo'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {syncConfirmTarget?.action === 'unsync' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <CheckCheck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <Modal.Heading className="text-base font-bold text-neutral-900 dark:text-white">
                    {syncConfirmTarget?.action === 'unsync' ? 'Unsync Conversation' : 'Sync Conversation'}
                  </Modal.Heading>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {syncConfirmTarget?.action === 'unsync'
                      ? 'Stop real-time message sync'
                      : 'Enable real-time message sync'}
                  </p>
                </div>
              </Modal.Header>

              {/* Visual Contact Card: Avatar, App Logo, Name, Phone */}
              {syncConfirmTarget && (
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#18181b] border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <Avatar size="lg" className="w-14 h-14 rounded-2xl ring-2 ring-white dark:ring-neutral-700 shadow-sm overflow-hidden">
                      <Avatar.Image src={syncConfirmTarget.chat.avatar} alt={syncConfirmTarget.chat.name} />
                      <Avatar.Fallback className="text-base font-bold bg-neutral-800 text-white">
                        {syncConfirmTarget.chat.name.slice(0, 2)}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#18181b] overflow-hidden bg-white shadow-xs flex items-center justify-center">
                      <img
                        src={syncConfirmTarget.chat.network === 'zalo' ? zaloLogo : whatsappLogo}
                        alt={syncConfirmTarget.chat.network}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {syncConfirmTarget.chat.name}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          syncConfirmTarget.chat.network === 'zalo'
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60'
                            : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                        }`}
                      >
                        {syncConfirmTarget.chat.network === 'zalo' ? 'Zalo' : 'WhatsApp'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {syncConfirmTarget.chat.phoneNumber ? (
                        <span className="font-mono text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                          📞 {syncConfirmTarget.chat.phoneNumber}
                        </span>
                      ) : syncConfirmTarget.chat.kind === 'group' ? (
                        <span>👥 Group • {syncConfirmTarget.chat.memberCount || 24} members</span>
                      ) : (
                        <span className="font-mono text-[11px]">{syncConfirmTarget.chat.account}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Informative Explanation */}
              <Modal.Body className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed py-0.5">
                {syncConfirmTarget?.action === 'unsync' ? (
                  <>
                    Are you sure you want to stop syncing messages for{' '}
                    <strong className="text-neutral-900 dark:text-white font-semibold">
                      {syncConfirmTarget?.chat.name}
                    </strong>
                    ? Previously synchronized messages will remain safely stored on your CRM, but future messages will no longer sync.
                  </>
                ) : (
                  <>
                    Are you sure you want to enable message synchronization for{' '}
                    <strong className="text-neutral-900 dark:text-white font-semibold">
                      {syncConfirmTarget?.chat.name}
                    </strong>
                    ? Incoming and historical customer messages will be safely forwarded to your connected CRM and spreadsheet destinations.
                  </>
                )}
              </Modal.Body>

              <Modal.Footer className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer"
                  onPress={() => setSyncConfirmTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition cursor-pointer ${
                    syncConfirmTarget?.action === 'unsync'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : syncConfirmTarget?.chat.network === 'zalo'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                  onPress={() => {
                    if (syncConfirmTarget) {
                      toggleChatSync(syncConfirmTarget.chat.id);
                      setSyncConfirmTarget(null);
                    }
                  }}
                >
                  {syncConfirmTarget?.action === 'unsync' ? 'Confirm Unsync' : 'Confirm Sync'}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>
    </section>
  );
}
