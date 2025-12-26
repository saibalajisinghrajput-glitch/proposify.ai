
/* eslint-disable no-console */
// Enhanced PDF Generation utilities for ProposifyAI
// Fixed PDF generation with comprehensive error handling and multiple export options

// Professional PDF Generation Class
class PDFGenerator {
  constructor() {
    this.defaultOptions = {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2
    };
    
    this.fonts = {
      header: { size: 18, style: 'bold' },
      subheader: { size: 14, style: 'bold' },
      body: { size: 11, style: 'normal' },
      small: { size: 9, style: 'normal' }
    };

    // Check if jsPDF is available
    this.hasJsPDF = typeof window.jsPDF !== 'undefined';
    this.hasHtml2Canvas = typeof window.html2canvas !== 'undefined';
  }

  // Validate PDF generation input
  validateInput(data) {
    if (!data) {
      throw new Error('No data provided for PDF generation');
    }
    
    if (!data.content && !data.html) {
      throw new Error('No content provided for PDF generation');
    }
    
    return true;
  }

  // Create enhanced HTML content for PDF
  createEnhancedHTML(data, options = {}) {

    const {
      title = 'Document',
      subtitle = '',
      // eslint-disable-next-line no-unused-vars
      docType = 'proposal',
      company = 'ProposifyAI',
      logo = null,
      clientInfo = {},
      date = new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } = options;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .logo {
            max-height: 60px;
            margin-bottom: 15px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 10px;
          }
          .date {
            font-size: 12px;
            color: #9ca3af;
          }
          .client-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #2563eb;
            page-break-inside: avoid;
          }
          .client-info h3 {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .client-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 12px;
          }
          .detail-item {
            display: flex;
            justify-content: space-between;
          }
          .detail-label {
            font-weight: 600;
            color: #4b5563;
          }
          .detail-value {
            color: #1f2937;
          }
          .content {
            white-space: pre-wrap;
            line-height: 1.8;
            font-size: 12px;
            color: #374151;
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          .content h1, .content h2, .content h3 {
            color: #1f2937;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          .content h1 { font-size: 18px; }
          .content h2 { font-size: 16px; }
          .content h3 { font-size: 14px; }
          .footer {
            position: fixed;
            bottom: 15mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            page-break-inside: avoid;
          }
          .page-break {
            page-break-before: always;
          }
          @media print {
            body { margin: 0; padding: 20mm; }
            .footer { position: fixed; bottom: 15mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : ''}
          <div class="company-name">${company}</div>
          <div class="title">${title}</div>
          ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
          <div class="date">Generated on ${date}</div>
        </div>

        ${Object.keys(clientInfo).length > 0 ? `
          <div class="client-info">
            <h3>Client Information</h3>
            <div class="client-details">
              ${Object.entries(clientInfo).map(([key, value]) => `
                <div class="detail-item">
                  <span class="detail-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span class="detail-value">${value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="content">${data.content || data.html}</div>
        
        <div class="footer">
          Generated by ProposifyAI | Page <span class="page-number"></span> of <span class="total-pages"></span>
        </div>

        <script>
          // Add page numbering
          document.addEventListener('DOMContentLoaded', function() {
            const pageNumber = document.querySelector('.page-number');
            const totalPages = document.querySelector('.total-pages');
            
            // For print dialog, we can't determine total pages in JavaScript
            // This is handled by the print CSS
            if (pageNumber) pageNumber.textContent = '1';
            if (totalPages) totalPages.textContent = '1';
          });
        </script>
      </body>
      </html>
    `;

    return htmlTemplate;
  }


  // Generate PDF using print dialog (most reliable)
  generatePrintPDF(data, options = {}) {
    try {
      // eslint-disable-next-line no-console
      console.log('🖨️ Generating PDF using print dialog...');
      
      const htmlContent = this.createEnhancedHTML(data, options);
      
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for PDF generation.');
      }
      
      // Write content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Auto-print after content loads
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.print();
          // Don't auto-close to let user save manually
        }, 1000);
      });
      

      // eslint-disable-next-line no-console
      console.log('✅ Print PDF generation initiated');
      return { success: true, method: 'print' };
      
    } catch (error) {

      // eslint-disable-next-line no-console
      console.error('❌ Print PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }


  // Generate PDF using browser's download functionality
  generateDownloadPDF(data, options = {}) {
    try {
      // eslint-disable-next-line no-console
      console.log('💾 Generating PDF for download...');
      
      const htmlContent = this.createEnhancedHTML(data, options);
      
      // Create a hidden div with the content
      const printDiv = document.createElement('div');
      printDiv.style.position = 'absolute';
      printDiv.style.left = '-9999px';
      printDiv.style.top = '-9999px';
      printDiv.style.width = '210mm';
      printDiv.style.background = 'white';
      printDiv.innerHTML = htmlContent;
      
      // Temporarily add to body
      document.body.appendChild(printDiv);
      
      // Trigger print dialog
      window.print();
      
      // Remove the div after printing
      setTimeout(() => {
        document.body.removeChild(printDiv);
      }, 2000);
      

      // eslint-disable-next-line no-console
      console.log('✅ Download PDF generation initiated');
      return { success: true, method: 'download' };
      
    } catch (error) {

      // eslint-disable-next-line no-console
      console.error('❌ Download PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }


  // Generate text file as fallback
  generateTextFile(data, filename = 'document.txt') {
    try {
      // eslint-disable-next-line no-console
      console.log('📝 Generating text file as fallback...');
      
      const content = data.content || data.html || 'No content provided';
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      element.style.display = 'none';
      
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      

      // eslint-disable-next-line no-console
      console.log('✅ Text file generated successfully');
      return { success: true, method: 'text', filename: element.download };
      
    } catch (error) {

      // eslint-disable-next-line no-console
      console.error('❌ Text file generation failed:', error);
      throw new Error(`Text file generation failed: ${error.message}`);
    }
  }

  // Generate proposal PDF
  generateProposalPDF(proposalData, options = {}) {
    try {
      this.validateInput(proposalData);
      
      const {
        clientName = 'Demo Client',
        clientCompany = 'Demo Company',
        content = 'No content provided',
        budget = '',
        timeline = '',
        serviceType = '',
        currency = 'INR'
      } = proposalData;

      const data = { content };
      const pdfOptions = {
        title: 'Business Proposal',
        subtitle: `For ${clientCompany}`,
        docType: 'proposal',
        clientInfo: {
          'Client Name': clientName,
          'Company': clientCompany,
          'Service Type': serviceType,
          'Budget': budget,
          'Timeline': timeline,
          'Currency': currency
        },
        ...options
      };

      // Try print PDF first
      try {
        return this.generatePrintPDF(data, pdfOptions);
      } catch (printError) {
        console.warn('Print PDF failed, trying download:', printError);
        return this.generateDownloadPDF(data, pdfOptions);
      }
      
    } catch (error) {

      // eslint-disable-next-line no-console
      console.error('❌ Error generating proposal PDF:', error);
      // Fallback to text file
      return this.generateTextFile(proposalData, 'proposal.txt');
    }
  }

  // Generate contract PDF
  generateContractPDF(contractData, options = {}) {
    try {
      this.validateInput(contractData);
      
      const {
        clientName = 'Demo Client',
        clientCompany = 'Demo Company',
        content = 'No content provided',
        currency = 'INR'
      } = contractData;

      const data = { content };
      const pdfOptions = {
        title: 'Service Agreement Contract',
        subtitle: `Between ProposifyAI & ${clientCompany}`,
        docType: 'contract',
        clientInfo: {
          'Client Name': clientName,
          'Company': clientCompany,
          'Document Type': 'Service Agreement',
          'Currency': currency
        },
        ...options
      };

      try {
        return this.generatePrintPDF(data, pdfOptions);
      } catch (printError) {
        console.warn('Print PDF failed, trying download:', printError);
        return this.generateDownloadPDF(data, pdfOptions);
      }
      
    } catch (error) {

      // eslint-disable-next-line no-console
      console.error('❌ Error generating contract PDF:', error);
      return this.generateTextFile(contractData, 'contract.txt');
    }
  }

  // Generate resume PDF
  generateResumePDF(resumeData, options = {}) {
    try {
      this.validateInput(resumeData);
      
      const {
        candidateName = 'Demo Candidate',
        jobRole = 'Software Developer',
        content = 'No content provided',
        skills = [],
        experienceLevel = 'Entry Level'
      } = resumeData;

      const data = { content };
      const pdfOptions = {
        title: 'Professional Resume',
        subtitle: `${candidateName} - ${jobRole}`,
        docType: 'resume',
        clientInfo: {
          'Name': candidateName,
          'Position': jobRole,
          'Experience': experienceLevel,
          'Skills': Array.isArray(skills) ? skills.join(', ') : skills
        },
        ...options
      };

      try {
        return this.generatePrintPDF(data, pdfOptions);
      } catch (printError) {
        console.warn('Print PDF failed, trying download:', printError);
        return this.generateDownloadPDF(data, pdfOptions);
      }
      
    } catch (error) {

      // eslint-disable-next-line no-console
      console.error('❌ Error generating resume PDF:', error);
      return this.generateTextFile(resumeData, 'resume.txt');
    }
  }

  // Generate offer letter PDF
  generateOfferLetterPDF(offerData, options = {}) {
    try {
      this.validateInput(offerData);
      
      const {
        candidateName = 'Demo Candidate',
        position = 'Software Engineer',
        companyName = 'Demo Company',
        content = 'No content provided',
        stipend = '$75,000',
        startDate = '2024-01-15'
      } = offerData;

      const data = { content };
      const pdfOptions = {
        title: 'Job Offer Letter',
        subtitle: `For ${candidateName}`,
        docType: 'offer',
        clientInfo: {
          'Candidate': candidateName,
          'Position': position,
          'Company': companyName,
          'Stipend': stipend,
          'Start Date': startDate
        },
        ...options
      };

      try {
        return this.generatePrintPDF(data, pdfOptions);
      } catch (printError) {
        console.warn('Print PDF failed, trying download:', printError);
        return this.generateDownloadPDF(data, pdfOptions);
      }
      
    } catch (error) {

      // eslint-disable-next-line no-console
      console.error('❌ Error generating offer letter PDF:', error);
      return this.generateTextFile(offerData, 'offer-letter.txt');
    }
  }



  // Universal PDF generation function
  generatePDF(data, options = {}) {
    // Extract docType and title outside try block to ensure scope in catch block
    const {
      docType = 'document',
      title = 'Document'
    } = options;

    try {
      this.validateInput(data);

      // eslint-disable-next-line no-console
      console.log(`📄 Generating ${docType} PDF...`);

      switch (docType) {
        case 'proposal':
          return this.generateProposalPDF(data, options);
        case 'contract':
          return this.generateContractPDF(data, options);
        case 'resume':
          return this.generateResumePDF(data, options);
        case 'offer':
          return this.generateOfferLetterPDF(data, options);
        default:
          // Generic document
          const dataObj = { content: data.content || data.html || 'No content provided' };
          const genericOptions = { title, docType, ...options };
          
          try {
            return this.generatePrintPDF(dataObj, genericOptions);
          } catch (error) {
            return this.generateDownloadPDF(dataObj, genericOptions);
          }
      }
      
    } catch (error) {

      // eslint-disable-next-line no-console
      console.error('❌ Generic PDF generation failed:', error);
      return this.generateTextFile(data, `${docType || 'document'}.txt`);
    }
  }
}

// Create and export singleton instance
const pdfGenerator = new PDFGenerator();

// Export convenience functions
export const generatePDF = (data, options = {}) => {
  return pdfGenerator.generatePDF(data, options);
};

export const generateProposalPDF = (data, options = {}) => {
  return pdfGenerator.generateProposalPDF(data, options);
};

export const generateContractPDF = (data, options = {}) => {
  return pdfGenerator.generateContractPDF(data, options);
};

export const generateResumePDF = (data, options = {}) => {
  return pdfGenerator.generateResumePDF(data, options);
};

export const generateOfferLetterPDF = (data, options = {}) => {
  return pdfGenerator.generateOfferLetterPDF(data, options);
};

// Backward compatibility exports
export const generateDemoPDF = (content, title = 'Document', docType = 'proposal') => {
  return pdfGenerator.generatePDF({ content }, { title, docType });
};

export const downloadAsPDF = (content, title = 'Document', docType = 'proposal') => {
  return pdfGenerator.generatePDF({ content }, { title, docType });
};

export const downloadAsText = (content, title = 'Document') => {
  return pdfGenerator.generateTextFile({ content }, `${title}.txt`);
};

export default pdfGenerator;

