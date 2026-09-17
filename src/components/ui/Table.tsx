import React from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TablePaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  pagination?: TablePaginationProps;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  className,
  pagination,
}: TableProps<T>) {
  const {
    currentPage = 1,
    totalPages = 1,
    totalItems = data.length,
    pageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
    onPageSizeChange,
  } = pagination || {};

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={clsx('w-full border border-[#E2EAE6] rounded-2xl bg-white shadow-xs overflow-hidden', className)}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-[#E2EAE6] text-[#64748B] font-semibold text-xs tracking-wide">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={clsx('px-6 py-3.5 whitespace-nowrap', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2EAE6] text-[#1E293B]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-[#94A3B8] text-sm">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-5 h-5 border-2 border-[#05A222] border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium text-slate-500">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-[#94A3B8] text-sm font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id ?? rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={clsx(
                    'hover:bg-[#F8FAFC] transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={clsx('px-6 py-4 text-sm font-medium', col.className)}>
                      {col.render
                        ? col.render(row, rowIdx)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Optional SaaS Pagination Footer */}
      {pagination && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-[#E2EAE6] bg-[#FAFCFB] text-xs text-[#64748B]">
          {/* Left: Row counts & page size selector */}
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="font-semibold text-[#0F172A]">{startIndex}</strong> to{' '}
              <strong className="font-semibold text-[#0F172A]">{endIndex}</strong> of{' '}
              <strong className="font-semibold text-[#0F172A]">{totalItems}</strong> entries
            </span>
            {onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="ml-2 px-2 py-1 bg-white border border-[#E2EAE6] rounded-lg text-xs font-semibold text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#05A222] cursor-pointer"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} / page
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Right: Page controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                className="px-2.5 py-1 rounded-lg border border-[#E2EAE6] bg-white font-semibold text-xs text-[#1E293B] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange && onPageChange(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === p
                        ? 'bg-[#05A222] text-white shadow-2xs'
                        : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 border border-[#E2EAE6]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                className="px-2.5 py-1 rounded-lg border border-[#E2EAE6] bg-white font-semibold text-xs text-[#1E293B] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
