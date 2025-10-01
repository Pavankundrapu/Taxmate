# Indian Salaried Income Tax Calculator

A comprehensive React web application for calculating income tax for Indian salaried individuals, supporting both Old and New tax regimes with advanced features like chart visualization, PDF export, and email reporting.

## Features

### 🧮 Tax Calculation
- **Dual Regime Support**: Calculate tax under both Old and New tax regimes
- **Age-based Slabs**: Support for different age groups (Below 60, 60-80, Above 80)
- **Comprehensive Deductions**: Section 80C, 80D, HRA, Home Loan Interest
- **Accurate Calculations**: Includes rebate (87A) and health & education cess (4%)
- **HRA Calculation**: Automatic HRA exemption calculation based on salary components

### 📊 Visualization & Comparison
- **Interactive Charts**: Bar charts, line charts, and pie charts using Recharts
- **Side-by-side Comparison**: Visual comparison of Old vs New regime
- **Tax Slab Visualization**: Progress bars showing income distribution across tax slabs
- **Monthly Breakdown**: Monthly take-home salary visualization

### 📧 Reporting & Export
- **Email Reports**: Send detailed tax reports via EmailJS
- **PDF Export**: Export complete tax calculation as PDF using jsPDF
- **Chart Export**: Export comparison charts as separate PDF
- **Print-friendly Layout**: Optimized for hard copy generation

### 🎨 User Experience
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark/Light Mode**: Toggle between themes
- **Real-time Updates**: Instant calculation updates
- **Form Validation**: Comprehensive input validation
- **Tax-saving Suggestions**: Personalized recommendations

### 💾 Data Management
- **Calculation History**: Store last 5 calculations in localStorage
- **Data Persistence**: Save preferences and history
- **Export Options**: Multiple export formats

## Technology Stack

- **Frontend**: React 18 with functional components
- **Styling**: TailwindCSS with custom components
- **Charts**: Recharts for data visualization
- **PDF Export**: jsPDF + html2canvas
- **Email**: EmailJS integration
- **Build Tool**: Vite
- **State Management**: React hooks (useState, useEffect)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the project directory
   cd indian-tax-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure EmailJS (Optional)**
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Create a service and template
   - Update the EmailJS configuration in `src/components/EmailPrompt.jsx`:
     ```javascript
     const EMAILJS_SERVICE_ID = 'your_service_id';
     const EMAILJS_TEMPLATE_ID = 'your_template_id';
     const EMAILJS_USER_ID = 'your_user_id';
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The application will be ready to use!

## Project Structure

```
src/
├── components/
│   ├── IncomeForm.jsx          # Main input form component
│   ├── ResultCard.jsx          # Tax result display cards
│   ├── ComparisonChart.jsx    # Chart visualization component
│   └── EmailPrompt.jsx        # Email sending modal
├── utils/
│   ├── taxCalculator.js        # Core tax calculation logic
│   └── pdfExport.js           # PDF export functionality
├── App.jsx                     # Main application component
├── main.jsx                    # Application entry point
└── index.css                   # Global styles and TailwindCSS
```

## Usage Guide

### Basic Tax Calculation

1. **Enter Annual Salary**: Input your gross annual salary
2. **Select Age Group**: Choose your age category
3. **Choose Tax Regime**: Select between Old and New regime
4. **Add Deductions**: Enter applicable deductions:
   - Section 80C (Max: ₹1,50,000)
   - Section 80D - Health Insurance (Max: ₹25,000)
   - Home Loan Interest (Max: ₹2,00,000)
5. **HRA Details**: Enter basic salary, HRA received, and rent paid
6. **Calculate**: Click "Calculate Tax" to see results

### Advanced Features

- **View Charts**: Click "View Charts" to see detailed visualizations
- **Export PDF**: Download complete tax report as PDF
- **Email Report**: Send detailed report to your email
- **History**: View your last 5 calculations
- **Dark Mode**: Toggle between light and dark themes

## Tax Calculation Logic

### Old Regime Tax Slabs (FY 2023-24)

**Below 60 years:**
- 0 - ₹2,50,000: 0%
- ₹2,50,001 - ₹5,00,000: 5%
- ₹5,00,001 - ₹10,00,000: 20%
- Above ₹10,00,000: 30%

**60-80 years (Senior Citizens):**
- 0 - ₹3,00,000: 0%
- ₹3,00,001 - ₹5,00,000: 5%
- ₹5,00,001 - ₹10,00,000: 20%
- Above ₹10,00,000: 30%

**Above 80 years (Super Senior Citizens):**
- 0 - ₹5,00,000: 0%
- ₹5,00,001 - ₹10,00,000: 20%
- Above ₹10,00,000: 30%

### New Regime Tax Slabs (FY 2023-24)

**All age groups:**
- 0 - ₹3,00,000: 0%
- ₹3,00,001 - ₹6,00,000: 5%
- ₹6,00,001 - ₹9,00,000: 10%
- ₹9,00,001 - ₹12,00,000: 15%
- ₹12,00,001 - ₹15,00,000: 20%
- Above ₹15,00,000: 30%

### Additional Features

- **Standard Deduction**: ₹50,000 for both regimes
- **Rebate 87A**: ₹12,500 for taxable income up to ₹5,00,000
- **Health & Education Cess**: 4% on tax amount
- **HRA Calculation**: Based on salary components and location

## Customization

### Adding New Deductions
To add new deduction types, modify the `taxCalculator.js` file:

```javascript
// Add to DEDUCTION_LIMITS
const DEDUCTION_LIMITS = {
  // ... existing limits
  newDeduction: 50000 // Add your new deduction limit
};
```

### Modifying Tax Slabs
Update the `TAX_SLABS` object in `taxCalculator.js` to reflect new tax rates.

### Styling Customization
Modify `tailwind.config.js` and `src/index.css` to customize the appearance.

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist` folder can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please consult a tax advisor for professional tax planning advice.

## Support

For issues or questions:
1. Check the browser console for errors
2. Ensure all dependencies are installed
3. Verify EmailJS configuration if using email features
4. Check that all required fields are filled

## Disclaimer

This calculator is for educational and informational purposes only. Tax laws are subject to change, and this tool may not reflect the latest updates. Always consult a qualified tax advisor for professional tax planning advice.

# Environment Setup

Create a `.env` file in the project root (same folder as package.json):

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_USER_ID=your_public_key
```

Do NOT commit real keys. Add `.env` to your `.gitignore`.