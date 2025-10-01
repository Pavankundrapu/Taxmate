import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// Currency symbols are intentionally omitted in PDF output

/**
 * PDF Export Utility
 * Handles exporting tax calculation results as PDF
 */

/**
 * Export tax calculation results as PDF
 * @param {Object} taxResults - Tax calculation results
 * @param {Object} userInputs - User input data
 * @param {string} chartElementId - ID of the chart element to include
 */
export const exportToPDF = async (taxResults, userInputs, chartElementId = 'comparison-chart') => {
  try {
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const formatNumber = (amount) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);
    const MARGIN_X = 18;
    const MARGIN_Y = 18;
    const CONTENT_WIDTH = pageWidth - MARGIN_X * 2;
    let yPosition = MARGIN_Y;

    // Layout helpers
    const ensurePageSpace = (requiredHeight = 10) => {
      if (yPosition + requiredHeight > pageHeight - MARGIN_Y) {
        pdf.addPage();
        yPosition = MARGIN_Y;
      }
    };

    const addDivider = (extraTopSpace = 6, extraBottomSpace = 6) => {
      ensurePageSpace(extraTopSpace + extraBottomSpace + 1);
      yPosition += extraTopSpace;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(MARGIN_X, yPosition, pageWidth - MARGIN_X, yPosition);
      yPosition += extraBottomSpace;
    };

    const addSectionHeading = (text, color = '#111827') => {
      ensurePageSpace(12);
      pdf.setFontSize(13);
      pdf.setTextColor(color);
      pdf.text(text, MARGIN_X, yPosition);
      yPosition += 4;
      addDivider(3, 5);
    };

    const addSmallText = (text, align = 'left') => {
      ensurePageSpace(6);
      pdf.setFontSize(10);
      pdf.setTextColor('#6b7280');
      const x = align === 'center' ? pageWidth / 2 : MARGIN_X;
      pdf.text(text, x, yPosition, { align });
      yPosition += 6;
    };

    const addTitle = (title, subtitle) => {
      ensurePageSpace(22);
      pdf.setFontSize(18);
      pdf.setTextColor('#2563eb');
      pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      if (subtitle) {
        addSmallText(subtitle, 'center');
      }
      yPosition += 2;
    };

    const measureTextWidth = (text, fontSize) => {
      const size = fontSize || pdf.getFontSize();
      return (pdf.getStringUnitWidth(String(text)) * size) / pdf.internal.scaleFactor;
    };

    const addKeyValueRow = (label, value, options = {}) => {
      const rowHeight = options.rowHeight || 7;
      const fontSize = options.fontSize || 11;
      const labelColor = options.labelColor || '#374151';
      const valueColor = options.valueColor || '#111827';
      const gap = 6; // space between dotted leader and value
      const valueMaxX = MARGIN_X + CONTENT_WIDTH; // right aligned

      ensurePageSpace(rowHeight);

      // Label
      pdf.setFontSize(fontSize);
      pdf.setTextColor(labelColor);
      pdf.setFont(undefined, 'normal');
      pdf.text(label, MARGIN_X, yPosition);

      // Value (right aligned)
      pdf.setTextColor(valueColor);
      pdf.setFont(undefined, 'bold');
      const valueWidth = measureTextWidth(value, fontSize);
      const valueX = valueMaxX; // right edge reference for alignment
      pdf.text(String(value), valueX, yPosition, { align: 'right' });
      pdf.setFont(undefined, 'normal');

      // Dotted leader between label end and value start
      const labelWidth = measureTextWidth(label, fontSize);
      const startX = MARGIN_X + labelWidth + 3;
      const endX = valueX - valueWidth - gap;
      if (endX - startX > 10) {
        pdf.setDrawColor(210, 210, 210);
        pdf.setLineDash([0.8, 1.8], 0);
        pdf.line(startX, yPosition - 2, endX, yPosition - 2);
        pdf.setLineDash();
      }

      yPosition += rowHeight;
    };

    const addKeyValueBlock = (title, color, rows) => {
      addSectionHeading(title, color);
      rows.forEach(({ label, value }) => addKeyValueRow(label, value));
    };

    // Title + Date
    addTitle('Indian Income Tax Calculator Report', `Generated on: ${new Date().toLocaleDateString()}`);

    // User Information
    addSectionHeading('Tax Calculation Summary', '#111827');

    // Basic Information
    const basicInfo = [
      { label: 'Annual Salary', value: formatNumber(userInputs.annualSalary) },
      { label: 'Age Group', value: (userInputs.ageGroup === 'below60' ? 'Below 60' : 
                   userInputs.ageGroup === '60-80' ? '60-80 (Senior)' : 'Above 80 (Super Senior)') },
      { label: 'Calculation Date', value: new Date().toLocaleDateString() }
    ];

    basicInfo.forEach(({ label, value }) => addKeyValueRow(label, value));
    addDivider(8, 6);

    // Old Regime Results
    addKeyValueBlock('OLD REGIME CALCULATION', '#2563eb', [
      { label: 'Gross Salary', value: formatNumber(taxResults.oldResult.grossSalary) },
      { label: 'Standard Deduction', value: formatNumber(taxResults.oldResult.standardDeduction) },
      { label: 'Total Deductions', value: formatNumber(taxResults.oldResult.totalDeductions) },
      { label: 'Taxable Income', value: formatNumber(taxResults.oldResult.taxableIncome) },
      { label: 'Tax Before Rebate', value: formatNumber(taxResults.oldResult.taxBeforeRebate) },
      { label: 'Rebate (87A)', value: formatNumber(taxResults.oldResult.rebate) },
      { label: 'Tax After Rebate', value: formatNumber(taxResults.oldResult.taxAfterRebate) },
      { label: 'Health & Education Cess', value: formatNumber(taxResults.oldResult.cess) },
      { label: 'Final Tax Payable', value: formatNumber(taxResults.oldResult.finalTax) },
      { label: 'Monthly Take Home', value: formatNumber(taxResults.oldResult.monthlyTakeHome) }
    ]);
    addDivider(10, 8);

    // New Regime Results
    addKeyValueBlock('NEW REGIME CALCULATION', '#10b981', [
      { label: 'Gross Salary', value: formatNumber(taxResults.newResult.grossSalary) },
      { label: 'Standard Deduction', value: formatNumber(taxResults.newResult.standardDeduction) },
      { label: 'Total Deductions', value: formatNumber(taxResults.newResult.totalDeductions) },
      { label: 'Taxable Income', value: formatNumber(taxResults.newResult.taxableIncome) },
      { label: 'Tax Before Rebate', value: formatNumber(taxResults.newResult.taxBeforeRebate) },
      { label: 'Rebate (87A)', value: formatNumber(taxResults.newResult.rebate) },
      { label: 'Tax After Rebate', value: formatNumber(taxResults.newResult.taxAfterRebate) },
      { label: 'Health & Education Cess', value: formatNumber(taxResults.newResult.cess) },
      { label: 'Final Tax Payable', value: formatNumber(taxResults.newResult.finalTax) },
      { label: 'Monthly Take Home', value: formatNumber(taxResults.newResult.monthlyTakeHome) }
    ]);
    addDivider(10, 8);

    // Comparison Summary
    const savings = Math.abs(taxResults.oldResult.finalTax - taxResults.newResult.finalTax);
    const betterRegime = taxResults.oldResult.finalTax < taxResults.newResult.finalTax ? 'Old Regime' : 'New Regime';

    addSectionHeading('COMPARISON SUMMARY', '#dc2626');
    addKeyValueRow('Old Regime Tax', formatNumber(taxResults.oldResult.finalTax));
    addKeyValueRow('New Regime Tax', formatNumber(taxResults.newResult.finalTax));
    addKeyValueRow('Recommended Regime', betterRegime);
    addKeyValueRow('Annual Savings', formatNumber(savings));
    addKeyValueRow('Monthly Savings', formatNumber(savings / 12));

    // Add new page for chart if needed
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = MARGIN_Y;
    }

    // Try to capture and add chart
    try {
      const chartElement = document.getElementById(chartElementId);
      if (chartElement) {
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = CONTENT_WIDTH;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add new page if needed
        if (yPosition + imgHeight + 20 > pageHeight - MARGIN_Y) {
          pdf.addPage();
          yPosition = MARGIN_Y;
        }
        // Chart title
        addSectionHeading('Comparison Chart', '#111827');
        pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
      }
    } catch (error) {
      console.warn('Could not capture chart:', error);
    }

    // Add footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor('#666666');
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Generated by Indian Tax Calculator', pageWidth / 2, pageHeight - 5, { align: 'center' });
    }

    // Save the PDF
    const fileName = `tax-calculation-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('PDF export failed:', error);
    return { success: false, error: error.message };
  }
};

// Chart-only PDF export has been removed as per user request.
