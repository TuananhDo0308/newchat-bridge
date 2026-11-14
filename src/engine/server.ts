import Fastify from 'fastify';
import cors from '@fastify/cors';
import type {
  SyncSnapshot,
  Message,
  SourceState,
  Chat,
  EngineStatus,
  Network,
} from '../shared/types.js';

export function createFastifyServer() {
  const app = Fastify({ logger: false });

  // 1. Initial Sources from Chat Bridge: 3 accounts
  const sources: SourceState[] = [
    {
      network: 'zalo',
      account: 'zalo-sale-personal',
      name: 'Sale Personal',
      state: 'connected',
      reason: 'Active (Zalo Personal Sales)',
    },
    {
      network: 'zalo',
      account: 'zalo-sale-gradion',
      name: 'Sale Gradion',
      state: 'connected',
      reason: 'Active (Gradion Zalo Business)',
    },
    {
      network: 'whatsapp',
      account: 'wa-sale-gradion',
      name: 'Sale Gradion',
      state: 'connected',
      reason: 'Active (Gradion WhatsApp Enterprise)',
    },
  ];

  // 2. Initial Chats from Chat Bridge
  const chats: Chat[] = [
    {
      id: 'wa-alexander',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84901112223@s.whatsapp.net',
      name: 'Alexander Jameson',
      kind: 'dm',
      selected: true,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-wa-5',
        time: '2026-11-14T00:57:00.000Z',
        direction: 'inbound',
        text: 'What day and time works best for you to come by for the viewing? Let me know, and I\'ll confirm the appointment right away.',
      },
    },
    {
      id: 'zalo-john-doe',
      network: 'zalo',
      account: '0901234567',
      thread: 'zalo_user_1001',
      name: 'John Doe',
      kind: 'dm',
      selected: true,
      pinOrder: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-zalo-1',
        time: '2026-11-13T16:45:00.000Z',
        direction: 'inbound',
        text: 'How\'s going with your property search?',
      },
    },
    {
      id: 'wa-travis',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84903334445@s.whatsapp.net',
      name: 'Travis Barker',
      kind: 'dm',
      selected: false,
      isTyping: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-wa-travis',
        time: '2026-11-13T17:38:00.000Z',
        direction: 'inbound',
        text: '... is typing',
      },
    },
    {
      id: 'zalo-kate',
      network: 'zalo',
      account: '0901234567',
      thread: 'zalo_user_1002',
      name: 'Kate Rose',
      kind: 'dm',
      selected: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-zalo-kate',
        time: '2026-11-13T17:04:00.000Z',
        direction: 'inbound',
        text: 'Looking forward to discussing real estate...',
      },
    },
    {
      id: 'wa-robert',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84905556667@s.whatsapp.net',
      name: 'Robert Parker',
      kind: 'dm',
      selected: true,
      unreadCount: 6,
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-wa-robert',
        time: '2026-11-13T16:22:00.000Z',
        direction: 'inbound',
        text: 'That\'s fantastic news about the new listi...',
      },
    },
    {
      id: 'zalo-emily',
      network: 'zalo',
      account: '0901234567',
      thread: 'zalo_user_1003',
      name: 'Emily Johnson',
      kind: 'dm',
      selected: false,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-zalo-emily',
        time: '2026-11-13T15:59:00.000Z',
        direction: 'inbound',
        text: 'Take a look at my recent real estate post...',
      },
    },
    {
      id: 'wa-sophia',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84907778889@s.whatsapp.net',
      name: 'Sophia Brown',
      kind: 'dm',
      selected: true,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-wa-sophia',
        time: '2026-11-13T03:24:00.000Z',
        direction: 'inbound',
        text: 'Discover amazing properties on my page!',
      },
    },
    {
      id: 'zalo-frederick',
      network: 'zalo',
      account: '0901234567',
      thread: 'zalo_user_1004',
      name: 'Frederick K.',
      kind: 'dm',
      selected: true,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-zalo-fred',
        time: '2026-11-13T13:06:00.000Z',
        direction: 'inbound',
        text: 'Are you considering pest control options...',
      },
    },
    {
      id: 'wa-tom-hardy',
      network: 'whatsapp-biz',
      account: '84911222333',
      thread: '84909990001@s.whatsapp.net',
      name: 'Tom Hardy',
      kind: 'dm',
      selected: false,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-wa-tom',
        time: '2026-11-13T12:43:00.000Z',
        direction: 'inbound',
        text: 'This property has such a unique design vi...',
      },
    },
    {
      id: 'zalo-vivienne',
      network: 'zalo',
      account: '0901234567',
      thread: 'zalo_user_1005',
      name: 'Vivienne Marigold',
      kind: 'dm',
      selected: true,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=faces',
      latest: {
        id: 'msg-zalo-viv',
        time: '2026-11-13T12:17:00.000Z',
        direction: 'inbound',
        text: 'Let me double check the contract terms...',
      },
    },
  ];

  // 3. Initial Messages Thread Repository
  const messages: Message[] = [
    // Alexander Jameson Thread
    {
      id: 'msg-wa-1',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84901112223@s.whatsapp.net',
      threadKind: 'dm',
      direction: 'inbound',
      time: '2026-11-13T10:37:00.000Z',
      from: {
        accountId: '84901112223@s.whatsapp.net',
        displayName: 'Alexander Jameson',
      },
      to: [{ accountId: 'self', displayName: 'Company Sales' }],
      text: "I'm a manager that's here to help",
    },
    {
      id: 'msg-wa-2',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84901112223@s.whatsapp.net',
      threadKind: 'dm',
      direction: 'outbound',
      time: '2026-11-13T10:41:00.000Z',
      from: { accountId: 'self', displayName: 'Company Sales' },
      to: [
        {
          accountId: '84901112223@s.whatsapp.net',
          displayName: 'Alexander Jameson',
        },
      ],
      text: 'Voice note (2:19)',
      metadata: {
        type: 'audio',
        duration: '2:19',
        waveform: [
          4, 8, 14, 10, 18, 12, 16, 22, 14, 8, 16, 20, 12, 18, 22, 14, 8, 12,
          18, 10, 16, 22, 14, 18, 12, 8, 16, 20, 14, 10, 14, 8, 12, 6, 4,
        ],
      },
    },
    {
      id: 'msg-wa-3',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84901112223@s.whatsapp.net',
      threadKind: 'dm',
      direction: 'inbound',
      time: '2026-11-13T11:19:00.000Z',
      from: {
        accountId: '84901112223@s.whatsapp.net',
        displayName: 'Alexander Jameson',
      },
      to: [{ accountId: 'self', displayName: 'Company Sales' }],
      text: 'This is a modern townhouse in a quiet neighborhood. It has 3 bedrooms, 2 bathrooms, a spacious kitchen and living room 🏠',
      metadata: {
        type: 'property',
        propertySpecs: {
          visitors: '2,429',
          buildingAge: '3Y',
          temperature: '28°F',
        },
        photos: [
          'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
        ],
      },
    },
    {
      id: 'msg-wa-4',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84901112223@s.whatsapp.net',
      threadKind: 'dm',
      direction: 'outbound',
      time: '2026-11-13T12:25:00.000Z',
      from: { accountId: 'self', displayName: 'Company Sales' },
      to: [
        {
          accountId: '84901112223@s.whatsapp.net',
          displayName: 'Alexander Jameson',
        },
      ],
      text: 'Looks good 👍. I want to sign up for a viewing',
    },
    {
      id: 'msg-wa-5',
      network: 'whatsapp',
      account: '84988889999',
      thread: '84901112223@s.whatsapp.net',
      threadKind: 'dm',
      direction: 'inbound',
      time: '2026-11-14T00:57:00.000Z',
      from: {
        accountId: '84901112223@s.whatsapp.net',
        displayName: 'Alexander Jameson',
      },
      to: [{ accountId: 'self', displayName: 'Company Sales' }],
      text: 'What day and time works best for you to come by for the viewing? Let me know, and I\'ll confirm the appointment right away.',
    },

    // John Doe Thread (Zalo)
    {
      id: 'msg-zalo-1',
      network: 'zalo',
      account: '0901234567',
      thread: 'zalo_user_1001',
      threadKind: 'dm',
      direction: 'inbound',
      time: '2026-11-13T16:45:00.000Z',
      from: { accountId: 'zalo_user_1001', displayName: 'John Doe' },
      to: [{ accountId: 'self', displayName: 'Sales Rep 1' }],
      text: "How's going with your property search?",
    },
  ];

  app.register(cors, { origin: '*' });

  // 1. Get Engine Status
  app.get('/v1/status', async (): Promise<EngineStatus> => {
    return {
      online: true,
      port: 41234,
      uptime: Math.floor(process.uptime()),
      activeSources: sources.filter((s) => s.state === 'connected').length,
      totalMessagesSaved: messages.length + 138,
      outboxPending: 0,
    };
  });

  // 2. Get Sync Snapshot (Sources & Chats)
  app.get('/v1/sync', async (): Promise<SyncSnapshot> => {
    return {
      sources,
      chats,
      savedCount: messages.length,
    };
  });

  // 3. Get Messages (All or per Chat)
  app.get('/v1/sync/messages', async (request): Promise<Message[]> => {
    const { chatId } = request.query as { chatId?: string };
    if (!chatId) return messages;

    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return [];

    return messages.filter(
      (m) =>
        m.network === chat.network &&
        m.account === chat.account &&
        m.thread === chat.thread
    );
  });

  // 4. Toggle Chat Sync Selection (Pick / Forward to CRM)
  app.put('/v1/sync/chats', async (request, reply) => {
    const { id, selected } = request.body as { id: string; selected: boolean };
    const chat = chats.find((c) => c.id === id);
    if (!chat) return reply.status(404).send({ error: 'Chat not found' });

    chat.selected = selected;
    return { success: true, chat };
  });

  // 5. Connect Source
  app.post('/v1/sync/connect', async (request, reply) => {
    const { network } = request.body as { network: Network };
    const source = sources.find((s) => s.network === network);
    if (!source) return reply.status(404).send({ error: 'Source network not found' });

    source.state = 'connected';
    source.reason = 'Connected successfully via desktop QR auth';
    return { success: true, source };
  });

  // 6. Disconnect Source
  app.post('/v1/sync/disconnect', async (request, reply) => {
    const { network } = request.body as { network: Network };
    const source = sources.find((s) => s.network === network);
    if (!source) return reply.status(404).send({ error: 'Source network not found' });

    source.state = 'needs-login';
    source.reason = 'Disconnected by user';
    return { success: true, source };
  });

  // 7. Send Message Outbound
  app.post('/v1/messages/send', async (request, reply) => {
    const { chatId, text } = request.body as { chatId: string; text: string };
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return reply.status(404).send({ error: 'Chat not found' });

    const newMsg: Message = {
      id: `msg-out-${Date.now()}`,
      network: chat.network,
      account: chat.account,
      thread: chat.thread,
      threadKind: chat.kind,
      direction: 'outbound',
      time: new Date().toISOString(),
      from: { accountId: 'self', displayName: 'Sales Rep' },
      to: [{ accountId: chat.thread, displayName: chat.name }],
      text,
    };

    messages.push(newMsg);
    chat.latest = {
      id: newMsg.id,
      time: newMsg.time,
      direction: 'outbound',
      text: newMsg.text,
    };

    return newMsg;
  });

  return app;
}
