'use client';

import { cn } from '@/libs/utils';
import * as React from 'react';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import ZrxButton from '../button/button';
import { ZrxInput } from '../input/input';
import '@/styles/zrx/grid.css';

// Define column interface
export type ZrxGridColumn<T> = {
  field: keyof T | string; // Key in data object
  header: string; // Column header text
  width?: string; // Width of column (e.g. "150px" or "10%")
  minWidth?: string; // Minimum width for this column (e.g. "80px")
  sortable?: boolean; // Whether column is sortable
  cellClass?: string; // Optional class for cells in this column
  headerAlign?: 'left' | 'center' | 'right'; // Add alignment option for header text
  render?: (value: any, rowData: T, rowIndex: number) => React.ReactNode; // Custom render function
  isDeleteColumn?: boolean; // New property to identify delete columns
};

// Define sort direction type
type SortDirection = 'asc' | 'desc' | null;

// Define grid props
type ZrxGridProps<T extends Record<string, any>> = {
  data: T[]; // Array of data items
  columns: ZrxGridColumn<T>[];
  usePagination?: boolean;
  numPageRows?: number;
  pageSizeOptions?: number[]; // Add options for page size
  className?: string;
  onCellClick?: (rowData: T, column: ZrxGridColumn<T>, rowIndex: number, columnIndex: number) => void;
  onCellHover?: (rowData: T, column: ZrxGridColumn<T>, rowIndex: number, columnIndex: number) => void;
  onCellFocus?: (rowData: T, column: ZrxGridColumn<T>, rowIndex: number, columnIndex: number) => void;
  idField?: keyof T; // Field to use as unique identifier
  emptyMessage?: string;
  minHeight?: string; // Added minHeight prop
  minColumnWidth?: string; // Default minimum width for all columns
  noSearch?: boolean; // Add option to hide search functionality
  inputgrid?: boolean; // New prop to indicate the grid contains form inputs
};

