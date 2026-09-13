import React from 'react';
import clsx from 'clsx';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  className,
}: TableProps<T>) {
  return (
    <div className={clsx('w-full overflow-x-auto border border-[#E2EAE6] rounded-2xl bg-white shadow-[0_8px_30px_rgba(1,59,35,0.04)]', className)}>
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#F6FAF8] border-b border-[#E2EAE6] text-[#5F7069] font-bold text-[11px] uppercase tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={clsx('px-5 py-3.5', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2EAE6] text-[#1F2A26]">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-[#8A9993]">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#05A222] border-t-transparent rounded-full animate-spin" />
                  <span>Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-[#8A9993]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={clsx(
                  'hover:bg-[#F6FAF8] transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={clsx('px-5 py-4', col.className)}>
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
  );
}
