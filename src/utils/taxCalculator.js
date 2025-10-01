/**
 * Indian Income Tax Calculator Utility
 * Implements tax calculation for both Old and New Tax Regimes
 * Updated for FY 2025-26 behavior:
 *  - Old regime: 50,000 standard deduction; 80C/80D/home-loan; HRA exemption (min-of-three)
 *  - New regime: ONLY standard deduction of 75,000; no other deductions/HRA
 *  - New regime default slabs unchanged from Budget 2023
 */

// Tax slabs for different age groups (FY 2023-24)
const TAX_SLABS = {
  // Below 60 years
  below60: {
    old: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 }
    ],
    new: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 600000, rate: 5 },
      { min: 600000, max: 900000, rate: 10 },
      { min: 900000, max: 1200000, rate: 15 },
      { min: 1200000, max: 1500000, rate: 20 },
      { min: 1500000, max: Infinity, rate: 30 }
    ]
  },
  // 60-80 years
  senior: {
    old: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 }
    ],
    new: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 600000, rate: 5 },
      { min: 600000, max: 900000, rate: 10 },
      { min: 900000, max: 1200000, rate: 15 },
      { min: 1200000, max: 1500000, rate: 20 },
      { min: 1500000, max: Infinity, rate: 30 }
    ]
  },
  // Above 80 years
  superSenior: {
    old: [
      { min: 0, max: 500000, rate: 0 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 }
    ],
    new: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 600000, rate: 5 },
      { min: 600000, max: 900000, rate: 10 },
      { min: 900000, max: 1200000, rate: 15 },
      { min: 1200000, max: 1500000, rate: 20 },
      { min: 1500000, max: Infinity, rate: 30 }
    ]
  }
};

// Standard deduction amounts (FY 2025-26)
const STANDARD_DEDUCTION = {
  old: 50000,  // Old regime standard deduction
  new: 75000   // New regime standard deduction (FY 2025-26)
};

// Maximum deduction limits
const DEDUCTION_LIMITS = {
  section80C: 150000,
  section80D: 25000, // For self and family
  section80D_senior: 50000, // For senior citizens
  hra: 0, // HRA is calculated based on salary components
  homeLoanInterest: 200000
};

/**
 * Calculate HRA exemption based on salary components
 * @param {number} basicSalary - Basic salary component
 * @param {number} hraReceived - HRA received from employer
 * @param {number} rentPaid - Rent paid for accommodation
 * @param {string} location - Location type (metro/non-metro)
 * @returns {number} HRA exemption amount
 */
export const calculateHRA = (basicSalary, hraReceived, rentPaid, location = 'metro') => {
  const metroRate = 0.5; // 50% for metro cities
  const nonMetroRate = 0.4; // 40% for non-metro cities
  
  const rate = location === 'metro' ? metroRate : nonMetroRate;
  const limitPercentOfBasic = Math.max(0, basicSalary * rate);
  const rentMinusTenPercent = Math.max(0, (rentPaid || 0) - (basicSalary * 0.1));
  const hraRec = Math.max(0, hraReceived || 0);

  // Statutory: exemption is minimum of (HRA received, rent - 10% basic, 50%/40% of basic)
  const exemption = Math.min(hraRec, limitPercentOfBasic, rentMinusTenPercent);
  
  return Math.max(0, exemption);
};

/**
 * Calculate tax for a given income using tax slabs
 * @param {number} taxableIncome - Taxable income amount
 * @param {Array} slabs - Tax slabs array
 * @returns {Object} Tax calculation result
 */
const calculateTaxFromSlabs = (taxableIncome, slabs) => {
  let totalTax = 0;
  const slabBreakdown = [];
  
  for (const slab of slabs) {
    if (taxableIncome <= slab.min) break;
    
    const taxableInSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min);
    const taxInSlab = taxableInSlab * (slab.rate / 100);
    
    if (taxableInSlab > 0) {
      slabBreakdown.push({
        range: `${slab.min.toLocaleString()} - ${slab.max === Infinity ? '∞' : slab.max.toLocaleString()}`,
        taxableAmount: taxableInSlab,
        rate: slab.rate,
        tax: taxInSlab
      });
    }
    
    totalTax += taxInSlab;
  }
  
  return { totalTax, slabBreakdown };
};

