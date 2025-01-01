import { useState, useEffect } from 'react';
import { uploadcsvfile } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Bank } from "../utils/types";
import { banksApi } from "../services/banksApi";
import {
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";

const UploadPage = () => {
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [accountType, setAccountType] = useState<"bank" | "credit">("bank");
  const [transactionType, setTransactionType] = useState<"personal" | "business">("personal");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedTransactions, setUploadedTransactions] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    banksApi.getAll()
      .then(response => {
        if (response.status === 'success' && response.data) {
          setBanks(response.data);
        }
      })
      .catch(() => setError("Error loading banks"));
  }, []);

  const handleReset = () => {
    setSelectedBankId(null);
    setFile(null);
    setUploadedTransactions(0);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !selectedBankId) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      const data = await uploadcsvfile(file, selectedBankId, accountType, transactionType);
      if (data.status === "success") {
        setUploadedTransactions(data.uploadedRows);
        setError(null);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setError((err as Error).message || "Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFile(e.target.files ? e.target.files[0] : null);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md space-y-4">
          <div className="inline-block bg-sky-50 rounded px-3 py-5 w-full">
            <h3 className="text-2xl font-bold text-gray-800 text-center">
              Upload CSV File
            </h3>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {uploadedTransactions > 0 ? (
            <div className="p-6">
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-800 text-center mb-2">
                  Success! {uploadedTransactions} Transactions Loaded
                </h2>
                <p className="text-center text-green-600">
                  Your transactions have been uploaded successfully.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  onClick={handleReset}
                >
                  Upload Another File
                </button>
                <button
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  onClick={() => navigate('/transactions')}
                >
                  View Transactions
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="my-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Select your bank:
                  </label>
                  <Select value={selectedBankId?.toString() || ''} onValueChange={(value) => setSelectedBankId(Number(value))}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select a bank..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {banks.map(bank => (
                        <SelectItem key={bank.id} value={bank.id.toString()}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              <div className="my-6">
                <label className="block text-gray-700 font-medium mb-2">
                  What type of account is this?
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="bank"
                      checked={accountType === "bank"}
                      onChange={(e) => setAccountType(e.target.value as "bank" | "credit")}
                      className="mr-2"
                    />
                    Bank Account
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="credit"
                      checked={accountType === "credit"}
                      onChange={(e) => setAccountType(e.target.value as "bank" | "credit")}
                      className="mr-2"
                    />
                    Credit Card
                  </label>
                </div>
              </div>

              <div className="my-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Most of these transactions are:
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="transactionType"
                      value="personal"
                      checked={transactionType === "personal"}
                      onChange={(e) => setTransactionType(e.target.value as "personal" | "business")}
                      className="mr-2"
                    />
                    Personal
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="transactionType"
                      value="business"
                      checked={transactionType === "business"}
                      onChange={(e) => setTransactionType(e.target.value as "personal" | "business")}
                      className="mr-2"
                    />
                    Business
                  </label>
                </div>
              </div>

              <div className="flex gap-4 my-6">
                <input
                  type="file"
                  accept=".csv"
                  className="flex-1 file:mr-4 file:py-2 file:px-4 
                    file:rounded-md file:border-0 
                    file:text-gray-700 file:bg-gray-200 
                    file:hover:bg-gray-300
                    hover:cursor-pointer
                    text-gray-700"
                  name="file"
                  onChange={handleFileChange}
                />
                <button
                  className={`flex-1 px-6 py-2 rounded-md transition-colors ${
                    isLoading || !file || !selectedBankId
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#4338ca] hover:bg-[#3730a3]'
                  } text-white`}
                  disabled={isLoading || !file || !selectedBankId}
                  onClick={handleUpload}
                >
                  {isLoading ? 'Uploading...' : 'UPLOAD'}
                </button>
              </div>
              

              {!file && selectedBankId && (
                <p className="text-sm text-gray-500 text-center">
                  Please select a CSV file to upload
                </p>
              )}
              {!selectedBankId && file && (
                <p className="text-sm text-gray-500 text-center">
                  Please select a bank
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;