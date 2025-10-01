/**
 * EmailJS Configuration
 * 
 * To set up EmailJS:
 * 1. Go to https://www.emailjs.com/
 * 2. Create an account and verify your email
 * 3. Create a new service (Gmail, Outlook, etc.)
 * 4. Create an email template with the following variables:
 *    - {{to_email}}
 *    - {{user_name}}
 *    - {{annual_salary}}
 *    - {{old_regime_tax}}
 *    - {{new_regime_tax}}
 *    - {{recommended_regime}}
 *    - {{savings_amount}}
 *    - {{monthly_take_home_old}}
 *    - {{monthly_take_home_new}}
 *    - {{calculation_date}}
 * 5. Copy your Service ID, Template ID, and User ID below
 */

// EmailJS Configuration (loaded from Vite env variables)
// Create a .env file with VITE_ prefixed keys. See .env.example.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

export const EMAILJS_CONFIG = {
  SERVICE_ID,
  TEMPLATE_ID,
  USER_ID
};

// Email template variables (for reference)
export const EMAIL_TEMPLATE_VARIABLES = {
  to_email: 'Recipient email address',
  user_name: 'User name',
  annual_salary: 'Annual salary amount',
  old_regime_tax: 'Old regime tax amount',
  new_regime_tax: 'New regime tax amount',
  recommended_regime: 'Recommended tax regime',
  savings_amount: 'Amount saved with recommended regime',
  monthly_take_home_old: 'Monthly take home (Old regime)',
  monthly_take_home_new: 'Monthly take home (New regime)',
  calculation_date: 'Date of calculation'
};

// Sample email template HTML
export const SAMPLE_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <title>Tax Calculation Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .highlight { background-color: #f0f9ff; padding: 15px; border-left: 4px solid #2563eb; }
        .comparison { display: flex; justify-content: space-between; }
        .regime { flex: 1; margin: 0 10px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .old-regime { border-color: #ef4444; }
        .new-regime { border-color: #10b981; }
        .recommended { background-color: #dcfce7; border-color: #10b981; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Indian Income Tax Calculator Report</h1>
        <p>Generated on {{calculation_date}}</p>
    </div>
    
    <div class="content">
        <div class="section">
            <h2>Tax Calculation Summary</h2>
            <p><strong>Annual Salary:</strong> {{annual_salary}}</p>
            <p><strong>Recommended Regime:</strong> {{recommended_regime}}</p>
            <p><strong>Potential Annual Savings:</strong> {{savings_amount}}</p>
        </div>
        
        <div class="section">
            <h2>Regime Comparison</h2>
            <div class="comparison">
                <div class="regime old-regime">
                    <h3>Old Regime</h3>
                    <p><strong>Tax Payable:</strong> {{old_regime_tax}}</p>
                    <p><strong>Monthly Take Home:</strong> {{monthly_take_home_old}}</p>
                </div>
                <div class="regime new-regime">
                    <h3>New Regime</h3>
                    <p><strong>Tax Payable:</strong> {{new_regime_tax}}</p>
                    <p><strong>Monthly Take Home:</strong> {{monthly_take_home_new}}</p>
                </div>
            </div>
        </div>
        
        <div class="section highlight">
            <h3>Important Note</h3>
            <p>This calculation is for educational purposes only. Tax laws are subject to change, and this tool may not reflect the latest updates. Always consult a qualified tax advisor for professional tax planning advice.</p>
        </div>
    </div>
</body>
</html>
`;