/**
 * Calculate rebate under section 87A
 * @param {number} tax - Tax amount before rebate
 * @param {number} taxableIncome - Taxable income
 * @returns {number} Rebate amount
 */
const calculateRebate87A = (tax, taxableIncome, regime) => {
  // Old regime: rebate up to ₹12,500 for taxable income ≤ ₹5,00,000
  if (regime === 'old') {
    if (taxableIncome <= 500000) {
      return Math.min(tax, 12500);
    }
    return 0;
  }

  // New regime: effective full rebate up to ₹7,00,000 taxable income (simplified)
  if (regime === 'new') {
    if (taxableIncome <= 700000) {
      // Rebate equals the tax amount to reduce liability to zero
      return Math.min(tax, tax);
    }
    return 0;
  }
  return 0;
};

/**
 * Calculate health and education cess
 * @param {number} tax - Tax amount after rebate
 * @returns {number} Cess amount (4%)
 */
const calculateCess = (tax) => {
  return tax * 0.04; // 4% cess
};

/**
 * Main tax calculation function
 * @param {Object} inputs - Input parameters
 * @returns {Object} Complete tax calculation result
 */
export const calculateTax = (inputs) => {
  const {
    annualSalary,
    ageGroup,
    regime,
    deductions = {},
    hraDetails = {}
  } = inputs;
  
  // Get tax slabs based on age group
  const ageGroupKey = ageGroup === 'below60' ? 'below60' : 
                     ageGroup === '60-80' ? 'senior' : 'superSenior';
  const slabs = TAX_SLABS[ageGroupKey][regime];
  
  // Calculate HRA exemption if applicable
  let hraExemption = 0;
  if (hraDetails.basicSalary && hraDetails.hraReceived && hraDetails.rentPaid) {
    hraExemption = calculateHRA(
      hraDetails.basicSalary,
      hraDetails.hraReceived,
      hraDetails.rentPaid,
      hraDetails.location
    );
  }
  
  // Calculate total deductions by regime
  // Old: allow 80C, 80D (age-capped), HRA, home-loan interest (capped)
  // New: disallow most deductions (only standard deduction is applied separately)
  let totalDeductions = 0;
  if (regime === 'old') {
    const isSeniorOrAbove = ageGroup !== 'below60';
    const max80D = isSeniorOrAbove ? DEDUCTION_LIMITS.section80D_senior : DEDUCTION_LIMITS.section80D;
    const capped80C = Math.max(0, Math.min(DEDUCTION_LIMITS.section80C, deductions.section80C || 0));
    const capped80D = Math.max(0, Math.min(max80D, deductions.section80D || 0));
    const cappedHomeLoan = Math.max(0, Math.min(DEDUCTION_LIMITS.homeLoanInterest, deductions.homeLoanInterest || 0));
    totalDeductions = capped80C + capped80D + Math.max(0, hraExemption) + cappedHomeLoan;
  } else {
    totalDeductions = 0;
  }
  
  // Calculate taxable income
  const grossSalary = annualSalary;
  const standardDeduction = STANDARD_DEDUCTION[regime];
  const taxableIncome = Math.max(0, grossSalary - standardDeduction - totalDeductions);
  
  // Calculate tax using slabs
  const { totalTax, slabBreakdown } = calculateTaxFromSlabs(taxableIncome, slabs);
  
  // Apply rebate 87A (regime-aware)
  const rebate = calculateRebate87A(totalTax, taxableIncome, regime);
  const taxAfterRebate = Math.max(0, totalTax - rebate);
  
  // Calculate cess
  const cess = calculateCess(taxAfterRebate);
  const finalTax = taxAfterRebate + cess;
  
  // Calculate take-home salary
  const monthlyTakeHome = (grossSalary - finalTax) / 12;
  
  // Debug: Log calculated tax values for tracing
  try {
    // Collapsed group for neat console output
    // eslint-disable-next-line no-console
    console.groupCollapsed('[TaxCalculator] Computation Summary:', regime.toUpperCase());
    // eslint-disable-next-line no-console
    console.log('Inputs', {
      annualSalary,
      ageGroup,
      regime,
      deductions,
      hraDetails
    });
    // eslint-disable-next-line no-console
    console.log('Derived', {
      grossSalary,
      standardDeduction,
      totalDeductions,
      hraExemption,
      taxableIncome
    });
    // eslint-disable-next-line no-console
    console.log('Tax', {
      taxBeforeRebate: totalTax,
      rebate,
      taxAfterRebate,
      cess,
      finalTax,
      monthlyTakeHome
    });
    // eslint-disable-next-line no-console
    console.groupEnd();
  } catch (_) {
    // ignore logging errors
  }

  return {
    grossSalary,
    standardDeduction,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate: totalTax,
    rebate,
    taxAfterRebate,
    cess,
    finalTax,
    monthlyTakeHome,
    slabBreakdown,
    hraExemption,
    deductions: {
      section80C: deductions.section80C || 0,
      section80D: deductions.section80D || 0,
      hra: hraExemption,
      homeLoanInterest: deductions.homeLoanInterest || 0
    }
  };
};