export function ZrxGrid<T extends Record<string, any>>({
  data,
  columns,
  usePagination = true,
  numPageRows = 10,
  className,
  onCellClick,
  onCellHover,
  onCellFocus,
  idField,
  emptyMessage = 'No data available',
  minHeight = '300px', // Default min-height
  minColumnWidth = '80px', // Default minimum width
  noSearch = false, // Default to showing search
  inputgrid = false, // Default to false
}: ZrxGridProps<T>) {
  // State for search term
  const [searchTerm, setSearchTerm] = React.useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  // State for sorting
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  // Add state for page size
  const [pageSize, setPageSize] = React.useState<number>(numPageRows);

  // Calculate total pages based on filtered data and numPageRows
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return data.filter((item) => {
      // Search through all fields
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowerSearchTerm),
      );
    });
  }, [data, searchTerm]);

  // Apply sorting to the filtered data
  const sortedData = React.useMemo(() => {
    if (!sortField || !sortDirection) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField as keyof T];
      const bValue = b[sortField as keyof T];

      if (aValue === bValue) {
        return 0;
      }

      // Handle different types of values
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }

      return (aValue < bValue ? -1 : 1) * modifier;
    });
  }, [filteredData, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  // Get current page data
  const currentData = React.useMemo(() => {
    if (!usePagination) {
      return sortedData;
    }

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, usePagination]);

  // Handle sort toggle
  const handleSort = (field: string, sortable?: boolean) => {
    if (!sortable) {
      return;
    }

    if (sortField === field) {
      // Toggle direction or reset
      setSortDirection((prev: 'asc' | 'desc' | null): 'asc' | 'desc' | null => {
        if (prev === 'asc') {
          return 'desc';
        }
        if (prev === 'desc') {
          return null;
        }
        return 'asc';
      });

      // If direction is being reset, also reset the sort field
      if (sortDirection === 'desc') {
        setSortField(null);
      }
    } else {
      // New field, start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle search input
  const handleZrxSearch = (value: string | number) => {
    setSearchTerm(value.toString());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page size change for numerical input
  const handlePageSizeChange = (value: string | number) => {
    let newSize = typeof value === 'string' ? Number.parseInt(value, 10) : value;
    // Enforce a minimum of 1 row per page
    newSize = Math.max(1, newSize);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) {
      return null;
    }

    if (sortDirection === 'asc') {
      return <span className="zrx-grid-sort-indicator">▲</span>;
    }
    if (sortDirection === 'desc') {
      return <span className="zrx-grid-sort-indicator">▼</span>;
    }
    return null;
  };

  // Get cell value based on field (handles nested properties with dot notation)
  const getCellValue = (item: T, field: string) => {
    if (field.includes('.')) {
      return field.split('.').reduce((obj, key) => obj && obj[key], item as any);
    }
    return item[field as keyof T];
  };

  // Format page size options for the select component

  // Calculate total minimum width of all columns

  return (
    <div className={cn('zrx-grid-container', className)}>
      {/* Search bar - conditionally rendered based on noSearch prop */}
      {!noSearch && (
        <div className="zrx-grid-search-container">
          <ZrxInput
            value={searchTerm}
            onChange={handleZrxSearch}
            placeholder="Search..."
            className="w-full"
            style={{
              minWidth: '200px',
            }}
          />
        </div>
      )}

      {/* Grid table with horizontal scrolling */}
      <div
        className="zrx-grid-table-container"
        style={{ minHeight, overflowX: 'auto' }}
      >
        <table className="zrx-grid-table">
          <thead>
            <tr>
              {columns.map((column, _index) => (
                <th
                  key={String(column.field || column.header)}
                  className={cn(
                    'zrx-grid-header',
                    column.sortable && 'zrx-grid-header-sortable',
                    sortField === column.field && `zrx-grid-header-sorted-${sortDirection}`,
                    column.headerAlign && `text-${column.headerAlign}`, // Apply text alignment
                    column.isDeleteColumn && 'zrx-grid-header-delete', // Add special class for delete column header
                  )}
                  onClick={() => handleSort(column.field as string, column.sortable)}
                  style={{
                    width: column.isDeleteColumn ? '38px' : (column.width || 'auto'),
                    minWidth: column.isDeleteColumn ? '38px' : (column.minWidth || minColumnWidth),
                    maxWidth: column.isDeleteColumn ? '38px' : undefined, // Ensure max width also matches
                  }}
                >
                  {column.header}
                  {renderSortIndicator(column.field as string)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0
              ? (
                  currentData.map((item, rowIndex) => (
                    <tr
                      key={idField ? String(item[idField]) : rowIndex}
                      className={cn(
                        'zrx-grid-row',
                        // Swap for odd rows being darker
                        rowIndex % 2 === 0 && 'zrx-grid-row-odd', // Even indices (0, 2, 4) are now odd rows in UI
                        rowIndex % 2 !== 0 && 'zrx-grid-row-even', // Odd indices (1, 3, 5) are now even rows in UI
                      )}
                    >
                      {columns.map((column, colIndex) => {
                        const value = getCellValue(item, column.field as string);
                        const isFirstColumn = colIndex === 0;
                        const isLastColumn = colIndex === columns.length - 1;

                        // Determine paddings based on column position and type
                        let paddingLeft, paddingRight;

                        // Add extra padding to first and last rows to compensate for removed spacers
                        const isFirstRow = rowIndex === 0;
                        const isLastRow = rowIndex === currentData.length - 1;
                        let paddingTop, paddingBottom;

                        if (inputgrid) {
                          // For input grids
                          if (column.isDeleteColumn) {
                            paddingLeft = '8px';
                            paddingRight = '16px';
                          } else {
                            paddingLeft = isFirstColumn ? '16px' : '8px';
                            paddingRight = isLastColumn ? '16px' : '8px';
                          }

                          if (isFirstRow) {
                            paddingTop = '10px';
                          }
                          if (isLastRow) {
                            paddingBottom = '10px';
                          }
                        } else {
                          // Regular grids (non-input)
                          if (column.isDeleteColumn) {
                            paddingLeft = '0';
                            paddingRight = undefined;
                          }
                        }

                        return (
                          <td
                            key={idField ? `${String(item[idField])}-${colIndex}` : `row-${rowIndex}-col-${colIndex}`}
                            className={cn('zrx-grid-cell', column.cellClass)}
                            onClick={onCellClick ? () => onCellClick(item, column, rowIndex, colIndex) : undefined}
                            onMouseEnter={onCellHover ? () => onCellHover(item, column, rowIndex, colIndex) : undefined}
                            onFocus={onCellFocus ? () => onCellFocus(item, column, rowIndex, colIndex) : undefined}
                            style={{
                              minWidth: column.isDeleteColumn ? '38px' : (column.minWidth || minColumnWidth),
                              width: column.isDeleteColumn ? '38px' : undefined,
                              paddingLeft,
                              paddingRight,
                              paddingTop,
                              paddingBottom,
                              ...(column.isDeleteColumn ? { textAlign: 'center' } : {}),
                            }}
                            tabIndex={0}
                          >
                            {column.render ? column.render(value, item, rowIndex) : value}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )
              : (
                  <tr className="zrx-grid-empty-row">
                    <td colSpan={columns.length} className="zrx-grid-empty" style={inputgrid ? { padding: '20px 0' } : {}}>
                      {emptyMessage}
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* Updated pagination with properly distributed controls and consistent border color */}
      {usePagination && (
        <div className="flex flex-col sm:flex-row w-full justify-between items-center p-3 zrx-grid-top-border">
          {/* Pagination controls with forms variant buttons - left side */}
          <div className="w-full sm:w-1/2 flex justify-center sm:justify-start items-center space-x-2 mb-4 sm:mb-0">
            <ZrxButton
              forms
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-[38px] h-[38px] p-0 flex items-center justify-center"
            >
              <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
            </ZrxButton>

            <ZrxButton
              forms
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-[38px] h-[38px] p-0 flex items-center justify-center"
            >
              <MdKeyboardArrowLeft className="w-5 h-5" />
            </ZrxButton>

            <span className="zrx-grid-pagination-info px-2 inline-block leading-[38px]">
              Page
              {' '}
              {currentPage}
              {' '}
              of
              {' '}
              {totalPages}
            </span>

            <ZrxButton
              forms
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-[38px] h-[38px] p-0 flex items-center justify-center"
            >
              <MdKeyboardArrowRight className="w-5 h-5" />
            </ZrxButton>

            <ZrxButton
              forms
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-[38px] h-[38px] p-0 flex items-center justify-center"
            >
              <MdKeyboardDoubleArrowRight className="w-5 h-5" />
            </ZrxButton>
          </div>

          {/* Rows per page control - right side */}
          <div className="w-full sm:w-1/2 flex justify-center sm:justify-end items-center">
            <span className="text-sm mr-2 whitespace-nowrap">Rows per page:</span>
            <div className="w-[140px]">
              <ZrxInput
                isNumber
                value={pageSize}
                onChange={handlePageSizeChange}
                min={1}
                max={100}
                className="zrx-grid-page-size-input"
                style={{
                  width: '100%',
                  minWidth: '140px',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZrxGrid;
