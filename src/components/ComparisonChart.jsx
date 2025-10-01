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
  Line
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

  // Prepare data for pie chart (tax breakdown)
  const oldTaxBreakdown = [
    { name: 'Tax Before Rebate', value: oldResult.taxBeforeRebate, color: '#ef4444' },
    { name: 'Rebate', value: -oldResult.rebate, color: '#10b981' },
    { name: 'Cess', value: oldResult.cess, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  const newTaxBreakdown = [
    { name: 'Tax Before Rebate', value: newResult.taxBeforeRebate, color: '#ef4444' },
    { name: 'Rebate', value: -newResult.rebate, color: '#10b981' },
    { name: 'Cess', value: newResult.cess, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  // Prepare data for line chart (monthly take home)
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
    'Old Regime': oldResult.monthlyTakeHome,
    'New Regime': newResult.monthlyTakeHome
  }));

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

      {/* Tax Breakdown Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Old Regime Tax Breakdown */}
        <div className="card overflow-x-auto">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Old Regime Tax Breakdown
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

        {/* New Regime Tax Breakdown */}
        <div className="card overflow-x-auto">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            New Regime Tax Breakdown
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
