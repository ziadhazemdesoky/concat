import React, { useState } from "react";
import { X } from "lucide-react";
import { Card } from "./ui/Card";
import { BulkOperationType } from "../utils/types";
import { Pencil } from "lucide-react";
import { TransactionQueryState } from "../utils/types";

export interface BulkUpdaterProps {
  selectedCount: number;
  onBulkUpdateClick: (
    type: BulkOperationType,
    value: boolean,
    data?: string
  ) => void;
  onUpdate: () => void;
  isUpdating: boolean;
  currentSelectedType?: BulkOperationType;
  onClear?: () => void;
  onBulkLabelSubmit: (label: string) => void;
  queryState: TransactionQueryState;
}

export const BulkUpdater: React.FC<BulkUpdaterProps> = ({
  selectedCount,
  onBulkUpdateClick,
  onUpdate,
  isUpdating,
  currentSelectedType,
  onClear,
  queryState,
}) => {
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [label, setLabel] = useState("");

  const handleOperationClick = (type: BulkOperationType) => {
    switch (type) {
      case "LABEL":
        onBulkUpdateClick(type, !queryState.bulkSelection?.isLabelBulk);
        break;
      case "BUSINESS":
        onBulkUpdateClick(type, !queryState.bulkSelection?.isBusinessBulk);
        break;
      case "PERSONAL":
        onBulkUpdateClick(type, !queryState.bulkSelection?.isPersonalBulk);
        break;
      case "TAG":
        onBulkUpdateClick(type, !queryState.bulkSelection?.isTagBulk);
        break;
      case "CATEGORY":
        onBulkUpdateClick(type, !queryState.bulkSelection?.isCategoryBulk);
        break;
      case "STATUS":
        onBulkUpdateClick(type, !queryState.bulkSelection?.isStatusBulk);
        break;

      default:
        break;
    }
  };

  const bulkLabelEdit = () => {
    setShowLabelInput(true);
    onBulkUpdateClick(BulkOperationType.LABEL, true);
  };

  const bulkLabelSubmit = () => {
    if (label.trim()) {
      onBulkUpdateClick(BulkOperationType.LABEL, true, label);
      // onBulkLabelSubmit(label.trim());
      setLabel("");
      setShowLabelInput(false);
    }
  };

  return (
    <Card className="p-4 mt-4">
      <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-[#4338CA] mb-4">Bulk Update</h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleOperationClick(BulkOperationType.PERSONAL)}
            disabled={isUpdating || showLabelInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-4
              ${
                queryState.bulkSelection?.isPersonalBulk
                  ? "border-green-700 text-green-700"
                  : "border-gray-300 text-gray-400 hover:bg-gray-50"
              } 
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            P
          </button>
          <button
            onClick={() => handleOperationClick(BulkOperationType.BUSINESS)}
            disabled={isUpdating || showLabelInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-4
              ${
                queryState.bulkSelection?.isBusinessBulk
                  ? "border-blue-700 text-blue-700"
                  : "border-gray-300 text-gray-400 hover:bg-gray-50"
              } 
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            B
          </button>
          {!showLabelInput && (
            <button
              onClick={bulkLabelEdit}
              disabled={isUpdating}
              className={`flex items-center gap-2 px-4 py-2 border-2
                ${
                  queryState.bulkSelection?.isLabelBulk
                    ? "border-blue-500 text-blue-600"
                    : "border-gray-400 text-gray-600"
                } 
                rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Pencil className="w-4 h-4" />
              Edit Label
            </button>
          )}
        </div>

        {selectedCount > 0 && (
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              {selectedCount} transaction{selectedCount !== 1 ? "s" : ""}{" "}
              selected
            </span>
            {onClear && (
              <button
                onClick={onClear}
                className="text-red-500 hover:text-red-700"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {showLabelInput && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter new label"
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 
                focus:outline-none flex-grow"
              autoFocus
            />
            <button
              onClick={bulkLabelSubmit}
              disabled={isUpdating || !label.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
              SAVE
            </button>
            <button
              onClick={() => {
                setShowLabelInput(false);
                setLabel("");
                onClear?.();
              }}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Cancel Edit
            </button>
          </div>
        )}

        {queryState?.bulkSelection?.isLabelBulk &&
          !!queryState.bulkSelection.label?.length && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.5rem",
              }}
            >
              <p>{queryState.bulkSelection.label}</p>
              <X
                size={16}
                className="text-gray-500 cursor-pointer"
                onClick={() => {
                  onBulkUpdateClick(BulkOperationType.LABEL, false, "");
                }}
              />
            </div>
          )}

        {!showLabelInput && (
          <button
            onClick={onUpdate}
            disabled={isUpdating || !currentSelectedType || selectedCount <= 0}
            className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-blue-700 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "BULK UPDATE"}
          </button>
        )}
      </div>
    </Card>
  );
};

export default BulkUpdater;