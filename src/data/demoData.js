/**
 * Demo Data for Testing
 * Sample inputs for testing the tax calculator
 */

export const DEMO_INPUTS = {
  // High income scenario
  highIncome: {
    annualSalary: 1500000,
    ageGroup: 'below60',
    regime: 'old',
    deductions: {
      section80C: 150000,
      section80D: 25000,
      homeLoanInterest: 200000
    },
    hraDetails: {
      basicSalary: 600000,
      hraReceived: 180000,
      rentPaid: 25000,
      location: 'metro'
    }
  },

  // Medium income scenario
  mediumIncome: {
    annualSalary: 800000,
    ageGroup: 'below60',
    regime: 'old',
    deductions: {
      section80C: 100000,
      section80D: 15000,
      homeLoanInterest: 0
    },
    hraDetails: {
      basicSalary: 400000,
      hraReceived: 80000,
      rentPaid: 15000,
      location: 'non-metro'
    }
  },

  // Senior citizen scenario
  seniorCitizen: {
    annualSalary: 1200000,
    ageGroup: '60-80',
    regime: 'old',
    deductions: {
      section80C: 150000,
      section80D: 25000,
      homeLoanInterest: 150000
    },
    hraDetails: {
      basicSalary: 600000,
      hraReceived: 120000,
      rentPaid: 20000,
      location: 'metro'
    }
  },

  // New regime scenario
  newRegime: {
    annualSalary: 900000,
    ageGroup: 'below60',
    regime: 'new',
    deductions: {
      section80C: 0,
      section80D: 0,
      homeLoanInterest: 0
    },
    hraDetails: {
      basicSalary: 0,
      hraReceived: 0,
      rentPaid: 0,
      location: 'metro'
    }
  }
};

/**
 * Tax slab examples for different scenarios
 */
export const TAX_SLAB_EXAMPLES = {
  below60: {
    old: [
      { min: 0, max: 250000, rate: 0, description: 'No tax' },
      { min: 250000, max: 500000, rate: 5, description: '5% tax' },
      { min: 500000, max: 1000000, rate: 20, description: '20% tax' },
      { min: 1000000, max: Infinity, rate: 30, description: '30% tax' }
    ],
    new: [
      { min: 0, max: 300000, rate: 0, description: 'No tax' },
      { min: 300000, max: 600000, rate: 5, description: '5% tax' },
      { min: 600000, max: 900000, rate: 10, description: '10% tax' },
      { min: 900000, max: 1200000, rate: 15, description: '15% tax' },
      { min: 1200000, max: 1500000, rate: 20, description: '20% tax' },
      { min: 1500000, max: Infinity, rate: 30, description: '30% tax' }
    ]
  }
};

/**
 * Common deduction limits and examples
 */
export const DEDUCTION_EXAMPLES = {
  section80C: {
    limit: 150000,
    examples: [
      'Employee Provident Fund (EPF)',
      'Public Provident Fund (PPF)',
      'Equity Linked Savings Scheme (ELSS)',
      'National Savings Certificate (NSC)',
      'Tax Saving Fixed Deposits',
      'Sukanya Samriddhi Yojana',
      'Senior Citizens Savings Scheme'
    ]
  },
  section80D: {
    limit: 25000,
    examples: [
      'Health Insurance Premium for self and family',
      'Preventive Health Check-up (up to ₹5,000)',
      'Medical expenses for senior citizens'
    ]
  },
  homeLoanInterest: {
    limit: 200000,
    examples: [
      'Interest on home loan for self-occupied property',
      'Interest on home loan for let-out property'
    ]
  }
};

/**
 * HRA calculation examples
 */
export const HRA_EXAMPLES = {
  metro: {
    rate: 0.5,
    description: '50% of basic salary (Metro cities: Delhi, Mumbai, Chennai, Kolkata)'
  },
  nonMetro: {
    rate: 0.4,
    description: '40% of basic salary (Non-metro cities)'
  }
};
