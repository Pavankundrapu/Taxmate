import React, { useState, useEffect } from 'react';
import IncomeForm from './components/IncomeForm';
import ResultCard, { ComparisonSummary } from './components/ResultCard';
import ComparisonChart from './components/ComparisonChart';
import EmailPrompt from './components/EmailPrompt';
import { calculateTax, getTaxSavingSuggestions } from './utils/taxCalculator';
import { exportToPDF } from './utils/pdfExport';

/**
 * Main App Component
 * Manages the complete tax calculation workflow
 */
const App = () => {
  // State management
  const [taxResults, setTaxResults] = useState(null);
  const [userInputs, setUserInputs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [currentPage, setCurrentPage] = useState('Form');
  const [darkMode, setDarkMode] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [taxSuggestions, setTaxSuggestions] = useState([]);

  // Ensure Results/Charts are accessible only when results exist
  useEffect(() => {
    if (!taxResults && (currentPage === 'Results' || currentPage === 'Charts')) {
      setCurrentPage('Form');
    }
  }, [taxResults, currentPage]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedHistory = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    
    setDarkMode(savedDarkMode);
    setCalculationHistory(savedHistory);
    
    // Apply dark mode to document
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save calculation history
  useEffect(() => {
    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
  }, [calculationHistory]);

  // Handle tax calculation
  const handleCalculate = async (inputs) => {
    setIsLoading(true);
    setUserInputs(inputs);

    try {
      // Calculate for both regimes
      const oldResult = calculateTax({ ...inputs, regime: 'old' });
      const newResult = calculateTax({ ...inputs, regime: 'new' });

      const results = {
        oldResult,
        newResult,
        timestamp: new Date().toISOString(),
        inputs
      };

      setTaxResults(results);

      // Add to history (keep last 5 calculations)
      const newHistory = [results, ...calculationHistory.slice(0, 4)];
      setCalculationHistory(newHistory);

      // Get tax-saving suggestions
      const suggestions = getTaxSavingSuggestions(inputs.deductions, inputs.annualSalary);
      setTaxSuggestions(suggestions);

      // Removed auto email prompt; will show via explicit button

    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Tax calculation failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!taxResults) return;

    try {
      const result = await exportToPDF(taxResults, userInputs, 'comparison-chart');
      if (result.success) {
        alert(`PDF exported successfully: ${result.fileName}`);
      } else {
        alert(`PDF export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF export failed. Please try again.');
    }
  };

  // Chart PDF export removed

  // Handle email sent
  const handleEmailSent = (email) => {
    console.log('Email sent to:', email);
    setShowEmailPrompt(false);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Clear history
  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem('calculationHistory');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Indian Tax Calculator
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calculate your income tax for both Old and New regimes
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* History Button */}
              {calculationHistory.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setCurrentPage('Recent')}
                    className="btn-secondary"
                    title="View calculation history"
                  >
                    History ({calculationHistory.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs Navigation */}
      {(() => {
        const tabs = ['Form', ...(taxResults ? ['Results', 'Charts'] : []), 'Recent'];
        return (
          <div className="mb-6">
            <nav className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setCurrentPage(tab)}
                  className={`px-4 py-2 rounded-t-md text-sm font-medium ${currentPage === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        );
      })()}
      <div className="flex flex-col gap-8">
          {/* Input Form */}
          {currentPage === 'Form' && (
            <div>
              <IncomeForm onCalculate={handleCalculate} isLoading={isLoading} />
            </div>
          )}

          {/* Results Section */}
          {currentPage === 'Results' && taxResults && (
            <div className="space-y-6">
              {/* Comparison Summary */}
              <ComparisonSummary 
                oldResult={taxResults.oldResult} 
                newResult={taxResults.newResult} 
              />

              {/* Individual Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  title="Old Regime"
                  result={taxResults.oldResult}
                  regime="old"
                  isRecommended={taxResults.oldResult.finalTax < taxResults.newResult.finalTax}
                  onShowDetails={(regime) => console.log('Show details for:', regime)}
                />
                
                <ResultCard
                  title="New Regime"
                  result={taxResults.newResult}
                  regime="new"
                  isRecommended={taxResults.newResult.finalTax < taxResults.oldResult.finalTax}
                  onShowDetails={(regime) => console.log('Show details for:', regime)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                  
                <button
                  onClick={handleExportPDF}
                  className="btn-secondary"
                >
                  Export PDF
                </button>

                <button
                  onClick={() => setShowEmailPrompt(true)}
                  className="btn-secondary"
                >
                  Send via Email
                </button>
              </div>

              {/* Tax Saving Suggestions */}
              {taxSuggestions.length > 0 && (
                <div className="mt-4">
                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Tax Saving Suggestions
                    </h3>
                    <div className="space-y-4">
                      {taxSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                            {suggestion.title}
                          </h4>
                          <p className="text-blue-800 dark:text-blue-400 text-sm mt-1">
                            {suggestion.description}
                          </p>
                          <p className="text-green-600 dark:text-green-400 font-medium text-sm mt-2">
                            Potential Tax Savings: {suggestion.potentialSavings.toLocaleString('en-IN', {
                              style: 'currency',
                              currency: 'INR'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Charts Section */}
        {currentPage === 'Charts' && taxResults && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tax Comparison Charts
              </h2>
              <button
                onClick={() => setCurrentPage('Results')}
                className="btn-secondary"
              >
                Back to Results
              </button>
            </div>
            
            <div id="comparison-chart">
              <ComparisonChart 
                oldResult={taxResults.oldResult} 
                newResult={taxResults.newResult} 
              />
            </div>
          </div>
        )}

        {/* Calculation History */}
        {currentPage === 'Recent' && calculationHistory.length > 0 && (
          <div className="mt-8">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Calculations
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Clear History
                </button>
              </div>
              
              <div className="space-y-3">
                {calculationHistory.slice(0, 5).map((calc, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Salary: {calc.inputs.annualSalary.toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          })}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(calc.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Old: {calc.oldResult.finalTax.toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          })}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          New: {calc.newResult.finalTax.toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Email Prompt Modal */}
      <EmailPrompt
        isOpen={showEmailPrompt}
        onClose={() => setShowEmailPrompt(false)}
        taxResults={taxResults}
        userInputs={userInputs}
        onEmailSent={handleEmailSent}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 Indian Tax Calculator. For educational purposes only.</p>
            <p className="text-sm mt-2">
              Please consult a tax advisor for professional tax planning advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
