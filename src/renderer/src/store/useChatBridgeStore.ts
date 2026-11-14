import { create } from 'zustand';
import type {
  AccountScope,
  Chat,
  Message,
  RailAccount,
  SourceState,
} from '@shared/types.js';
import { mockChats, mockMessages, mockSources } from '../mock/mockData.js';
import { networkInitials, sourceNames } from '../utils/formatters.js';

export type SyncFilterType = 'sync' | 'unsync';
export type KindFilterType = 'all' | 'dm' | 'group';

interface ChatBridgeState {
  // Data
  sources: SourceState[];
  chats: Chat[];
  messages: Message[];
  isLoading: boolean;

  // Selection & Filters
  scope: AccountScope | undefined;
  selectedChatId: string;
  searchQuery: string;
  syncFilter: SyncFilterType;
  kindFilter: KindFilterType;
  inputText: string;

  // Setters
  setScope: (scope: AccountScope | undefined) => void;
  setSelectedChatId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSyncFilter: (filter: SyncFilterType) => void;
  setKindFilter: (filter: KindFilterType) => void;
  setInputText: (text: string) => void;

  // Actions
  loadData: () => Promise<void>;
  toggleChatSync: (chatId: string) => Promise<void>;
  batchSyncChats: (chatIds: string[], targetSelected: boolean) => Promise<void>;
  sendMessage: () => Promise<void>;
}

export const useChatBridgeStore = create<ChatBridgeState>((set, get) => ({
  sources: [],
  chats: [],
  messages: [],
  isLoading: true,

  scope: { network: 'zalo', account: 'zalo-sale-gradion' },
  selectedChatId: 'zalo-grad-david',
  searchQuery: '',
  syncFilter: 'sync',
  kindFilter: 'all',
  inputText: '',

  setScope: (scope) => {
    set({ scope });
    // Auto-select first matching chat in this scope if current selection is outside
    const { chats, selectedChatId } = get();
    const currentChat = chats.find((c) => c.id === selectedChatId);
    const isCurrentInScope =
      !scope ||
      (currentChat &&
        currentChat.network === scope.network &&
        (scope.account === undefined || currentChat.account === scope.account));

    if (!isCurrentInScope) {
      const firstInScope = chats.find(
        (c) =>
          !scope ||
          (c.network === scope.network &&
            (scope.account === undefined || c.account === scope.account))
      );
      if (firstInScope) {
        set({ selectedChatId: firstInScope.id });
      }
    }
  },

  setSelectedChatId: (selectedChatId) => set({ selectedChatId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSyncFilter: (syncFilter) => set({ syncFilter }),
  setKindFilter: (kindFilter) => set({ kindFilter }),
  setInputText: (inputText) => set({ inputText }),

  loadData: async () => {
    set({ isLoading: true });
    if (window.bridge) {
      try {
        const [snapshot, msgs] = await Promise.all([
          window.bridge.getSyncSnapshot(),
          window.bridge.getMessages(),
        ]);
        set({
          sources: snapshot.sources || [],
          chats: snapshot.chats || [],
          messages: msgs || [],
        });
      } catch (err) {
        console.error('Failed to load snapshot from bridge:', err);
      }
    } else {
      try {
        const res = await fetch('http://127.0.0.1:41234/v1/sync');
        if (res.ok) {
          const snapshot = await res.json();
          const msgsRes = await fetch('http://127.0.0.1:41234/v1/sync/messages');
          const msgs = msgsRes.ok ? await msgsRes.json() : [];
          set({
            sources: snapshot.sources || [],
            chats: snapshot.chats || [],
            messages: msgs || [],
          });
        } else {
          throw new Error('Fallback fetch returned non-200');
        }
      } catch {
        // Fallback to rich mock data
        set({
          sources: mockSources,
          chats: mockChats,
          messages: mockMessages,
        });
      }
    }
    set({ isLoading: false });
  },

  toggleChatSync: async (chatId) => {
    const { chats } = get();
    const targetChat = chats.find((c) => c.id === chatId);
    if (!targetChat) return;

    const nextSelected = !targetChat.selected;
    set({
      chats: chats.map((c) => (c.id === chatId ? { ...c, selected: nextSelected } : c)),
    });

    if (window.bridge) {
      await window.bridge.toggleChatSelection(chatId, nextSelected);
    } else {
      await fetch('http://127.0.0.1:41234/v1/sync/chats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: chatId, selected: nextSelected }),
      }).catch(() => {});
    }
  },

  batchSyncChats: async (chatIds: string[], targetSelected: boolean) => {
    const { chats } = get();
    const idSet = new Set(chatIds);
    set({
      chats: chats.map((c) => (idSet.has(c.id) ? { ...c, selected: targetSelected } : c)),
    });

    if (window.bridge) {
      for (const id of chatIds) {
        await window.bridge.toggleChatSelection(id, targetSelected);
      }
    } else {
      for (const id of chatIds) {
        await fetch('http://127.0.0.1:41234/v1/sync/chats', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, selected: targetSelected }),
        }).catch(() => {});
      }
    }
  },

  sendMessage: async () => {
    const { inputText, chats, selectedChatId } = get();
    const activeChat = chats.find((c) => c.id === selectedChatId);
    if (!inputText.trim() || !activeChat) return;

    const textToSend = inputText.trim();
    set({ inputText: '' });

    const optimisticMsg: Message = {
      id: `msg-out-${Date.now()}`,
      network: activeChat.network,
      account: activeChat.account,
      thread: activeChat.thread,
      threadKind: activeChat.kind,
      direction: 'outbound',
      time: new Date().toISOString(),
      from: { accountId: 'self', displayName: 'Company Sales' },
      to: [{ accountId: activeChat.thread, displayName: activeChat.name }],
      text: textToSend,
    };

    set((state) => ({
      messages: [...state.messages, optimisticMsg],
      chats: state.chats.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              latest: {
                id: optimisticMsg.id,
                time: optimisticMsg.time,
                direction: 'outbound',
                text: textToSend,
              },
            }
          : c
      ),
    }));

    if (window.bridge) {
      await window.bridge.sendMessage(activeChat.id, textToSend);
    } else {
      await fetch('http://127.0.0.1:41234/v1/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: activeChat.id, text: textToSend }),
      }).catch(() => {});
    }
  },
}));

