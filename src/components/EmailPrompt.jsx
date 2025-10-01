import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { EMAILJS_CONFIG } from '../config/emailjs';

/**
 * EmailPrompt Component
 * Handles email sending functionality using EmailJS
 */
const EmailPrompt = ({ 
  isOpen, 
  onClose, 
  taxResults, 
  userInputs,
  onEmailSent 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Prepare email template data
      const templateParams = {
        to_email: email,
        user_name: 'Tax Calculator User',
        annual_salary: taxResults.oldResult.grossSalary,
        old_regime_tax: taxResults.oldResult.finalTax,
        new_regime_tax: taxResults.newResult.finalTax,
        recommended_regime: taxResults.oldResult.finalTax < taxResults.newResult.finalTax ? 'Old Regime' : 'New Regime',
        savings_amount: Math.abs(taxResults.oldResult.finalTax - taxResults.newResult.finalTax),
        monthly_take_home_old: taxResults.oldResult.monthlyTakeHome,
        monthly_take_home_new: taxResults.newResult.monthlyTakeHome,
        calculation_date: new Date().toLocaleDateString()
      };

      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.USER_ID
      );

      setMessage('Tax report sent successfully to your email!');
      onEmailSent(email);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setEmail('');
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error('Email sending failed:', error);
      setMessage('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Get Tax Report via Email
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter your email address to receive a detailed tax calculation report.
          </p>

          <form onSubmit={handleEmailSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {message}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading || !email}
                className={`btn-primary flex-1 ${
                  isLoading || !email ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Report'}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailPrompt;
