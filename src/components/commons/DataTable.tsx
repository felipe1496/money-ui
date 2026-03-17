import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/functions';

export interface Column<T> {
  id: string;
  title: ReactNode;
  render?: (value: T) => ReactNode;
  trClassName?: string;
  isLoading?: ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  getRowProps?: (row: T) => HTMLAttributes<HTMLTableRowElement>;
}

export const DataTable = <T,>({ columns, data, isLoading = false, getRowProps }: Props<T>) => {
  function renderRows() {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, rowIndex) => (
        <tr key={`table-row-${rowIndex}`}>
          {columns.map((column) => (
            <td key={`table-cell-${rowIndex}-${String(column.id)}`} className={cn('px-3 py-1.5')}>
              {column.isLoading || null}
            </td>
          ))}
        </tr>
      ));
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-3 py-1.5 text-center text-sm text-zinc-500">
            No data found
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => {
      const rowProps = getRowProps?.(row) || {};
      const { className: rowClassName, ...rest } = rowProps;
      return (
        <tr key={`table-row-${rowIndex}`} {...rest} className={cn(rowClassName)}>
          {columns.map((column) => (
            <td key={`table-cell-${rowIndex}-${String(column.id)}`} className={cn('px-3 py-0.5')}>
              {column.render ? column.render(row) : null}
            </td>
          ))}
        </tr>
      );
    });
  }
  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={`table-column-${String(column.id)}`}
              className={cn(
                'bg-zinc-100 px-3 py-1.5 text-left text-sm font-semibold',
                column.trClassName,
              )}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
};
