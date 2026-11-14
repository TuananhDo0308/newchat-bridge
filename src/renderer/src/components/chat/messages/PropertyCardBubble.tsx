import React from 'react';
import { Avatar, Card } from '@heroui/react';
import { Eye, Building, Thermometer } from 'lucide-react';
import type { Message } from '@shared/types.js';
import { formatChatTime } from '../../../utils/formatters.js';

interface PropertyCardBubbleProps {
  message: Message;
  senderAvatar?: string;
  senderName?: string;
}

export function PropertyCardBubble({
  message,
  senderAvatar,
  senderName,
}: PropertyCardBubbleProps) {
  const specs = message.metadata?.propertySpecs || {
    visitors: '2,429',
    buildingAge: '3Y',
    temperature: '28°F',
  };

  const photos = message.metadata?.photos || [
    'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=500&h=350&fit=crop',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&h=350&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=350&fit=crop',
  ];

  return (
    <div className="flex items-start gap-3 max-w-xl">
      <Avatar size="sm" className="w-8 h-8 shrink-0 mt-1 ring-1 ring-neutral-200/80 dark:ring-neutral-800">
        <Avatar.Image src={senderAvatar} alt={senderName} />
        <Avatar.Fallback>{(senderName || 'U').slice(0, 2)}</Avatar.Fallback>
      </Avatar>

      <div className="flex flex-col items-start flex-1">
        <div className="bg-black text-white rounded-[26px] p-5 w-full space-y-4 shadow-md border border-neutral-800">
          <p className="text-xs md:text-sm leading-relaxed">{message.text}</p>

          {/* Property Specs 3-card Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <Card className="bg-white dark:bg-[#18181b] text-neutral-900 dark:text-neutral-100 rounded-2xl p-3 border-none shadow-none">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium block">Daily Visitors</span>
              <strong className="text-sm font-bold text-neutral-900 dark:text-white block mt-0.5">
                {specs.visitors}
              </strong>
            </Card>

            <Card className="bg-white dark:bg-[#18181b] text-neutral-900 dark:text-neutral-100 rounded-2xl p-3 border-none shadow-none">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Building className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium block">Building Age</span>
              <strong className="text-sm font-bold text-neutral-900 dark:text-white block mt-0.5">
                {specs.buildingAge}
              </strong>
            </Card>

            <Card className="bg-white dark:bg-[#18181b] text-neutral-900 dark:text-neutral-100 rounded-2xl p-3 border-none shadow-none">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Thermometer className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium block">Temperature</span>
              <strong className="text-sm font-bold text-neutral-900 dark:text-white block mt-0.5">
                {specs.temperature}
              </strong>
            </Card>
          </div>

          {/* Photos Grid */}
          <div className="space-y-2 pt-1">
            <span className="text-xs text-neutral-300 font-medium block">Here are the photos:</span>
            <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
              <img
                src={photos[0]}
                alt="Bedroom"
                className="w-full h-24 object-cover rounded-xl"
              />
              <img
                src={photos[1]}
                alt="Kitchen"
                className="w-full h-24 object-cover rounded-xl"
              />
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={photos[2]}
                  alt="Bathroom"
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center font-bold text-white text-base">
                  3+
                </div>
              </div>
            </div>
          </div>
        </div>

        <span className="text-[11px] text-neutral-400 ml-1 mt-1">
          {formatChatTime(message.time)}
        </span>
      </div>
    </div>
  );
}