/**
 * Get tax-saving suggestions based on unused deduction limits
 * @param {Object} deductions - Current deductions
 * @param {number} annualSalary - Annual salary
 * @returns {Array} Array of suggestions
 */
export const getTaxSavingSuggestions = (deductions, annualSalary) => {
  const suggestions = [];
  
  // Section 80C suggestions
  const unused80C = DEDUCTION_LIMITS.section80C - (deductions.section80C || 0);
  if (unused80C > 0) {
    suggestions.push({
      type: 'section80C',
      title: 'Maximize Section 80C',
      description: `You can save ₹${unused80C.toLocaleString()} more in tax by investing in ELSS, PPF, EPF, or other 80C instruments.`,
      potentialSavings: unused80C * 0.3 // Assuming 30% tax rate
    });
  }
  
  // Section 80D suggestions
  const unused80D = DEDUCTION_LIMITS.section80D - (deductions.section80D || 0);
  if (unused80D > 0) {
    suggestions.push({
      type: 'section80D',
      title: 'Health Insurance Premium',
      description: `Consider health insurance to save ₹${unused80D.toLocaleString()} more in tax.`,
      potentialSavings: unused80D * 0.3
    });
  }
  
  // Home loan interest suggestions
  const unusedHomeLoan = DEDUCTION_LIMITS.homeLoanInterest - (deductions.homeLoanInterest || 0);
  if (unusedHomeLoan > 0) {
    suggestions.push({
      type: 'homeLoan',
      title: 'Home Loan Interest',
      description: `If you have a home loan, you can claim up to ₹${DEDUCTION_LIMITS.homeLoanInterest.toLocaleString()} in interest deduction.`,
      potentialSavings: unusedHomeLoan * 0.3
    });
  }
  
  return suggestions;
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Get progress percentage for tax slab visualization
 * @param {number} income - Current income
 * @param {Array} slabs - Tax slabs
 * @returns {Array} Progress data for each slab
 */
export const getSlabProgress = (income, slabs) => {
  return slabs.map(slab => {
    const slabRange = slab.max === Infinity ? income : slab.max;
    const progress = Math.min(100, Math.max(0, ((income - slab.min) / (slabRange - slab.min)) * 100));
    return {
      ...slab,
      progress: isNaN(progress) ? 0 : progress,
      isActive: income > slab.min
    };
  });
};
