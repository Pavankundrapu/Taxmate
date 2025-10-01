import React, { useState } from 'react';

/**
 * IncomeForm Component
 * Handles all user inputs for tax calculation including salary, age, regime, and deductions
 */
const IncomeForm = ({ onCalculate, isLoading }) => {
  const [formData, setFormData] = useState({
    annualSalary: '',
    ageGroup: 'below60',
    regime: 'old',
    deductions: {
      section80C: '',
      section80D: '',
      homeLoanInterest: ''
    },
    hraDetails: {
      basicSalary: '',
      hraReceived: '',
      rentPaid: '',
      location: 'metro'
    }
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle deduction changes
  const handleDeductionChange = (deduction, value) => {
    setFormData(prev => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [deduction]: value
      }
    }));
  };

  // Handle HRA details changes
  const handleHRAChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      hraDetails: {
        ...prev.hraDetails,
        [field]: value
      }
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    const isSeniorOrAbove = formData.ageGroup !== 'below60';
    const max80D = isSeniorOrAbove ? 50000 : 25000;

    if (!formData.annualSalary || formData.annualSalary <= 0) {
      newErrors.annualSalary = 'Please enter a valid annual salary';
    }
    
    if (formData.deductions.section80C && (formData.deductions.section80C < 0 || formData.deductions.section80C > 150000)) {
      newErrors.section80C = 'Section 80C deduction must be between 0 and ₹1,50,000';
    }
    
    if (formData.deductions.section80D && (formData.deductions.section80D < 0 || formData.deductions.section80D > max80D)) {
      newErrors.section80D = `Section 80D deduction must be between 0 and ₹${max80D.toLocaleString()}`;
    }
    
    if (formData.deductions.homeLoanInterest && (formData.deductions.homeLoanInterest < 0 || formData.deductions.homeLoanInterest > 200000)) {
      newErrors.homeLoanInterest = 'Home loan interest must be between 0 and ₹2,00,000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const calculationData = {
        annualSalary: parseFloat(formData.annualSalary),
        ageGroup: formData.ageGroup,
        regime: formData.regime,
        deductions: {
          section80C: parseFloat(formData.deductions.section80C) || 0,
          section80D: parseFloat(formData.deductions.section80D) || 0,
          homeLoanInterest: parseFloat(formData.deductions.homeLoanInterest) || 0
        },
        hraDetails: {
          basicSalary: parseFloat(formData.hraDetails.basicSalary) || 0,
          hraReceived: parseFloat(formData.hraDetails.hraReceived) || 0,
          rentPaid: parseFloat(formData.hraDetails.rentPaid) || 0,
          location: formData.hraDetails.location
        }
      };
      
      onCalculate(calculationData);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Income & Deduction Details
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Annual Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Annual Salary (₹)
          </label>
          <input
            type="number"
            value={formData.annualSalary}
            onChange={(e) => handleInputChange('annualSalary', e.target.value)}
            className={`input-field ${errors.annualSalary ? 'border-red-500' : ''}`}
            placeholder="Enter your annual salary"
            required
          />
          {errors.annualSalary && (
            <p className="text-red-500 text-sm mt-1">{errors.annualSalary}</p>
          )}
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Age Group
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'below60', label: 'Below 60' },
              { value: '60-80', label: '60-80 (Senior)' },
              { value: 'above80', label: 'Above 80 (Super Senior)' }
            ].map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="ageGroup"
                  value={option.value}
                  checked={formData.ageGroup === option.value}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tax Regime */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tax Regime
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: 'old', label: 'Old Regime (with deductions)' },
              { value: 'new', label: 'New Regime (simplified)' }
            ].map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="regime"
                  value={option.value}
                  checked={formData.regime === option.value}
                  onChange={(e) => handleInputChange('regime', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Deductions Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Deductions (₹)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 80C */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section 80C (Max: ₹1,50,000)
              </label>
              <input
                type="number"
                value={formData.deductions.section80C}
                onChange={(e) => handleDeductionChange('section80C', e.target.value)}
                className={`input-field ${errors.section80C ? 'border-red-500' : ''}`}
                placeholder="0"
                min="0"
                max="150000"
                disabled={formData.regime === 'new'}
              />
              {formData.regime === 'new' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not applicable in New Regime.</p>
              )}
              {errors.section80C && (
                <p className="text-red-500 text-sm mt-1">{errors.section80C}</p>
              )}
            </div>

            {/* Section 80D */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section 80D - Health Insurance (Max: ₹{formData.ageGroup === 'below60' ? '25,000' : '50,000'})
              </label>
              <input
                type="number"
                value={formData.deductions.section80D}
                onChange={(e) => handleDeductionChange('section80D', e.target.value)}
                className={`input-field ${errors.section80D ? 'border-red-500' : ''}`}
                placeholder="0"
                min="0"
                max={formData.ageGroup === 'below60' ? "25000" : "50000"}
                disabled={formData.regime === 'new'}
              />
              {formData.regime === 'new' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not applicable in New Regime.</p>
              )}
              {errors.section80D && (
                <p className="text-red-500 text-sm mt-1">{errors.section80D}</p>
              )}
            </div>

            {/* Home Loan Interest */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Home Loan Interest (Max: ₹2,00,000)
              </label>
              <input
                type="number"
                value={formData.deductions.homeLoanInterest}
                onChange={(e) => handleDeductionChange('homeLoanInterest', e.target.value)}
                className={`input-field ${errors.homeLoanInterest ? 'border-red-500' : ''}`}
                placeholder="0"
                min="0"
                max="200000"
                disabled={formData.regime === 'new'}
              />
              {formData.regime === 'new' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not applicable in New Regime.</p>
              )}
              {errors.homeLoanInterest && (
                <p className="text-red-500 text-sm mt-1">{errors.homeLoanInterest}</p>
              )}
            </div>
          </div>
        </div>

        {/* HRA Details */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            HRA (House Rent Allowance) Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Basic Salary (₹)
              </label>
              <input
                type="number"
                value={formData.hraDetails.basicSalary}
                onChange={(e) => handleHRAChange('basicSalary', e.target.value)}
                className="input-field"
                placeholder="Basic salary component"
                disabled={formData.regime === 'new'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                HRA Received (₹)
              </label>
              <input
                type="number"
                value={formData.hraDetails.hraReceived}
                onChange={(e) => handleHRAChange('hraReceived', e.target.value)}
                className="input-field"
                placeholder="HRA from employer"
                disabled={formData.regime === 'new'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rent Paid (₹)
              </label>
              <input
                type="number"
                value={formData.hraDetails.rentPaid}
                onChange={(e) => handleHRAChange('rentPaid', e.target.value)}
                className="input-field"
                placeholder="Monthly rent paid"
                disabled={formData.regime === 'new'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <select
                value={formData.hraDetails.location}
                onChange={(e) => handleHRAChange('location', e.target.value)}
                className="input-field"
                disabled={formData.regime === 'new'}
              >
                <option value="metro">Metro City (50% of basic)</option>
                <option value="non-metro">Non-Metro City (40% of basic)</option>
              </select>
              {formData.regime === 'new' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">HRA not applicable in New Regime.</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary px-8 py-3 text-lg ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Calculating...' : 'Calculate Tax'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;
