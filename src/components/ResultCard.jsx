import React from 'react';
import { formatCurrency } from '../utils/taxCalculator';

/**
 * ResultCard Component
 * Displays detailed tax calculation results for a specific regime
 */
const ResultCard = ({ 
  title, 
  result, 
  regime, 
  isRecommended = false,
  onShowDetails 
}) => {
  const {
    grossSalary,
    standardDeduction,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebate,
    taxAfterRebate,
    cess,
    finalTax,
    monthlyTakeHome,
    deductions
  } = result;

  return (
    <div className={`card ${isRecommended ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        {isRecommended && (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </span>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Taxable Income</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(taxableIncome)}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Tax Payable</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(finalTax)}
          </div>
        </div>
      </div>

      {/* Monthly Take Home */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="text-sm text-blue-600 dark:text-blue-400">Monthly Take Home</div>
        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
          {formatCurrency(monthlyTakeHome)}
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="space-y-3 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white">Tax Breakdown</h4>
        
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="text-gray-600 dark:text-gray-400">Tax before rebate</span>
          <span className="font-medium">{formatCurrency(taxBeforeRebate)}</span>
        </div>
        
        {rebate > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400">Rebate (87A)</span>
            <span className="font-medium text-green-600">-{formatCurrency(rebate)}</span>
          </div>
        )}
        
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="text-gray-600 dark:text-gray-400">Tax after rebate</span>
          <span className="font-medium">{formatCurrency(taxAfterRebate)}</span>
        </div>
        
        <div className="flex justify-between py-2">
          <span className="text-gray-600 dark:text-gray-400">Health & Education Cess (4%)</span>
          <span className="font-medium">{formatCurrency(cess)}</span>
        </div>
      </div>

      {/* Deductions Summary */}
      <div className="space-y-3 mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white">Deductions Applied</h4>
        
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
          <span className="text-gray-600 dark:text-gray-400">Standard Deduction</span>
          <span className="font-medium">{formatCurrency(standardDeduction)}</span>
        </div>

        {/* Only show non-standard deductions for Old Regime */}
        {regime === 'old' && (
          <>
            {deductions.section80C > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">Section 80C</span>
                <span className="font-medium">{formatCurrency(deductions.section80C)}</span>
              </div>
            )}
            
            {deductions.section80D > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">Section 80D</span>
                <span className="font-medium">{formatCurrency(deductions.section80D)}</span>
              </div>
            )}
            
            {deductions.hra > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">HRA Exemption</span>
                <span className="font-medium">{formatCurrency(deductions.hra)}</span>
              </div>
            )}
            
            {deductions.homeLoanInterest > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Home Loan Interest</span>
                <span className="font-medium">{formatCurrency(deductions.homeLoanInterest)}</span>
              </div>
            )}
          </>
        )}
        
        <div className="flex justify-between py-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
          <span className="font-semibold text-gray-900 dark:text-white">Other Deductions (excl. Std)</span>
          <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalDeductions)}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * ComparisonSummary Component
 * Shows side-by-side comparison of both regimes
 */
export const ComparisonSummary = ({ oldResult, newResult }) => {
  // Determine which regime yields LOWER tax
  const isNewBetter = newResult.finalTax < oldResult.finalTax;
  const betterRegime = isNewBetter ? 'New Regime' : 'Old Regime';
  const savingsAmount = Math.abs(oldResult.finalTax - newResult.finalTax);

  return (
    <div className="card bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Regime Comparison
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(oldResult.finalTax)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Old Regime Tax</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(newResult.finalTax)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">New Regime Tax</div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-500">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {betterRegime} is Better
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            Save {formatCurrency(savingsAmount)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {savingsAmount > 0 ? 'per year' : 'No significant difference'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
