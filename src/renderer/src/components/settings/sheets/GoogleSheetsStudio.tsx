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
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  GripVertical,
  X,
  ChevronDown,
  Table,
  Eye,
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore.js';
import {
  allSheetColumns,
  sampleMessages,
  placeColumn,
  columnLetter,
  type SheetColumn,
  type SheetLayoutPreset,
} from './sheetsData.js';

/**
 * Authentic miniature spreadsheet illustration.
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
      ? ['Lan', 'Marcus', 'David']
      : ['Zalo - 2026-11'];

  return (
    <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-[#111113] overflow-hidden shadow-2xs select-none pointer-events-none">
      {/* Top Spreadsheet Grid Lines */}
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

      {/* Bottom Tabs Bar */}
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
  isReadOnly?: boolean;
  initialSheetName?: string;
  initialSheetId?: string;
  initialPreset?: SheetLayoutPreset;
  initialColumns?: SheetColumn[];
  onClose?: () => void;
}

export function GoogleSheetsStudio({
  isReadOnly = false,
  initialSheetName,
  initialSheetId,
  initialPreset,
  initialColumns,
  onClose,
}: GoogleSheetsStudioProps) {
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  // 3 Studio Steps: 1. Destination Sheet, 2. Tabs Strategy, 3. Table Workbench
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Layout Configuration State
  const [preset, setPreset] = useState<SheetLayoutPreset>(initialPreset || sheetsConfig.preset || 'single');
  const [includeContactsTab, setIncludeContactsTab] = useState(
    sheetsConfig.includeContactsTab ?? true
  );
  const [columns, setColumns] = useState<SheetColumn[]>(
    initialColumns || sheetsConfig.columns || ['time', 'network', 'chat', 'direction', 'sender', 'text']
  );

  // File identification state
  const [selectedFileName, setSelectedFileName] = useState(
    initialSheetName || sheetsConfig.selectedFileName || 'ChatBridge_Transcripts_2026'
  );
  const [spreadsheetId, setSpreadsheetId] = useState(
    initialSheetId || sheetsConfig.spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  );

  // UI interaction states
  const [activePreviewTab, setActivePreviewTab] = useState<string>('messages');
  const [dragOverCol, setDragOverCol] = useState<{ target: SheetColumn; side: 'before' | 'after' } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const draggedColRef = useRef<SheetColumn | null>(null);

  // Autocomplete state
  const [sheetSearchQuery, setSheetSearchQuery] = useState('');

  // Drive sheets mock list
  const driveSheetsList = useMemo(() => [
    { name: 'ChatBridge_Transcripts_2026', id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', modified: 'Just now' },
    { name: 'Q4_Enterprise_Sales_Pipeline', id: '1A98BCx2309kLMNz8943184', modified: 'Yesterday' },
    { name: 'APAC_Client_Communications_Log', id: '1C7719830219842189014', modified: '3 days ago' },
    { name: 'Daily_Orders_Gradion_Log', id: '1D4421980018471209823', modified: '1 week ago' },
    { name: 'Customer_Directory_Master', id: '1E8831092837401928341', modified: '2 weeks ago' },
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

  // Drag-and-drop operations
  const handleDragStart = (e: React.DragEvent, col: SheetColumn) => {
    draggedColRef.current = col;
    e.dataTransfer.setData('text/plain', col);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, target: SheetColumn) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const side: 'before' | 'after' = e.clientX < midX ? 'before' : 'after';

    if (dragOverCol?.target !== target || dragOverCol.side !== side) {
      setDragOverCol({ target, side });
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
      selectedFileName,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose?.();
    }, 1200);
  };

  // Compute tabs list based on preset
  const previewTabList = useMemo(() => {
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
        { id: 'david', label: 'David' },
        { id: 'elena', label: 'Elena' }
      );
    } else {
      list.push({ id: 'custom', label: 'Zalo - 2026-11' });
    }

    if (includeContactsTab) {
      list.push({ id: 'contacts', label: 'Contacts Directory' });
    }

    return list;
  }, [preset, includeContactsTab]);

  const currentTab = activePreviewTab || previewTabList[0]?.id || 'messages';

  const STEPS = [
    { step: 1 as const, title: '1. Destination Sheet' },
    { step: 2 as const, title: '2. Tabs Strategy' },
    { step: 3 as const, title: '3. Table Workbench' },
  ];

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden bg-[#f7faf8] dark:bg-black text-neutral-900 dark:text-neutral-100 select-none animate-in fade-in duration-200">
      {/* Top Header Bar with Return to Settings */}
      <header className="px-3 sm:px-6 md:px-8 py-3 md:py-3.5 border-b border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-[#0c0d0e]/90 backdrop-blur-md shrink-0 flex items-center justify-between gap-2 sm:gap-4 z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer group shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Settings</span>
              <span className="sm:hidden">Back</span>
              <kbd className="hidden md:inline-block text-[10px] px-1 py-0.2 rounded bg-white dark:bg-neutral-900 text-neutral-400 border border-neutral-200 dark:border-neutral-700 font-mono">
                Esc
              </kbd>
            </button>
          )}

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                Google Sheets Studio
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isReadOnly ? (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Read-only mode</span>
              <span className="sm:hidden">Read-only</span>
            </div>
          ) : (
            <Button
              size="sm"
              className="px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
              onPress={handleSaveLayout}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saveSuccess ? 'Saved!' : 'Save Layout'}</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Scrollable Studio View */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Segmented Progress Bar: 3 Clean Steps */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setActiveStep(seg as 1 | 2 | 3)}
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
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {STEPS.map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveStep(item.step)}
                  className={`text-left transition cursor-pointer select-none truncate ${
                    activeStep === item.step
                      ? 'text-neutral-900 dark:text-white font-bold'
                      : activeStep > item.step
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Step Heading and Subtitle */}
          <div className="pb-1">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {activeStep === 1 && 'Google Spreadsheet Destination'}
              {activeStep === 2 && 'Spreadsheet Tabs Partitioning Strategy'}
              {activeStep === 3 && 'Table Workbench & Live Spreadsheet Preview'}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
              {activeStep === 1 && 'Search existing Google Drive sheets or type a new name to create a new sheet destination.'}
              {activeStep === 2 && 'Choose how transcripts are split across tabs: Single, Daily, Monthly, or by App Network.'}
              {activeStep === 3 && 'Drag-and-drop columns directly in the table header to reorder fields, or click remove button.'}
            </p>
          </div>

          {/* =================================================================== */}
          {/* STEP 1: DESTINATION SHEET (HEROUI PRO AUTOCOMPLETE)                 */}
          {/* =================================================================== */}
          {activeStep === 1 && (
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] space-y-6 shadow-xs animate-in fade-in duration-200">
              {/* AUTOCOMPLETE FIELD WITH CREATE OPTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-900 dark:text-white">
                    Select or Create Google Spreadsheet
                  </label>
                  {spreadsheetId ? (
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
                        if (window.bridge?.openExternal) {
                          window.bridge.openExternal(url);
                        } else {
                          window.open(url, '_blank', 'noreferrer');
                        }
                      }}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Open in Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>

                {isReadOnly ? (
                  <div className="w-full px-4 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white shadow-2xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate text-sm font-bold">{selectedFileName || 'ChatBridge_Transcripts_2026'}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Connected
                      </span>
                    </div>
                  </div>
                ) : (
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
                    <Autocomplete.Trigger className="w-full px-3.5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white shadow-2xs cursor-pointer">
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
                              placeholder="Search Google Drive sheets or type new name..."
                              className="w-full text-xs bg-transparent outline-none text-neutral-900 dark:text-white font-medium"
                            />
                            <SearchField.ClearButton />
                          </SearchField.Group>
                        </SearchField>

                        <ListBox className="space-y-1 max-h-60 overflow-y-auto">
                          {/* Option: Create New Spreadsheet */}
                          <ListBox.Item
                            id="__create_new__"
                            textValue={sheetSearchQuery.trim() || 'Create new spreadsheet'}
                            className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 cursor-pointer flex items-center gap-2.5 transition select-none"
                          >
                            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">
                                {sheetSearchQuery.trim()
                                  ? `+ Create new spreadsheet: "${sheetSearchQuery.trim()}"`
                                  : '+ Create new spreadsheet on Google Drive'}
                              </div>
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                Auto-provisions file and syncs data
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
                )}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80">
                {onClose ? (
                  <Button
                    size="sm"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                    onPress={onClose}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Settings</span>
                  </Button>
                ) : <div />}

                <Button
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  onPress={() => setActiveStep(2)}
                >
                  <span>Next: Tabs Strategy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* STEP 2: TABS STRATEGY                                               */}
          {/* =================================================================== */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] text-xs text-neutral-600 dark:text-neutral-300 shadow-xs">
                Choose how messages are distributed across spreadsheet tabs. New sheets will be automatically provisioned when messages match criteria.
              </div>

              {/* Strategy Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { id: 'single' as SheetLayoutPreset, label: 'Single Tab (Default)', example: 'Messages', desc: 'All transcripts are collected into a single unified worksheet' },
                  { id: 'daily' as SheetLayoutPreset, label: 'Daily Tab', example: '2026-11-14 (UTC+7)', desc: 'Automatically creates a dedicated tab for each day' },
                  { id: 'monthly' as SheetLayoutPreset, label: 'Monthly Tab', example: '2026-11 (UTC+7)', desc: 'Organizes transcripts by billing period and monthly review cycle' },
                  { id: 'network' as SheetLayoutPreset, label: 'By App Network', example: 'Zalo, WhatsApp', desc: 'Separates channels into distinct app worksheets' },
                  { id: 'contact' as SheetLayoutPreset, label: 'By Contact Customer', example: 'Lan, Marcus, David', desc: 'Maintains an individual ledger tab per customer contact' },
                  { id: 'custom' as SheetLayoutPreset, label: 'Custom Pattern', example: '{App} - {Month}', desc: 'Flexible dynamic naming pattern with runtime tokens' },
                ].map((card) => {
                  const isSelected = preset === card.id;
                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        if (isReadOnly) return;
                        setPreset(card.id);
                        updateSheetsConfig({ preset: card.id });
                      }}
                      className={`p-4 rounded-2xl border transition-all select-none flex flex-col justify-between gap-3.5 ${
                        isReadOnly ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400 shadow-xs'
                      }`}
                    >
                      <LayoutThumb preset={card.id} />

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{card.label}</span>
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

              {/* Sample Tabs Bar */}
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
                  if (isReadOnly) return;
                  const next = !includeContactsTab;
                  setIncludeContactsTab(next);
                  updateSheetsConfig({ includeContactsTab: next });
                }}
                className={`p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] flex items-center justify-between select-none shadow-xs ${
                  isReadOnly ? 'cursor-default opacity-80' : 'cursor-pointer'
                }`}
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
                      Add Contacts Directory Summary Sheet
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Automatically generates an auxiliary sheet containing contact names, phone numbers, app networks, and message volume totals.
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
                  onPress={() => setActiveStep(1)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </Button>

                <Button
                  size="sm"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  onPress={() => setActiveStep(3)}
                >
                  <span>Next: Drag & Drop Columns</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* STEP 3: DRAG & DROP COLUMN WORKBENCH & SPREADSHEET LIVE PREVIEW     */}
          {/* =================================================================== */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col lg:flex-row gap-5 items-start">
                {/* Field Palette */}
                <div
                  className={`w-full lg:w-64 shrink-0 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] space-y-3 shadow-xs ${
                    isReadOnly ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                      Field Palette
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {unusedColumns.length} available
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Click + or drag directly into table header to add
                  </p>

                  <div className="space-y-1.5">
                    {unusedColumns.length === 0 ? (
                      <div className="p-3 text-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-400">
                        All available columns added
                      </div>
                    ) : (
                      unusedColumns.map((col) => (
                        <div
                          key={col.id}
                          draggable={!isReadOnly}
                          onDragStart={(e) => !isReadOnly && handleDragStart(e, col.id)}
                          onClick={() => !isReadOnly && addColumnToEnd(col.id)}
                          className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-left transition text-xs font-medium flex items-center justify-between group cursor-grab active:cursor-grabbing select-none"
                          title="Click or drag into table to add column"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 shrink-0" />
                            <span className="truncate">{col.label}</span>
                          </div>
                          <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Table Viewport */}
                <div className="flex-1 min-w-0 w-full space-y-3.5">
                  <div className="rounded-2xl border border-neutral-300 dark:border-neutral-700/80 bg-white dark:bg-[#0c0d0e] overflow-hidden shadow-xs flex flex-col w-full">
                    {/* Table Viewport */}
                    <div className="min-h-[380px] max-h-[540px] overflow-auto scrollbar-thin">
                      <table className="w-full text-xs border-collapse font-sans">
                        <thead>
                          {/* Letters Row (A, B, C...) */}
                          <tr className="bg-neutral-100 dark:bg-[#18181b] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono text-[10px]">
                            <th className="w-8 p-1.5 text-center border-r border-neutral-200 dark:border-neutral-800 select-none">◢</th>
                            {columns.map((col, idx) => (
                              <th key={col} className="p-1.5 text-center border-r border-neutral-200 dark:border-neutral-800 font-semibold text-neutral-600 dark:text-neutral-300 select-none">
                                {columnLetter(idx)}
                              </th>
                            ))}
                          </tr>

                          {/* Row 1 Header with Drag-and-Drop and Delete Button */}
                          <tr className="bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 font-semibold text-[11px]">
                            <td className="p-2 text-center font-mono text-[10px] text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-[#18181b]/60 select-none">
                              1
                            </td>
                            {columns.map((col) => {
                              const colDef = allSheetColumns.find((c) => c.id === col);
                              const isDragOver = dragOverCol?.target === col;
                              return (
                                <th
                                  key={col}
                                  draggable={!isReadOnly}
                                  onDragStart={(e) => !isReadOnly && handleDragStart(e, col)}
                                  onDragOver={(e) => !isReadOnly && handleDragOver(e, col)}
                                  onDrop={(e) => !isReadOnly && handleDrop(e, col)}
                                  onDragEnd={handleDragEnd}
                                  className={`p-2 border-r border-neutral-200 dark:border-neutral-800 text-left font-bold select-none transition group ${
                                    isReadOnly
                                      ? 'cursor-default text-emerald-900 dark:text-emerald-300'
                                      : 'cursor-grab active:cursor-grabbing hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                                  } ${
                                    isDragOver
                                      ? 'bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/40 ring-inset'
                                      : ''
                                  }`}
                                  title={isReadOnly ? '' : 'Drag to reorder, click remove'}
                                >
                                  <div className="flex items-center justify-between gap-2 min-w-[130px]">
                                    <div className="flex items-center gap-1.5 truncate">
                                      {!isReadOnly && (
                                        <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0" />
                                      )}
                                      <span className="truncate">{colDef?.label || col}</span>
                                    </div>
                                    {!isReadOnly && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeColumn(col);
                                        }}
                                        className="w-4 h-4 rounded-md hover:bg-rose-500/20 text-neutral-400 hover:text-rose-500 flex items-center justify-center transition cursor-pointer shrink-0"
                                        title="Remove column from table"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300 text-[11px]">
                          {sampleMessages.map((msg, rIdx) => (
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
                                  <td key={col} className="p-2 border-r border-neutral-200 dark:border-neutral-800 text-left truncate max-w-[320px]">
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
                  onPress={() => setActiveStep(2)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </Button>

                {isReadOnly ? (
                  <Button
                    size="sm"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 cursor-pointer shadow-xs flex items-center gap-1.5"
                    onPress={onClose}
                  >
                    <span>Close Config</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-xs flex items-center gap-1.5"
                    onPress={handleSaveLayout}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{saveSuccess ? 'Layout Saved!' : 'Finish & Save Layout'}</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
