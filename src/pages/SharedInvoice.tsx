
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Download, Mail, Calendar, DollarSign } from 'lucide-react';
import { supabase, Invoice, Client, Project } from '@/lib/supabase';
import { format } from 'date-fns';
import { downloadPdf } from '@/utils/pdfUtils';
import { useToast } from '@/components/ui/use-toast';

const SharedInvoice = () => {
  const { token } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const { toast } = useToast();

  // Load invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get invoice by share token
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .select('*')
          .eq('share_token', token)
          .single();
          
        if (invoiceError || !invoiceData) {
          throw new Error(invoiceError?.message || 'Invoice not found');
        }
        
        setInvoice(invoiceData);
        
        // Get client data
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', invoiceData.client_id)
          .single();
          
        if (clientError || !clientData) {
          throw new Error(clientError?.message || 'Client not found');
        }
        
        setClient(clientData);
        
        // Get project data if available
        if (invoiceData.project_id) {
          const { data: projectData } = await supabase
            .from('projects')
            .select('*')
            .eq('id', invoiceData.project_id)
            .single();
            
          setProject(projectData || null);
        }
        
        // Get company settings
        const { data: settings } = await supabase
          .from('general_settings')
          .select('*')
          .single();
          
        setGeneralSettings(settings || null);
        
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchInvoice();
    }
  }, [token]);

  // Calculate totals
  const subtotal = invoice?.amount || 0;
  const advancePayment = invoice?.advance_payment || 0;
  const taxPercentage = invoice?.tax_percentage || 0;
  const taxAmount = ((subtotal - advancePayment) * (taxPercentage / 100));
  const total = subtotal - advancePayment + taxAmount;

  // Handle PDF download
  const handleDownload = async () => {
    if (!invoice || !client) return;
    
    try {
      await downloadPdf({
        invoice,
        client,
        project,
        companyName: generalSettings?.siteTitle || 'Your Company',
        companyAddress: generalSettings?.address,
        companyPhone: generalSettings?.phoneNumber,
        companyEmail: generalSettings?.adminEmail,
      });
      
      toast({
        title: "Download started",
        description: "Your invoice PDF is being generated and downloaded"
      });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast({
        title: "Download failed",
        description: "Failed to generate or download the PDF",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-agency-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  if (error || !invoice || !client) {
    return (
      <div className="min-h-screen bg-agency-dark pt-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-card p-8">
            <div className="text-center">
              <FileText className="mx-auto h-16 w-16 text-red-400" />
              <h1 className="mt-4 text-2xl font-bold text-white">Invoice Not Found</h1>
              <p className="mt-2 text-gray-400">
                {error || "The invoice you're looking for doesn't exist or has been removed."}
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agency-dark pt-20 px-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        <Card className="glass-card p-8 overflow-hidden">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Invoice #{invoice.id.substring(0, 8)}</h1>
              <div className="text-gray-400 mt-1 flex items-center">
                <Calendar size={14} className="mr-1" />
                Issued on {format(new Date(invoice.issued_date), 'MMMM d, yyyy')}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                className="border-agency-purple text-agency-purple hover:bg-agency-purple/10"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
          
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">From</h2>
              <div className="text-gray-300">
                <div className="font-medium text-white">
                  {generalSettings?.siteTitle || 'Your Company'}
                </div>
                <div className="mt-1">{generalSettings?.address || ''}</div>
                <div className="mt-1">{generalSettings?.phoneNumber || ''}</div>
                <div className="mt-1">{generalSettings?.adminEmail || ''}</div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Bill To</h2>
              <div className="text-gray-300">
                <div className="font-medium text-white">{client.name}</div>
                {client.company && <div className="mt-1">{client.company}</div>}
                {client.address && <div className="mt-1">{client.address}</div>}
                <div className="mt-1">{client.email}</div>
                {client.phone && <div className="mt-1">{client.phone}</div>}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">Invoice Details</h2>
            
            {project && (
              <div className="mb-4 p-4 bg-white/5 rounded-lg">
                <div className="font-medium text-white">Project: {project.title}</div>
                {project.description && (
                  <div className="mt-1 text-gray-300">{project.description}</div>
                )}
              </div>
            )}
            
            <div className="mt-4 rounded-lg overflow-hidden">
              <div className="bg-white/10 p-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Invoice Number</div>
                  <div className="text-white font-medium">#{invoice.id.substring(0, 8)}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">Status</div>
                  <div className={`font-medium ${
                    invoice.status === 'paid' ? 'text-green-400' : 
                    invoice.status === 'overdue' ? 'text-red-400' : 
                    invoice.status === 'cancelled' ? 'text-gray-400' : 
                    'text-yellow-400'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">Issue Date</div>
                  <div className="text-white font-medium">
                    {format(new Date(invoice.issued_date), 'MMMM d, yyyy')}
                  </div>
                </div>
                
                {invoice.due_date && (
                  <div>
                    <div className="text-gray-400 text-sm">Due Date</div>
                    <div className="text-white font-medium">
                      {format(new Date(invoice.due_date), 'MMMM d, yyyy')}
                    </div>
                  </div>
                )}
                
                {invoice.paid_date && invoice.status === 'paid' && (
                  <div>
                    <div className="text-gray-400 text-sm">Payment Date</div>
                    <div className="text-green-400 font-medium">
                      {format(new Date(invoice.paid_date), 'MMMM d, yyyy')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
            
            <div className="rounded-lg overflow-hidden">
              <div className="bg-white/10 p-4">
                <div className="grid grid-cols-12 gap-4 border-b border-white/10 pb-2 mb-4">
                  <div className="col-span-8 text-gray-300 font-medium">Description</div>
                  <div className="col-span-4 text-right text-gray-300 font-medium">Amount</div>
                </div>
                
                <div className="grid grid-cols-12 gap-4 py-2">
                  <div className="col-span-8 text-white">Professional Services</div>
                  <div className="col-span-4 text-right text-white">${subtotal.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between py-2">
                <div className="text-gray-300">Subtotal</div>
                <div className="text-white">${subtotal.toFixed(2)}</div>
              </div>
              
              {advancePayment > 0 && (
                <div className="flex justify-between py-2 border-t border-white/10">
                  <div className="text-gray-300">Advance Payment</div>
                  <div className="text-white">-${advancePayment.toFixed(2)}</div>
                </div>
              )}
              
              {taxPercentage > 0 && (
                <div className="flex justify-between py-2 border-t border-white/10">
                  <div className="text-gray-300">{invoice.custom_tax_name || 'Tax'} ({taxPercentage}%)</div>
                  <div className="text-white">${taxAmount.toFixed(2)}</div>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-t border-white/10 text-lg font-medium">
                <div className="text-white">Total Due</div>
                <div className="text-white">${total.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          {invoice.notes && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-2">Notes</h2>
              <div className="p-4 bg-white/5 rounded-lg text-gray-300">
                {invoice.notes}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SharedInvoice;
