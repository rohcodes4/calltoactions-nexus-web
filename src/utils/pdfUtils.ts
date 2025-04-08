
import { Invoice, Client, Project } from '@/lib/supabase';
import { format } from 'date-fns';

interface InvoicePdfConfig {
  invoice: Invoice;
  client: Client;
  project?: Project | null;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export const generatePdfBlob = async (config: InvoicePdfConfig): Promise<Blob> => {
  const { invoice, client, project, companyName, companyAddress, companyPhone, companyEmail } = config;
  
  // Import jsPDF dynamically to avoid SSR issues
  const { jsPDF } = await import('jspdf');
  const { autoTable } = await import('jspdf-autotable');
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Define colors for dark mode styling
  const colors = {
    purple: [121, 40, 202],     // #7928CA - agency-purple
    blue: [31, 174, 233],       // #1FAEE9 - agency-blue
    teal: [0, 220, 204],        // #00DCCC - agency-teal
    dark: [16, 16, 22],         // #101016 - dark background
    darkGray: [40, 40, 50],     // #282832 - dark gray for sections
    mediumGray: [80, 80, 90],   // #50505A - medium gray for borders
    lightGray: [160, 160, 170], // #A0A0AA - light gray for text
    white: [240, 240, 245],     // #F0F0F5 - off-white for main text
  };
  
  // Set background color for the entire page
  doc.setFillColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  // Add a stylish header
  // Header gradient rectangle
  doc.setFillColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.roundedRect(10, 10, doc.internal.pageSize.width - 20, 45, 3, 3, 'F');
  
  // Purple accent line
  doc.setFillColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  doc.rect(10, 10, 5, 45, 'F');
  
  // Company details
  doc.setFontSize(22);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(companyName || 'Your Company', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  if (companyAddress) doc.text(companyAddress, 20, 33);
  if (companyPhone) doc.text(`Phone: ${companyPhone}`, 20, 39);
  if (companyEmail) doc.text(`Email: ${companyEmail}`, 20, 45);
  
  // Invoice details
  doc.setFontSize(18);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(`INVOICE #${invoice.id.substring(0, 8)}`, 190, 25, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.text(`Issue Date: ${format(new Date(invoice.issued_date), 'MMMM d, yyyy')}`, 190, 33, { align: 'right' });
  
  if (invoice.due_date) {
    doc.text(`Due Date: ${format(new Date(invoice.due_date), 'MMMM d, yyyy')}`, 190, 39, { align: 'right' });
  }
  
  // Status badge
  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return { bg: [46, 204, 113], text: [255, 255, 255] }; // green
      case 'overdue': return { bg: [231, 76, 60], text: [255, 255, 255] }; // red
      case 'cancelled': return { bg: [127, 140, 141], text: [255, 255, 255] }; // gray
      default: return { bg: [241, 196, 15], text: [50, 50, 50] }; // yellow
    }
  };
  
  const statusColors = getStatusColors(invoice.status);
  doc.setFillColor(statusColors.bg[0], statusColors.bg[1], statusColors.bg[2]);
  doc.roundedRect(150, 42, 40, 10, 2, 2, 'F');
  doc.setTextColor(statusColors.text[0], statusColors.text[1], statusColors.text[2]);
  doc.setFont(undefined, 'bold');
  const status = invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);
  doc.text(status, 170, 48, { align: 'center' });
  doc.setFont(undefined, 'normal');
  
