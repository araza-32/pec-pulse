
import { useState } from "react";

interface UseBulkSelectionOptions<T> {
  items: T[];
  idKey?: keyof T;
}

interface UseBulkSelectionResult {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  selectedCount: number;
  clearSelection: () => void;
  selectMultiple: (ids: string[]) => void;
}

export function useBulkSelection<T extends { id: string }>({
  items,
  idKey = 'id' as keyof T
}: UseBulkSelectionOptions<T>): UseBulkSelectionResult {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelected = (id: string): boolean => {
    return selectedIds.includes(id);
  };

  const toggleSelection = (id: string): void => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAll = (): void => {
    const allIds = items.map(item => String(item[idKey]));
    setSelectedIds(allIds);
  };

  const deselectAll = (): void => {
    setSelectedIds([]);
  };

  const clearSelection = (): void => {
    setSelectedIds([]);
  };

  const selectMultiple = (ids: string[]): void => {
    setSelectedIds(prev => {
      const uniqueIds = new Set([...prev, ...ids]);
      return Array.from(uniqueIds);
    });
  };

  return {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
    selectedCount: selectedIds.length,
    clearSelection,
    selectMultiple
  };
}
