'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface VirtualTableColumn<T> {
  key: keyof T;
  title: string;
  width?: number;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface VirtualTableProps<T> {
  data: T[];
  columns: VirtualTableColumn<T>[];
  itemHeight?: number;
  height?: number;
  onRowClick?: (item: T, index: number) => void;
  onRowDoubleClick?: (item: T, index: number) => void;
  selectedItems?: Set<string | number>;
  onSelectionChange?: (selectedItems: Set<string | number>) => void;
  loading?: boolean;
  className?: string;
  rowClassName?: (item: T, index: number) => string;
  emptyMessage?: string;
  getKey?: (item: T) => string | number;
}

export function VirtualTable<T extends Record<string, any>>({
  data,
  columns,
  itemHeight = 48,
  height = 400,
  onRowClick,
  onRowDoubleClick,
  selectedItems = new Set(),
  onSelectionChange,
  loading = false,
  className,
  rowClassName,
  emptyMessage = 'No data available',
  getKey = (item) => item.id
}: VirtualTableProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<keyof T, string>>({});
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calcular datos filtrados y ordenados
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = String(item[key]).toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });

    // Aplicar ordenamiento
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortColumn, sortDirection]);

  // Calcular rango visible
  const { startIndex, endIndex, visibleCount } = useMemo(() => {
    const containerHeight = height;
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // +2 para buffer
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
    const endIndex = Math.min(filteredAndSortedData.length - 1, startIndex + visibleCount);
    
    return { startIndex, endIndex, visibleCount };
  }, [scrollTop, itemHeight, height, filteredAndSortedData.length]);

  // Datos visibles
  const visibleData = useMemo(() => {
    return filteredAndSortedData.slice(startIndex, endIndex + 1);
  }, [filteredAndSortedData, startIndex, endIndex]);

  // Manejar scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Manejar clic en columna para ordenamiento
  const handleColumnClick = useCallback((column: VirtualTableColumn<T>) => {
    if (!column.sortable) return;
    
    if (sortColumn === column.key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column.key);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  // Manejar cambio de filtro
  const handleFilterChange = useCallback((column: VirtualTableColumn<T>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column.key]: value
    }));
  }, []);

  // Manejar selección de fila
  const handleRowClick = useCallback((item: T, index: number) => {
    if (onSelectionChange) {
      const key = getKey(item);
      const newSelected = new Set(selectedItems);
      
      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }
      
      onSelectionChange(newSelected);
    }
    
    onRowClick?.(item, index);
  }, [onRowClick, onSelectionChange, selectedItems, getKey]);

  // Manejar doble clic en fila
  const handleRowDoubleClick = useCallback((item: T, index: number) => {
    onRowDoubleClick?.(item, index);
  }, [onRowDoubleClick]);

  // Seleccionar todo
  const selectAll = useCallback(() => {
    if (onSelectionChange) {
      const allKeys = filteredAndSortedData.map(getKey);
      onSelectionChange(new Set(allKeys));
    }
  }, [onSelectionChange, filteredAndSortedData, getKey]);

  // Deseleccionar todo
  const deselectAll = useCallback(() => {
    if (onSelectionChange) {
      onSelectionChange(new Set());
    }
  }, [onSelectionChange]);

  const totalHeight = filteredAndSortedData.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div className={cn('relative border rounded-lg', className)}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex">
          {onSelectionChange && (
            <div className="w-12 p-2 border-r flex items-center justify-center">
              <input
                type="checkbox"
                checked={selectedItems.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                className="rounded"
              />
            </div>
          )}
          {columns.map((column) => (
            <div
              key={String(column.key)}
              className={cn(
                'p-3 border-r font-medium text-sm cursor-pointer select-none',
                column.sortable && 'hover:bg-muted/50'
              )}
              style={{ width: column.width }}
              onClick={() => handleColumnClick(column)}
            >
              <div className="flex items-center justify-between">
                <span>{column.title}</span>
                {column.sortable && sortColumn === column.key && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
              {column.filterable && (
                <input
                  type="text"
                  placeholder="Filter..."
                  className="mt-1 w-full text-xs px-2 py-1 border rounded"
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenedor scrollable */}
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height }}
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredAndSortedData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <>
            {/* Espacio superior para offset */}
            <div style={{ height: offsetY }} />
            
            {/* Filas visibles */}
            <div ref={contentRef}>
              {visibleData.map((item, index) => {
                const actualIndex = startIndex + index;
                const key = getKey(item);
                const isSelected = selectedItems.has(key);
                
                return (
                  <div
                    key={String(key)}
                    className={cn(
                      'flex border-b hover:bg-muted/50 transition-colors',
                      isSelected && 'bg-muted',
                      rowClassName?.(item, actualIndex)
                    )}
                    style={{ height: itemHeight }}
                    onClick={() => handleRowClick(item, actualIndex)}
                    onDoubleClick={() => handleRowDoubleClick(item, actualIndex)}
                  >
                    {onSelectionChange && (
                      <div className="w-12 p-2 border-r flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRowClick(item, actualIndex)}
                          className="rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                    {columns.map((column) => (
                      <div
                        key={String(column.key)}
                        className="p-3 border-r text-sm truncate"
                        style={{ width: column.width }}
                      >
                        {column.render
                          ? column.render(item[column.key], item, actualIndex)
                          : String(item[column.key] || '')
                        }
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            
            {/* Espacio inferior */}
            <div style={{ height: totalHeight - offsetY - visibleData.length * itemHeight }} />
          </>
        )}
      </div>

      {/* Footer con información */}
      <div className="sticky bottom-0 z-10 bg-background border-t px-3 py-2 text-sm text-muted-foreground">
        {filteredAndSortedData.length} items
        {selectedItems.size > 0 && (
          <span className="ml-2">
            ({selectedItems.size} selected)
          </span>
        )}
      </div>
    </div>
  );
}