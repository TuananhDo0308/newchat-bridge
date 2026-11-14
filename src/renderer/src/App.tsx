import React, { useEffect } from 'react';
import { useChatBridgeStore } from './store/useChatBridgeStore.js';
import { useAppStore } from './store/useAppStore.js';
import { AccountRail } from './components/layout/AccountRail.js';
import { ConversationSidebar } from './components/layout/ConversationSidebar.js';
import { ChatArea } from './components/layout/ChatArea.js';
import { OnboardingWizard } from './components/wizard/OnboardingWizard.js';
import { SettingsModal } from './components/settings/SettingsModal.js';

export function App() {
  const loadData = useChatBridgeStore((s) => s.loadData);
  const theme = useAppStore((s) => s.theme);
  const isWizardOpen = useAppStore((s) => s.isWizardOpen);
  const closeWizard = useAppStore((s) => s.closeWizard);

  useEffect(() => {
    loadData();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [loadData, theme]);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#f7faf8] dark:bg-black text-neutral-900 dark:text-neutral-100 select-none font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 relative">
      {/* Block 1: Leftmost Account & Channel Rail */}
      <AccountRail />

      {/* Block 2: Middle Conversation List Sidebar */}
      <ConversationSidebar />

      {/* Block 3: Expanded Active Chat Workspace */}
      <ChatArea />

      {/* Block 4: First-time Onboarding Setup Wizard Overlay with Dynamic Ambient Waves */}
      {isWizardOpen && (
        <OnboardingWizard onComplete={closeWizard} />
      )}

      {/* Block 5: Comprehensive Desktop Settings Modal */}
      <SettingsModal />
    </div>
  );
}

export default App;
