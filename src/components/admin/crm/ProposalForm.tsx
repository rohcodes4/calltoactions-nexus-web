
import { useState } from 'react';
import { Proposal, Client } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface ProposalFormProps {
  proposal: Proposal;
  clients: Client[];
  onSave: (proposal: Proposal) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ProposalForm = ({ proposal: initialProposal, clients, onSave, onCancel, isLoading }: ProposalFormProps) => {
  const [proposal, setProposal] = useState<Proposal>(initialProposal);

  const handleChange = (field: keyof Proposal, value: any) => {
    setProposal(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log({proposal})
    e.preventDefault();
    onSave(proposal);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Proposal Title*</label>
          <input 
            type="text" 
            value={proposal.title || ''}
            onChange={e => handleChange('title', e.target.value)}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
            placeholder="Proposal Name"
            required
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">Client*</label>
          <select 
            value={proposal.client_id || ''}
            onChange={e => handleChange('client_id', e.target.value)}
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
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Content</label>
        <textarea 
          value={proposal.content || ''}
          onChange={e => handleChange('content', e.target.value)}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white font-mono"
          rows={15}
          placeholder="# Proposal Title

## Overview
Provide a brief overview of the project

## Scope of Work
- Item 1
- Item 2
- Item 3

## Timeline
Describe the project timeline

## Budget
Provide budget details

## Terms and Conditions
List any terms and conditions"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can use Markdown formatting for rich text.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Status</label>
          <select 
            value={proposal.status}
            onChange={e => handleChange('status', e.target.value as any)}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="flex items-center mt-8">
          <input 
            type="checkbox" 
            id="ai_generated"
            checked={proposal.ai_generated}
            onChange={e => handleChange('ai_generated', e.target.checked)}
            className="rounded border-white/20 bg-white/10 text-agency-purple"
          />
          <label htmlFor="ai_generated" className="text-sm text-gray-300 ml-2">
            AI-generated content
          </label>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          <X size={16} className="mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          ) : (
            <Save size={16} className="mr-2" />
          )}
          Save Proposal
        </Button>
      </div>
    </form>
  );
};

export default ProposalForm;
