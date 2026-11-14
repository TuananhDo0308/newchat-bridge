import React, { useState, useRef } from 'react';
import marginceLogo from '../../assets/margince-logo.svg';
import { IconGoogleSheets, IconCheck } from './WizardIcons.js';
import type { SelectedDestinations } from './types.js';
import {
  allSheetColumns,
  placeColumn,
  type SheetColumn,
  type SheetLayoutPreset,
} from '../settings/sheets/sheetsData.js';
import { useAppStore } from '../../store/useAppStore.js';

interface Step5DestinationsProps {
  selectedDestinations: SelectedDestinations;
  onToggleDestination: (key: keyof SelectedDestinations) => void;
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

export function Step5Destinations({
  selectedDestinations,
  onToggleDestination,
}: Step5DestinationsProps) {
  const sheetsConfig = useAppStore((s) => s.sheetsConfig);
  const updateSheetsConfig = useAppStore((s) => s.updateSheetsConfig);

  // Sub-tabs inside Google Sheets Linking: 'oauth' | 'file' | 'studio'
  const [activeSheetTab, setActiveSheetTab] = useState<'oauth' | 'file' | 'studio'>('file');

  // Drag and drop state
  const draggedColRef = useRef<SheetColumn | null>(null);
  const [dragOverCol, setDragOverCol] = useState<{ target: SheetColumn | null; side: 'before' | 'after' } | null>(null);

  // OAuth Account state
  const googleAccount = sheetsConfig.googleAccount || 'tuananh@gradion.ai';
  const oauthConnected = sheetsConfig.oauthConnected ?? true;

  // File state
  const createMode = sheetsConfig.createMode || 'new';
  const selectedFileName = sheetsConfig.selectedFileName || 'ChatBridge_Transcripts_2026';
  const sheetName = sheetsConfig.sheetName || 'Transcripts';

  // Columns & Preset
  const columns = sheetsConfig.columns || ['time', 'network', 'chat', 'sender', 'direction', 'text'];
  const preset = sheetsConfig.preset || 'single';
  const includeContactsTab = sheetsConfig.includeContactsTab ?? true;

  // Drive files mock list
  const driveFiles = [
    { name: 'ChatBridge_Transcripts_2026', id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', modified: 'Vừa xong' },
    { name: 'Q4_Enterprise_Sales_Pipeline', id: '1A98BCx2309kLMNz8943184', modified: 'Hôm qua' },
    { name: 'APAC_Client_Communications_Log', id: '1C7719830219842189014', modified: '3 ngày trước' },
  ];

  // Drag handlers
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

  const handleDrop = (e: React.DragEvent, target: SheetColumn | null) => {
    e.preventDefault();
    const draggedCol = draggedColRef.current;
    if (!draggedCol) return;
    const side = dragOverCol?.side || 'after';
    const next = placeColumn(columns, draggedCol, target, side);
    updateSheetsConfig({ columns: next });
    draggedColRef.current = null;
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    draggedColRef.current = null;
    setDragOverCol(null);
  };

  const addColumn = (col: SheetColumn) => {
    if (!columns.includes(col)) {
      updateSheetsConfig({ columns: [...columns, col] });
    }
  };

  const removeColumn = (col: SheetColumn) => {
    if (columns.length > 1) {
      updateSheetsConfig({ columns: columns.filter((c) => c !== col) });
    }
  };

  const unusedColumns = allSheetColumns.filter((c) => !columns.includes(c.id));

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* =================================================================== */}
      {/* DESTINATION 1: MARGINCE CRM                                         */}
      {/* =================================================================== */}
      <div
        className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
          selectedDestinations.margince
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/80 dark:border-emerald-500/80 shadow-xs'
            : 'bg-neutral-50/60 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white p-2">
            <img src={marginceLogo} alt="Margince CRM" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                Margince CRM
              </h4>
              <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                Primary CRM
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
              Forward leads, deals & conversation timelines directly into pipeline.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleDestination('margince')}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer select-none flex items-center gap-1.5 shadow-xs ${
            selectedDestinations.margince
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700'
          }`}
        >
          {selectedDestinations.margince ? (
            <>
              <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
              <span>Connected</span>
            </>
          ) : (
            <span>Connect</span>
          )}
        </button>
      </div>

      {/* =================================================================== */}
      {/* DESTINATION 2: GOOGLE SHEETS WITH INTEGRATED LINK & STUDIO          */}
      {/* =================================================================== */}
      <div
        className={`rounded-2xl border transition-all overflow-hidden ${
          selectedDestinations.sheets
            ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-500/80 dark:border-emerald-500/80 shadow-xs'
            : 'bg-neutral-50/60 dark:bg-[#161618] border-neutral-200/90 dark:border-neutral-800'
        }`}
      >
        {/* Top Header Row */}
        <div className="p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ring-1 ring-neutral-200 dark:ring-neutral-700 bg-white p-1">
              <IconGoogleSheets className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                  Google Sheets
                </h4>
                <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                  OAuth 2.0 & Studio
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                {selectedDestinations.sheets
                  ? `Linked: ${selectedFileName} (${columns.length} columns active)`
                  : 'Connect with Google OAuth, choose destination spreadsheet & customize table columns.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!selectedDestinations.sheets) {
                  onToggleDestination('sheets');
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer select-none flex items-center gap-1.5 shadow-xs ${
                selectedDestinations.sheets
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700'
              }`}
            >
              {selectedDestinations.sheets ? (
                <>
                  <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Linked</span>
                </>
              ) : (
                <span>Link Sheet</span>
              )}
            </button>
          </div>
        </div>

        {/* EXPANDED LINKING WORKBENCH: OAUTH, CHỌN FILE LƯU & STUDIO */}
        {selectedDestinations.sheets && (
          <div className="border-t border-emerald-500/20 dark:border-emerald-500/20 p-3.5 pt-2.5 space-y-3 bg-white/70 dark:bg-black/40">
            {/* 3 Sub-Step Tabs Navigation */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveSheetTab('oauth')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeSheetTab === 'oauth'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>🔑</span>
                <span>1. Google OAuth</span>
                {oauthConnected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveSheetTab('file')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeSheetTab === 'file'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>📁</span>
                <span>2. Chọn file lưu</span>
                <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[80px]">
                  {selectedFileName}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSheetTab('studio')}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeSheetTab === 'studio'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>🛠️</span>
                <span>3. Sheet Studio</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {columns.length} Cột
                </span>
              </button>
            </div>

            {/* TAB 1: GOOGLE OAUTH */}
            {activeSheetTab === 'oauth' && (
              <div className="p-3 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#161618] space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center font-bold text-xs shadow-xs text-neutral-900 dark:text-white">
                      G
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        Google Account OAuth
                      </div>
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        {googleAccount}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>OAuth 2.0 Active</span>
                  </span>
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Đã cấp quyền ghi trực tiếp vào Google Drive & Google Sheets (spreadsheets, drive.file). Token mã hóa an toàn trên máy cục bộ.
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Token expires in 30 days
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSheetTab('file')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Tiếp tục: Chọn file lưu →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CHỌN FILE LƯU (DESTINATION FILE SELECTION) */}
            {activeSheetTab === 'file' && (
              <div className="p-3 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#161618] space-y-3 animate-in fade-in duration-150">
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSheetsConfig({ createMode: 'new' })}
                    className={`p-2 rounded-xl border text-left transition select-none cursor-pointer ${
                      createMode === 'new'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-2xs font-bold'
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="text-[11px]">📄 Tạo bảng tính mới</div>
                    <div className={`text-[9px] font-mono mt-0.5 ${createMode === 'new' ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                      Tự động tạo trên Drive
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSheetsConfig({ createMode: 'existing' })}
                    className={`p-2 rounded-xl border text-left transition select-none cursor-pointer ${
                      createMode === 'existing'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-2xs font-bold'
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="text-[11px]">📁 Chọn từ Google Drive</div>
                    <div className={`text-[9px] font-mono mt-0.5 ${createMode === 'existing' ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                      Chọn file có sẵn
                    </div>
                  </button>
                </div>

                {createMode === 'new' ? (
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                      Tên bảng tính mới (Google Spreadsheet Name)
                    </label>
                    <input
                      type="text"
                      value={selectedFileName}
                      onChange={(e) => updateSheetsConfig({ selectedFileName: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                      placeholder="ChatBridge_Transcripts_2026"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                      Danh sách file Google Sheets tìm thấy trên Drive
                    </label>
                    <div className="space-y-1">
                      {driveFiles.map((file) => {
                        const isChosen = selectedFileName === file.name;
                        return (
                          <div
                            key={file.id}
                            onClick={() => updateSheetsConfig({ selectedFileName: file.name, spreadsheetId: file.id })}
                            className={`p-2 rounded-lg border text-xs transition cursor-pointer select-none flex items-center justify-between ${
                              isChosen
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-emerald-500">📊</span>
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

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                    Tên Sheet / Worksheet Tab mặc định
                  </label>
                  <input
                    type="text"
                    value={sheetName}
                    onChange={(e) => updateSheetsConfig({ sheetName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    placeholder="Transcripts"
                  />
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveSheetTab('studio')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Tiếp tục: Cấu hình Sheet Studio (Kéo thả cột) →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: SHEET STUDIO (DRAG & DROP COLUMN WORKBENCH & STRATEGY) */}
            {activeSheetTab === 'studio' && (
              <div className="p-3 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#161618] space-y-3 animate-in fade-in duration-150">
                {/* Drag & Drop Column Workbench Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Thứ tự các Cột trong bảng tính (Kéo thả để sắp xếp)
                    </h5>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      Cột nào ở trước sẽ xuất hiện tương ứng cột A, B, C... trên Google Sheets preview bên phải.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {columns.length} Cột Đang Bật
                  </span>
                </div>

                {/* Active Columns Horizontal Drag & Drop Chips */}
                <div
                  onDragOver={(e) => handleDragOver(e, null)}
                  onDrop={(e) => handleDrop(e, null)}
                  className="p-2 rounded-xl bg-white dark:bg-black/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-wrap gap-1.5 min-h-[46px] items-center"
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
                        className={`group px-2 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none transition shadow-2xs ${
                          isDragOver
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <IconGrip className="w-3 h-3 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200" />
                        <span>{colDef?.labelVi || col}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeColumn(col);
                          }}
                          className="text-neutral-400 hover:text-rose-500 text-xs px-0.5 rounded cursor-pointer"
                          title="Bỏ cột này"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Unused Column Palette (Click to Add) */}
                {unusedColumns.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Cột có thể thêm (Bấm để chọn):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {unusedColumns.map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => addColumn(col.id)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                        >
                          <span>+</span>
                          <span>{col.labelVi}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs Strategy Quick Select */}
                <div className="space-y-1.5 pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                    Quy tắc chia Tab (Tabs Partitioning Strategy):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'single' as SheetLayoutPreset, label: 'Một Tab Master' },
                      { id: 'monthly' as SheetLayoutPreset, label: 'Theo Tháng' },
                      { id: 'network' as SheetLayoutPreset, label: 'Theo Ứng Dụng' },
                      { id: 'contact' as SheetLayoutPreset, label: 'Theo Khách Hàng' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => updateSheetsConfig({ preset: st.id })}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-medium transition cursor-pointer text-center truncate ${
                          preset === st.id
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold border-neutral-900 dark:border-white shadow-2xs'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contacts Directory Tab Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-neutral-700 dark:text-neutral-300 pt-1">
                  <input
                    type="checkbox"
                    checked={includeContactsTab}
                    onChange={(e) => updateSheetsConfig({ includeContactsTab: e.target.checked })}
                    className="w-3.5 h-3.5 rounded accent-emerald-600 cursor-pointer"
                  />
                  <span>Tự động tạo Tab Danh bạ khách hàng tổng hợp (Contacts Summary)</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
