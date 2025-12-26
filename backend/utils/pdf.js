
const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = (content, title = 'Document', docType = 'proposal') => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 60,
          right: 60
        }
      });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Professional header
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text(title, { align: 'center' })
         .moveDown(0.5);

      // Subtitle
      doc.fontSize(12)
         .font('Helvetica')
         .text(docType === 'proposal' ? 'Professional Business Proposal' : 'Service Agreement Contract', {
           align: 'center'
         })
         .moveDown(1);

      // Decorative line
      doc.moveTo(60, doc.y)
         .lineTo(535, doc.y)
         .stroke()
         .moveDown(1);

      // Process and format content
      const formattedContent = formatContentForPDF(content, docType);
      
      // Add main content with proper styling
      doc.fontSize(11)
         .font('Helvetica')
         .text(formattedContent, {
           align: 'left',
           lineGap: 4,
           paragraphGap: 12
         });


      // Add footer with page numbers
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(9)
           .font('Helvetica')
           .text(
             `Generated on ${new Date().toLocaleDateString()} | Page ${i + 1} of ${pages.count}`,
             60,
             doc.page.height - 40,
             { align: 'center' }
           );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Format content for professional PDF appearance
const formatContentForPDF = (content, docType) => {
  let formatted = content;
  
  // Clean up markdown formatting for better PDF appearance
  formatted = formatted.replace(/^# (.*$)/gim, '\n\n$1\n' + '='.repeat(50))
                      .replace(/^## (.*$)/gim, '\n\n$1\n' + '-'.repeat(30))
                      .replace(/^### (.*$)/gim, '\n\n$1')
                      .replace(/^#### (.*$)/gim, '\n\n$1')
                      .replace(/^\*\*([^*]+)\*\*/gim, '$1') // Bold
                      .replace(/^\*([^*]+)\*/gim, '$1')     // Italic
                      .replace(/^- /gim, '• ')              // Bullet points
                      .replace(/✓/gim, '✓')                 // Checkmarks
                      .replace(/\n{3,}/g, '\n\n');          // Multiple line breaks

  // Add professional spacing for proposals vs contracts
  if (docType === 'contract') {
    formatted = formatted.replace(/^ARTICLE \d+:/gim, '\n\nARTICLE $0');
    formatted = formatted.replace(/^([A-Z\s]{3,})$/gim, '\n\n$1\n' + '-'.repeat(20));
  }

  return formatted;
};

module.exports = {
  generatePDF
};
