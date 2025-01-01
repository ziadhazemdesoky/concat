import React, { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { transactionsApi } from '../services/transactionsApi';
import { Transaction, TransactionQueryParams } from "../utils/types";

const IncomePage: React.FC = () => {  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const params: TransactionQueryParams = {}; // Simplified params without view filter
        const response = await transactionsApi.getIncomeTransactions(params);
        setTransactions(response.transactions);
      } catch (err) {
        setError('Failed to fetch income transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchIncome();
  }, []);

  const handleToggle = async (id: number) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
   
    
    const newIncome = !transaction.income;
    // deposit should always be true
    const newDeposit = true;  // <-- Fixed!
  
    setTransactions(prevData => {
      const updatedData = prevData.map(t =>
        t.id === id ? { 
          ...t, 
          income: newIncome,
          deposit: newDeposit 
        } : t
      );
      
      return updatedData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  
    try {
      await transactionsApi.updateCategory(
        id,
        {
          business: transaction.business,
          flag: false,
          lock: false,
          hidden: false,
          split: false,
          income: newIncome,
          deposit: newDeposit
        }
      );
    } catch (error) {
      console.error("Error updating income status:", error);
      setTransactions(prevData =>
        prevData.map(t =>
          t.id === id ? { 
            ...t, 
            income: transaction.income,
            deposit: transaction.deposit 
          } : t
        )
      );
    }
  };

  const handleLabelEdit = (id: number, currentLabel: string) => {
    setEditingLabel(id);
    setNewLabel(currentLabel);
  };
  
  const handleLabelSave = async () => {
    if (editingLabel === null) return;
    
    try {
      await transactionsApi.updateLabel(editingLabel, newLabel);
      setTransactions(prevData =>
        prevData.map(transaction =>
          transaction.id === editingLabel
            ? { ...transaction, custom: newLabel }
            : transaction
        )
      );
      setEditingLabel(null);
      setNewLabel("");
    } catch (error) {
      console.error("Error updating label:", error);
    }
  };

  const getTotal = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getIncomeTotal = () => {
    return transactions
      .filter(t => t.income)
      .reduce((sum, t) => sum + t.amount, 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getDepositTotal = () => {
    return transactions
      .filter(t => !t.income)
      .reduce((sum, t) => sum + t.amount, 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getTypeIndicator = (transaction: Transaction) => {
    if (transaction.income) {
      return (
        <div 
          className="      
          w-8 h-8 rounded-full border-4 border-sky-600 text-sky-600 flex items-center justify-center font-bold font-serif bg-white cursor-pointer hover:bg-sky-50"
          onClick={() => handleToggle(transaction.id)}
        >
          I
        </div>
      );
    }
    return (
      <div 
        className="w-8 h-8 rounded-full border-2 border-sky-300 text-sky-300 flex items-center justify-center font-bold bg-white cursor-pointer hover:bg-sky-50"
        onClick={() => handleToggle(transaction.id)}
      >
        D
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-pulse text-gray-500">Loading entries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-red-500">{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#4338CA]">Income & Deposits</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-sky-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Income</div>
            <div className="text-xl font-bold text-sky-700">
              ${getIncomeTotal()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Deposits</div>
            <div className="text-xl font-bold text-sky-300">
              ${getDepositTotal()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Combined Total</div>
            <div className="text-xl font-bold">
              ${getTotal()}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-semibold">Type</th>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-left font-semibold">Label</th>
                <th className="p-3 text-left font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} 
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      transaction.income ? 'bg-sky-50/30' : ''
                    }`}>
                  <td className="p-3">
                    {getTypeIndicator(transaction)}
                  </td>
                  <td className="p-3">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="p-3">
                    {editingLabel === transaction.id ? (
                      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                          <div className="text-center">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-2xl text-[#4338CA] font-bold">Edit Label</h3>
                              <button
                                onClick={() => setEditingLabel(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={newLabel}
                              onChange={(e) => setNewLabel(e.target.value)}
                              className="w-full px-3 py-2 border rounded mb-4"
                              placeholder="Edit label"
                              autoFocus
                            />
                            <button
                              onClick={handleLabelSave}
                              className="w-full px-4 py-2 bg-[#4338CA] text-white rounded hover:bg-[#3730A3]"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className={transaction.custom ? "underline underline-offset-4" : ""}>
                          <span className="relative group">
                            {transaction.custom || transaction.label}
                            {transaction.custom && (
                              <span className="absolute w-max left-0 bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 z-10">
                                {transaction.label}
                              </span>
                            )}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleLabelEdit(transaction.id, transaction.custom ?? transaction.label)}
                          className="ml-2 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="text-gray-400" size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className={`flex items-center ${transaction.income ? 'text-green-600' : ''}`}>
                      ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <p className="text-sm text-gray-500">Showing all entries</p>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;