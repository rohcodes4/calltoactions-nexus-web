
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Calendar, 
  Send, 
  Download, 
  Sparkles,
  Copy
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Proposal, Client } from '@/lib/supabase';
import { 
  fetchProposals, 
  createProposal, 
  updateProposal, 
  deleteProposal, 
  fetchClients,
  generateProposalWithAI
} from '@/services/databaseService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import ProposalForm from './ProposalForm';
import ProposalView from './ProposalView';
import AIProposalGenerator from './AIProposalGenerator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interface for AI proposal generation
interface AIProposalParams {
  clientId: string;
  title: string;
  details: { 
    clientInfo: Client; 
    projectScope: string; 
    budget: string; 
    timeline: string; 
    requirements: string[] 
  };
}

const ProposalManager = () => {
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [viewingProposal, setViewingProposal] = useState<Proposal | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch proposals from the database
  const { data: proposals = [], isLoading: isLoadingProposals, error: proposalsError } = useQuery({
    queryKey: ['proposals'],
    queryFn: fetchProposals
  });

  // Fetch clients for the dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Create proposal mutation
  const createMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Proposal Created",
        description: "The proposal has been created successfully"
      });
      setEditingProposal(null);
      setIsAdding(false);
    }
  });

  // Update proposal mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Proposal> }) => 
      updateProposal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Proposal Updated",
        description: "The proposal has been updated successfully"
      });
      setEditingProposal(null);
    }
  });

  // Delete proposal mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Proposal Deleted",
        description: "The proposal has been deleted successfully"
      });
    }
  });

  // AI Generate proposal mutation
  const generateAIMutation = useMutation({
    mutationFn: (params: AIProposalParams) => generateProposalWithAI(
      params.clientId,
      params.title,
      params.details
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      if (data) {
        toast({
          title: "Proposal Generated",
          description: "AI has generated a proposal draft"
        });
        setViewingProposal(data);
      }
      setIsGeneratingAI(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate AI proposal",
        variant: "destructive"
      });
      setIsGeneratingAI(false);
    }
  });

  const handleEdit = (proposal: Proposal) => {
    setViewingProposal(null);
    setEditingProposal({ ...proposal });
    setIsAdding(false);
  };

  const handleView = (proposal: Proposal) => {
    setEditingProposal(null);
    setViewingProposal({ ...proposal });
  };

  const handleAdd = () => {
    setViewingProposal(null);
    const newProposal: Proposal = {
      id: "",
      client_id: "",
      title: "",
      content: "",
      ai_generated: false,
      status: "draft"
    };
    setEditingProposal(newProposal);
    setIsAdding(true);
  };

  const handleCreateWithAI = () => {
    setViewingProposal(null);
    setEditingProposal(null);
    setIsGeneratingAI(true);
  };

  const handleCloseAIGenerator = () => {
    setIsGeneratingAI(false);
  };

  const handleSave = () => {
    if (!editingProposal) return;
    
    if (isAdding) {
      // For new proposals, we don't include the id
      const { id, ...proposalData } = editingProposal;
      createMutation.mutate(proposalData as Omit<Proposal, 'id'>);
    } else {
      updateMutation.mutate({ 
        id: editingProposal.id, 
        updates: editingProposal 
      });
    }
  };

  const handleCancel = () => {
    setEditingProposal(null);
    setIsAdding(false);
  };

  const handleCloseView = () => {
    setViewingProposal(null);
  };

  const handleDelete = (id: string) => {
    const proposalToDelete = proposals.find(p => p.id === id);
    if (confirm(`Are you sure you want to delete proposal "${proposalToDelete?.title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmitAIGenerator = (
    clientId: string, 
    title: string, 
    details: { 
      clientInfo: Client, 
      projectScope: string, 
      budget: string, 
      timeline: string, 
      requirements: string[] 
    }
  ) => {
    generateAIMutation.mutate({
      clientId,
      title,
      details
    });
  };

  const handleStatusChange = (proposal: Proposal, newStatus: "draft" | "sent" | "accepted" | "rejected") => {
    updateMutation.mutate({
      id: proposal.id,
      updates: { status: newStatus }
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-500/20 text-gray-300";
      case "sent": return "bg-blue-500/20 text-blue-300";
      case "accepted": return "bg-green-500/20 text-green-300";
      case "rejected": return "bg-red-500/20 text-red-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  if (isLoadingProposals) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  if (proposalsError) {
    return (
      <div className="text-red-500 p-4">
        Error loading proposals. Please try again later.
        {proposalsError instanceof Error && <div className="text-sm mt-2">{proposalsError.message}</div>}
      </div>
    );
  }

  // If we're viewing a proposal, show that instead
  if (viewingProposal) {
    return (
      <ProposalView 
        proposal={viewingProposal} 
        client={clients.find(c => c.id === viewingProposal.client_id)} 
        onClose={handleCloseView}
        onEdit={() => handleEdit(viewingProposal)}
        onStatusChange={(status) => handleStatusChange(viewingProposal, status)}
      />
    );
  }

  // If we're generating an AI proposal, show the generator
  if (isGeneratingAI) {
    return (
      <AIProposalGenerator 
        clients={clients}
        onSubmit={handleSubmitAIGenerator}
        onCancel={handleCloseAIGenerator}
        isGenerating={generateAIMutation.isPending}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Proposal Management</h1>
          <p className="text-gray-400">Create and manage client proposals</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleCreateWithAI}
            variant="outline"
            className="border-agency-purple text-agency-purple hover:bg-agency-purple/10"
          >
            <Sparkles size={16} className="mr-2" />
            AI Generate
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
          >
            <Plus size={16} className="mr-2" />
            Add Proposal
          </Button>
        </div>
      </div>

      {editingProposal ? (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Create New Proposal" : "Edit Proposal"}
          </h2>
          
          <ProposalForm
            proposal={editingProposal}
            clients={clients}
            onChange={setEditingProposal}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={createMutation.isPending || updateMutation.isPending}
          />
        </Card>
      ) : null}

      <Card className="glass-card p-4 overflow-hidden">
        <div className="rounded-md border border-white/10 overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-white/5 border-white/10">
                <TableHead className="text-white">Proposal</TableHead>
                <TableHead className="text-white">Client</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map(proposal => (
                <TableRow key={proposal.id} className="hover:bg-white/5 border-white/10">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">
                        {proposal.title}
                        {proposal.ai_generated && (
                          <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                            AI Generated
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getClientName(proposal.client_id)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {proposal.created_at ? format(new Date(proposal.created_at), 'MMM d, yyyy') : 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(proposal.status)}`}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleView(proposal)}
                        title="View Proposal"
                      >
                        <FileText size={16} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(proposal)}
                        title="Edit Proposal"
                      >
                        <Edit size={16} />
                      </Button>
                      
                      {proposal.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(proposal, 'sent')}
                          className="text-blue-400 hover:text-blue-300"
                          title="Mark as Sent"
                        >
                          <Send size={16} />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(proposal.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete Proposal"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {proposals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No proposals found. Click "Add Proposal" to create one or use "AI Generate" for quick drafts.
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

export default ProposalManager;
