import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { PaginationInfo } from '../types/mbta';
import { PAGE_SIZE_OPTIONS } from '../utils/constants';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startItem,
    endItem,
    hasNext,
    hasPrev,
  } = pagination;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 mt-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 w-full md:w-auto justify-between md:justify-start">
        <div className="font-medium text-slate-700">
          Menampilkan{' '}
          <span className="font-bold text-slate-900">{startItem}</span>-
          <span className="font-bold text-slate-900">{endItem}</span> dari{' '}
          <span className="font-bold text-blue-600">{totalItems}</span> Data
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="pageSizeSelect" className="text-slate-500 whitespace-nowrap">
            Tampilkan:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            disabled={isLoading}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer disabled:opacity-50"
          >
            {PAGE_SIZE_OPTIONS.map((sizeOption) => (
              <option key={sizeOption} value={sizeOption}>
                {sizeOption} per hal
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center w-full md:w-auto">
        <span className="text-xs text-slate-400 mr-2 hidden lg:inline">
          Hal <strong className="text-slate-700">{currentPage}</strong> dari{' '}
          <strong className="text-slate-700">{totalPages}</strong>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!hasPrev || currentPage === 1 || isLoading}
          title="Halaman pertama"
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-600 transition-colors cursor-pointer"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev || currentPage === 1 || isLoading}
          title="Halaman sebelumnya"
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-600 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, index) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-xs text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext || currentPage === totalPages || isLoading}
          title="Halaman berikutnya"
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-600 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext || currentPage === totalPages || isLoading}
          title="Halaman terakhir"
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-600 transition-colors cursor-pointer"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
