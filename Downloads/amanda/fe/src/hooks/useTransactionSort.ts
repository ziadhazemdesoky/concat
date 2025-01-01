import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

type SortColumn = "date" | "label" | "amount";
type SortDirection = "asc" | "desc";

interface SortState {
  column: SortColumn;
  direction: SortDirection;
}

interface UseTransactionSortProps {
  onSortChange?: (sortState: SortState) => void;
}

export const useTransactionSort = (
  initialColumn: SortColumn = "date",
  { onSortChange }: UseTransactionSortProps = {}
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [sortState, setSortState] = useState<SortState>(() => ({
    column: (searchParams.get('sortColumn') as SortColumn) || initialColumn,
    direction: (searchParams.get('sortDirection') as SortDirection) || "desc"
  }));

  // Update URL when sort changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortColumn', sortState.column);
    newParams.set('sortDirection', sortState.direction);
    setSearchParams(newParams, { replace: true });
    
    // Notify parent component of sort changes
    onSortChange?.(sortState);
  }, [sortState, setSearchParams, searchParams, onSortChange]);

  const handleSort = useCallback((column: SortColumn) => {
    setSortState(currentState => ({
      column,
      direction: 
        column === currentState.column && currentState.direction === "asc" 
          ? "desc" 
          : "asc"
    }));
  }, []);

  return {
    sortColumn: sortState.column,
    sortDirection: sortState.direction,
    handleSort,
    // Add current sort state for fetch params
    getSortParams: () => ({
      sortColumn: sortState.column,
      sortDirection: sortState.direction
    })
  };
};