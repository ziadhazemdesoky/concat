//hooks/useTransactions.ts
import { useState } from 'react';
import { Transaction, TransactionQueryState } from '../utils/types';
import { transactionsApi } from '../services/transactionsApi';

interface UseTransactionsProps {
  itemsPerPage: number;
  queryState: TransactionQueryState;
  onError: (error: string) => void;
}

export const useTransactions = ({
  itemsPerPage,
  queryState,
  onError
}: UseTransactionsProps) => {
  const [rowData, setRowData] = useState<Transaction[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const filterVisibleTransactions = (transactions: Transaction[]) => {
    return transactions.filter(transaction => {
      return (
        (!transaction.hidden || queryState.visibilityPreferences.showHidden) &&
        (!transaction.lock || queryState.visibilityPreferences.showLocked) &&
        (!transaction.flag || queryState.visibilityPreferences.showFlagged) &&
        (!transaction.split || queryState.visibilityPreferences.showSplit)
      );
    });
  };

  const fetchData = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await transactionsApi.fetch({
        page,
        itemsPerPage,
        sortColumn: queryState.sort?.column,
        sortDirection: queryState.sort?.direction,
        transactionType: queryState.transactionType,
        filters: queryState.filters
      });
  
      const filteredTransactions = filterVisibleTransactions(response.transactions || []);
      
      setRowData(filteredTransactions);
      setTotalRecords(response.totalRecords);  // Use the total from API instead of filtered length
    } catch (error) {
      setRowData([]);
      setTotalRecords(0);
      onError(error instanceof Error ? error.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };
  return {
    rowData,
    totalRecords,
    isLoading,
    fetchData
  };
};