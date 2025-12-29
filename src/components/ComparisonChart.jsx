import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { formatCurrency } from '../utils/taxCalculator';

/**
 * ComparisonChart Component
 * Displays various charts comparing Old vs New regime tax calculations
 */
const ComparisonChart = ({ oldResult, newResult, onRegimeChange }) => {
  // Prepare data for bar chart
  const barChartData = [
    {
      name: 'Old Regime',
      'Tax Payable': oldResult.finalTax,
      'Take Home': oldResult.grossSalary - oldResult.finalTax,
      'Other Deductions (excl. Std)': oldResult.totalDeductions
    },
    {
      name: 'New Regime',
      'Tax Payable': newResult.finalTax,
      'Take Home': newResult.grossSalary - newResult.finalTax,
      'Other Deductions (excl. Std)': newResult.totalDeductions
    }
  ];

  // Prepare data for pie chart (tax breakdown) - showing final tax components
  const oldTaxBreakdown = [
    { name: 'Tax After Rebate', value: oldResult.taxAfterRebate, color: '#ef4444' },
    { name: 'Cess (4%)', value: oldResult.cess, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  const newTaxBreakdown = [
    { name: 'Tax After Rebate', value: newResult.taxAfterRebate, color: '#ef4444' },
    { name: 'Cess (4%)', value: newResult.cess, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  // Prepare detailed tax breakdown for bar chart (showing all components)
  const oldTaxComponents = [
    { name: 'Tax Before Rebate', value: oldResult.taxBeforeRebate, color: '#dc2626' },
    { name: 'Rebate (87A)', value: -oldResult.rebate, color: '#10b981' },
    { name: 'Tax After Rebate', value: oldResult.taxAfterRebate, color: '#ef4444' },
    { name: 'Cess (4%)', value: oldResult.cess, color: '#f59e0b' },
    { name: 'Final Tax', value: oldResult.finalTax, color: '#991b1b' }
  ];

  const newTaxComponents = [
    { name: 'Tax Before Rebate', value: newResult.taxBeforeRebate, color: '#dc2626' },
    { name: 'Rebate (87A)', value: -newResult.rebate, color: '#10b981' },
    { name: 'Tax After Rebate', value: newResult.taxAfterRebate, color: '#ef4444' },
    { name: 'Cess (4%)', value: newResult.cess, color: '#f59e0b' },
    { name: 'Final Tax', value: newResult.finalTax, color: '#991b1b' }
  ];

  // Prepare data for line chart (monthly take home)
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
    'Old Regime': oldResult.monthlyTakeHome,
    'New Regime': newResult.monthlyTakeHome
  }));

  // Prepare tax slab breakdown data with all details from taxCalculator
  const oldSlabData = oldResult.slabBreakdown?.map(slab => ({
    range: slab.range,
    taxableAmount: slab.taxableAmount,
    rate: slab.rate,
    tax: slab.tax,
    regime: 'Old Regime',
    label: `${slab.range} @ ${slab.rate}%`
  })) || [];

  const newSlabData = newResult.slabBreakdown?.map(slab => ({
    range: slab.range,
    taxableAmount: slab.taxableAmount,
    rate: slab.rate,
    tax: slab.tax,
    regime: 'New Regime',
    label: `${slab.range} @ ${slab.rate}%`
  })) || [];

  // Prepare deductions comparison data
  const deductionsData = [
    {
      name: 'Standard Deduction',
      'Old Regime': oldResult.standardDeduction,
      'New Regime': newResult.standardDeduction
    },
    {
      name: 'Section 80C',
      'Old Regime': oldResult.deductions?.section80C || 0,
      'New Regime': 0
    },
    {
      name: 'Section 80D',
      'Old Regime': oldResult.deductions?.section80D || 0,
      'New Regime': 0
    },
    {
      name: 'HRA Exemption',
      'Old Regime': oldResult.deductions?.hra || 0,
      'New Regime': 0
    },
    {
      name: 'Home Loan Interest',
      'Old Regime': oldResult.deductions?.homeLoanInterest || 0,
      'New Regime': 0
    }
  ].filter(item => item['Old Regime'] > 0 || item['New Regime'] > 0);

  // Calculate effective tax rates
  const oldEffectiveRate = ((oldResult.finalTax / oldResult.grossSalary) * 100).toFixed(2);
  const newEffectiveRate = ((newResult.finalTax / newResult.grossSalary) * 100).toFixed(2);

  // Prepare effective tax rate comparison
  const effectiveRateData = [
    {
      name: 'Old Regime',
      'Effective Tax Rate (%)': parseFloat(oldEffectiveRate),
      'Tax Amount': oldResult.finalTax
    },
    {
      name: 'New Regime',
      'Effective Tax Rate (%)': parseFloat(newEffectiveRate),
      'Tax Amount': newResult.finalTax
    }
  ];

  // Prepare annual vs monthly breakdown
  const annualMonthlyData = [
    {
      category: 'Gross Salary',
      annual: oldResult.grossSalary,
      monthly: oldResult.grossSalary / 12,
      regime: 'Old'
    },
    {
      category: 'Tax',
      annual: oldResult.finalTax,
      monthly: oldResult.finalTax / 12,
      regime: 'Old'
    },
    {
      category: 'Take Home',
      annual: oldResult.grossSalary - oldResult.finalTax,
      monthly: oldResult.monthlyTakeHome,
      regime: 'Old'
    }
  ];

  const annualMonthlyDataNew = [
    {
      category: 'Gross Salary',
      annual: newResult.grossSalary,
      monthly: newResult.grossSalary / 12,
      regime: 'New'
    },
    {
      category: 'Tax',
      annual: newResult.finalTax,
      monthly: newResult.finalTax / 12,
      regime: 'New'
    },
    {
      category: 'Take Home',
      annual: newResult.grossSalary - newResult.finalTax,
      monthly: newResult.monthlyTakeHome,
      regime: 'New'
    }
  ];

  // Prepare salary breakdown waterfall data
  const oldSalaryBreakdown = [
    { name: 'Gross Salary', value: oldResult.grossSalary, fill: '#3b82f6' },
    { name: 'Standard Deduction', value: -oldResult.standardDeduction, fill: '#ef4444' },
    { name: 'Other Deductions', value: -oldResult.totalDeductions, fill: '#f59e0b' },
    { name: 'Taxable Income', value: oldResult.taxableIncome, fill: '#8b5cf6' },
    { name: 'Tax', value: -oldResult.finalTax, fill: '#dc2626' },
    { name: 'Take Home', value: oldResult.grossSalary - oldResult.finalTax, fill: '#10b981' }
  ];

  const newSalaryBreakdown = [
    { name: 'Gross Salary', value: newResult.grossSalary, fill: '#3b82f6' },
    { name: 'Standard Deduction', value: -newResult.standardDeduction, fill: '#ef4444' },
    { name: 'Other Deductions', value: -newResult.totalDeductions, fill: '#f59e0b' },
    { name: 'Taxable Income', value: newResult.taxableIncome, fill: '#8b5cf6' },
    { name: 'Tax', value: -newResult.finalTax, fill: '#dc2626' },
    { name: 'Take Home', value: newResult.grossSalary - newResult.finalTax, fill: '#10b981' }
  ];

  // Custom tooltip for currency formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Tax Comparison Bar Chart */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Tax Comparison: Old vs New Regime
        </h3>
        <div className="h-64 sm:h-72 md:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Tax Payable" fill="#ef4444" name="Tax Payable" />
              <Bar dataKey="Take Home" fill="#10b981" name="Take Home Salary" />
              <Bar dataKey="Other Deductions (excl. Std)" fill="#3b82f6" name="Other Deductions (excl. Std)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Take Home Comparison */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Monthly Take Home Salary
        </h3>
        <div className="h-64 sm:h-72 md:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Old Regime" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="New Regime" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tax Breakdown */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Detailed Tax Breakdown
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Old Regime Tax Components */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Old Regime</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={oldTaxComponents} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#8884d8">
                    {oldTaxComponents.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Tax Breakdown Summary Table */}
            <div className="mt-4 space-y-2">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Breakdown:</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Tax Before Rebate:</span>
                  <span className="font-medium">{formatCurrency(oldResult.taxBeforeRebate)}</span>
                </div>
                {oldResult.rebate > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Rebate (87A):</span>
                    <span className="font-medium">-{formatCurrency(oldResult.rebate)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax After Rebate:</span>
                  <span className="font-medium">{formatCurrency(oldResult.taxAfterRebate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cess (4%):</span>
                  <span className="font-medium">{formatCurrency(oldResult.cess)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t pt-1">
                  <span>Final Tax:</span>
                  <span>{formatCurrency(oldResult.finalTax)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Regime Tax Components */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">New Regime</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newTaxComponents} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#8884d8">
                    {newTaxComponents.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Tax Breakdown Summary Table */}
            <div className="mt-4 space-y-2">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Breakdown:</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Tax Before Rebate:</span>
                  <span className="font-medium">{formatCurrency(newResult.taxBeforeRebate)}</span>
                </div>
                {newResult.rebate > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Rebate (87A):</span>
                    <span className="font-medium">-{formatCurrency(newResult.rebate)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax After Rebate:</span>
                  <span className="font-medium">{formatCurrency(newResult.taxAfterRebate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cess (4%):</span>
                  <span className="font-medium">{formatCurrency(newResult.cess)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t pt-1">
                  <span>Final Tax:</span>
                  <span>{formatCurrency(newResult.finalTax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Breakdown Pie Charts (Simplified) */}
      {oldTaxBreakdown.length > 0 && newTaxBreakdown.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Old Regime Tax Breakdown Pie */}
          <div className="card overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Old Regime Tax Composition
            </h3>
            <div className="h-64 min-w-[280px] sm:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={oldTaxBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {oldTaxBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Regime Tax Breakdown Pie */}
          <div className="card overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              New Regime Tax Composition
            </h3>
            <div className="h-64 min-w-[280px] sm:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={newTaxBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {newTaxBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tax Slab Breakdown */}
      {(oldSlabData.length > 0 || newSlabData.length > 0) && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Tax Slab Breakdown
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {oldSlabData.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Old Regime</h4>
                <div className="h-80 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={oldSlabData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" angle={-45} textAnchor="end" height={120} />
                      <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                                <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.range}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Tax Rate: <span className="font-medium">{data.rate}%</span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Taxable Amount: <span className="font-medium">{formatCurrency(data.taxableAmount)}</span>
                                </p>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                  Tax: <span className="font-bold">{formatCurrency(data.tax)}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="tax" fill="#3b82f6" name="Tax Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Slab Breakdown Table */}
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Slab Details:</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-2 text-gray-700 dark:text-gray-300">Slab Range</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300">Rate</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300">Taxable</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300">Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oldSlabData.map((slab, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 text-gray-600 dark:text-gray-400">{slab.range}</td>
                            <td className="py-2 text-right text-gray-600 dark:text-gray-400">{slab.rate}%</td>
                            <td className="py-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(slab.taxableAmount)}</td>
                            <td className="py-2 text-right font-medium text-blue-600 dark:text-blue-400">{formatCurrency(slab.tax)}</td>
                          </tr>
                        ))}
                        <tr className="font-bold text-gray-900 dark:text-white border-t-2 border-gray-300 dark:border-gray-500">
                          <td colSpan="3" className="py-2">Total Tax:</td>
                          <td className="py-2 text-right">{formatCurrency(oldResult.taxBeforeRebate)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {newSlabData.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">New Regime</h4>
                <div className="h-80 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={newSlabData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" angle={-45} textAnchor="end" height={120} />
                      <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                                <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.range}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Tax Rate: <span className="font-medium">{data.rate}%</span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Taxable Amount: <span className="font-medium">{formatCurrency(data.taxableAmount)}</span>
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                  Tax: <span className="font-bold">{formatCurrency(data.tax)}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="tax" fill="#10b981" name="Tax Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Slab Breakdown Table */}
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Slab Details:</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-2 text-gray-700 dark:text-gray-300">Slab Range</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300">Rate</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300">Taxable</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300">Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newSlabData.map((slab, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 text-gray-600 dark:text-gray-400">{slab.range}</td>
                            <td className="py-2 text-right text-gray-600 dark:text-gray-400">{slab.rate}%</td>
                            <td className="py-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(slab.taxableAmount)}</td>
                            <td className="py-2 text-right font-medium text-green-600 dark:text-green-400">{formatCurrency(slab.tax)}</td>
                          </tr>
                        ))}
                        <tr className="font-bold text-gray-900 dark:text-white border-t-2 border-gray-300 dark:border-gray-500">
                          <td colSpan="3" className="py-2">Total Tax:</td>
                          <td className="py-2 text-right">{formatCurrency(newResult.taxBeforeRebate)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deductions Comparison */}
      {deductionsData.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Deductions Comparison
          </h3>
          <div className="h-64 sm:h-72 md:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deductionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Old Regime" fill="#3b82f6" name="Old Regime" />
                <Bar dataKey="New Regime" fill="#10b981" name="New Regime" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Effective Tax Rate Comparison */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Effective Tax Rate Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {oldEffectiveRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Old Regime Effective Rate</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Tax: {formatCurrency(oldResult.finalTax)} / Salary: {formatCurrency(oldResult.grossSalary)}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {newEffectiveRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">New Regime Effective Rate</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Tax: {formatCurrency(newResult.finalTax)} / Salary: {formatCurrency(newResult.grossSalary)}
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={effectiveRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" label={{ value: 'Tax Rate (%)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="right" dataKey="Tax Amount" fill="#ef4444" name="Tax Amount" />
              <Line yAxisId="left" type="monotone" dataKey="Effective Tax Rate (%)" stroke="#3b82f6" strokeWidth={3} name="Effective Tax Rate (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Annual vs Monthly Breakdown */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Annual vs Monthly Breakdown
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Old Regime</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="annual" fill="#3b82f6" name="Annual (₹)" />
                  <Bar dataKey="monthly" fill="#10b981" name="Monthly (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">New Regime</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualMonthlyDataNew} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="annual" fill="#3b82f6" name="Annual (₹)" />
                  <Bar dataKey="monthly" fill="#10b981" name="Monthly (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Breakdown Waterfall */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Salary Breakdown Flow
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Old Regime</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={oldSalaryBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#8884d8">
                    {oldSalaryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">New Regime</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newSalaryBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#8884d8">
                    {newSalaryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Summary */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Annual Savings Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(oldResult.finalTax)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Old Regime Tax</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(newResult.finalTax)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">New Regime Tax</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(Math.abs(oldResult.finalTax - newResult.finalTax))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {oldResult.finalTax > newResult.finalTax ? 'Savings with New' : 'Savings with Old'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;
