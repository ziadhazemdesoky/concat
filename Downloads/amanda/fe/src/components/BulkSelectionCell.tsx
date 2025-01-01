import React from "react";
import { TransactionQueryState, BulkOperationType } from "../utils/types";

interface BulkSelectionCellProps {
  transactionId: number;
  isLocked: boolean;
  isBusiness: boolean;
  queryState: TransactionQueryState;
  bulkLabelEdit: boolean;
  onChange: (updates: Partial<TransactionQueryState>) => void;
}

export const BulkSelectionCell: React.FC<BulkSelectionCellProps> = ({
  transactionId,
  isLocked,
  isBusiness,
  queryState,
  bulkLabelEdit,
  onChange,
}) => {
  // Always render to maintain table structure
  const showCheckbox = queryState.bulkSelection?.targetType || bulkLabelEdit;

  const isEligible = () => {
    if (isLocked) return false;

    // Label edit is always eligible unless locked
    if (bulkLabelEdit) return true;

    // Handle business/personal conversion eligibility
    const hasTypeOperation =
      queryState.bulkSelection?.targetType === BulkOperationType.BUSINESS ||
      queryState.bulkSelection?.targetType === BulkOperationType.PERSONAL;

    if (hasTypeOperation) {
      if (queryState.bulkSelection?.targetType === BulkOperationType.BUSINESS) {
        return !isBusiness;
      }
      if (queryState.bulkSelection?.targetType === BulkOperationType.PERSONAL) {
        return isBusiness;
      }
    }

    return true;
  };

  const isSelected =
    queryState.bulkSelection?.selectedIds?.includes(transactionId);
  const eligible = isEligible();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedIds = queryState.bulkSelection?.selectedIds || [];
    const newSelectedIds = e.target.checked
      ? [...selectedIds, transactionId]
      : selectedIds.filter((id) => id !== transactionId);

    onChange({
      ...queryState,
      bulkSelection: {
        ...queryState.bulkSelection,
        targetType: queryState.bulkSelection?.targetType,
        selectedIds: newSelectedIds,
      },
    });
  };

  return (
    <td className="p-3">
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          disabled={!eligible}
          onChange={handleChange}
          className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500
          ${!eligible ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      )}
    </td>
  );
};

export default BulkSelectionCell;
