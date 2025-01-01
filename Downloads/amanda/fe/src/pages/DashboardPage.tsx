import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import ContributionGrid from "../components/ContributionGrid";
import { transactionsApi } from '../services/transactionsApi';
import { taxYearApi } from '../services/taxYearApi';
import { Info, SquarePercent} from 'lucide-react';
import QuickGuide from "../components/QuickGuide";

interface DashboardStats {
  income: number;
  businessDeductions: number;
  personalDeductions: number;
  splitDeductions: number;
}

const DashboardPage: React.FC = () => {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [taxYear, setTaxYear] = useState<number>(0);
  const [stats, setStats] = useState<DashboardStats>({
    income: 0,
    businessDeductions: 0,
    personalDeductions: 0,
    splitDeductions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const taxYearResponse = await taxYearApi.get();
        setTaxYear(taxYearResponse.taxYear);

        const regularResponse = await transactionsApi.fetch({
          page: 1,
          itemsPerPage: 5000,
          sortColumn: "date",
          sortDirection: "desc"
        });

        const incomeResponse = await transactionsApi.getIncomeTransactions({});

        setTotalTransactions(regularResponse.totalRecords);

        const income = incomeResponse.transactions
          .filter(t => t.deposit && t.income)
          .reduce((sum, t) => sum + t.amount, 0);

        const businessDeductions = regularResponse.transactions
          .filter(t => t.business && !t.deposit && t.tagId !== null)
          .reduce((sum, t) => sum + t.amount, 0);

        const personalDeductions = regularResponse.transactions
          .filter(t => !t.business && !t.deposit && t.tagId !== null)
          .reduce((sum, t) => sum + t.amount, 0);

        const splitDeductions = regularResponse.transactions
          .filter(t => t.split)
          .reduce((sum, t) => sum + t.amount, 0);

        setStats({
          income,
          businessDeductions,
          personalDeductions,
          splitDeductions
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* First Column: Transaction Count & Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col mb-8">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">
                {isLoading ? "Loading..." : `${taxYear} Transactions`}
              </h2>
              <div className="text-5xl font-bold text-indigo-700 mb-2 items-center justifty-center">
                {isLoading ? "..." : totalTransactions.toLocaleString()}
              </div>
              <div className="text-lg text-gray-600 mb-6">transactions loaded</div>
              <div className="mt-6 text-center">
                <Link 
                  to="/upload" 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-indigo-700"
                >
                  UPLOAD CSVs
             
              </Link>
            </div>
            </div>
            <h4 className="text-2xl font-bold mb-6 text-indigo-700">To-Dos</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Link to="/expenses" className="flex items-center justify-between w-full group">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-4 border-blue-700 text-blue-700 flex items-center justify-center font-bold bg-white z-10">B</div>
                      <div className="w-8 h-8 rounded-full border-4 border-green-700 text-green-700 flex items-center justify-center font-bold bg-white">P</div>
                    </div>
                    <span className="text-indigo-700 group-hover:text-indigo-900">Categorize Your Expenses and Tag Deductions</span>
                  </div>
                  <div className="relative">
                    <Info className="w-5 h-5 text-gray-400 hover:text-indigo-600" />
                    <div className="absolute right-0 mt-2 w-64 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible hover:opacity-100 hover:visible transition-all z-10">
                      Classify your expenses as business or personal and organize them with tags
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Link to="/income" className="flex items-center justify-between w-full group">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-sky-300 text-sky-300 flex items-center justify-center font-bold bg-white z-10">D</div>
                      <div className="w-8 h-8 rounded-full border-4 border-sky-600 text-sky-600 flex items-center justify-center font-bold bg-white font-serif">I</div>
                    </div>
                    <span className="text-indigo-700 group-hover:text-indigo-900">Categorize Your Income</span>
                  </div>
                  <div className="relative">
                    <Info className="w-5 h-5 text-gray-400 hover:text-indigo-600" />
                    <div className="absolute right-0 mt-2 w-64 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible hover:opacity-100 hover:visible transition-all z-10">
                      Mark your deposits and income sources for accurate income tracking
                    </div>
                  </div>
                </Link>
              </div>

              <div className="mt-6 text-center">
                <Link 
                  to="/report" 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  VIEW ACCOUNTANT REPORTS
                </Link>
              </div>
            </div>
          </div>

          {/* Second Column: Tax Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">Tax Summary</h2>
            <div className="space-y-4">
              <div className="bg-sky-50 p-4 rounded shadow">
                <div className="text-gray-600 flex">
                  <div className="w-8 h-8 mx-2 rounded-full border-4 border-sky-600 text-sky-600 flex items-center justify-center font-bold bg-white font-serif">I</div>
                  Total Income 
                </div>
                <div className="text-2xl mx-10 font-bold">
                  ${stats.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="bg-blue-100 p-4 rounded shadow">
                <div className="text-gray-600 flex">
                  <div className="w-8 h-8 mx-2 rounded-full border-4 border-blue-700 text-blue-700 flex items-center justify-center font-bold bg-white">
                    B
                  </div>
                  Total Business Deductions
                </div>
                <div className="text-2xl mx-10 font-bold">
                  ${stats.businessDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="bg-green-100 p-4 rounded shadow">
                <div className="text-gray-600 flex">
                  <div className="w-8 h-8 mx-2 rounded-full border-4 border-green-700 text-green-700 flex items-center justify-center font-bold bg-white">
                    P
                  </div>
                  Total Personal Deductions
                </div>
                <div className="text-2xl mx-10 font-bold">
                  ${stats.personalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded shadow">
                <div className="text-gray-600 flex items-center">
                  <div className="w-8 h-8 mx-2 border-indigo-700 flex items-center justify-center bg-white">
                    <SquarePercent className="w-5 h-5 text-indigo-700" />
                  </div>
                  Split Deductions
                </div>
                <div className="text-2xl mx-10 font-bold text-indigo-700">
                  ${(stats.splitDeductions || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          <QuickGuide />

        </div>

        {/* Bottom Row: Contribution Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {!isLoading && taxYear ? (
            <ContributionGrid />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Loading activity data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;