import React, { useEffect } from 'react';
import { useChatBridgeStore } from './store/useChatBridgeStore.js';
import { useAppStore } from './store/useAppStore.js';
import { AccountRail } from './components/layout/AccountRail.js';
import { ConversationSidebar } from './components/layout/ConversationSidebar.js';
import { ChatArea } from './components/layout/ChatArea.js';
import { OnboardingWizard } from './components/wizard/OnboardingWizard.js';
import { AddAccountModal } from './components/wizard/AddAccountModal.js';
import { SettingsScreen } from './components/settings/SettingsScreen.js';

export function App() {
  const loadData = useChatBridgeStore((s) => s.loadData);
  const theme = useAppStore((s) => s.theme);
  const isWizardOpen = useAppStore((s) => s.isWizardOpen);
  const closeWizard = useAppStore((s) => s.closeWizard);
  const isSettingsOpen = useAppStore((s) => s.isSettingsOpen);
  const isAddAccountModalOpen = useAppStore((s) => s.isAddAccountModalOpen);
  const addAccountInitialChannel = useAppStore((s) => s.addAccountInitialChannel);
  const closeAddAccountModal = useAppStore((s) => s.closeAddAccountModal);

  useEffect(() => {
    loadData();
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    return undefined;
  }, [loadData, theme]);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#f7faf8] dark:bg-black text-neutral-900 dark:text-neutral-100 select-none font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 relative">
      {/* Block 1: Leftmost Account & Channel Rail */}
      <AccountRail />

      {/* Block 2 & 3: Either Full Page Settings Screen OR Active Chat Workspace */}
      {isSettingsOpen ? (
        <SettingsScreen />
      ) : (
        <>
          {/* Middle Conversation List Sidebar */}
          <ConversationSidebar />

          {/* Expanded Active Chat Workspace */}
          <ChatArea />
        </>
      )}

      {/* Block 4: First-time Onboarding Setup Wizard Overlay with Dynamic Ambient Waves */}
      {isWizardOpen && (
        <OnboardingWizard onComplete={closeWizard} />
      )}

      {/* Block 5: Streamlined 3-Step Add Account Modal */}
      {isAddAccountModalOpen && (
        <AddAccountModal
          initialChannel={addAccountInitialChannel}
          onClose={closeAddAccountModal}
          onComplete={closeAddAccountModal}
        />
      )}
    </div>
  );
}

export default App;
