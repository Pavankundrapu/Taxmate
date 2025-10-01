/**
 * Test Calculations for Tax Calculator
 * Verifies the accuracy of tax calculations with known examples
 */

import { calculateTax } from './taxCalculator';

/**
 * Test cases for tax calculation verification
 */
export const TEST_CASES = [
  {
    name: 'Basic Salary - Below 60, Old Regime',
    inputs: {
      annualSalary: 600000,
      ageGroup: 'below60',
      regime: 'old',
      deductions: {
        section80C: 100000,
        section80D: 0,
        homeLoanInterest: 0
      },
      hraDetails: {
        basicSalary: 0,
        hraReceived: 0,
        rentPaid: 0,
        location: 'metro'
      }
    },
    expected: {
      taxableIncome: 450000, // 600000 - 50000 (standard) - 100000 (80C)
      finalTax: 10000 // 5% of 200000 (450000 - 250000)
    }
  },
  {
    name: 'High Income - Below 60, Old Regime',
    inputs: {
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
    expected: {
      taxableIncome: 825000, // 1500000 - 50000 - 150000 - 25000 - 200000 - 250000 (HRA)
      finalTax: 125000 // Complex calculation with multiple slabs
    }
  },
  {
    name: 'New Regime - Below 60',
    inputs: {
      annualSalary: 800000,
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
    },
    expected: {
      taxableIncome: 750000, // 800000 - 50000 (standard)
      finalTax: 30000 // 5% of 300000 + 10% of 300000 + 15% of 150000
    }
  }
];

/**
 * Run test calculations and verify results
 */
export const runTests = () => {
  console.log('🧮 Running Tax Calculator Tests...\n');
  
  let passedTests = 0;
  let totalTests = TEST_CASES.length;

  TEST_CASES.forEach((testCase, index) => {
    try {
      const result = calculateTax(testCase.inputs);
      const { taxableIncome, finalTax } = result;
      
      console.log(`Test ${index + 1}: ${testCase.name}`);
      console.log(`  Expected Taxable Income: ₹${testCase.expected.taxableIncome.toLocaleString()}`);
      console.log(`  Calculated Taxable Income: ₹${taxableIncome.toLocaleString()}`);
      console.log(`  Expected Tax: ₹${testCase.expected.finalTax.toLocaleString()}`);
      console.log(`  Calculated Tax: ₹${finalTax.toLocaleString()}`);
      
      // Check if results are within acceptable range (±₹1000 for tax calculations)
      const taxDifference = Math.abs(finalTax - testCase.expected.finalTax);
      const incomeDifference = Math.abs(taxableIncome - testCase.expected.taxableIncome);
      
      if (taxDifference <= 1000 && incomeDifference <= 1000) {
        console.log(`  ✅ PASSED\n`);
        passedTests++;
      } else {
        console.log(`  ❌ FAILED (Difference: Tax ₹${taxDifference}, Income ₹${incomeDifference})\n`);
      }
    } catch (error) {
      console.log(`  ❌ ERROR: ${error.message}\n`);
    }
  });

  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Tax calculator is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the tax calculation logic.');
  }

  return { passedTests, totalTests };
};

/**
 * Performance test for multiple calculations
 */
export const performanceTest = (iterations = 100) => {
  console.log(`🚀 Running Performance Test (${iterations} iterations)...`);
  
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    const testInput = {
      annualSalary: 500000 + (i * 10000),
      ageGroup: 'below60',
      regime: i % 2 === 0 ? 'old' : 'new',
      deductions: {
        section80C: Math.min(150000, i * 1000),
        section80D: Math.min(25000, i * 100),
        homeLoanInterest: Math.min(200000, i * 2000)
      },
      hraDetails: {
        basicSalary: 0,
        hraReceived: 0,
        rentPaid: 0,
        location: 'metro'
      }
    };
    
    calculateTax(testInput);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`⏱️  Performance Test Results:`);
  console.log(`   Total Time: ${duration.toFixed(2)}ms`);
  console.log(`   Average per Calculation: ${(duration / iterations).toFixed(2)}ms`);
  console.log(`   Calculations per Second: ${(iterations / (duration / 1000)).toFixed(0)}`);
  
  return { duration, iterations, averageTime: duration / iterations };
};

// Export test runner
export const runAllTests = () => {
  const testResults = runTests();
  const perfResults = performanceTest(50);
  
  return {
    testResults,
    perfResults,
    summary: {
      testsPassed: testResults.passedTests === testResults.totalTests,
      performanceGood: perfResults.averageTime < 10 // Less than 10ms per calculation
    }
  };
};
