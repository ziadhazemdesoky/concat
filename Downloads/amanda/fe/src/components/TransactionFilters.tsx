import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { TransactionQueryState, TransactionType } from "../utils/types";

interface TransactionFiltersProps {
  queryState: TransactionQueryState;
  onChange: (state: Partial<TransactionQueryState>) => void;
  onError: (error: string | null) => void;
  className?: string;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  queryState,
  onChange,
  onError,
  className = ""
}) => {
  const [localKeyword, setLocalKeyword] = useState(queryState.filters.search || "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(localKeyword);
  const [localMonth, setLocalMonth] = useState(queryState.filters.month || "");
  const [amount, setAmount] = useState({
    min: queryState.filters.minAmount?.toString() || "",
    max: queryState.filters.maxAmount?.toString() || ""
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);


  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];


  const amountOptions = [
    { value: "", label: "Any Amount" },
    { value: "10", label: "$10" },
    { value: "25", label: "$25" },
    { value: "50", label: "$50" },
    { value: "100", label: "$100" },
    { value: "250", label: "$250" },
    { value: "500", label: "$500" },
    { value: "1000", label: "$1,000" },
    { value: "10000", label: "$10,000" },
    { value: "50000", label: "$50,000" }
  ];

  // Debounce the local keyword changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(localKeyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [localKeyword]);

  // Only apply the filter when the debounced value changes
  useEffect(() => {
    if (debouncedKeyword !== queryState.filters.search) {
      applyFilters({ search: debouncedKeyword || undefined });
    }
  }, [debouncedKeyword]);

  // Update local state when query state changes
  useEffect(() => {
    setLocalKeyword(queryState.filters.search || "");
    setLocalMonth(queryState.filters.month || "");
    setAmount({
      min: queryState.filters.minAmount?.toString() || "",
      max: queryState.filters.maxAmount?.toString() || ""
    });
  }, [queryState.filters]);

  const applyFilters = useCallback((updates: Partial<TransactionQueryState['filters']> = {}) => {
    const newFilters = {
      ...queryState.filters,
      ...updates
    };

    // Clean up empty values
    Object.keys(newFilters).forEach(key => {
      const value = newFilters[key as keyof typeof newFilters];
      if (value === undefined || value === '') {
        delete newFilters[key as keyof typeof newFilters];
      }
    });

    // Validate amount range
    if (newFilters.minAmount && newFilters.maxAmount &&
      Number(newFilters.minAmount) > Number(newFilters.maxAmount)) {
      onError("Minimum amount cannot be greater than maximum amount");
      return;
    }

    onError(null);
    onChange({
      ...queryState,
      filters: newFilters
    });
  }, [queryState, onChange, onError]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalMonth(value);
    applyFilters({ month: value || undefined });
  };

  const handleTypeChange = useCallback((type: TransactionType) => {
    onChange({
      ...queryState,
      transactionType: queryState.transactionType === type ? undefined : type
    });
  }, [queryState, onChange]);

  const handleReset = useCallback(() => {
    // Reset all local state
    setLocalKeyword("");
    setDebouncedKeyword("");
    setLocalMonth("");
    setAmount({ min: "", max: "" });
    
    // Reset query state
    onChange({
      ...queryState,
      transactionType: undefined,
      filters: {
        search: undefined,
        minAmount: undefined,
        maxAmount: undefined,
        month: undefined
      }
    });
    
    onError(null);
  }, [queryState, onChange, onError]);

const hasActiveFilters = localKeyword || amount.min || amount.max || queryState.filters.month || queryState.transactionType;

  // Mobile filter badges display helper
  const getActiveFilterCount = () => {
    let count = 0;
    if (localKeyword) count++;
    if (amount.min || amount.max) count++;
    if (queryState.filters.month) count++;
    if (queryState.transactionType) count++;
    return count;
  };

  return (
    <>
      {/* Mobile Filters Bar */}
      <div className="md:hidden bg-white shadow-sm mb-4 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 text-gray-600"
          >
            FI
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-sm">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Mobile Filters Dropdown */}
        {isMobileFiltersOpen && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => handleTypeChange(TransactionType.PERSONAL)}
                className={`px-3 py-1 rounded-full border ${
                  queryState.transactionType === TransactionType.PERSONAL
                    ? 'bg-green-50 text-green-700 border-green-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => handleTypeChange(TransactionType.BUSINESS)}
                className={`px-3 py-1 rounded-full border ${
                  queryState.transactionType === TransactionType.BUSINESS
                    ? 'bg-blue-50 text-blue-700 border-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Business
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* Month and Amount Selectors */}
            <div className="flex gap-2">
              <select
                value={localMonth}
                onChange={handleMonthChange}
                className="w-1/2 px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Months</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <select
                value={amount.min}
                onChange={(e) => {
                  const value = e.target.value;
                  setAmount(prev => ({ ...prev, min: value }));
                  applyFilters({
                    minAmount: value ? parseFloat(value) : undefined,
                    maxAmount: amount.max ? parseFloat(amount.max) : undefined
                  });
                }}
                className="w-1/2 px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Min Amount</option>
                {amountOptions.slice(1).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar Filters - hide on mobile */}
      <div className={`hidden md:block w-full bg-white rounded shadow p-4 ${className}`}>
        <h2 className="text-lg font-semibold text-[#4338CA] mb-4">Filters</h2>
        
        {/* Transaction Type Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleTypeChange(TransactionType.PERSONAL)}
            className={`w-12 h-12 text-xl rounded-full border-4 ${
              queryState.transactionType === TransactionType.PERSONAL
                ? 'bg-green-50 text-green-700 font-bold border-green-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            P
          </button>
          <button
            onClick={() => handleTypeChange(TransactionType.BUSINESS)} 
            className={`w-12 h-12 text-xl rounded-full border-4 ${
              queryState.transactionType === TransactionType.BUSINESS
                ? 'text-blue-600 font-bold border-blue-600 bg-blue-50'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            B
          </button>
        </div>

        <div className="space-y-4">
          {/* Keyword Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Transactions
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by label..."
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={localMonth}
              onChange={handleMonthChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Range
            </label>
            <div>
              <div className="flex items-center gap-2">
                <select
                  value={amount.min}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAmount(prev => ({ ...prev, min: value }));
                    applyFilters({ 
                      ...queryState.filters,
                      minAmount: value ? parseFloat(value) : undefined,
                      maxAmount: amount.max ? parseFloat(amount.max) : undefined
                    });
                  }}
                  className="w-1/2 px-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Min Amount</option>
                  {amountOptions.slice(1).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="text-gray-500">to</span>
                <select
                  value={amount.max}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAmount(prev => ({ ...prev, max: value }));
                    applyFilters({ 
                      ...queryState.filters,
                      minAmount: amount.min ? parseFloat(amount.min) : undefined,
                      maxAmount: value ? parseFloat(value) : undefined
                    });
                  }}
                  className="w-1/2 px-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Max Amount</option>
                  {amountOptions.slice(1).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="w-full mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Reset Filters
              </button>
            )}
       </div>
        </div>
      </div>
    </>
  );
};

export default TransactionFilters;