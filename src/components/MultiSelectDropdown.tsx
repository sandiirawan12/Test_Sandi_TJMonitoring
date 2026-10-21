import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Check, X, Search, Loader2, ServerCrash } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  subLabel?: string;
  color?: string;
  badge?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  placeholder?: string;
  items: DropdownItem[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  loading?: boolean;
  loadingMore?: boolean;
  isServerSearching?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onSearchChange?: (query: string) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  emptyMessage?: string;
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  const lowerQuery = trimmed.toLowerCase();
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === lowerQuery ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5 not-italic font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  placeholder = 'Pilih opsi...',
  items,
  selectedIds,
  onChange,
  loading = false,
  loadingMore = false,
  isServerSearching = false,
  hasMore = false,
  onLoadMore,
  onSearchChange,
  icon,
  disabled = false,
  emptyMessage = 'Data tidak ditemukan.',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleScroll = () => {
    if (!listRef.current || !hasMore || loadingMore || !onLoadMore) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 40) {
      onLoadMore();
    }
  };

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const handleClearSearch = () => {
    setSearch('');
    onSearchChange?.('');
    inputRef.current?.focus();
  };

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const query = search.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        (item.subLabel && item.subLabel.toLowerCase().includes(query)) ||
        item.id.toLowerCase().includes(query) ||
        (item.badge && item.badge.toLowerCase().includes(query))
    );
  }, [items, search]);

  const isSearching = isServerSearching || (loading && search.trim().length > 0);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) setIsOpen(!isOpen);
        }}
        className={`w-full min-h-[44px] px-3.5 py-2 border rounded-xl flex items-center justify-between gap-2 text-left transition-all shadow-2xs ${
          disabled
            ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-50 pointer-events-none'
            : isOpen
            ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-sm cursor-pointer'
            : 'bg-white border-slate-200 cursor-pointer hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          {icon && <span className={`shrink-0 ${isOpen ? 'text-blue-500' : 'text-slate-400'}`}>{icon}</span>}
          {selectedIds.length === 0 ? (
            <span className="text-sm text-slate-400 truncate">{placeholder}</span>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap truncate">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {selectedIds.length} dipilih
              </span>
              <span className="text-xs text-slate-600 truncate hidden sm:inline">
                ({items.filter((i) => selectedIds.includes(i.id)).map((i) => i.label).slice(0, 2).join(', ')}
                {selectedIds.length > 2 ? ` +${selectedIds.length - 2}` : ''})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              title="Hapus pilihan"
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin absolute left-3 top-1/2 -translate-y-1/2" />
              ) : (
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder={`Cari berdasarkan nama atau ID...`}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400"
                onClick={(e) => e.stopPropagation()}
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-2 text-[11px] px-0.5">
              <span className="text-slate-400 flex items-center gap-1">
                {isSearching ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                    <span className="text-blue-500 font-medium">Mencari di server...</span>
                  </>
                ) : search.trim() ? (
                  <span className="text-slate-500">
                    <span className="font-semibold text-slate-700">{filteredItems.length}</span> hasil untuk &ldquo;<span className="text-blue-600 font-medium">{search}</span>&rdquo;
                  </span>
                ) : (
                  <span>{items.length} opsi tersedia</span>
                )}
              </span>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-rose-500 hover:text-rose-700 font-semibold cursor-pointer transition-colors"
                >
                  Hapus semua ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-64 overflow-y-auto p-1.5 space-y-0.5"
          >
            {loading && items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span>Memuat data...</span>
              </div>
            ) : isSearching && filteredItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-blue-500">Mencari di server...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center gap-2">
                <ServerCrash className="w-5 h-5 text-slate-300" />
                <span className="text-xs text-slate-400">{emptyMessage}</span>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors select-none ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 font-medium border border-blue-100'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      {item.color && (
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ring-1 ring-black/10"
                          style={{ backgroundColor: item.color }}
                        />
                      )}

                      <div className="truncate flex-1 min-w-0">
                        <span className="truncate block font-medium">
                          <HighlightText text={item.label} query={search} />
                        </span>
                        {item.subLabel && (
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                            <HighlightText text={item.subLabel} query={search} />
                          </span>
                        )}
                      </div>
                    </div>

                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-500 shrink-0 border border-slate-200">
                        <HighlightText text={item.badge} query={search} />
                      </span>
                    )}
                  </div>
                );
              })
            )}

            {loadingMore && (
              <div className="py-3 text-center text-xs text-blue-600 flex items-center justify-center gap-1.5 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memuat lebih banyak...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
