import { useState, useEffect } from 'react';
import { Transaction, TransactionTag } from '../utils/types';
import { transactionsApi } from '../services/transactionsApi';
import { businessPercentageApi } from '../services/businessPercentageApi';

type ReportType = 'business' | 'personal' | 'split';
type TransactionType = 'Income' | 'Expenses';

interface TagGroup {
  tag: TransactionTag | null;
  transactions: Transaction[];
  total: number;
}

const ReportPage = () => {
  const [rowData, setRowData] = useState<Transaction[]>([]);
  const [incomeData, setIncomeData] = useState<Transaction[]>([]);
  const [businessPercentage, setBusinessPercentage] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ReportType>('business');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transResponse, incomeResponse, percentageResponse] = await Promise.all([
        transactionsApi.fetch({ page: 1, itemsPerPage: 3000 }),
        transactionsApi.getIncomeTransactions({}),
        businessPercentageApi.get()
      ]);
      
      if (transResponse?.transactions) setRowData(transResponse.transactions);
      if (incomeResponse?.transactions) setIncomeData(incomeResponse.transactions);
      if (percentageResponse?.status === 'success' && percentageResponse.data) {
        setBusinessPercentage(percentageResponse.data.businessPercentage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getFilteredTransactions = () => {
    if (activeFilter === 'split') {
      return {
        income: [],
        expense: rowData.filter(t => t.split)
      };
    }

    return {
      income: activeFilter === 'business' ? 
        incomeData.filter(t => t.deposit && t.income && !t.hidden) : [],
      expense: rowData.filter(t => {
        if (activeFilter === 'business') {
          return t.business && !t.deposit && !t.split && !t.hidden;
        }
        return !t.business && !t.deposit && !t.split && !t.hidden;
      })
    };
  };

  const groupExpensesByTag = (transactions: Transaction[]): TagGroup[] => {
    const groups: { [key: string]: TagGroup } = {
      'untagged': { tag: null, transactions: [], total: 0 }
    };

    transactions.forEach(transaction => {
      const tagKey = transaction.tag ? String(transaction.tag.id) : 'untagged';
      if (!groups[tagKey]) {
        groups[tagKey] = {
          tag: transaction.tag,
          transactions: [],
          total: 0
        };
      }
      groups[tagKey].transactions.push(transaction);
      groups[tagKey].total += transaction.amount;
    });

    return Object.values(groups)
      .sort((a, b) => b.total - a.total);
  };

  const exportToCSV = (transactions: Transaction[], type: TransactionType, tagName?: string): void => {
    const now = new Date().toLocaleString();
    const reportName = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
    const fileName = tagName 
      ? `${reportName}_${type}_${tagName}_${new Date().toISOString().split('T')[0]}.csv`
      : `${reportName}_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    
    const csvHeader = [
      `Report: ${reportName}`,
      `Type: ${type}`,
      tagName ? `Deduction: ${tagName}` : '',
      `Export Date: ${now}`,
      `Generated By: CanCat Finance - visit CanCat.io for more detail`,
      '',
      activeFilter === 'split' 
        ? 'Date,Label,Amount,Percentage,Deduction Amount,Flag'
        : 'Date,Label,Amount,Type,Flag',
      ''
    ].filter(Boolean).join('\n');
  
    const csvRows = transactions.map(t => {
      const date = new Date(t.date).toLocaleDateString();
      const label = t.custom ? `${t.custom} (${t.label})` : t.label;
      const cleanLabel = label.replace(/,/g, ' ');
      const amount = t.amount.toFixed(2);
      const flag = t.flag ? 'Flag' : '';
      
      if (activeFilter === 'split') {
        const percentage = businessPercentage || 10;
        const deductionAmount = (t.amount * percentage / 100).toFixed(2);
        return `${date},${cleanLabel},${amount},${percentage}%,${deductionAmount},${flag}`;
      }
      
      const transactionType = t.income ? 'Income' : 'Expense';
      return `${date},${cleanLabel},${amount},${transactionType},${flag}`;
    });

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalDeduction = activeFilter === 'split' 
      ? (total * (businessPercentage || 10) / 100) 
      : total;
    
    const csvFooter = [
      '',
      `Subtotal,${total.toFixed(2)}`,
      activeFilter === 'split' ? `Total Deduction Amount,${totalDeduction.toFixed(2)}` : ''
    ].filter(Boolean).join('\n');
    
    const csvContent = `${csvHeader}\n${csvRows.join('\n')}\n${csvFooter}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderTransactionGroup = (transactions: Transaction[], title: TransactionType, showTags: boolean = false) => {
    if (!transactions.length) return null;

    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (!showTags) {
      return (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {title} ({transactions.length} transactions)
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">
                Total: ${transactions.reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <button
                onClick={() => exportToCSV(sortedTransactions, title)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Export Income Report
              </button>
            </div>
          </div>
          {renderTransactionTable(sortedTransactions)}
        </div>
      );
    }

    const tagGroups = groupExpensesByTag(sortedTransactions);

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            {title}
          </h3>
          <button
            onClick={() => exportToCSV(sortedTransactions, title)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Export Report
          </button>
        </div>
        
        {tagGroups.map((group) => (
          <div key={group.tag?.id || 'untagged'} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-600">
                {group.tag?.name || 'Untagged'} 
              </h4>
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  ${group.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => exportToCSV(group.transactions, title, group.tag?.name || 'Untagged')}
                  className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Export
                </button>
              </div>
            </div>
            {renderTransactionTable(group.transactions)}
          </div>
        ))}
      </div>
    );
  };

  const renderTransactionTable = (transactions: Transaction[]) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left font-semibold">Date</th>
            <th className="p-3 text-left font-semibold">Label</th>
            <th className="p-3 text-left font-semibold">Amount</th>
            {activeFilter === 'split' && (
              <>
                <th className="p-3 text-left font-semibold">Percentage</th>
                <th className="p-3 text-left font-semibold">Deduction Amount</th>
              </>
            )}
            <th className="p-3 text-left font-semibold"> </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="p-3">
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
              </td>
              <td className="p-3">
                <span className={transaction.income ? 'text-green-600' : ''}>
                  ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </td>
              {activeFilter === 'split' && (
                <>
                  <td className="p-3">{businessPercentage || 10}%</td>
                  <td className="p-3">
                    ${((transaction.amount * (businessPercentage || 10)) / 100)
                      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </>
              )}
              <td className="p-3 text-sm text-gray-600">
                {transaction.flag ? 'FLAG' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const groupedTransactions = getFilteredTransactions();

  return (
    <div className="container mx-auto px-4 py-8 w-1/2">
      <h1 className="text-3xl font-bold text-center mb-2">Accounting Reports</h1>
      <p className="text-gray-600 text-center mb-6">Download these reports and email them to your accountant</p>
      
      <div className="flex justify-center mb-6">
        <nav className="flex space-x-2 bg-white rounded-lg p-1 shadow">
          {(['business', 'personal', 'split'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-md text-sm font-medium capitalize
                ${activeFilter === filter 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              {filter}
            </button>
          ))}
        </nav>
      </div>
  
      <div className="w-full p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">
          {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Deductions Report
        </h2>
        {activeFilter === 'split' && (
          <p className="text-gray-600 mb-4 italic">
            You can change the % to adjust deductions as needed
          </p>
        )}
        
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {activeFilter === 'business' && (
                <div className="bg-sky-50 p-4 rounded shadow">
                  <div className="text-gray-600 flex">
                    <div className="w-8 h-8 mx-2 rounded-full border-4 border-sky-600 text-sky-600 flex items-center justify-center font-bold bg-white font-serif">I</div>
                    Total Income 
                  </div>
                  <div className="text-2xl mx-10 font-bold">
                    ${groupedTransactions.income
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString('en-US', { minimumFractionDigits: 2,
                        maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}
              {activeFilter !== 'split' && (
                <div className={`bg-blue-100 p-4 rounded shadow ${activeFilter === 'personal' ? 'col-span-2' : ''}`}>
                  <div className="text-gray-600 flex">
                    <div className={`w-8 h-8 mx-2 rounded-full border-4 ${
                      activeFilter === 'business' ? 'border-blue-700 text-blue-700' : 'border-green-700 text-green-700'
                    } flex items-center justify-center font-bold bg-white`}>
                      {activeFilter === 'business' ? 'B' : 'P'}
                    </div>
                    Total {activeFilter === 'business' ? 'Business' : 'Personal'} Deductions
                  </div>
                  <div className="text-2xl mx-10 font-bold">
                    ${groupedTransactions.expense
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}
            </div>
  
            {activeFilter === 'business' && renderTransactionGroup(groupedTransactions.income, 'Income')}
            {renderTransactionGroup(groupedTransactions.expense, 'Expenses', true)}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportPage;