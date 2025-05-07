import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProposals, fetchClients, createProposal, updateProposal, deleteProposal, generateProposalWithAI, shareProposal } from '@/services/databaseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Check, X, Bot, Share2, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProposalForm from './ProposalForm';
import ProposalView from './ProposalView';
import AIProposalGenerator from './AIProposalGenerator';
import { Proposal, Client } from '@/lib/supabase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ReactMarkdown from 'react-markdown';

const initialProposal: Proposal = {
  id: '',
  title: '',
  content: '',
  ai_generated: false,
  status: 'draft',
};

type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

const ProposalManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [editMode, setEditMode] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<Proposal>(initialProposal);
  const [viewProposal, setViewProposal] = useState<Proposal | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch proposals
  const { data: proposals = [], isLoading: isLoadingProposals } = useQuery({
    queryKey: ['proposals'],
    queryFn: fetchProposals
  });

  // Fetch clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({ title: "Success", description: "Proposal created successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Proposal> }) => {
      return updateProposal(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({ title: "Success", description: "Proposal updated successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({ title: "Success", description: "Proposal deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const shareMutation = useMutation({
    mutationFn: shareProposal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      // Create share URL
      const shareUrl = `${window.location.origin}/proposals/shared/${data.share_token}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast({ 
        title: "Proposal shared", 
        description: "Share link copied to clipboard" 
      });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const generateAIMutation = useMutation({
    mutationFn: ({ clientId, prompt }: { clientId: string, prompt: string }) =>
      generateProposalWithAI(clientId, prompt),
    onSuccess: (data) => {
      setCurrentProposal({
        id: '',
        title: data.title,
        content: data.content,
        client_id: data.client_id,
        ai_generated: true,
        status: 'draft'
      });
      setEditMode(true);
      setShowAIGenerator(false);
      toast({ title: "Success", description: "AI proposal generated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setCurrentProposal(initialProposal);
    setEditMode(false);
    setViewProposal(null);
  };

  const handleEdit = (proposal: Proposal) => {
    setCurrentProposal({
      id: proposal.id,
      title: proposal.title,
      content: proposal.content,
      client_id: proposal.client_id,
      status: proposal.status,
      ai_generated: proposal.ai_generated
    });
    setEditMode(true);
    setViewProposal(null);
  };

  const handleView = (proposal: Proposal) => {
    setViewProposal(proposal);
    setEditMode(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (proposal: Proposal) => {
    if (proposal.id) {
      updateMutation.mutate({ id: proposal.id, updates: proposal });
    } else {
      createMutation.mutate(proposal);
    }
  };

  const handleStatusChange = (id: string, status: ProposalStatus) => {
    updateMutation.mutate({ id, updates: { status } });
  };

  const handleGenerateAI = (clientId: string, prompt: string) => {
    generateAIMutation.mutate({ clientId, prompt });
  };

  const handleShare = (id: string) => {
    shareMutation.mutate(id);
  };

  const handleDownload = (proposal: Proposal) => {
    const doc = new jsPDF();
    const clientInfo = proposal.client_id 
      ? clients.find(c => c.id === proposal.client_id)
      : null;
    
    // Add header
    doc.setFontSize(20);
    doc.text(proposal.title, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Status: ${proposal.status}`, 20, 30);
    if (clientInfo) {
      doc.text(`Client: ${clientInfo.name}${clientInfo.company ? ` (${clientInfo.company})` : ''}`, 20, 35);
    }
    
    // Add content - simple version that doesn't parse markdown
    doc.setFontSize(10);
    const contentLines = doc.splitTextToSize(proposal.content || '', 170);
    doc.text(contentLines, 20, 45);
    
    // Save the PDF
    doc.save(`proposal-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  // Filter proposals based on search query, status, and client
  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || proposal.status === selectedStatus;
    const matchesClient = selectedClient === 'all' || proposal.client_id === selectedClient;
    return matchesSearch && matchesStatus && matchesClient;
  });

  // Find client name by ID
  const getClientName = (clientId?: string, clientName?: string) => {
    if (clientName) return clientName;
    if (!clientId) return 'No client';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const statusColors = {
    draft: "bg-gray-500",
    sent: "bg-blue-500",
    accepted: "bg-green-500",
    rejected: "bg-red-500"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Proposal Management</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => { setShowAIGenerator(true); setEditMode(false); setViewProposal(null); }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Bot size={16} className="mr-2" />
            AI Generator
          </Button>
          <Button 
            onClick={() => { setEditMode(true); setCurrentProposal(initialProposal); setViewProposal(null); setShowAIGenerator(false); }}
            className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
          >
            <Plus size={16} className="mr-2" />
            New Proposal
          </Button>
        </div>
      </div>

      {showAIGenerator ? (
        <Card className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Generate Proposal with AI</h2>
          <AIProposalGenerator 
            clients={clients}
            onCancel={() => setShowAIGenerator(false)}
            isLoading={generateAIMutation.isPending}
            onSubmit={handleGenerateAI}
          />
        </Card>
      ) : null}

      {editMode ? (
        <Card className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {currentProposal.id ? "Edit Proposal" : "Create New Proposal"}
          </h2>
          <ProposalForm 
            proposal={currentProposal}
            clients={clients}
            onSave={handleSave}
            onCancel={resetForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </Card>
      ) : null}

      {viewProposal ? (
        <Card className="glass-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Viewing Proposal</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleShare(viewProposal.id)}
                className="text-blue-400 hover:text-blue-300"
              >
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDownload(viewProposal)}
                className="text-green-400 hover:text-green-300"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => setViewProposal(null)}>
                <X size={16} className="mr-2" />
                Close
              </Button>
            </div>
          </div>
          <ProposalView 
            proposal={viewProposal} 
            client={getClientName(viewProposal.client_id, viewProposal.client_name)}
          />
        </Card>
      ) : null}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-agency-darker border-white/10 text-white"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="bg-agency-darker border-white/10 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-agency-darker border-white/10 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-64">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="bg-agency-darker border-white/10 text-white">
              <SelectValue placeholder="Filter by client" />
            </SelectTrigger>
            <SelectContent className="bg-agency-darker border-white/10 text-white">
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="none">No Client</SelectItem>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoadingProposals || isLoadingClients ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No proposals found. Create your first proposal.
            </div>
          ) : (
            filteredProposals.map(proposal => (
              <Card key={proposal.id} className="glass-card p-4 overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className={`${statusColors[proposal.status as keyof typeof statusColors] || "bg-gray-500"} 
                          w-3 h-3 rounded-full`}
                      />
                      <h3 className="text-lg font-semibold text-white">{proposal.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      Client: {getClientName(proposal.client_id, proposal.client_name)}
                    </p>
                    {proposal.ai_generated && (
                      <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded-full">
                        AI Generated
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <Select 
                      defaultValue={proposal.status}
                      onValueChange={(value) => handleStatusChange(proposal.id, value as ProposalStatus)}
                    >
                      <SelectTrigger className="h-8 text-sm bg-agency-darker border-white/10 text-white w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-agency-darker border-white/10 text-white">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleView(proposal)}
                      className="border-white/10"
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShare(proposal.id)}
                      className="border-white/10 text-blue-500 hover:text-blue-400"
                    >
                      <Share2 size={14} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(proposal)}
                      className="border-white/10 text-green-500 hover:text-green-400"
                    >
                      <Download size={14} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEdit(proposal)}
                      className="border-white/10 h-8 w-8"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(proposal.id)}
                      className="border-white/10 text-red-500 hover:text-red-400 h-8 w-8"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProposalManager;
