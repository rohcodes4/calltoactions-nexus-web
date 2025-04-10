
import React from 'react';
import { Proposal } from '@/lib/supabase';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface ProposalViewProps {
  proposal: Proposal;
  client: string;
}

const ProposalView: React.FC<ProposalViewProps> = ({ proposal, client }) => {
  // Format dates
  const createdAt = proposal.created_at 
    ? format(new Date(proposal.created_at), 'MMMM d, yyyy')
    : 'Unknown date';

  const statusColors = {
    draft: "bg-gray-500/20 text-gray-300",
    sent: "bg-blue-500/20 text-blue-300",
    accepted: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-300"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{proposal.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-400">
              <User size={16} className="mr-1" />
              <span>{client}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Calendar size={16} className="mr-1" />
              <span>{createdAt}</span>
            </div>
          </div>
        </div>
        <div 
          className={`px-3 py-1 rounded-full text-sm ${
            statusColors[proposal.status as keyof typeof statusColors] || "bg-gray-500/20 text-gray-300"
          }`}
        >
          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
        </div>
      </div>
      
      <div className="h-px bg-white/10" />
      
      <div className="bg-white/5 p-6 rounded-lg">
        <div className="prose prose-invert max-w-none">
          {proposal.content?.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-300">{paragraph}</p>
          ))}
        </div>
      </div>
      
      {proposal.ai_generated && (
        <div className="bg-purple-900/20 p-4 rounded-lg">
          <p className="text-purple-300 text-sm">
            <strong>Note:</strong> This proposal was generated with AI assistance. Please review and edit as needed 
            before sending to the client.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProposalView;
