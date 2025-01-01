// hooks/useBulkTransactions.ts
import { useState, useCallback } from "react";
import {
  BulkOperationType,
  TransactionQueryState,
  BulkUpdateParams,
} from "../utils/types";
import { transactionsApi } from "../services/transactionsApi";

interface UseBulkTransactionsProps {
  queryState: TransactionQueryState;
  onChange: (state: Partial<TransactionQueryState>) => void;
  onUpdateComplete?: () => void;
  onError?: (error: string) => void;
}

export const useBulkTransactions = ({
  queryState,
  onChange,
  onUpdateComplete,
  onError,
}: UseBulkTransactionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const clearBulkSelection = useCallback(() => {
    onChange({
      ...queryState,
      bulkSelection: {
        targetType: undefined,
        isLabelBulk: false,
        isBusinessBulk: false,
        isPersonalBulk: false,
        isTagBulk: false,
        isCategoryBulk: false,
        isStatusBulk: false,
        selectedIds: [],
      },
    });
  }, [queryState, onChange]);

  const handleBulkOperationClick = useCallback(
    (type: BulkOperationType, value: boolean, data?: string) => {
      switch (type) {
        case "LABEL":
          onChange({
            ...queryState,
            bulkSelection: {
              ...queryState.bulkSelection,
              isLabelBulk: value,
              targetType: type,
              label: data,
            },
          });
          break;
        case "BUSINESS":
          onChange({
            ...queryState,
            bulkSelection: {
              ...queryState.bulkSelection,
              isBusinessBulk: value,
              isPersonalBulk: false,
              targetType: type,
            },
          });
          break;
        case "PERSONAL":
          onChange({
            ...queryState,
            bulkSelection: {
              ...queryState.bulkSelection,
              isPersonalBulk: value,
              isBusinessBulk: false,
              targetType: type,
            },
          });
          break;
        case "TAG":
          onChange({
            ...queryState,
            bulkSelection: {
              ...queryState.bulkSelection,
              isTagBulk: value,
              targetType: type,
            },
          });
          break;
        case "CATEGORY":
          onChange({
            ...queryState,
            bulkSelection: {
              ...queryState.bulkSelection,
              isCategoryBulk: value,
              targetType: type,
            },
          });
          break;
        case "STATUS":
          onChange({
            ...queryState,
            bulkSelection: {
              ...queryState.bulkSelection,
              isStatusBulk: value,
              targetType: type,
            },
          });
          break;

        default:
          break;
      }
    },
    [queryState, onChange]
  );

  const handleBulkOperation = useCallback(
    async (params: BulkUpdateParams) => {
      console.log("Starting bulk operation:", params);

      if (!params.transactionIds.length) {
        console.warn("No transactions selected");
        return;
      }

      setIsUpdating(true);
      try {
        const response = await transactionsApi.bulkUpdate(params);

        if (response.status === "success") {
          clearBulkSelection();
          onUpdateComplete?.();
        } else {
          throw new Error(response.message || "Bulk update failed");
        }
      } catch (error) {
        console.error("Bulk operation error:", error);
        onError?.(
          error instanceof Error
            ? error.message
            : "Failed to update transactions"
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [clearBulkSelection, onUpdateComplete, onError]
  );

  // Convenience methods for specific bulk operations
  const handleBulkTypeUpdate = useCallback(
    (type: BulkOperationType) => {
      if (!queryState.bulkSelection?.selectedIds?.length) return;

      let data = {};

      if (queryState.bulkSelection.isLabelBulk) {
        data = {
          ...data,
          label: queryState.bulkSelection.label,
        };
      }

      if (queryState.bulkSelection.isBusinessBulk) {
        data = {
          ...data,
          business: true,
        };
      }

      if (queryState.bulkSelection.isPersonalBulk) {
        data = {
          ...data,
          business: false,
        };
      }

      handleBulkOperation({
        transactionIds: queryState.bulkSelection.selectedIds,
        operation: type, // Using the passed type directly (BUSINESS or PERSONAL)
        data,
      });
    },
    [queryState.bulkSelection, handleBulkOperation]
  );

  const handleBulkLabelUpdate = useCallback(
    (label: string) => {
      if (!queryState.bulkSelection?.selectedIds?.length) return;

      handleBulkOperation({
        transactionIds: queryState.bulkSelection.selectedIds,
        operation: BulkOperationType.LABEL,
        data: { label },
      });
    },
    [queryState.bulkSelection, handleBulkOperation]
  );

  const handleBulkTagUpdate = useCallback(
    (tagId: number) => {
      if (!queryState.bulkSelection?.selectedIds?.length) return;

      handleBulkOperation({
        transactionIds: queryState.bulkSelection.selectedIds,
        operation: BulkOperationType.BUSINESS, // Will need to update this when you add TAG to enum
        data: { tagId },
      });
    },
    [queryState.bulkSelection, handleBulkOperation]
  );

  const handleBulkStatusUpdate = useCallback(
    (statusType: "flag" | "lock" | "hidden" | "split", value: boolean) => {
      if (!queryState.bulkSelection?.selectedIds?.length) return;

      handleBulkOperation({
        transactionIds: queryState.bulkSelection.selectedIds,
        operation: BulkOperationType.STATUS,
        data: { [statusType]: value },
      });
    },
    [queryState.bulkSelection, handleBulkOperation]
  );

  return {
    isUpdating,
    handleBulkOperationClick,
    clearBulkSelection,
    handleBulkTypeUpdate,
    handleBulkLabelUpdate,
    handleBulkTagUpdate,
    handleBulkStatusUpdate,
  };
};
