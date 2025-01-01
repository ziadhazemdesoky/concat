
import { Flag, EyeOff, Lock, Pencil, SquarePercent, History } from "lucide-react";

const HelpPage = () => {
  return (
    <div className="bg-gray-200 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4338ca] mb-2">Help Center</h1>
          <p className="text-gray-600">Find answers to common questions about using CanCat</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Transaction Icons Guide</h2>
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full border-4 border-blue-700 text-blue-700 flex items-center justify-center font-bold bg-white">B</div>
              <div className="w-8 h-8 rounded-full border-4 border-green-700 text-green-700 flex items-center justify-center font-bold bg-white">P</div>
              <div>
                <p className="font-medium">Business vs Personal</p>
                <p className="text-sm text-gray-600">Switch between business and personal transaction categories</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full border-2 border-sky-300 text-sky-300 flex items-center justify-center font-bold bg-white">D</div>
              <div className="w-8 h-8 rounded-full border-4 border-sky-600 text-sky-600 flex items-center justify-center font-bold bg-white font-serif">I</div>
              <div>
                <p className="font-medium">Deposit vs Income</p>
                <p className="text-sm text-gray-600">Switch between business and personal transaction categories</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <SquarePercent className="text-indigo-700 w-8 h-8  rounded-lg" />
              <div>
                <p className="font-medium">Split/Partial Transaction</p>
                <p className="text-sm text-gray-600">Mark transactions where a percentage qualifies as business deduction.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 ">
              <div className="flex gap-2">
                <EyeOff className="text-orange-300 border-orange-300 bg-orange-50 p-1 w-6 h-6 border-2 rounded-lg" />
              </div>
              <div>
                <p className="font-medium">Hide Transaction</p>
                <p className="text-sm text-gray-600">Show or hide transactions from your main view</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50  ">
              <Flag className="text-red-400  border-red-300 bg-red-50 p-1 w-6 h-6 border-2 rounded-lg" />
              <div>
                <p className="font-medium">Flag for Review</p>
                <p className="text-sm text-gray-600">Mark transactions that you need to return to or ask your accountant</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2">
                <Lock className="text-yellow-700  border-yellow-700 bg-yellow-50 p-1 w-6 h-6 border-2 rounded-lg" />
              </div>
              <div>
                <p className="font-medium">Lock</p>
                <p className="text-sm text-gray-600">Prevent or allow modifications to transaction details</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Pencil size={20} className="text-zinc-500  border-zinc-500  bg-zinc-50 p-1 w-6 h-6 border-2 rounded-lg" />
              <div>
                <p className="font-medium">Edit Label</p>
                <p className="text-sm text-gray-600">Modify the transaction description or label</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <History className="text-zinc-700  border-zinc-700 bg-indigo-50 p-1 w-6 h-6 border-2 rounded-lg" />
              <div>
                <p className="font-medium">Transaction History</p>
                <p className="text-sm text-gray-600">View the change history for this transaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-gray-600">support@cancat.com</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600">Monday - Friday, 9am - 5pm EST</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">How do I categorize transactions?</span>
              </summary>
              <div className="p-4 text-gray-600">
                Use the Business/Personal toggle to set the main category, then add specific tags for detailed categorization. You can also split transactions between categories if needed.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">How do I mark transactions for my accountant?</span>
              </summary>
              <div className="p-4 text-gray-600">
                Use the flag icon to mark transactions that need your accountant's attention. You can also add notes and track any changes through the history feature.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Can I protect sensitive transactions?</span>
              </summary>
              <div className="p-4 text-gray-600">
                Yes! Use the lock icon to prevent accidental changes, and the visibility toggle to hide sensitive transactions from the main view.
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;