
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
  proposalContent?: string;
  proposalTitle?: string;
}

export const generatePdfBlob = async (config: InvoicePdfConfig): Promise<Blob> => {
  const { invoice, client, project, companyName, companyAddress, companyPhone, companyEmail, proposalContent, proposalTitle } = config;
  
  // Import jsPDF dynamically to avoid SSR issues
  const { jsPDF } = await import('jspdf');
  const { autoTable } = await import('jspdf-autotable');
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Define colors for dark mode styling
  const colors = {
    purple: [155, 135, 245], // #9b87f5
    secondaryPurple: [126, 105, 171], // #7E69AB
    tertiaryPurple: [110, 89, 165], // #6E59A5
    darkPurple: [26, 31, 44],    // #1A1F2C
    lightPurple: [214, 188, 250], // #D6BCFA
    vividPurple: [139, 92, 246], // #8B5CF6
    skyBlue: [51, 195, 240],   // #33C3F0
    brightBlue: [30, 174, 219], // #1EAEDB
    darkGray: [34, 34, 34],    // #222222
    white: [255, 255, 255],    // #fff
    red: [234, 56, 76]         // #ea384c
  };
  
  // Set background color for the entire page
  doc.setFillColor(colors.darkPurple[0], colors.darkPurple[1], colors.darkPurple[2]);
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
  doc.text(companyName || 'Your Agency', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
  if (companyAddress) doc.text(companyAddress, 20, 33);
  if (companyPhone) doc.text(`Phone: ${companyPhone}`, 20, 39);
  if (companyEmail) doc.text(`Email: ${companyEmail}`, 20, 45);
  
  // Determine if this is a proposal or invoice
  const isProposal = !!proposalContent;
  
  // Title section (Invoice or Proposal)
  doc.setFontSize(18);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(isProposal ? `PROPOSAL` : `INVOICE #${invoice.id.substring(0, 8)}`, 190, 25, { align: 'right' });
  
  if (proposalTitle) {
    doc.setFontSize(12);
    doc.text(proposalTitle, 190, 32, { align: 'right' });
  }
  
  doc.setFontSize(10);
  doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
  doc.text(`Issue Date: ${format(new Date(invoice.issued_date), 'MMMM d, yyyy')}`, 190, isProposal ? 38 : 33, { align: 'right' });
  
  if (invoice.due_date) {
    doc.text(`Due Date: ${format(new Date(invoice.due_date), 'MMMM d, yyyy')}`, 190, isProposal ? 44 : 39, { align: 'right' });
  }
  
  // Status badge
  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return { bg: [46, 204, 113], text: [255, 255, 255] }; // green
      case 'accepted': return { bg: [46, 204, 113], text: [255, 255, 255] }; // green
      case 'overdue': return { bg: [231, 76, 60], text: [255, 255, 255] }; // red
      case 'rejected': return { bg: [231, 76, 60], text: [255, 255, 255] }; // red
      case 'cancelled': return { bg: [127, 140, 141], text: [255, 255, 255] }; // gray
      case 'sent': return { bg: [52, 152, 219], text: [255, 255, 255] }; // blue
      default: return { bg: [241, 196, 15], text: [50, 50, 50] }; // yellow for draft
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
  doc.text(isProposal ? 'PREPARED FOR:' : 'BILL TO:', 20, 75);
  
  doc.setFontSize(11);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(client.name, 20, 85);
  doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
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
    doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
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

  // Handle different content for proposal vs invoice
  if (isProposal && proposalContent) {
    // Process the proposal content
    const contentStartY = 130;
    
    // Format the content - parse markdown-like syntax
    const processContent = (content: string): string[] => {
      // Replace bold markers with actual bold text
      const lines = content.split('\n');
      const processedLines: string[] = [];
      
      let inHeading = false;
      
      for (const line of lines) {
        // If it's a heading, mark it for special handling
        if (line.startsWith('# ')) {
          processedLines.push('[h1]' + line.substring(2));
          inHeading = true;
        } else if (line.startsWith('## ')) {
          processedLines.push('[h2]' + line.substring(3));
          inHeading = true;
        } else if (line.startsWith('### ')) {
          processedLines.push('[h3]' + line.substring(4));
          inHeading = true;
        } else if (line === '---') {
          processedLines.push('[divider]');
        } else {
          // Handle bold text
          let processedLine = line.replace(/\*\*(.*?)\*\*/g, '[@bold]$1[@/bold]');
          processedLines.push(processedLine);
          inHeading = false;
        }
      }
      
      return processedLines;
    };
    
    const processedContent = processContent(proposalContent);
    
    // Now render the content with proper formatting
    let currentY = contentStartY;
    let activeSection = '';
    
    // Custom purple background for content
    doc.setFillColor(colors.darkPurple[0], colors.darkPurple[1], colors.darkPurple[2]);
    doc.roundedRect(10, contentStartY, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - contentStartY - 20, 3, 3, 'F');
    
    currentY += 10; // Add some padding at the top
    
    for (let line of processedContent) {
      // Check for special markers
      if (line.startsWith('[h1]')) {
        // Handle H1 headings
        activeSection = line.substring(4);
        doc.setFontSize(18);
        doc.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
        doc.setFont(undefined, 'bold');
        
        // Add some extra space before headings
        currentY += 5;
        
        // Purple background for headings
        const headingWidth = doc.getTextWidth(activeSection) + 10;
        doc.setFillColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
        doc.roundedRect(15, currentY - 5, headingWidth, 10, 2, 2, 'F');
        
        doc.text(activeSection, 20, currentY);
        currentY += 10;
        
        // Reset font after heading
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
      } else if (line.startsWith('[h2]')) {
        // Handle H2 headings
        activeSection = line.substring(4);
        doc.setFontSize(14);
        doc.setTextColor(colors.vividPurple[0], colors.vividPurple[1], colors.vividPurple[2]);
        doc.setFont(undefined, 'bold');
        
        // Add some extra space before headings
        currentY += 4;
        
        doc.text(activeSection, 20, currentY);
        currentY += 8;
        
        // Reset font after heading
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
      } else if (line.startsWith('[h3]')) {
        // Handle H3 headings
        activeSection = line.substring(4);
        doc.setFontSize(12);
        doc.setTextColor(colors.skyBlue[0], colors.skyBlue[1], colors.skyBlue[2]);
        doc.setFont(undefined, 'bold');
        
        // Add some extra space before headings
        currentY += 3;
        
        doc.text(activeSection, 20, currentY);
        currentY += 7;
        
        // Reset font after heading
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
      } else if (line === '[divider]') {
        // Add a divider line
        currentY += 5;
        doc.setDrawColor(colors.purple[0], colors.purple[1], colors.purple[2]);
        doc.setLineWidth(0.5);
        doc.line(20, currentY, doc.internal.pageSize.width - 20, currentY);
        currentY += 5;
      } else {
        // Handle regular text with possible bold sections
        while (line.includes('[@bold]')) {
          const boldStart = line.indexOf('[@bold]');
          const boldEnd = line.indexOf('[@/bold]');
          
          if (boldStart !== -1 && boldEnd !== -1) {
            // Get the text before the bold part
            const beforeBold = line.substring(0, boldStart);
            
            // Get the bold text
            const boldText = line.substring(boldStart + 7, boldEnd);
            
            // Update the line to be the remainder
            line = line.substring(boldEnd + 8);
            
            // Draw the text before bold
            if (beforeBold) {
              doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
              doc.setFont(undefined, 'normal');
              doc.text(beforeBold, 20, currentY);
            }
            
            // Calculate position for bold text
            const xPos = 20 + doc.getTextWidth(beforeBold);
            
            // Draw the bold text
            doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
            doc.setFont(undefined, 'bold');
            doc.text(boldText, xPos, currentY);
            
            // Update position for continuing text
            line = beforeBold + boldText + line;
          } else {
            break; // Malformed bold tags, just render as is
          }
        }
        
        // Draw any remaining text
        if (line) {
          doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
          doc.setFont(undefined, 'normal');
          doc.text(line, 20, currentY);
        }
        
        currentY += 6;
      }
      
      // Check if we need a new page
      if (currentY > doc.internal.pageSize.height - 20) {
        doc.addPage();
        doc.setFillColor(colors.darkPurple[0], colors.darkPurple[1], colors.darkPurple[2]);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
        currentY = 20;
      }
    }
  } else {
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
    doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
    doc.text('Subtotal', 120, currentY);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(`$${invoice.amount.toFixed(2)}`, 190, currentY, { align: 'right' });
    
    // Add advance payment if exists
    if (invoice.advance_payment && invoice.advance_payment > 0) {
      currentY += 10;
      doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
      doc.text('Advance Payment', 120, currentY);
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.text(`-$${invoice.advance_payment.toFixed(2)}`, 190, currentY, { align: 'right' });
    }
    
    // Add tax if exists
    if (invoice.tax_percentage && invoice.tax_percentage > 0) {
      currentY += 10;
      const taxAmount = ((invoice.amount - (invoice.advance_payment || 0)) * (invoice.tax_percentage / 100));
      doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
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
    doc.setDrawColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
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
      doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
      
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
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(colors.lightPurple[0], colors.lightPurple[1], colors.lightPurple[2]);
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
  link.download = config.proposalTitle 
    ? `Proposal-${config.proposalTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`
    : `Invoice-${config.invoice.id.substring(0, 8)}.pdf`;
  link.click();
  
  URL.revokeObjectURL(url);
};
