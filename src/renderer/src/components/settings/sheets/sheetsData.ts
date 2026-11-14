export type SheetColumn =
  | 'time'
  | 'network'
  | 'chat'
  | 'direction'
  | 'sender'
  | 'phone'
  | 'text'
  | 'id';

export type SheetLayoutPreset = 'single' | 'daily' | 'monthly' | 'network' | 'contact' | 'custom';

export interface SampleMessage {
  id: string;
  time: string;
  network: 'zalo' | 'whatsapp';
  chat: string;
  direction: 'inbound' | 'outbound';
  sender: string;
  phone: string;
  text: string;
}

export const allSheetColumns: { id: SheetColumn; labelEn: string; labelVi: string; desc: string }[] = [
  { id: 'time', labelEn: 'Time (UTC+7)', labelVi: 'Thời gian (UTC+7)', desc: 'YYYY-MM-DD HH:mm Vietnam time' },
  { id: 'network', labelEn: 'App Network', labelVi: 'Ứng dụng', desc: 'Zalo or WhatsApp' },
  { id: 'chat', labelEn: 'Conversation / Chat', labelVi: 'Hội thoại', desc: 'Customer thread name' },
  { id: 'direction', labelEn: 'Direction', labelVi: 'Gửi/nhận', desc: 'Inbound or Outbound' },
  { id: 'sender', labelEn: 'Sender Name', labelVi: 'Người gửi', desc: 'Contact or sales rep' },
  { id: 'phone', labelEn: 'Phone Number', labelVi: 'Điện thoại', desc: 'Customer phone if provided' },
  { id: 'text', labelEn: 'Message Content', labelVi: 'Tin nhắn', desc: 'Transcribed text payload' },
  { id: 'id', labelEn: 'Message ID', labelVi: 'Mã tin nhắn', desc: 'Unique audit trace UUID' },
];

export const sampleMessages: SampleMessage[] = [
  {
    id: 'msg-01',
    time: '2026-10-30T09:15:00+07:00',
    network: 'zalo',
    chat: 'Lan (Rivera Apparel)',
    direction: 'inbound',
    sender: 'Lan',
    phone: '+84 912 345 678',
    text: 'Chào anh Tuấn! Bên em đang duyệt ngân sách Q4 cho 200 nhân viên sales dùng phần mềm.',
  },
  {
    id: 'msg-02',
    time: '2026-10-30T09:20:00+07:00',
    network: 'zalo',
    chat: 'Lan (Rivera Apparel)',
    direction: 'outbound',
    sender: 'You (Sales Rep)',
    phone: '',
    text: 'Chào Lan! Anh đã đính kèm bảng báo giá chiết khấu 15% kèm cam kết SLA 99.99% nhé.',
  },
  {
    id: 'msg-03',
    time: '2026-11-05T14:05:00+07:00',
    network: 'whatsapp',
    chat: 'Marcus Sterling',
    direction: 'outbound',
    sender: 'You (Sales Rep)',
    phone: '',
    text: 'Hi Marcus, following up regarding the enterprise data compliance security sheet.',
  },
  {
    id: 'msg-04',
    time: '2026-11-05T14:12:00+07:00',
    network: 'whatsapp',
    chat: 'Marcus Sterling',
    direction: 'inbound',
    sender: 'Marcus Sterling',
    phone: '+1 555-019-2834',
    text: 'Everything is approved by our APAC legal counsel. Ready for production rollout.',
  },
  {
    id: 'msg-05',
    time: '2026-11-06T10:30:00+07:00',
    network: 'zalo',
    chat: 'Tuấn Anh (Kế toán ABC)',
    direction: 'inbound',
    sender: 'Tuấn Anh',
    phone: '+84 988 123 456',
    text: 'Bên mình đã làm lệnh ủy nhiệm chi thanh toán hợp đồng ChatBridge rồi nhé.',
  },
  {
    id: 'msg-06',
    time: '2026-11-06T10:45:00+07:00',
    network: 'zalo',
    chat: 'Tuấn Anh (Kế toán ABC)',
    direction: 'outbound',
    sender: 'You (Sales Rep)',
    phone: '',
    text: 'Dạ em cảm ơn anh! Hệ thống tự động kích hoạt tài khoản license vĩnh viễn cho team.',
  },
  {
    id: 'msg-07',
    time: '2026-11-06T16:10:00+07:00',
    network: 'whatsapp',
    chat: 'Elena Rostova',
    direction: 'inbound',
    sender: 'Elena Rostova',
    phone: '+44 7700 900077',
    text: 'Confirmed. The live Google Sheets transcript export integration is functioning properly.',
  },
];

export interface ContactSummary {
  name: string;
  phone: string;
  network: string;
  count: number;
}

export const sampleContacts: ContactSummary[] = [
  { name: 'Lan (Rivera Apparel)', phone: '+84 912 345 678', network: 'Zalo', count: 2 },
  { name: 'Marcus Sterling', phone: '+1 555-019-2834', network: 'WhatsApp', count: 2 },
  { name: 'Tuấn Anh (Kế toán ABC)', phone: '+84 988 123 456', network: 'Zalo', count: 2 },
  { name: 'Elena Rostova', phone: '+44 7700 900077', network: 'WhatsApp', count: 1 },
];

export function placeColumn(
  columns: readonly SheetColumn[],
  column: SheetColumn,
  target: SheetColumn | null,
  side: 'before' | 'after'
): SheetColumn[] {
  if (column === target) return [...columns];
  const rest = columns.filter((value) => value !== column);
  const at = target === null ? -1 : rest.indexOf(target);
  if (at < 0) return [...rest, column];
  rest.splice(side === 'before' ? at : at + 1, 0, column);
  return rest;
}

export function columnLetter(index: number): string {
  let value = index + 1;
  let letters = '';
  while (value > 0) {
    const rest = (value - 1) % 26;
    letters = String.fromCharCode(65 + rest) + letters;
    value = Math.floor((value - 1) / 26);
  }
  return letters;
}

