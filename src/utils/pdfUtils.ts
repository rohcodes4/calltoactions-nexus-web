
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
  
  // Company details
  doc.setFontSize(20);
  doc.setTextColor(51, 51, 153);
  doc.text(companyName || 'Your Company', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  if (companyAddress) doc.text(companyAddress, 20, 30);
  if (companyPhone) doc.text(`Phone: ${companyPhone}`, 20, 35);
  if (companyEmail) doc.text(`Email: ${companyEmail}`, 20, 40);
  
  // Invoice details
  doc.setFontSize(16);
  doc.setTextColor(51, 51, 153);
  doc.text(`INVOICE #${invoice.id.substring(0, 8)}`, 150, 20, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Issue Date: ${format(new Date(invoice.issued_date), 'MMMM d, yyyy')}`, 150, 30, { align: 'right' });
  
  if (invoice.due_date) {
    doc.text(`Due Date: ${format(new Date(invoice.due_date), 'MMMM d, yyyy')}`, 150, 35, { align: 'right' });
  }
  
  // Client information
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text('Bill To:', 20, 60);
  
  doc.setFontSize(10);
  doc.text(client.name, 20, 70);
  if (client.company) doc.text(client.company, 20, 75);
  if (client.address) doc.text(client.address, 20, 80);
  doc.text(`Email: ${client.email}`, 20, 85);
  if (client.phone) doc.text(`Phone: ${client.phone}`, 20, 90);
  
  // Project information if available
  if (project) {
    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    doc.text('Project:', 120, 60);
    
    doc.setFontSize(10);
    doc.text(project.title, 120, 70);
    if (project.description) {
      doc.text(project.description.substring(0, 50) + (project.description.length > 50 ? '...' : ''), 120, 75);
    }
  }
  
  // Invoice items (placeholder - in a real app, you'd have line items)
  autoTable(doc, {
    startY: 100,
    head: [['Description', 'Quantity', 'Rate', 'Amount']],
    body: [
      ['Professional Services', '1', `$${invoice.amount.toFixed(2)}`, `$${invoice.amount.toFixed(2)}`],
    ],
    foot: [
      ['', '', 'Subtotal', `$${invoice.amount.toFixed(2)}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [51, 51, 153], textColor: [255, 255, 255] },
    footStyles: { fillColor: [240, 240, 240], textColor: [51, 51, 51], fontStyle: 'bold' },
  });
  
  // Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Add advance payment if exists
  if (invoice.advance_payment && invoice.advance_payment > 0) {
    autoTable(doc, {
      startY: finalY,
      body: [
        ['', '', 'Advance Payment', `-$${invoice.advance_payment.toFixed(2)}`],
      ],
      theme: 'plain',
      styles: { cellPadding: 2 },
    });
  }
  
  // Add tax if exists
  if (invoice.tax_percentage && invoice.tax_percentage > 0) {
    const taxAmount = ((invoice.amount - (invoice.advance_payment || 0)) * (invoice.tax_percentage / 100));
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY,
      body: [
        ['', '', invoice.custom_tax_name || 'Tax', `$${taxAmount.toFixed(2)}`],
      ],
      theme: 'plain',
      styles: { cellPadding: 2 },
    });
  }
  
  // Calculate total
  const total = invoice.amount - (invoice.advance_payment || 0) + 
    ((invoice.amount - (invoice.advance_payment || 0)) * ((invoice.tax_percentage || 0) / 100));
  
  // Add total
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY,
    body: [
      ['', '', 'Total Due', `$${total.toFixed(2)}`],
    ],
    theme: 'plain',
    styles: { cellPadding: 2, fontSize: 12 },
    bodyStyles: { fontStyle: 'bold' },
  });
  
  // Notes section
  if (invoice.notes) {
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.text('Notes:', 20, (doc as any).lastAutoTable.finalY + 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(invoice.notes, 20, (doc as any).lastAutoTable.finalY + 30);
  }
  
  // Payment status
  doc.setFontSize(16);
  if (invoice.status === 'paid') {
    doc.setTextColor(46, 204, 113);
    doc.text('PAID', 150, (doc as any).lastAutoTable.finalY + 20, { align: 'right' });
    if (invoice.paid_date) {
      doc.setFontSize(10);
      doc.text(`Payment Date: ${format(new Date(invoice.paid_date), 'MMMM d, yyyy')}`, 150, (doc as any).lastAutoTable.finalY + 30, { align: 'right' });
    }
  } else if (invoice.status === 'overdue') {
    doc.setTextColor(231, 76, 60);
    doc.text('OVERDUE', 150, (doc as any).lastAutoTable.finalY + 20, { align: 'right' });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, 190, 280, { align: 'right' });
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
