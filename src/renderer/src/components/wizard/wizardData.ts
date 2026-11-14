import type { Chat, Message } from '@shared/types.js';

export function getEnrichedChatMessages(chat: Chat, existingMessages: Message[], myName: string): Message[] {
  if (existingMessages.length >= 6) {
    return existingMessages;
  }

  const contactFirst = chat.name.split(' ')[0];

  return [
    // Day 1: Yesterday
    {
      id: `${chat.id}-m1`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'inbound',
      time: '2026-11-13T09:15:00.000Z',
      from: { accountId: chat.thread, displayName: chat.name },
      to: [{ accountId: 'self', displayName: myName }],
      text: `Hi ${myName.split(' ')[0]}! Could you please send over the latest quotation, SLA terms, and integration specs for our engineering team?`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m2`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'outbound',
      time: '2026-11-13T09:22:00.000Z',
      from: { accountId: 'self', displayName: myName },
      to: [{ accountId: chat.thread, displayName: chat.name }],
      text: `Hello ${contactFirst}! Absolutely. I have compiled the complete technical documentation, security compliance sheet, and enterprise pricing breakdown.`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m4`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'inbound',
      time: '2026-11-13T10:05:00.000Z',
      from: { accountId: chat.thread, displayName: chat.name },
      to: [{ accountId: 'self', displayName: myName }],
      text: `Thanks for the swift turnaround! Our VP of Product and technical leads are reviewing the SLA right now.`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m5`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'outbound',
      time: '2026-11-13T10:18:00.000Z',
      from: { accountId: 'self', displayName: myName },
      to: [{ accountId: chat.thread, displayName: chat.name }],
      text: `Sounds great. Let me know if you would like a brief 15-minute walkthrough of the sandbox environment as well.`,
      isSynced: true,
    },
    // Day 2: Today
    {
      id: `${chat.id}-m6`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'inbound',
      time: '2026-11-14T08:30:00.000Z',
      from: { accountId: chat.thread, displayName: chat.name },
      to: [{ accountId: 'self', displayName: myName }],
      text: `Good morning ${myName.split(' ')[0]}! We reviewed the pricing proposal with leadership this morning. Everything looks approved and ready for sign-off.`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m8`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'outbound',
      time: '2026-11-14T09:10:00.000Z',
      from: { accountId: 'self', displayName: myName },
      to: [{ accountId: chat.thread, displayName: chat.name }],
      text: `That is fantastic news! I have prepared the contract agreement and live deployment schedule. Let's arrange a kickoff call tomorrow at 10:00 AM.`,
      isSynced: true,
    },
    {
      id: `${chat.id}-m9`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'inbound',
      time: '2026-11-14T09:25:00.000Z',
      from: { accountId: chat.thread, displayName: chat.name },
      to: [{ accountId: 'self', displayName: myName }],
      text: `10:00 AM works perfectly for our whole department. Please send over the calendar invite and final DocuSign link!`,
      isSynced: true,
    },
  ];
}
