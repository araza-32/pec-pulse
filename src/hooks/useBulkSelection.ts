
import { useState, useCallback } from 'react';

interface UseBulkSelectionProps<T> {
  items: T[];
  idField?: keyof T;
}

interface BulkSelectionReturn<T> {
  selectedIds: Set<string | number>;
  isSelected: (id: string | number) => boolean;
  toggleSelection: (id: string | number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectedItems: T[];
  selectedCount: number;
}

export function useBulkSelection<T>({ 
  items, 
  idField = 'id' as keyof T 
}: UseBulkSelectionProps<T>): BulkSelectionReturn<T> {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  
  const isSelected = useCallback((id: string | number) => {
    return selectedIds.has(id);
  }, [selectedIds]);
  
  const toggleSelection = useCallback((id: string | number) => {
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  }, []);
  
  const selectAll = useCallback(() => {
    const allIds = new Set(items.map(item => String(item[idField])));
    setSelectedIds(allIds);
  }, [items, idField]);
  
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);
  
  const selectedItems = items.filter(item => 
    selectedIds.has(String(item[idField]))
  );
  
  return {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    selectedItems,
    selectedCount: selectedIds.size
  };
}
