import React, { useState, useRef, useMemo } from 'react';
import {
  Autocomplete,
  SearchField,
  ListBox,
  Button,
} from '@heroui/react';
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

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

/**
 * Authentic miniature spreadsheet illustration from chat_bridge.
 * Renders spreadsheet grid lines and the bottom tab pills for each strategy.
 */
function LayoutThumb({ preset }: { preset: SheetLayoutPreset }) {
  const tabs =
    preset === 'single'
      ? ['Messages']
      : preset === 'daily'
      ? ['2026-10-30', '2026-11-05', '2026-11-06']
      : preset === 'monthly'
      ? ['2026-10', '2026-11']
      : preset === 'network'
      ? ['Zalo', 'WhatsApp']
      : preset === 'contact'
      ? ['Lan', 'Marcus', 'Tuấn']
      : ['Zalo - 2026-11'];

  return (
    <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-[#111113] overflow-hidden shadow-2xs select-none pointer-events-none">
      {/* Top Spreadsheet Grid Lines (authentic chat_bridge thumbGrid) */}
      <div className="h-12 p-2 bg-neutral-50/70 dark:bg-neutral-900/40 flex flex-col justify-between">
        <div className="flex gap-1.5 opacity-60">
          <div className="h-1.5 w-7 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-11 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-14 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 flex-1 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <div className="flex gap-1.5 opacity-40">
          <div className="h-1.5 w-7 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-11 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-14 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 flex-1 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <div className="flex gap-1.5 opacity-20">
          <div className="h-1.5 w-7 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-11 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-14 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 flex-1 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </div>

      {/* Bottom Tabs Bar (authentic chat_bridge thumbTabs) */}
      <div className="flex items-center gap-1 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/90 dark:bg-[#18181b] px-2 py-1 overflow-x-hidden">
        {tabs.map((tab, idx) => (
          <span
            key={tab}
            className={`whitespace-nowrap px-1.5 py-0.5 rounded text-[9px] font-mono transition ${
              idx === 0
                ? 'bg-white dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs border-t-2 border-emerald-500'
                : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
  );
}

interface GoogleSheetsStudioProps {
  isVi?: boolean;
  onClose?: () => void;
}

export function GoogleSheetsStudio({ isVi = false, onClose }: GoogleSheetsStudioProps) {
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  // 4 Studio Steps: 1. OAuth, 2. Destination Sheet, 3. Tabs Strategy, 4. Columns Table
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(2);

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

  // Autocomplete state
  const [sheetSearchQuery, setSheetSearchQuery] = useState('');

  // Drive sheets mock list
  const driveSheetsList = useMemo(() => [
    { name: 'ChatBridge_Transcripts_2026', id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', modified: 'Vừa xong' },
    { name: 'Q4_Enterprise_Sales_Pipeline', id: '1A98BCx2309kLMNz8943184', modified: 'Hôm qua' },
    { name: 'APAC_Client_Communications_Log', id: '1C7719830219842189014', modified: '3 ngày trước' },
    { name: 'Daily_Orders_Gradion_Log', id: '1D4421980018471209823', modified: '1 tuần trước' },
    { name: 'Customer_Directory_Master', id: '1E8831092837401928341', modified: '2 tuần trước' },
  ], []);

  // Filtered sheets based on search query
  const filteredSheets = useMemo(() => {
    if (!sheetSearchQuery.trim()) return driveSheetsList;
    return driveSheetsList.filter((s) =>
      s.name.toLowerCase().includes(sheetSearchQuery.toLowerCase())
    );
  }, [driveSheetsList, sheetSearchQuery]);

  const handleSelectSheet = (sheet: { name: string; id: string }) => {
    setSelectedFileName(sheet.name);
    setSpreadsheetId(sheet.id);
    updateSheetsConfig({ selectedFileName: sheet.name, spreadsheetId: sheet.id });
  };

  const handleCreateNewSheet = (name: string) => {
    const trimmed = name.trim() || 'New_ChatBridge_Spreadsheet';
    const newId = '1' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSelectedFileName(trimmed);
    setSpreadsheetId(newId);
    updateSheetsConfig({ selectedFileName: trimmed, spreadsheetId: newId, createMode: 'new' });
  };

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
    updateSheetsConfig({ columns: next });
    draggedColRef.current = null;
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    draggedColRef.current = null;
    setDragOverCol(null);
  };

  const addColumnToEnd = (col: SheetColumn) => {
    if (!columns.includes(col)) {
      const next = [...columns, col];
      setColumns(next);
      updateSheetsConfig({ columns: next });
    }
  };

  const removeColumn = (col: SheetColumn) => {
    if (columns.length > 1) {
      const next = columns.filter((c) => c !== col);
      setColumns(next);
      updateSheetsConfig({ columns: next });
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

  const currentTab = previewTabList.some((t) => t.id === activePreviewTab)
    ? activePreviewTab
    : previewTabList[0]?.id || 'messages';

  // 4 Steps Definition
  const STEPS_DATA = [
    { step: 1 as const, titleEn: 'Google Account', titleVi: 'Tài khoản Google', badge: 'OAuth 2.0' },
    { step: 2 as const, titleEn: 'Destination Sheet', titleVi: 'Nơi lưu trữ', badge: selectedFileName },
    { step: 3 as const, titleEn: 'Tabs Strategy', titleVi: 'Cách chia Tab', badge: preset.toUpperCase() },
    { step: 4 as const, titleEn: 'Table Workbench', titleVi: 'Kéo thả Cột', badge: `${columns.length} Cột` },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Studio Banner & Header */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#161618] space-y-4 shadow-xs">
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
                {isVi ? 'Đóng' : 'Close'}
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

        {/* =================================================================== */}
        {/* PRO UI PROGRESS STEPPER (4 BƯỚC DẠNG PROGRESS)                      */}
        {/* =================================================================== */}
        <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/80">
          <div className="relative flex items-center justify-between">
            {/* Background connecting progress line track */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-200 dark:bg-neutral-800 -z-0" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-emerald-500 transition-all duration-300 -z-0"
              style={{ width: `${((activeStep - 1) / 3) * 100 * 0.88}%` }}
            />

            {STEPS_DATA.map((item) => {
              const isActive = activeStep === item.step;
              const isPassed = activeStep > item.step;

              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveStep(item.step)}
                  className="group relative z-10 flex flex-col items-center text-center cursor-pointer select-none transition focus:outline-none"
                >
                  {/* Step circle indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 ring-4 ring-emerald-500/20 scale-105'
                        : isPassed
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {isPassed ? <IconCheck className="w-4 h-4 stroke-[3]" /> : item.step}
                  </div>

                  {/* Step Title & Badge */}
                  <div className="mt-1.5">
                    <span
                      className={`block text-[11px] font-semibold transition ${
                        isActive
                          ? 'text-neutral-900 dark:text-white font-bold'
                          : isPassed
                          ? 'text-neutral-700 dark:text-neutral-300'
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    >
                      {isVi ? item.titleVi : item.titleEn}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono hidden sm:block truncate max-w-[110px]">
                      {item.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* STEP 1: GOOGLE OAUTH ACCOUNT                                        */}
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
      {/* STEP 2: DESTINATION SHEET (PRO UI AUTOCOMPLETE COMBOWORKBENCH)      */}
      {/* =================================================================== */}
      {activeStep === 2 && (
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-4 animate-in fade-in duration-200">
          <div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              {isVi ? 'Nơi lưu trữ bảng tính (Google Spreadsheet Destination)' : 'Google Spreadsheet Destination'}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isVi
                ? 'Tìm kiếm bảng tính có sẵn trên Google Drive hoặc nhập tên để tạo mới ngay trong ô tự động gợi ý.'
                : 'Search existing Google Drive sheets or type a new name to create one directly with Pro UI Autocomplete.'}
            </p>
          </div>

          {/* OFFICIAL PRO UI AUTOCOMPLETE FIELD WITH CREATE OPTION */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 dark:text-white">
                {isVi ? 'Chọn hoặc tạo bảng tính Google Sheets' : 'Select or Create Google Spreadsheet'}
              </label>
              <span className="text-[10px] text-neutral-400 font-normal">
                {isVi ? 'HeroUI Pro Autocomplete' : 'HeroUI Pro Autocomplete'}
              </span>
            </div>

            <Autocomplete
              className="w-full"
              onSelectionChange={(key) => {
                if (!key) return;
                const k = String(key);
                if (k === '__create_new__') {
                  handleCreateNewSheet(sheetSearchQuery.trim() || 'New_ChatBridge_Spreadsheet');
                } else {
                  const found = driveSheetsList.find((s) => s.id === k);
                  if (found) {
                    handleSelectSheet(found);
                  }
                }
              }}
            >
              <Autocomplete.Trigger className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white shadow-2xs cursor-pointer">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-emerald-500 font-bold text-sm">📊</span>
                  <Autocomplete.Value placeholder={selectedFileName || (isVi ? 'Chọn bảng tính từ Drive...' : 'Select spreadsheet from Drive...')} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Autocomplete.ClearButton />
                  <Autocomplete.Indicator />
                </div>
              </Autocomplete.Trigger>

              <Autocomplete.Popover className="w-full p-2 bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50">
                <Autocomplete.Filter>
                  <SearchField className="mb-2">
                    <SearchField.Group className="flex items-center px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30 transition">
                      <SearchField.SearchIcon className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
                      <SearchField.Input
                        value={sheetSearchQuery}
                        onChange={(e) => setSheetSearchQuery(e.target.value)}
                        placeholder={isVi ? 'Tìm kiếm hoặc nhập tên mới...' : 'Search Google Drive sheets or type new name...'}
                        className="w-full text-xs bg-transparent outline-none text-neutral-900 dark:text-white font-medium"
                      />
                      <SearchField.ClearButton />
                    </SearchField.Group>
                  </SearchField>

                  <ListBox className="space-y-1 max-h-60 overflow-y-auto">
                    {/* Option: Create New Spreadsheet */}
                    <ListBox.Item
                      id="__create_new__"
                      textValue={sheetSearchQuery.trim() ? `Tạo mới: ${sheetSearchQuery.trim()}` : 'Tạo bảng tính mới'}
                      className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 cursor-pointer flex items-center gap-2.5 transition select-none"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <IconPlus className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {sheetSearchQuery.trim()
                            ? (isVi ? `+ Tạo bảng tính mới: "${sheetSearchQuery.trim()}"` : `+ Create new spreadsheet: "${sheetSearchQuery.trim()}"`)
                            : (isVi ? '+ Tạo bảng tính mới trên Google Drive' : '+ Create new spreadsheet on Drive')}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          {isVi ? 'Tự động cấp phát file mới và đồng bộ dữ liệu' : 'Auto-provisions file and syncs data'}
                        </div>
                      </div>
                    </ListBox.Item>

                    {/* Fetched Drive Spreadsheets */}
                    {filteredSheets.map((file) => (
                      <ListBox.Item
                        key={file.id}
                        id={file.id}
                        textValue={file.name}
                        className={`p-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer select-none text-xs ${
                          selectedFileName === file.name
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-2xs'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-emerald-500 font-bold text-sm">📊</span>
                          <span className="text-xs truncate">{file.name}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 ${selectedFileName === file.name ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                          {file.modified}
                        </span>
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Autocomplete.Filter>
              </Autocomplete.Popover>
            </Autocomplete>
          </div>

          {/* Active Selected Sheet Details Card */}
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-emerald-500 font-bold text-lg shrink-0">📊</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {selectedFileName}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    .gsheet
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono truncate block">
                  ID: {spreadsheetId}
                </span>
              </div>
            </div>

            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{isVi ? '↗ Mở trên Sheets' : '↗ Open in Sheets'}</span>
            </a>
          </div>

          {/* Base Worksheet Tab Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-900 dark:text-white">
              {isVi ? 'Tên Tab mặc định (Worksheet Tab Name)' : 'Base Worksheet Tab Name'}
            </label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => {
                setSheetName(e.target.value);
                updateSheetsConfig({ sheetName: e.target.value });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              placeholder="ChatBridge_Transcripts"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Button
              size="sm"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800"
              onPress={() => setActiveStep(1)}
            >
              <span>← Quay lại</span>
            </Button>

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
      {/* STEP 3: TABS STRATEGY WITH AUTHENTIC CHAT_BRIDGE MINI THUMBNAILS     */}
      {/* =================================================================== */}
      {activeStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] text-xs text-neutral-600 dark:text-neutral-300">
            {isVi
              ? 'Chọn cách chia tin nhắn vào các trang tính. Hệ thống sẽ tự động tạo tab mới theo quy tắc khi có tin nhắn mới phát sinh.'
              : 'Choose how messages are distributed across spreadsheet tabs. New sheets will be automatically provisioned when messages match criteria.'}
          </div>

          {/* 6 Strategy Cards with authentic LayoutThumb illustrations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'single' as SheetLayoutPreset, labelEn: 'Single Tab (Default)', labelVi: 'Một trang tính (Mặc định)', example: 'Messages / Tin nhắn', desc: 'Toàn bộ tin nhắn được gom vào 1 bảng duy nhất' },
              { id: 'daily' as SheetLayoutPreset, labelEn: 'Daily Tab', labelVi: 'Mỗi ngày một tab', example: '2026-11-14 (UTC+7)', desc: 'Tự động tạo tab riêng biệt theo từng ngày' },
              { id: 'monthly' as SheetLayoutPreset, labelEn: 'Monthly Tab', labelVi: 'Mỗi tháng một tab', example: '2026-11 (UTC+7)', desc: 'Gom theo kỳ thanh toán và chu kỳ kế toán' },
              { id: 'network' as SheetLayoutPreset, labelEn: 'By App Network', labelVi: 'Theo ứng dụng', example: 'Zalo, WhatsApp', desc: 'Tách riêng khách hàng nội địa và quốc tế' },
              { id: 'contact' as SheetLayoutPreset, labelEn: 'By Contact Customer', labelVi: 'Theo khách hàng', example: 'Lan, Marcus, Tuấn', desc: 'Mỗi khách hàng có một sổ cái riêng biệt' },
              { id: 'custom' as SheetLayoutPreset, labelEn: 'Custom Pattern', labelVi: 'Công thức tùy chỉnh', example: '{App} - {Month}', desc: 'Định dạng linh hoạt theo biến số' },
            ].map((card) => {
              const isSelected = preset === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => {
                    setPreset(card.id);
                    updateSheetsConfig({ preset: card.id });
                  }}
                  className={`p-3.5 rounded-2xl border transition-all select-none cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-neutral-50/70 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {/* Authentic chat_bridge Visual Thumbnail */}
                  <LayoutThumb preset={card.id} />

                  <div className="space-y-1">
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
                </div>
              );
            })}
          </div>

          {/* Authentic chat_bridge Sample Tabs Bar */}
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-[#161618] flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-neutral-400 font-mono font-bold shrink-0">＋ ≡</span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {previewTabList.map((t, idx) => (
                <span
                  key={t.id}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold transition shrink-0 ${
                    idx === 0
                      ? 'bg-white dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 shadow-2xs border-t-2 border-emerald-500'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Contacts Summary Tab Checkbox */}
          <div
            onClick={() => {
              const next = !includeContactsTab;
              setIncludeContactsTab(next);
              updateSheetsConfig({ includeContactsTab: next });
            }}
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

          <div className="pt-2 flex items-center justify-between">
            <Button
              size="sm"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800"
              onPress={() => setActiveStep(2)}
            >
              <span>← Quay lại</span>
            </Button>

            <Button
              size="sm"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onPress={() => setActiveStep(4)}
            >
              <span>{isVi ? 'Tiếp tục: Kéo thả Cột (Table) →' : 'Next: Drag & Drop Columns →'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 4: DRAG & DROP COLUMN WORKBENCH & SPREADSHEET LIVE PREVIEW     */}
      {/* =================================================================== */}
      {activeStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
            {/* Field Palette (Cột có thể thêm) */}
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-3 lg:col-span-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  {isVi ? 'Trường dữ liệu' : 'Field Palette'}
                </h4>
                <span className="text-[10px] font-mono text-neutral-400">
                  {unusedColumns.length} còn lại
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {isVi ? 'Bấm để thêm cột vào bảng tính' : 'Click to add column to sheet'}
              </p>

              <div className="space-y-1.5">
                {unusedColumns.length === 0 ? (
                  <div className="p-3 text-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-400">
                    {isVi ? 'Đã thêm tất cả các cột' : 'All available columns added'}
                  </div>
                ) : (
                  unusedColumns.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => addColumnToEnd(col.id)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-left transition text-xs font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate">{isVi ? col.labelVi : col.labelEn}</span>
                      <IconPlus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500" />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Active Columns Workbench (Kéo thả sắp xếp) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#161618] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {isVi ? 'Thứ tự các Cột trong bảng tính (Kéo thả để sắp xếp)' : 'Active Columns (Drag to Reorder)'}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {columns.length} Cột Đang Bật
                  </span>
                </div>

                <div
                  onDragOver={(e) => handleDragOver(e, null)}
                  onDrop={(e) => handleDrop(e, null)}
                  className="p-2.5 rounded-xl bg-white dark:bg-black/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-wrap gap-2 min-h-[52px] items-center"
                >
                  {columns.map((col) => {
                    const colDef = allSheetColumns.find((c) => c.id === col);
                    const isDragOver = dragOverCol?.target === col;
                    return (
                      <div
                        key={col}
                        draggable
                        onDragStart={(e) => handleDragStart(e, col)}
                        onDragOver={(e) => handleDragOver(e, col)}
                        onDrop={(e) => handleDrop(e, col)}
                        onDragEnd={handleDragEnd}
                        className={`group px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-grab active:cursor-grabbing select-none transition shadow-2xs ${
                          isDragOver
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <IconGrip className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200" />
                        <span>{isVi ? colDef?.labelVi : colDef?.labelEn || col}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeColumn(col);
                          }}
                          className="text-neutral-400 hover:text-rose-500 text-xs px-1 rounded cursor-pointer"
                          title="Bỏ cột này"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Google Sheets Spreadsheet Preview Table */}
              <div className="rounded-2xl border border-neutral-300 dark:border-neutral-700/80 bg-white dark:bg-[#0c0d0e] overflow-hidden shadow-xs flex flex-col">
                {/* Table Formula Bar */}
                <div className="h-8 px-3 rounded-t-xl bg-neutral-100 dark:bg-[#161618] border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                  <span className="font-bold text-neutral-400 italic">fx</span>
                  <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-700" />
                  <span className="text-neutral-700 dark:text-neutral-300 truncate">
                    =CHATBRIDGE_STREAM(&quot;{selectedFileName}&quot;, &quot;{currentTab}&quot;) • {columns.length} columns active
                  </span>
                </div>

                {/* Table Viewport */}
                <div className="max-h-72 overflow-auto scrollbar-thin">
                  <table className="w-full text-xs border-collapse font-sans">
                    <thead>
                      {/* Letters Row (A, B, C...) */}
                      <tr className="bg-neutral-100 dark:bg-[#18181b] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono text-[10px]">
                        <th className="w-8 p-1 text-center border-r border-neutral-200 dark:border-neutral-800">◢</th>
                        {columns.map((col, idx) => (
                          <th key={col} className="p-1 text-center border-r border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-600 dark:text-neutral-300">
                            {columnLetter(idx)}
                          </th>
                        ))}
                      </tr>
                      {/* Header Row (Row 1) */}
                      <tr className="bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 font-semibold text-[11px]">
                        <td className="p-1.5 text-center font-mono text-[10px] text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-[#18181b]/50">
                          1
                        </td>
                        {columns.map((col) => {
                          const colDef = allSheetColumns.find((c) => c.id === col);
                          return (
                            <td key={col} className="p-2 border-r border-neutral-200 dark:border-neutral-800 text-left font-bold text-emerald-800 dark:text-emerald-400 truncate">
                              {isVi ? colDef?.labelVi : colDef?.labelEn || col}
                            </td>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300 text-[11px]">
                      {sampleMessages.slice(0, 5).map((msg, rIdx) => (
                        <tr key={msg.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                          <td className="p-1.5 text-center font-mono text-[10px] text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                            {rIdx + 2}
                          </td>
                          {columns.map((col) => {
                            let val = '';
                            if (col === 'time') val = msg.time.replace('T', ' ').slice(0, 16);
                            else if (col === 'network') val = msg.network.toUpperCase();
                            else if (col === 'chat') val = msg.chat;
                            else if (col === 'direction') val = msg.direction === 'inbound' ? 'Inbound' : 'Outbound';
                            else if (col === 'sender') val = msg.sender;
                            else if (col === 'phone') val = msg.phone || '—';
                            else if (col === 'text') val = msg.text;
                            else if (col === 'id') val = msg.id;

                            return (
                              <td key={col} className="p-2 border-r border-neutral-200 dark:border-neutral-800 text-left truncate max-w-[200px]">
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Sheet Tab Bar */}
                <div className="h-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/90 dark:bg-[#141416] px-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    <span className="text-neutral-400 font-mono text-[10px] px-1 font-bold">＋ ≡</span>
                    {previewTabList.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActivePreviewTab(t.id)}
                        className={`px-3 py-1 rounded-t border-t-2 text-[11px] font-medium transition cursor-pointer select-none shrink-0 ${
                          currentTab === t.id
                            ? 'bg-white dark:bg-[#0c0d0e] border-emerald-500 text-neutral-900 dark:text-white font-bold shadow-2xs'
                            : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] text-neutral-400 font-mono shrink-0 pl-2">
                    100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Button
              size="sm"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800"
              onPress={() => setActiveStep(3)}
            >
              <span>← Quay lại</span>
            </Button>

            <Button
              size="sm"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-xs"
              onPress={handleSaveLayout}
            >
              <IconCheck className="w-3.5 h-3.5" />
              <span>{saveSuccess ? (isVi ? 'Đã lưu bố cục!' : 'Layout Saved!') : (isVi ? 'Hoàn tất & Lưu bố cục' : 'Finish & Save Layout')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
