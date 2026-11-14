import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Autocomplete,
  SearchField,
  ListBox,
  Button,
} from '@heroui/react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  GripVertical,
  X,
  ChevronDown,
  Layers,
  Table,
  Save,
  ShieldCheck,
} from 'lucide-react';
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
    setSheetSearchQuery('');
    updateSheetsConfig({ selectedFileName: sheet.name, spreadsheetId: sheet.id });
  };

  const handleCreateNewSheet = (name: string) => {
    const trimmed = name.trim() || 'New_ChatBridge_Spreadsheet';
    const newId = '1' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSelectedFileName(trimmed);
    setSpreadsheetId(newId);
    setSheetSearchQuery('');
    updateSheetsConfig({ selectedFileName: trimmed, spreadsheetId: newId, createMode: 'new' });
  };

  // Keyboard shortcut: Esc to return to settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
      list.push({ id: 'contacts', label: isVi ? 'Danh bạ tổng hợp' : 'Contacts Directory' });
    }

    return list;
  }, [preset, includeContactsTab, isVi]);

  const currentTab = activePreviewTab || previewTabList[0]?.id || 'messages';

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden bg-[#f7faf8] dark:bg-black text-neutral-900 dark:text-neutral-100 select-none animate-in fade-in duration-200">
      {/* Top Header Bar with Return to Settings */}
      <header className="p-4 md:px-8 md:py-3.5 border-b border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-[#0c0d0e]/90 backdrop-blur-md shrink-0 flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>{isVi ? 'Quay lại Cài đặt' : 'Back to Settings'}</span>
              <kbd className="text-[10px] px-1 py-0.2 rounded bg-white dark:bg-neutral-900 text-neutral-400 border border-neutral-200 dark:border-neutral-700 font-mono">
                Esc
              </kbd>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Google Sheets Format & Layout Studio
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Pro UI
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
            onPress={handleSaveLayout}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{saveSuccess ? (isVi ? 'Đã lưu bố cục!' : 'Layout Saved!') : (isVi ? 'Lưu bố cục' : 'Save Layout')}</span>
          </Button>
        </div>
      </header>

      {/* Main Scrollable Studio View */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Segmented Progress Bar (styled exactly like OnboardingWizard) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setActiveStep(seg as 1 | 2 | 3 | 4)}
                  className="h-1.5 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden cursor-pointer hover:opacity-85 transition group"
                  title={`Step ${seg}`}
                >
                  <div
                    className={`h-full bg-neutral-900 dark:bg-white transition-all duration-300 ${
                      activeStep >= seg ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Step Labels underneath */}
            <div className="grid grid-cols-4 gap-2 text-[11px]">
              {[
                { step: 1, label: isVi ? '1. Tài khoản Google' : '1. Google OAuth' },
                { step: 2, label: isVi ? '2. Bảng tính đích' : '2. Destination Sheet' },
                { step: 3, label: isVi ? '3. Chia sheet tab' : '3. Tabs Strategy' },
                { step: 4, label: isVi ? '4. Kéo thả cột & Bảng' : '4. Table Workbench' },
              ].map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveStep(item.step as 1 | 2 | 3 | 4)}
                  className={`text-left transition cursor-pointer select-none truncate ${
                    activeStep === item.step
                      ? 'text-neutral-900 dark:text-white font-bold'
                      : activeStep > item.step
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step Heading and Subtitle */}
          <div className="pb-1">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {activeStep === 1 && (isVi ? 'Xác thực tài khoản Google Drive & Sheets' : 'Connect Google Drive & Sheets Account')}
              {activeStep === 2 && (isVi ? 'Chọn hoặc tạo bảng tính Google Sheets' : 'Google Spreadsheet Destination')}
              {activeStep === 3 && (isVi ? 'Chiến lược phân chia worksheet tab' : 'Spreadsheet Tabs Partitioning Strategy')}
              {activeStep === 4 && (isVi ? 'Sắp xếp cột & xem trước bảng tính trực tiếp' : 'Table Workbench & Live Spreadsheet Preview')}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
              {activeStep === 1 && (isVi ? 'Ủy quyền kết nối OAuth 2.0 an toàn để ChatBridge đồng bộ tin nhắn vào bảng tính.' : 'Secure OAuth 2.0 connection enabling ChatBridge to synchronize messages.')}
              {activeStep === 2 && (isVi ? 'Tìm kiếm bảng tính trên Google Drive hoặc nhập tên để tạo mới ngay lập tức.' : 'Search existing Google Drive sheets or type a new name to create one directly with Pro UI Autocomplete.')}
              {activeStep === 3 && (isVi ? 'Chọn cách tổ chức các tab: Một bảng duy nhất, theo ngày, theo tháng hoặc theo từng ứng dụng.' : 'Choose how transcripts are split across tabs: Single, Daily, Monthly, or by App Network.')}
              {activeStep === 4 && (isVi ? 'Kéo thả các cột vào thanh tiêu đề, sắp xếp thứ tự và kiểm tra bảng tính trực tiếp.' : 'Drag-and-drop columns into table header, reorder fields, and inspect real-time preview.')}
            </p>
          </div>

          {/* =================================================================== */}
          {/* STEP 1: GOOGLE OAUTH ACCOUNT                                        */}
          {/* =================================================================== */}
          {activeStep === 1 && (
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] space-y-5 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center font-bold text-sm text-neutral-900 dark:text-white">
                    G
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Google OAuth 2.0 Authorization
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      {googleAccount} (Verified Active)
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>OAuth Connected</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
                <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Quyền truy cập đã cấp (Granted Scopes):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-neutral-500 pl-1">
                  <li>https://www.googleapis.com/auth/spreadsheets (Đọc & Ghi dữ liệu bảng tính)</li>
                  <li>https://www.googleapis.com/auth/drive.file (Tạo file bảng tính mới theo yêu cầu)</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {onClose ? (
                  <Button
                    size="sm"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                    onPress={onClose}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Quay lại Cài đặt' : 'Back to Settings'}</span>
                  </Button>
                ) : <div />}

                <Button
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  onPress={() => setActiveStep(2)}
                >
                  <span>{isVi ? 'Tiếp tục: Bảng tính đích' : 'Next: Destination Sheet'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* STEP 2: DESTINATION SHEET (HEROUI PRO AUTOCOMPLETE)                 */}
          {/* =================================================================== */}
          {activeStep === 2 && (
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] space-y-5 shadow-xs animate-in fade-in duration-200">
              {/* PRO UI AUTOCOMPLETE FIELD WITH CREATE OPTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-900 dark:text-white">
                    {isVi ? 'Chọn hoặc tạo bảng tính Google Sheets' : 'Select or Create Google Spreadsheet'}
                  </label>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    HeroUI Pro Autocomplete
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
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate">{selectedFileName || 'ChatBridge_Transcripts_2026'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </Autocomplete.Trigger>

                  <Autocomplete.Popover className="w-full p-2 bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50">
                    <Autocomplete.Filter>
                      <SearchField className="mb-2">
                        <SearchField.Group className="flex items-center px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30 transition">
                          <Search className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
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
                          textValue={sheetSearchQuery.trim() || 'Tạo bảng tính mới'}
                          className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 cursor-pointer flex items-center gap-2.5 transition select-none"
                        >
                          <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">
                              {sheetSearchQuery.trim()
                                ? (isVi ? `+ Tạo bảng tính mới: "${sheetSearchQuery.trim()}"` : `+ Create new spreadsheet: "${sheetSearchQuery.trim()}"`)
                                : (isVi ? '+ Tạo bảng tính mới trên Google Drive' : '+ Create new spreadsheet on Drive')}
                            </div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                              {isVi ? 'Tự động tạo file và gán quyền ghi' : 'Auto-provisions file and syncs data'}
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
                              <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
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
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />
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
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 shrink-0"
                >
                  <span>{isVi ? 'Mở trên Sheets' : 'Open in Sheets'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Base Worksheet Tab Name Input */}
              <div className="space-y-1.5">
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
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-neutral-900 dark:text-white"
                  placeholder="Transcripts"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  size="sm"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                  onPress={() => setActiveStep(1)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Quay lại' : 'Back'}</span>
                </Button>

                <Button
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  onPress={() => setActiveStep(3)}
                >
                  <span>{isVi ? 'Tiếp tục: Chiến lược chia Tab' : 'Next: Tabs Strategy'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* STEP 3: TABS STRATEGY WITH AUTHENTIC CHAT_BRIDGE MINI THUMBNAILS     */}
          {/* =================================================================== */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] text-xs text-neutral-600 dark:text-neutral-300 shadow-xs">
                {isVi
                  ? 'Chọn cách chia tin nhắn vào các trang tính. Hệ thống sẽ tự động tạo tab mới theo quy tắc khi có tin nhắn mới phát sinh.'
                  : 'Choose how messages are distributed across spreadsheet tabs. New sheets will be automatically provisioned when messages match criteria.'}
              </div>

              {/* 6 Strategy Cards with authentic LayoutThumb illustrations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                      className={`p-4 rounded-2xl border transition-all select-none cursor-pointer flex flex-col justify-between gap-3.5 ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400 shadow-xs'
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
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-[#161618] flex items-center gap-2 overflow-x-auto text-[11px]">
                <div className="flex items-center gap-1 text-neutral-400 shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                  <Table className="w-3.5 h-3.5" />
                </div>
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
                className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] flex items-center justify-between cursor-pointer select-none shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                      includeContactsTab ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-400 dark:border-neutral-600'
                    }`}
                  >
                    {includeContactsTab && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      {isVi ? 'Thêm trang tính Danh bạ tổng hợp (Contacts Summary Sheet)' : 'Add Contacts Directory Summary Sheet'}
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Tự động tạo thêm một tab chứa danh sách người liên hệ, số điện thoại, ứng dụng và số lượng tin nhắn.
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
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                  onPress={() => setActiveStep(2)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Quay lại' : 'Back'}</span>
                </Button>

                <Button
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  onPress={() => setActiveStep(4)}
                >
                  <span>{isVi ? 'Tiếp tục: Kéo thả Cột (Table)' : 'Next: Drag & Drop Columns'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* STEP 4: DRAG & DROP COLUMN WORKBENCH & SPREADSHEET LIVE PREVIEW     */}
          {/* =================================================================== */}
          {activeStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                {/* Field Palette (Cột có thể thêm) */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] space-y-3 lg:col-span-1 shadow-xs">
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
                          className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-left transition text-xs font-medium flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate">{isVi ? col.labelVi : col.labelEn}</span>
                          <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500" />
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Active Columns Workbench (Kéo thả sắp xếp) */}
                <div className="lg:col-span-3 space-y-3.5">
                  <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] space-y-2.5 shadow-xs">
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
                      className="p-2.5 rounded-xl bg-neutral-50 dark:bg-black/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-wrap gap-2 min-h-[52px] items-center"
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
                                : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200" />
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
                              <X className="w-3 h-3" />
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
                        <div className="flex items-center gap-1 text-neutral-400 px-1 font-bold">
                          <Plus className="w-3 h-3" />
                          <Table className="w-3 h-3" />
                        </div>
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
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                  onPress={() => setActiveStep(3)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Quay lại' : 'Back'}</span>
                </Button>

                <Button
                  size="sm"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-xs flex items-center gap-1.5"
                  onPress={handleSaveLayout}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{saveSuccess ? (isVi ? 'Đã lưu bố cục!' : 'Layout Saved!') : (isVi ? 'Hoàn tất & Lưu bố cục' : 'Finish & Save Layout')}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
