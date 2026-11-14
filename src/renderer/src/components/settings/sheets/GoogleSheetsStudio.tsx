import React, { useState, useRef, useMemo } from 'react';
import { Button } from '@heroui/react';
import { useAppStore } from '../../../store/useAppStore.js';
import {
  allSheetColumns,
  sampleMessages,
  sampleContacts,
  placeColumn,
  columnLetter,
  type SheetColumn,
  type SheetLayoutPreset,
} from './sheetsData.js';

function IconGoogleSheets(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M30 4H12a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V14L30 4z" fill="#0F9D58" />
      <path d="M30 4v10h10L30 4z" fill="#87CEAC" />
      <path d="M14 22h20v18H14V22z" fill="#FFFFFF" fillOpacity="0.25" />
      <path d="M14 26h20v2H14v-2zm0 6h20v2H14v-2zm0 6h20v2H14v-2z" fill="#FFFFFF" />
      <path d="M22 22h4v18h-4V22z" fill="#FFFFFF" fillOpacity="0.6" />
    </svg>
  );
}

function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconGrip(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function IconPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

interface GoogleSheetsStudioProps {
  isVi?: boolean;
  onClose?: () => void;
}

export function GoogleSheetsStudio({ isVi = false, onClose }: GoogleSheetsStudioProps) {
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  // 4 Studio Steps
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(4);

  // Layout Configuration State
  const [preset, setPreset] = useState<SheetLayoutPreset>(sheetsConfig.preset || 'single');
  const [includeContactsTab, setIncludeContactsTab] = useState(sheetsConfig.includeContactsTab ?? true);
  const [columns, setColumns] = useState<SheetColumn[]>(
    sheetsConfig.columns || ['time', 'network', 'chat', 'sender', 'direction', 'text']
  );

  // Active Tab in the live spreadsheet preview
  const [activePreviewTab, setActivePreviewTab] = useState<string>('messages');

  // Drag and drop state
  const draggedColRef = useRef<SheetColumn | null>(null);
  const [dragOverCol, setDragOverCol] = useState<{ target: SheetColumn | null; side: 'before' | 'after' } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Spreadsheet connection state
  const [spreadsheetId, setSpreadsheetId] = useState(sheetsConfig.spreadsheetId);
  const [sheetName, setSheetName] = useState(sheetsConfig.sheetName);
  const [googleAccount] = useState(sheetsConfig.googleAccount || 'tuananh@gradion.ai');
  const [selectedFileName, setSelectedFileName] = useState(sheetsConfig.selectedFileName || 'ChatBridge_Transcripts_2026');
  const [createMode, setCreateMode] = useState<'new' | 'existing'>(sheetsConfig.createMode || 'new');

  // Unused columns in palette
  const unusedColumns = useMemo(
    () => allSheetColumns.filter((c) => !columns.includes(c.id)),
    [columns]
  );

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, col: SheetColumn) => {
    draggedColRef.current = col;
    e.dataTransfer.setData('text/plain', col);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, target: SheetColumn | null) => {
    e.preventDefault();
    if (!draggedColRef.current) return;
    if (target === draggedColRef.current) {
      setDragOverCol(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const side = target
      ? e.clientX < rect.left + rect.width / 2
        ? 'before'
        : 'after'
      : 'after';

    if (dragOverCol?.target !== target || dragOverCol.side !== side) {
      setDragOverCol({ target, side });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e: React.DragEvent, target: SheetColumn | null) => {
    e.preventDefault();
    const draggedCol = draggedColRef.current;
    if (!draggedCol) return;
    const side = dragOverCol?.side || 'after';
    const next = placeColumn(columns, draggedCol, target, side);
    setColumns(next);
    draggedColRef.current = null;
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    draggedColRef.current = null;
    setDragOverCol(null);
  };

  const addColumnToEnd = (col: SheetColumn) => {
    if (!columns.includes(col)) {
      setColumns([...columns, col]);
    }
  };

  const removeColumn = (col: SheetColumn) => {
    if (columns.length > 1) {
      setColumns(columns.filter((c) => c !== col));
    }
  };

  const handleSaveLayout = () => {
    updateSheetsConfig({
      preset,
      includeContactsTab,
      columns,
      spreadsheetId,
      sheetName,
      googleAccount,
      selectedFileName,
      createMode,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2200);
  };

  // Compute tabs list based on preset
  const previewTabList = useMemo(() => {
    const list: { id: string; label: string }[] = [];
    if (preset === 'single') {
      list.push({ id: 'messages', label: isVi ? 'Tin nhắn' : 'Messages' });
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
      list.push({ id: 'contacts', label: isVi ? 'Danh bạ' : 'Contacts' });
    }
    return list;
  }, [preset, includeContactsTab, isVi]);

  // Ensure active tab is valid
  const currentTab = previewTabList.some((t) => t.id === activePreviewTab)
    ? activePreviewTab
    : previewTabList[0]?.id || 'messages';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Banner & Step Navigation */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#161618] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 ring-1 ring-neutral-200 dark:ring-neutral-700 shadow-xs flex items-center justify-center shrink-0">
              <IconGoogleSheets className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Google Sheets Format & Layout Studio
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Pro UI
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isVi
                  ? 'Kéo thả chọn cột, sắp xếp thứ tự hiển thị và chia tab tự động khi xuất tin nhắn.'
                  : 'Drag-and-drop column formatter, custom tab partitioning, and live spreadsheet preview.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onClose && (
              <Button
                size="sm"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-200/60 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                onPress={onClose}
              >
                {isVi ? 'Thu gọn' : 'Collapse Studio'}
              </Button>
            )}
            <Button
              size="sm"
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
              onPress={handleSaveLayout}
            >
              <IconCheck className="w-3.5 h-3.5" />
              <span>{saveSuccess ? (isVi ? 'Đã lưu bố cục!' : 'Layout Saved!') : (isVi ? 'Lưu bố cục' : 'Save Layout')}</span>
            </Button>
          </div>
        </div>

        {/* 4 Step Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/80">
          {[
            { step: 1 as const, titleEn: '1. Google Account', titleVi: '1. Tài khoản Google', badge: 'OAuth 2.0' },
            { step: 2 as const, titleEn: '2. Destination Sheet', titleVi: '2. Nơi lưu trữ', badge: 'ID Linked' },
            { step: 3 as const, titleEn: '3. Tabs Strategy', titleVi: '3. Cách chia Tab', badge: preset.toUpperCase() },
            { step: 4 as const, titleEn: '4. Drag & Drop Columns', titleVi: '4. Kéo thả Cột (Table)', badge: `${columns.length} Cols` },
          ].map((item) => {
            const isActive = activeStep === item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(item.step)}
                className={`p-2.5 rounded-xl border text-left transition select-none cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                    : 'bg-white/80 dark:bg-neutral-900/60 border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
              >
                <div className="font-semibold text-xs truncate">
                  {isVi ? item.titleVi : item.titleEn}
                </div>
                <div className={`text-[10px] font-mono mt-1 ${isActive ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                  {item.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* STEP 1: GOOGLE ACCOUNT                                              */}
      {/* =================================================================== */}
      {activeStep === 1 && (
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white p-2 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center font-bold text-sm text-neutral-900">
                G
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Google Drive & Sheets Access
                </h4>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  {googleAccount} (Verified OAuth Session)
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connected</span>
            </span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {isVi
              ? 'Tài khoản Google dùng để tạo sheet mới và ghi dữ liệu tin nhắn. Token được mã hóa an toàn trên máy của bạn.'
              : 'Google OAuth account authorized to create new worksheets and append synchronized transcripts. Security scopes granted: spreadsheets and drive.file.'}
          </p>

          <div className="pt-2 flex items-center justify-end">
            <Button
              size="sm"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onPress={() => setActiveStep(2)}
            >
              <span>{isVi ? 'Tiếp tục: Nơi lưu →' : 'Next: Destination Sheet →'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 2: DESTINATION SPREADSHEET (CHỌN FILE LƯU TRÊN DRIVE)          */}
      {/* =================================================================== */}
      {activeStep === 2 && (
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-4 animate-in fade-in duration-200">
          <div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              {isVi ? 'Chọn file lưu trữ trên Google Drive' : 'Select Destination File on Google Drive'}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isVi
                ? 'Tạo mới hoặc chọn bảng tính có sẵn từ tài khoản Google Drive của bạn để lưu hội thoại.'
                : 'Create a new spreadsheet or pick an existing sheet from your Google Drive storage.'}
            </p>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setCreateMode('new')}
              className={`p-3 rounded-xl border text-left transition select-none cursor-pointer ${
                createMode === 'new'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs font-bold'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="text-xs">{isVi ? '📄 Tạo bảng tính mới' : '📄 Create New Spreadsheet'}</div>
              <div className={`text-[10px] font-mono mt-0.5 ${createMode === 'new' ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                {isVi ? 'Tự tạo file mới trên Drive' : 'Auto-provision new sheet'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCreateMode('existing')}
              className={`p-3 rounded-xl border text-left transition select-none cursor-pointer ${
                createMode === 'existing'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs font-bold'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="text-xs">{isVi ? '📁 Chọn file từ Google Drive' : '📁 Pick from Google Drive'}</div>
              <div className={`text-[10px] font-mono mt-0.5 ${createMode === 'existing' ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                {isVi ? 'Ghi nối vào sheet có sẵn' : 'Append to existing sheet'}
              </div>
            </button>
          </div>

          {createMode === 'new' ? (
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-900 dark:text-white">
                {isVi ? 'Tên file bảng tính mới' : 'New Spreadsheet File Name'}
              </label>
              <input
                type="text"
                value={selectedFileName}
                onChange={(e) => setSelectedFileName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                placeholder="ChatBridge_Transcripts_2026"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-900 dark:text-white">
                {isVi ? 'File tìm thấy trong Google Drive của bạn' : 'Files Found in Your Google Drive'}
              </label>
              <div className="space-y-1.5">
                {[
                  { name: 'ChatBridge_Transcripts_2026', id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', modified: 'Vừa xong' },
                  { name: 'Q4_Enterprise_Sales_Pipeline', id: '1A98BCx2309kLMNz8943184', modified: 'Hôm qua' },
                  { name: 'APAC_Client_Communications_Log', id: '1C7719830219842189014', modified: '3 ngày trước' },
                ].map((file) => {
                  const isChosen = selectedFileName === file.name;
                  return (
                    <div
                      key={file.id}
                      onClick={() => {
                        setSelectedFileName(file.name);
                        setSpreadsheetId(file.id);
                      }}
                      className={`p-2.5 rounded-xl border text-xs transition cursor-pointer select-none flex items-center justify-between ${
                        isChosen
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-emerald-500 font-bold">📊</span>
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                        {file.modified}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-900 dark:text-white">
                {isVi ? 'Mã Spreadsheet ID' : 'Google Spreadsheet ID'}
              </label>
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                placeholder="1BxiMVs0XRA5n..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-900 dark:text-white">
                {isVi ? 'Tên Tab mặc định (Worksheet Tab)' : 'Base Worksheet Tab Name'}
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="ChatBridge_Transcripts"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>{isVi ? '↗ Mở trực tiếp trên Google Sheets' : '↗ Open live in Google Sheets'}</span>
            </a>

            <Button
              size="sm"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onPress={() => setActiveStep(3)}
            >
              <span>{isVi ? 'Tiếp tục: Cách chia Tab →' : 'Next: Tabs Strategy →'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 3: TABS STRATEGY                                               */}
      {/* =================================================================== */}
      {activeStep === 3 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] text-xs text-neutral-600 dark:text-neutral-300">
            {isVi
              ? 'Chọn cách chia tin nhắn vào các trang tính. Hệ thống sẽ tự động tạo tab mới theo quy tắc khi có tin nhắn mới phát sinh.'
              : 'Choose how messages are distributed across spreadsheet tabs. New sheets will be automatically provisioned when messages match criteria.'}
          </div>

          {/* 6 Strategy Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'single' as SheetLayoutPreset, labelEn: 'Single Tab (Default)', labelVi: 'Một trang tính (Mặc định)', example: 'Messages / Tin nhắn', desc: 'All messages streamed into one master table' },
              { id: 'daily' as SheetLayoutPreset, labelEn: 'Daily Tab', labelVi: 'Mỗi ngày một tab', example: '2026-11-14 (UTC+7)', desc: 'Automatic clean daily log sheets' },
              { id: 'monthly' as SheetLayoutPreset, labelEn: 'Monthly Tab', labelVi: 'Mỗi tháng một tab', example: '2026-11 (UTC+7)', desc: 'Organized by accounting billing period' },
              { id: 'network' as SheetLayoutPreset, labelEn: 'By App Network', labelVi: 'Mỗi ứng dụng một tab', example: 'Zalo, WhatsApp', desc: 'Separate domestic & international clients' },
              { id: 'contact' as SheetLayoutPreset, labelEn: 'By Contact Customer', labelVi: 'Mỗi khách hàng một tab', example: 'Lan, Marcus, Tuấn', desc: 'Dedicated ledger per customer relationship' },
              { id: 'custom' as SheetLayoutPreset, labelEn: 'Custom Pattern', labelVi: 'Tuỳ chỉnh công thức', example: '{App} - {Month}', desc: 'Pattern formula or keyword routing' },
            ].map((card) => {
              const isSelected = preset === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => setPreset(card.id)}
                  className={`p-4 rounded-2xl border transition-all select-none cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md ring-1 ring-black/10 dark:ring-white/20'
                      : 'bg-neutral-50/70 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{isVi ? card.labelVi : card.labelEn}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                      {card.example}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-200 dark:text-neutral-700' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contacts Summary Tab Checkbox */}
          <div
            onClick={() => setIncludeContactsTab(!includeContactsTab)}
            className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                  includeContactsTab ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-400 dark:border-neutral-600'
                }`}
              >
                {includeContactsTab && <IconCheck className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <span className="font-bold text-xs text-neutral-900 dark:text-white">
                  {isVi ? 'Thêm trang tính Danh bạ tổng hợp (Contacts Summary Sheet)' : 'Add Contacts Directory Summary Sheet'}
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Appends a dedicated summary tab with contact names, phone numbers, app networks, and total message counts.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-neutral-400">
              {includeContactsTab ? 'Tab Enabled' : 'Off'}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <Button
              size="sm"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onPress={() => setActiveStep(4)}
            >
              <span>{isVi ? 'Tiếp tục: Kéo thả Cột (Table) →' : 'Next: Drag & Drop Columns (Table) →'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 4: INTERACTIVE DRAG & DROP COLUMNS WORKBENCH                   */}
      {/* =================================================================== */}
      {activeStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Instruction Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#161618] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {isVi
                  ? 'Kéo thẻ từ "Trường dữ liệu" thả vào tiêu đề bảng để chèn cột. Kéo tiêu đề cột để đổi vị trí, hoặc bấm × để xoá.'
                  : 'Drag fields into the table header to insert columns. Drag existing column headers to reorder, or click × to remove.'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-neutral-400">
                {columns.length} columns active
              </span>
            </div>
          </div>

          {/* Workbench Grid: Left Field Palette + Right Interactive Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* 1. LEFT PALETTE: Available Unused Fields */}
            <div className="lg:col-span-3 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                  <span>{isVi ? 'Trường dữ liệu' : 'Data Fields'}</span>
                  <span className="text-[10px] font-mono font-normal text-neutral-400">
                    {unusedColumns.length} available
                  </span>
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {unusedColumns.length > 0
                    ? isVi ? 'Kéo thả vào bảng hoặc nhấp để thêm' : 'Drag into table or click to append'
                    : isVi ? 'Tất cả các cột đã có trên bảng' : 'All available fields placed'}
                </p>
              </div>

              {unusedColumns.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-center text-xs text-neutral-400">
                  {isVi ? '✓ Tất cả các trường đã được thêm vào trang tính' : '✓ All data fields are placed in spreadsheet'}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {unusedColumns.map((col) => (
                    <div
                      key={col.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, col.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => addColumnToEnd(col.id)}
                      className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-emerald-500/80 dark:hover:border-emerald-500 hover:shadow-sm transition flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing select-none group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <IconGrip className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 shrink-0" />
                        <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200 truncate">
                          {isVi ? col.labelVi : col.labelEn}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 group-hover:text-emerald-500 font-bold shrink-0">
                        + Add
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. RIGHT SPREADSHEET TABLE PREVIEW */}
            <div className="lg:col-span-9 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] overflow-hidden shadow-sm flex flex-col">
              {/* Spreadsheet Toolbar */}
              <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 flex items-center justify-between text-xs font-mono text-neutral-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-sans font-bold text-neutral-800 dark:text-neutral-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Google Sheets Table Editor
                  </span>
                  <span>•</span>
                  <span>Sheet ID: {spreadsheetId.slice(0, 16)}...</span>
                </div>
                <span>7 sample rows loaded</span>
              </div>

              {/* Scrollable Table Area */}
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  {/* Table Header: Column Letters & Drag-and-Drop Column Heads */}
                  <thead className="sticky top-0 z-10 bg-neutral-50 dark:bg-[#121214] border-b border-neutral-200 dark:border-neutral-800">
                    {/* Top Row: Column Letters A, B, C, D... */}
                    <tr className="border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] font-mono text-neutral-400">
                      <th className="w-10 px-2 py-1 text-center bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
                        #
                      </th>
                      {columns.map((_, i) => (
                        <th
                          key={i}
                          className="px-3 py-1 text-center font-bold border-r border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50"
                        >
                          {columnLetter(i)}
                        </th>
                      ))}
                      <th className="px-3 py-1 text-center text-neutral-400">
                        {columnLetter(columns.length)}
                      </th>
                    </tr>

                    {/* Main Row: Column Names with Grip Handle & Delete button */}
                    <tr>
                      <th className="w-10 px-2 py-2 text-center font-mono text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
                        1
                      </th>
                      {columns.map((colKey) => {
                        const colDef = allSheetColumns.find((c) => c.id === colKey);
                        const isOver = dragOverCol?.target === colKey;
                        const dropIndicatorClass = isOver
                          ? dragOverCol.side === 'before'
                            ? 'border-l-3 border-l-emerald-500 bg-emerald-500/10'
                            : 'border-r-3 border-r-emerald-500 bg-emerald-500/10'
                          : '';

                        return (
                          <th
                            key={colKey}
                            draggable
                            onDragStart={(e) => handleDragStart(e, colKey)}
                            onDragOver={(e) => handleDragOver(e, colKey)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, colKey)}
                            onDragEnd={handleDragEnd}
                            className={`px-3 py-2.5 font-bold text-neutral-900 dark:text-white border-r border-neutral-200 dark:border-neutral-800 transition cursor-grab active:cursor-grabbing select-none group min-w-[140px] ${dropIndicatorClass}`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <IconGrip className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 shrink-0" />
                                <span className="truncate">
                                  {isVi ? colDef?.labelVi : colDef?.labelEn}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeColumn(colKey);
                                }}
                                disabled={columns.length === 1}
                                className="w-4 h-4 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center text-xs opacity-70 group-hover:opacity-100 disabled:opacity-20 cursor-pointer"
                                title="Remove column"
                              >
                                ✕
                              </button>
                            </div>
                          </th>
                        );
                      })}

                      {/* Drop Target Cell at end of row */}
                      <th
                        onDragOver={(e) => handleDragOver(e, null)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, null)}
                        className={`px-4 py-2.5 border-dashed border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold text-center text-xs min-w-[120px] transition ${
                          dragOverCol?.target === null ? 'bg-emerald-500/15 border-emerald-500' : 'bg-transparent'
                        }`}
                      >
                        + {isVi ? 'Thả vào đây' : 'Drop Here'}
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body with Realistic Sample Message Transcripts */}
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {currentTab === 'contacts' ? (
                      // Contacts Summary Rows
                      sampleContacts.map((contact, idx) => (
                        <tr
                          key={contact.name}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition font-mono text-[11px]"
                        >
                          <td className="w-10 px-2 py-2 text-center text-[10px] text-neutral-400 bg-neutral-100/50 dark:bg-neutral-900/50 border-r border-neutral-200 dark:border-neutral-800 font-mono">
                            {idx + 2}
                          </td>
                          <td className="px-3 py-2 border-r border-neutral-200 dark:border-neutral-800 font-sans font-bold text-neutral-900 dark:text-white">
                            {contact.name}
                          </td>
                          <td className="px-3 py-2 border-r border-neutral-200 dark:border-neutral-800">
                            {contact.phone}
                          </td>
                          <td className="px-3 py-2 border-r border-neutral-200 dark:border-neutral-800">
                            <span className="font-sans px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                              {contact.network}
                            </span>
                          </td>
                          <td className="px-3 py-2 border-r border-neutral-200 dark:border-neutral-800">
                            {contact.count} messages
                          </td>
                          {Array.from({ length: Math.max(0, columns.length - 3) }).map((_, emptyIdx) => (
                            <td key={emptyIdx} className="px-3 py-2 border-r border-neutral-200 dark:border-neutral-800 text-neutral-300">
                              —
                            </td>
                          ))}
                          <td className="px-3 py-2 text-neutral-300" />
                        </tr>
                      ))
                    ) : (
                      // Messages Rows matching current layout columns
                      sampleMessages.map((msg, idx) => (
                        <tr
                          key={msg.id}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition font-mono text-[11px]"
                        >
                          <td className="w-10 px-2 py-2 text-center text-[10px] text-neutral-400 bg-neutral-100/50 dark:bg-neutral-900/50 border-r border-neutral-200 dark:border-neutral-800 font-mono">
                            {idx + 2}
                          </td>
                          {columns.map((colKey) => {
                            let cellContent = '';
                            if (colKey === 'time') cellContent = msg.time.replace('T', ' ').slice(0, 16);
                            else if (colKey === 'network') cellContent = msg.network === 'zalo' ? 'Zalo' : 'WhatsApp';
                            else if (colKey === 'chat') cellContent = msg.chat;
                            else if (colKey === 'direction') cellContent = msg.direction === 'inbound' ? 'Inbound' : 'Outbound';
                            else if (colKey === 'sender') cellContent = msg.sender;
                            else if (colKey === 'phone') cellContent = msg.phone || '—';
                            else if (colKey === 'text') cellContent = msg.text;
                            else if (colKey === 'id') cellContent = msg.id;

                            return (
                              <td
                                key={colKey}
                                className="px-3 py-2 border-r border-neutral-200 dark:border-neutral-800 truncate max-w-[240px] text-neutral-800 dark:text-neutral-200 font-sans"
                                title={cellContent}
                              >
                                {colKey === 'network' ? (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      msg.network === 'zalo'
                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    }`}
                                  >
                                    {cellContent}
                                  </span>
                                ) : colKey === 'direction' ? (
                                  <span
                                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                                      msg.direction === 'inbound'
                                        ? 'text-neutral-700 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
                                        : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                                    }`}
                                  >
                                    {cellContent}
                                  </span>
                                ) : (
                                  cellContent
                                )}
                              </td>
                            );
                          })}
                          <td className="px-3 py-2 text-neutral-300" />
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Google Sheets Tab Bar (Authentic Sheets UI) */}
              <div className="px-3 py-1.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
                <button
                  type="button"
                  className="w-6 h-6 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white shrink-0 cursor-pointer"
                  title="Add Sheet"
                >
                  <IconPlus className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-1 shrink-0" />

                {previewTabList.map((tab) => {
                  const isActiveTab = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActivePreviewTab(tab.id)}
                      className={`px-3 py-1 rounded-t-lg text-xs font-semibold transition cursor-pointer select-none shrink-0 flex items-center gap-1.5 border-b-2 ${
                        isActiveTab
                          ? 'bg-white dark:bg-[#18181b] text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-xs'
                          : 'bg-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border-transparent'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

