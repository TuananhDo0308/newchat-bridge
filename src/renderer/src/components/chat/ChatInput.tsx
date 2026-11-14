import React from 'react';
import { Button } from '@heroui/react';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <footer className="p-6 pt-2 shrink-0 bg-white dark:bg-[#0a0a0a] border-t border-neutral-100 dark:border-neutral-800">
      <div className="bg-[#f6f9f8] dark:bg-neutral-900 rounded-full px-5 py-2.5 shadow-sm border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition shrink-0">
          <Paperclip className="w-5 h-5 -rotate-45" />
        </button>

        <input
          type="text"
          placeholder="Write a Message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend();
          }}
          className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        />

        <Button
          variant="primary"
          onPress={onSend}
          className="rounded-full w-9 h-9 p-0 bg-black text-white hover:bg-neutral-800 flex items-center justify-center shrink-0 shadow"
        >
          <Send className="w-4 h-4 fill-white translate-x-0.5" />
        </Button>
      </div>
    </footer>
  );
}