  // Client section
  // Client background
  doc.setFillColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.roundedRect(10, 65, 90, 55, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  doc.text('BILL TO:', 20, 75);
  
  doc.setFontSize(11);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(client.name, 20, 85);
  doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  if (client.company) doc.text(client.company, 20, 92);
  if (client.address) doc.text(client.address, 20, 99);
  doc.text(`Email: ${client.email}`, 20, 106);
  if (client.phone) doc.text(`Phone: ${client.phone}`, 20, 113);
  
  // Project information if available
  if (project) {
    // Project background
    doc.setFillColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.roundedRect(110, 65, 90, 55, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
    doc.text('PROJECT:', 120, 75);
    
    doc.setFontSize(11);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(project.title, 120, 85);
    doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    if (project.description) {
      // Split the description to fit in the box with max 4 lines
      const maxLength = 30;
      const desc = project.description.substring(0, 120);
      
      if (desc.length > maxLength) {
        const words = desc.split(' ');
        let line = '';
        let currentY = 92;
        
        for (const word of words) {
          if ((line + word).length > maxLength) {
            doc.text(line, 120, currentY);
            line = word + ' ';
            currentY += 7;
            
            // Only show 3 lines max
            if (currentY > 106) {
              if (word !== words[words.length - 1]) {
                doc.text(line + '...', 120, currentY);
              } else {
                doc.text(line, 120, currentY);
              }
              break;
            }
          } else {
            line += word + ' ';
          }
        }
        
        if (currentY <= 106) {
          doc.text(line, 120, currentY);
        }
      } else {
        doc.text(desc, 120, 92);
      }
    }
  }
  
  // Invoice details section
  // Heading for invoice details
  doc.setFillColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  doc.rect(10, 130, doc.internal.pageSize.width - 20, 10, 'F');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('SERVICE DETAILS', 20, 137);
  doc.setFont(undefined, 'normal');
  
  // Invoice items table
  autoTable(doc, {
    startY: 145,
    head: [['Description', 'Quantity', 'Rate', 'Amount']],
    body: [
      ['Professional Services', '1', `$${invoice.amount.toFixed(2)}`, `$${invoice.amount.toFixed(2)}`],
    ],
    theme: 'grid',
    styles: {
      fontSize: 10,
      textColor: [240, 240, 245],
      lineColor: [80, 80, 90],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [50, 50, 60],
      textColor: [240, 240, 245],
      fontStyle: 'bold',
    },
    bodyStyles: {
      fillColor: [40, 40, 50],
    },
    alternateRowStyles: {
      fillColor: [35, 35, 45],
    },
  });
  
  // Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Summary section
  // Summary background
  doc.setFillColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.roundedRect(110, finalY, 90, 60, 3, 3, 'F');
  
  let currentY = finalY + 15;
  
  // Subtotal
  doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  doc.text('Subtotal', 120, currentY);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(`$${invoice.amount.toFixed(2)}`, 190, currentY, { align: 'right' });
  
  // Add advance payment if exists
  if (invoice.advance_payment && invoice.advance_payment > 0) {
    currentY += 10;
    doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.text('Advance Payment', 120, currentY);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(`-$${invoice.advance_payment.toFixed(2)}`, 190, currentY, { align: 'right' });
  }
  
  // Add tax if exists
  if (invoice.tax_percentage && invoice.tax_percentage > 0) {
    currentY += 10;
    const taxAmount = ((invoice.amount - (invoice.advance_payment || 0)) * (invoice.tax_percentage / 100));
    doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.text(`${invoice.custom_tax_name || 'Tax'} (${invoice.tax_percentage}%)`, 120, currentY);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(`$${taxAmount.toFixed(2)}`, 190, currentY, { align: 'right' });
  }
  
  // Calculate total
  const total = invoice.amount - (invoice.advance_payment || 0) + 
    ((invoice.amount - (invoice.advance_payment || 0)) * ((invoice.tax_percentage || 0) / 100));
  
  // Total line
  currentY += 15;
  // Total separator line
  doc.setDrawColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2]);
  doc.line(120, currentY - 5, 190, currentY - 5);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
  doc.text('TOTAL DUE', 120, currentY);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(`$${total.toFixed(2)}`, 190, currentY, { align: 'right' });
  doc.setFont(undefined, 'normal');
  
  // Notes section
  if (invoice.notes) {
    const notesY = finalY + 70;
    
    // Notes background
    doc.setFillColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.roundedRect(10, notesY, doc.internal.pageSize.width - 20, 40, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
    doc.text('NOTES:', 20, notesY + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    
    // Handle multi-line notes
    const noteLines = doc.splitTextToSize(invoice.notes, 170);
    doc.text(noteLines, 20, notesY + 20);
  }
  
  // Payment status large watermark if paid
  if (invoice.status.toLowerCase() === 'paid') {
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
    doc.setTextColor(46, 204, 113); // Green color
    doc.setFontSize(80);
    doc.text('PAID', 105, 160, {
      align: 'center',
      angle: 30
    });
    doc.restoreGraphicsState();
    
    // Payment date info
    if (invoice.paid_date) {
      const paidY = finalY + (invoice.notes ? 120 : 70);
      doc.setFontSize(10);
      doc.setTextColor(46, 204, 113); // Green color
      doc.text(`Payment received on ${format(new Date(invoice.paid_date), 'MMMM d, yyyy')}`, 
        doc.internal.pageSize.width / 2, paidY, { align: 'center' });
    }
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, 190, 280, { align: 'right' });
    
    // Add a footer line
    doc.setDrawColor(colors.purple[0], colors.purple[1], colors.purple[2]);
    doc.line(10, 275, doc.internal.pageSize.width - 10, 275);
    
    // Add company name in footer
    doc.text(companyName || 'Your Company', 10, 280);
  }
  
  // Return the blob
  return doc.output('blob');
};

export const downloadPdf = async (config: InvoicePdfConfig) => {
  const blob = await generatePdfBlob(config);
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${config.invoice.id.substring(0, 8)}.pdf`;
  link.click();
  
  URL.revokeObjectURL(url);
};
