
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  Calendar, 
  DollarSign,
  FileText,
  Tag,
  Send,
  Download,
  Share2,
  Copy
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Invoice, Client, Project } from '@/lib/supabase';
import { supabase } from '@/lib/supabase'; // Add the supabase import
import { 
  fetchInvoices, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice, 
  fetchClients,
  fetchProjects,
  shareInvoice
} from '@/services/databaseService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadPdf } from '@/utils/pdfUtils';

const InvoiceManager = () => {
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch invoices from the database
  const { data: invoices = [], isLoading: isLoadingInvoices, error: invoicesError } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices
  });

  // Fetch clients for the dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Fetch projects for the dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // Create invoice mutation
  const createMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Invoice Created",
        description: "The invoice has been created successfully"
      });
      setEditingInvoice(null);
      setIsAdding(false);
    }
  });

  // Update invoice mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Invoice> }) => 
      updateInvoice(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Invoice Updated",
        description: "The invoice has been updated successfully"
      });
      setEditingInvoice(null);
    }
  });

  // Delete invoice mutation
  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Invoice Deleted",
        description: "The invoice has been deleted successfully"
      });
    }
  });

  // Share invoice mutation
  const shareMutation = useMutation({
    mutationFn: shareInvoice,
    onSuccess: (shareToken, invoiceId) => {
      if (shareToken) {
        const shareUrl = `${window.location.origin}/invoices/shared/${shareToken}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            toast({
              title: "Share Link Copied",
              description: "The invoice share link has been copied to your clipboard"
            });
          })
          .catch(() => {
            toast({
              title: "Share Link Created",
              description: "The invoice share link has been created but couldn't be copied automatically"
            });
          });
      }
    }
  });

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice({ ...invoice });
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newInvoice: Invoice = {
      id: "",
      client_id: "",
      amount: 0,
      status: "unpaid",
      issued_date: new Date().toISOString().split('T')[0],
      project_id: null,
      due_date: null,
      paid_date: null,
      notes: "",
      advance_payment: 0,
      tax_percentage: 0,
      custom_tax_name: "Tax"
    };
    setEditingInvoice(newInvoice);
    setIsAdding(true);
  };

  const handleStatusChange = (invoice: Invoice, newStatus: "unpaid" | "paid" | "overdue" | "cancelled") => {
    const updates: Partial<Invoice> = { 
      status: newStatus 
    };
    
    // If status changes to paid, set paid_date
    if (newStatus === 'paid' && !invoice.paid_date) {
      updates.paid_date = new Date().toISOString().split('T')[0];
    }
    
    updateMutation.mutate({ 
      id: invoice.id, 
      updates 
    });
  };

  const handleSave = () => {
    if (!editingInvoice) return;
    
    // Make a copy to modify
    const invoiceToSave = { ...editingInvoice };
    
    // Handle empty strings for date fields
    if (invoiceToSave.due_date === "") {
      invoiceToSave.due_date = null;
    }
    
    if (invoiceToSave.paid_date === "") {
      invoiceToSave.paid_date = null;
    }
    
    // Handle empty project_id
    if (invoiceToSave.project_id === "") {
      invoiceToSave.project_id = null;
    }
    
    if (isAdding) {
      // For new invoices, we don't include the id
      const { id, ...invoiceData } = invoiceToSave;
      createMutation.mutate(invoiceData as Omit<Invoice, 'id'>);
    } else {
      updateMutation.mutate({ 
        id: invoiceToSave.id, 
        updates: invoiceToSave 
      });
    }
  };

  const handleCancel = () => {
    setEditingInvoice(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const invoiceToDelete = invoices.find(i => i.id === id);
    if (confirm(`Are you sure you want to delete invoice #${invoiceToDelete?.id.substring(0, 8)}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleShare = (id: string) => {
    shareMutation.mutate(id);
  };

  const handleDownloadPdf = async (invoice: Invoice) => {
    const client = clients.find(c => c.id === invoice.client_id);
    const project = invoice.project_id ? projects.find(p => p.id === invoice.project_id) : null;
    
    if (!client) {
      toast({
        title: "Error",
        description: "Client information not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Fetch general settings for company info
      const { data: generalSettings } = await supabase
        .from('general_settings')
        .select('*')
        .single();
      
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingInvoice) return;
    
    const { name, value } = e.target;
    
    // Special handling for date and project fields
    if ((name === 'due_date' || name === 'paid_date') && value === '') {
      // Set to null if the field is empty
      setEditingInvoice(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: null
        };
      });
      return;
    }
    
    if (name === 'project_id' && value === '') {
      // Set project_id to null if empty selection
      setEditingInvoice(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          project_id: null
        };
      });
      return;
    }
    
    // Handle numeric fields
    if (name === 'amount' || name === 'advance_payment' || name === 'tax_percentage') {
      setEditingInvoice(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: value === '' ? 0 : parseFloat(value)
        };
      });
      return;
    }
    
    // Regular field handling
    setEditingInvoice(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "unpaid": return "bg-yellow-500/20 text-yellow-300";
      case "paid": return "bg-green-500/20 text-green-300";
      case "overdue": return "bg-red-500/20 text-red-300";
      case "cancelled": return "bg-gray-500/20 text-gray-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
  };
  
  // Calculate totals for an invoice
  const calculateTotal = (invoice: Invoice) => {
    const subtotal = invoice.amount || 0;
    const advancePayment = invoice.advance_payment || 0;
    const taxPercentage = invoice.tax_percentage || 0;
    const taxAmount = ((subtotal - advancePayment) * (taxPercentage / 100));
    return subtotal - advancePayment + taxAmount;
  };

  if (isLoadingInvoices) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  if (invoicesError) {
    return (
      <div className="text-red-500 p-4">
        Error loading invoices. Please try again later.
        {invoicesError instanceof Error && <div className="text-sm mt-2">{invoicesError.message}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoice Management</h1>
          <p className="text-gray-400">Create and manage client invoices</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Create Invoice
        </Button>
      </div>

      {editingInvoice && (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Create New Invoice" : "Edit Invoice"}
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Client*</label>
                <select 
                  name="client_id"
                  value={editingInvoice.client_id || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `(${client.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">Project (Optional)</label>
                <select 
                  name="project_id"
                  value={editingInvoice.project_id || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                >
                  <option value="">No Project</option>
                  {projects.filter(p => p.client_id === editingInvoice.client_id).map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Amount*</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input 
                    type="number" 
                    name="amount"
                    value={editingInvoice.amount || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-6 rounded bg-white/10 border border-white/20 text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">Advance Payment (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input 
                    type="number" 
                    name="advance_payment"
                    value={editingInvoice.advance_payment || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-6 rounded bg-white/10 border border-white/20 text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Tax Percentage (%)</label>
                <input 
                  type="number" 
                  name="tax_percentage"
                  value={editingInvoice.tax_percentage || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  placeholder="0"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">Tax Name</label>
                <input 
                  type="text" 
                  name="custom_tax_name"
                  value={editingInvoice.custom_tax_name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  placeholder="Tax"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">Total with Tax</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input 
                    type="text" 
                    value={calculateTotal(editingInvoice).toFixed(2)}
                    className="w-full p-2 pl-6 rounded bg-white/10 border border-white/20 text-white"
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Issued Date*</label>
                <input 
                  type="date" 
                  name="issued_date"
                  value={editingInvoice.issued_date ? editingInvoice.issued_date.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">Due Date</label>
                <input 
                  type="date" 
                  name="due_date"
                  value={editingInvoice.due_date ? (typeof editingInvoice.due_date === 'string' ? editingInvoice.due_date.split('T')[0] : '') : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">Status</label>
                <select 
                  name="status"
                  value={editingInvoice.status}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            {editingInvoice.status === 'paid' && (
              <div>
                <label className="text-sm text-gray-300 block mb-1">Paid Date</label>
                <input 
                  type="date" 
                  name="paid_date"
                  value={editingInvoice.paid_date ? (typeof editingInvoice.paid_date === 'string' ? editingInvoice.paid_date.split('T')[0] : '') : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                />
              </div>
            )}
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Notes</label>
              <textarea 
                name="notes"
                value={editingInvoice.notes || ''}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                rows={3}
                placeholder="Add any additional notes or payment instructions"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              
              <Button 
                onClick={handleSave}
                className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <Check size={16} className="mr-2" />
                )}
                {isAdding ? "Create Invoice" : "Update Invoice"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="glass-card p-4 overflow-hidden">
        <div className="rounded-md border border-white/10 overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-white/5 border-white/10">
                <TableHead className="text-white">Invoice</TableHead>
                <TableHead className="text-white">Client</TableHead>
                <TableHead className="text-white">Project</TableHead>
                <TableHead className="text-white">Amount</TableHead>
                <TableHead className="text-white">Issued</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(invoice => (
                <TableRow key={invoice.id} className="hover:bg-white/5 border-white/10">
                  <TableCell>
                    <div className="font-medium text-white">
                      Invoice #{invoice.id.substring(0, 8)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getClientName(invoice.client_id)}
                  </TableCell>
                  <TableCell>
                    {getProjectName(invoice.project_id)}
                  </TableCell>
                  <TableCell>
                    <div className="text-green-400 font-semibold">
                      ${calculateTotal(invoice).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {invoice.issued_date ? format(new Date(invoice.issued_date), 'MMM d, yyyy') : 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(invoice)}
                        title="Edit Invoice"
                      >
                        <Edit size={16} />
                      </Button>
                      
                      {invoice.status === 'unpaid' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(invoice, 'paid')}
                          className="text-green-400 hover:text-green-300"
                          title="Mark as Paid"
                        >
                          <Check size={16} />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadPdf(invoice)}
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleShare(invoice.id)}
                        title="Share Invoice"
                      >
                        <Share2 size={16} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(invoice.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete Invoice"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No invoices found. Click "Create Invoice" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceManager;
