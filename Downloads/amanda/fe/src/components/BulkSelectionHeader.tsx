// BulkSelectionHeader.tsx
import React from "react";
import {
  TransactionQueryState,
  BulkOperationType,
  Transaction,
} from "../utils/types";

interface BulkSelectionHeaderProps {
  rowData: Transaction[];
  queryState: TransactionQueryState;
  bulkLabelEdit: boolean;
  onChange: (updates: Partial<TransactionQueryState>) => void;
}

export const BulkSelectionHeader: React.FC<BulkSelectionHeaderProps> = ({
  rowData,
  queryState,
  bulkLabelEdit,
  onChange,
}) => {
  const showCheckbox = queryState.bulkSelection?.targetType || bulkLabelEdit;

  const eligibleTransactions = rowData.filter((t) => {
    if (t.lock) return false;
    if (bulkLabelEdit) return true;

    const hasTypeOperation =
      queryState.bulkSelection?.targetType === BulkOperationType.BUSINESS ||
      queryState.bulkSelection?.targetType === BulkOperationType.PERSONAL;

    if (hasTypeOperation) {
      if (queryState.bulkSelection?.targetType === BulkOperationType.BUSINESS) {
        return !t.business;
      }
      if (queryState.bulkSelection?.targetType === BulkOperationType.PERSONAL) {
        return t.business;
      }
    }

    return true;
  });

  return (
    <th className="p-3 text-left">
      {showCheckbox && (
        <input
          type="checkbox"
          checked={
            rowData.length > 0 &&
            queryState.bulkSelection?.selectedIds?.length ===
              eligibleTransactions.length
          }
          onChange={(e) =>
            onChange({
              ...queryState,
              bulkSelection: {
                ...queryState.bulkSelection,
                targetType: queryState.bulkSelection?.targetType,
                selectedIds: e.target.checked
                  ? eligibleTransactions.map((t) => t.id)
                  : [],
              },
            })
          }
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      )}
    </th>
  );
};

export default BulkSelectionHeader;