// Helper selector to compute rail accounts: 3 accounts with distinct avatars for each sales persona
export function selectRailAccounts(sources: SourceState[], chats: Chat[]): RailAccount[] {
  // Distinct avatars for the sales representative across roles:
  // 1. Sale Personal: Smart casual, approachable tech consultant portrait
  // 2. Sale Gradion (Zalo): Corporate enterprise software sales portrait
  // 3. Sale Gradion (WhatsApp): Executive APAC software sales director portrait
  const avatarsByAccount: Record<string, string> = {
    'zalo-sale-personal':
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    'zalo-sale-gradion':
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    'wa-sale-gradion':
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces';

  if (sources && sources.length > 0) {
    return sources.map((src) => ({
      key: `${src.network}:${src.account}`,
      network: src.network,
      account: src.account,
      initials: 'TA',
      name: src.name || (src.account === 'zalo-sale-personal' ? 'Sale Personal' : 'Sale Gradion'),
      state: src.state,
      detail: src.account,
      avatarUrl: (src.account && avatarsByAccount[src.account]) || defaultAvatar,
    }));
  }

  // Fallback if sources empty
  const defaultSources: Array<{ network: 'zalo' | 'whatsapp'; account: string; name: string }> = [
    { network: 'zalo', account: 'zalo-sale-personal', name: 'Sale Personal' },
    { network: 'zalo', account: 'zalo-sale-gradion', name: 'Sale Gradion' },
    { network: 'whatsapp', account: 'wa-sale-gradion', name: 'Sale Gradion' },
  ];

  return defaultSources.map((item) => ({
    key: `${item.network}:${item.account}`,
    network: item.network,
    account: item.account,
    initials: 'TA',
    name: item.name,
    state: 'connected' as const,
    detail: item.account,
    avatarUrl: avatarsByAccount[item.account] || defaultAvatar,
  }));
}
