import React, { useEffect, useState } from "react";
import { taxYearApi } from '../services/taxYearApi';

const TaxYearSelection: React.FC = () => {
const [taxYear, setTaxYear] = useState(new Date().getFullYear());
const [step, setStep] = useState(1);


useEffect(() => {
  taxYearApi.get()
    .then((data) => setTaxYear(data.taxYear))
    .catch((error) => console.error("Error fetching tax year:", error));
}, []);

const onClickUpdateYear = () => {
  taxYearApi.update(taxYear)
    .then(() => {
      console.log("Tax year updated successfully");
      setStep(2);
    })
    .catch((error) => console.error("Error updating tax year:", error));
};

 const renderTaxYearStep = () => (
   <div className="flex flex-col bg-white rounded-lg shadow-md p-8 m-8 w-1/2 items-center justify-center">
     <h2 className="text-2xl font-bold text-center text-[#4338ca] p-8 mb-6">
       Confirm Your Tax Year
     </h2>
     <div className="flex gap-4 justify-center">
       <input
         type="number"
         value={taxYear}
         onChange={(e) => setTaxYear(Number(e.target.value))}
         className="w-32 px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4338ca] focus:border-transparent"
       />
       <button
         className="bg-[#4338ca] text-white px-6 py-2 rounded-md hover:bg-[#3730a3] transition-colors"
         onClick={onClickUpdateYear}
       >
         UPDATE
       </button>
     </div>
   </div>
 );

 const renderImportStep = () => (
   <div className="w-full space-y-6 p-8">
     <h2 className="text-2xl font-bold text-[#4338ca] mb-2">
       Import your {taxYear} transactions
       <span className="text-sm text-gray-800 underline">
         (<a href="/dashboard">skip / next</a>)
       </span>
     </h2>
     <div className="bg-white rounded-lg shadow-md p-8">
       <h3 className="text-2xl font-bold text-gray-800 text-center">
         Coming soon
       </h3>
     </div>
   </div>
 );

 return (
   <div className="w-full bg-gray-100 p-6 flex items-center">
     <div className="mx-auto w-2/3">
       <h2 className="text-xl font-bold text-gray-500 text-left mb-4">
         Get Started
       </h2>
       {step === 1 && renderTaxYearStep()}
       {step === 2 && renderImportStep()}
     </div>
   </div>
 );
};

export default TaxYearSelection;