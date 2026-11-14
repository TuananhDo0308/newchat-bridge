import React, { useState } from 'react';
import {
  allSheetColumns,
  sampleMessages,
  sampleContacts,
  columnLetter,
  type SheetColumn,
  type SheetLayoutPreset,
} from '../settings/sheets/sheetsData.js';
import { IconGoogleSheets, IconCheck } from './WizardIcons.js';

interface Step5SheetsPreviewProps {
  columns: SheetColumn[];
  selectedFileName: string;
  preset: SheetLayoutPreset;
  includeContactsTab: boolean;
  googleAccount?: string;
  isMarginceActive?: boolean;
}

export function Step5SheetsPreview({
  columns,
  selectedFileName,
  preset,
  includeContactsTab,
  googleAccount = 'tuananh@gradion.ai',
  isMarginceActive = false,
}: Step5SheetsPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>('messages');
  const [previewMode, setPreviewMode] = useState<'sheets' | 'margince'>('sheets');

  // Compute tabs
  const tabList = React.useMemo(() => {
    const list: { id: string; label: string }[] = [];
    if (preset === 'single') {
      list.push({ id: 'messages', label: 'Messages' });
    } else if (preset === 'daily') {
      list.push(
        { id: '2026-10-30', label: '2026-10-30' },
        { id: '2026-11-05', label: '2026-11-05' },
        { id: '2026-11-06', label: '2026-11-06' }
      );
    } else if (preset === 'monthly') {
      list.push({ id: '2026-10', label: '2026-10' }, { id: '2026-11', label: '2026-11' });
    } else if (preset === 'network') {
      list.push({ id: 'zalo', label: 'Zalo' }, { id: 'whatsapp', label: 'WhatsApp' });
    } else if (preset === 'contact') {
      list.push(
        { id: 'lan', label: 'Lan' },
        { id: 'marcus', label: 'Marcus' },
        { id: 'tuan', label: 'Tuấn' },
        { id: 'elena', label: 'Elena' }
      );
    } else {
      list.push({ id: 'custom', label: 'Zalo - 2026-11' });
    }

    if (includeContactsTab) {
      list.push({ id: 'contacts', label: 'Contacts' });
    }
    return list;
  }, [preset, includeContactsTab]);

  const currentTab = tabList.some((t) => t.id === activeTab) ? activeTab : tabList[0]?.id || 'messages';

  // Filter sample rows by current tab if relevant
  const displayedMessages = React.useMemo(() => {
    if (currentTab === 'zalo') return sampleMessages.filter((m) => m.network === 'zalo');
    if (currentTab === 'whatsapp') return sampleMessages.filter((m) => m.network === 'whatsapp');
    if (currentTab === 'lan') return sampleMessages.filter((m) => m.chat.includes('Lan'));
    if (currentTab === 'marcus') return sampleMessages.filter((m) => m.chat.includes('Marcus'));
    if (currentTab === 'tuan') return sampleMessages.filter((m) => m.chat.includes('Tuấn'));
    if (currentTab === 'elena') return sampleMessages.filter((m) => m.chat.includes('Elena'));
    return sampleMessages;
  }, [currentTab]);

  const getCellValue = (msg: (typeof sampleMessages)[0], col: SheetColumn) => {
    switch (col) {
      case 'time':
        return msg.time.replace('T', ' ').slice(0, 16);
      case 'network':
        return msg.network.toUpperCase();
      case 'chat':
        return msg.chat;
      case 'direction':
        return msg.direction === 'inbound' ? 'Inbound' : 'Outbound';
      case 'sender':
        return msg.sender;
      case 'phone':
        return msg.phone || '—';
      case 'text':
        return msg.text;
      case 'id':
        return msg.id;
      default:
        return '—';
    }
  };

  return (
    <div className="relative z-10 flex flex-col h-full justify-between animate-in fade-in duration-300">
      {/* Top Bar with Mode Toggle & File Info */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shrink-0 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white p-1 ring-1 ring-neutral-200 dark:ring-neutral-700 shadow-xs flex items-center justify-center shrink-0">
            <IconGoogleSheets className="w-full h-full" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                {selectedFileName || 'ChatBridge_Transcripts_2026'}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                .gsheet
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-1 truncate">
              <span>Google Drive</span>
              <span>•</span>
              <span className="text-emerald-500">All changes auto-saved</span>
            </div>
          </div>
        </div>

        {isMarginceActive && (
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shrink-0">
            <button
              onClick={() => setPreviewMode('sheets')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                previewMode === 'sheets'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Sheets Table
            </button>
            <button
              onClick={() => setPreviewMode('margince')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                previewMode === 'margince'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              CRM Stream
            </button>
          </div>
        )}
      </div>

      {previewMode === 'sheets' ? (
        /* =================================================================== */
        /* GOOGLE SHEETS LIVE TABLE WORKBENCH PREVIEW                          */
        /* =================================================================== */
        <div className="flex-1 flex flex-col min-h-0 py-2.5 space-y-2">
          {/* Subtle Google Sheets Formula Bar */}
          <div className="h-7 px-2.5 rounded-lg bg-neutral-100/80 dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-2 text-[10px] font-mono text-neutral-500 shrink-0">
            <span className="font-bold text-neutral-400 italic">fx</span>
            <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-neutral-700 dark:text-neutral-300 truncate">
              =CHATBRIDGE_STREAM(&quot;{selectedFileName}&quot;, &quot;{currentTab}&quot;) • {columns.length} columns active
            </span>
          </div>

          {/* Spreadsheet Table Container */}
          <div className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700/80 bg-white dark:bg-[#0c0d0e] overflow-hidden flex flex-col shadow-xs min-h-0">
            {/* Table Scroll Area */}
            <div className="flex-1 overflow-auto scrollbar-thin">
              {currentTab === 'contacts' ? (
                /* Contacts Tab Preview */
                <table className="w-full text-[10px] border-collapse font-sans">
                  <thead>
                    <tr className="bg-neutral-100 dark:bg-[#18181b] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono">
                      <th className="w-8 p-1.5 text-center border-r border-neutral-200 dark:border-neutral-800 font-normal">#</th>
                      <th className="p-1.5 text-left border-r border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-800 dark:text-neutral-200">A • Contact Name</th>
                      <th className="p-1.5 text-left border-r border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-800 dark:text-neutral-200">B • Phone Number</th>
                      <th className="p-1.5 text-left border-r border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-800 dark:text-neutral-200">C • Network</th>
                      <th className="p-1.5 text-right font-semibold text-neutral-800 dark:text-neutral-200 pr-3">D • Msg Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300 font-mono text-[10px]">
                    {sampleContacts.map((c, i) => (
                      <tr key={c.name} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                        <td className="p-1.5 text-center border-r border-neutral-200 dark:border-neutral-800 text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/30">
                          {i + 2}
                        </td>
                        <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-800 font-sans font-medium text-neutral-900 dark:text-white">
                          {c.name}
                        </td>
                        <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-800 text-neutral-500">
                          {c.phone}
                        </td>
                        <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-800">
                          <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                            c.network === 'Zalo' ? 'text-blue-500' : 'text-emerald-500'
                          }`}>
                            {c.network}
                          </span>
                        </td>
                        <td className="p-1.5 text-right font-bold text-neutral-900 dark:text-white pr-3">
                          {c.count} msgs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Messages Table Preview */
                <table className="w-full text-[10px] border-collapse font-sans">
                  {/* Column Letters Row (A, B, C...) */}
                  <thead>
                    <tr className="bg-neutral-100 dark:bg-[#18181b] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono">
                      <th className="w-8 p-1 text-center border-r border-neutral-200 dark:border-neutral-800 font-normal">
                        ◢
                      </th>
                      {columns.map((col, idx) => (
                        <th
                          key={col}
                          className="p-1 text-center border-r border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-600 dark:text-neutral-300"
                        >
                          {columnLetter(idx)}
                        </th>
                      ))}
                    </tr>
                    {/* Header Row (Row 1 with column names) */}
                    <tr className="bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 font-semibold">
                      <td className="p-1.5 text-center font-mono text-[9px] text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-[#18181b]/50">
                        1
                      </td>
                      {columns.map((col) => {
                        const colDef = allSheetColumns.find((c) => c.id === col);
                        return (
                          <td
                            key={col}
                            className="p-1.5 border-r border-neutral-200 dark:border-neutral-800 text-left truncate font-bold text-emerald-800 dark:text-emerald-400"
                            title={colDef?.labelVi}
                          >
                            {colDef?.labelVi || col}
                          </td>
                        );
                      })}
                    </tr>
                  </thead>

                  {/* Sample Messages Data Rows */}
                  <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
                    {displayedMessages.map((msg, rIdx) => (
                      <tr
                        key={msg.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                      >
                        <td className="p-1.5 text-center font-mono text-[9px] text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                          {rIdx + 2}
                        </td>
                        {columns.map((col) => {
                          const val = getCellValue(msg, col);
                          const isNetwork = col === 'network';
                          const isDirection = col === 'direction';
                          const isText = col === 'text';

                          return (
                            <td
                              key={col}
                              className={`p-1.5 border-r border-neutral-200 dark:border-neutral-800 text-left ${
                                isText
                                  ? 'max-w-[200px] truncate'
                                  : isNetwork || isDirection
                                  ? 'font-semibold'
                                  : 'font-mono text-[9px]'
                              }`}
                            >
                              {isNetwork ? (
                                <span
                                  className={`px-1 py-0.2 rounded text-[8px] font-bold ${
                                    val === 'ZALO'
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-emerald-600 dark:text-emerald-400'
                                  }`}
                                >
                                  {val}
                                </span>
                              ) : isDirection ? (
                                <span
                                  className={`text-[9px] font-medium ${
                                    val === 'Inbound' ? 'text-amber-500' : 'text-neutral-400'
                                  }`}
                                >
                                  {val}
                                </span>
                              ) : (
                                <span className="truncate block">{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Authentic Google Sheets Bottom Tab Bar */}
            <div className="h-7 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/90 dark:bg-[#141416] px-2 flex items-center justify-between text-[10px] shrink-0">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                <button className="w-5 h-5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center font-bold text-neutral-500">
                  +
                </button>
                <button className="w-5 h-5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-500">
                  ≡
                </button>

                {tabList.map((t) => {
                  const isActive = t.id === currentTab;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`px-2.5 py-1 rounded-t border-t-2 text-[10px] font-medium transition cursor-pointer select-none shrink-0 ${
                        isActive
                          ? 'bg-white dark:bg-[#0c0d0e] border-emerald-500 text-neutral-900 dark:text-white font-bold shadow-2xs'
                          : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="text-[9px] text-neutral-400 font-mono shrink-0 pl-2">
                100%
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Margince CRM Stream Preview */
        <div className="flex-1 flex flex-col justify-center space-y-3 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] my-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Margince CRM Webhook Pipeline</span>
          </div>
          <div className="p-3 rounded-xl bg-black/80 font-mono text-[10px] text-emerald-400 space-y-1 overflow-x-auto">
            <div>POST /v1/stream HTTP/1.1</div>
            <div>Host: api.margince.com</div>
            <div>Authorization: Bearer mg_live_9f82d1c7...</div>
            <div className="text-neutral-400 pt-1">Payload:</div>
            <div className="text-neutral-200">
              {`{ "deal": "Gradion AI Enterprise", "contact": "Lan", "status": "approved", "value": 48000 }`}
            </div>
          </div>
          <span className="text-[11px] text-neutral-400">
            Real-time streaming enabled for customer proposals and chat messages.
          </span>
        </div>
      )}

      {/* Footer Info: Account & Security */}
      <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <IconCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[3]" />
          <span className="truncate">OAuth 2.0 Account: <strong className="text-neutral-700 dark:text-neutral-300">{googleAccount}</strong></span>
        </div>
        <span className="font-mono text-[10px] shrink-0 text-emerald-600 dark:text-emerald-400 font-semibold">
          Live Sync Ready
        </span>
      </div>
    </div>
  );
}
