
import { Proposal, Client } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X, 
  Edit, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  Building, 
  Mail, 
  User,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface ProposalViewProps {
  proposal: Proposal;
  client?: Client;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: "draft" | "sent" | "accepted" | "rejected") => void;
}

const ProposalView = ({ proposal, client, onClose, onEdit, onStatusChange }: ProposalViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-500/20 text-gray-300";
      case "sent": return "bg-blue-500/20 text-blue-300";
      case "accepted": return "bg-green-500/20 text-green-300";
      case "rejected": return "bg-red-500/20 text-red-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            {proposal.title}
            {proposal.ai_generated && (
              <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full flex items-center">
                <Sparkles size={12} className="mr-1" />
                AI Generated
              </span>
            )}
          </h1>
          <div className="flex items-center mt-1">
            <span className={`px-2 py-1 rounded text-xs mr-2 ${getStatusColor(proposal.status)}`}>
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
            {proposal.created_at && (
              <p className="text-gray-400 text-sm flex items-center">
                <Calendar size={12} className="mr-1" />
                Created: {format(new Date(proposal.created_at), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            <X size={16} className="mr-2" />
            Close
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Side info panel */}
        <div className="lg:col-span-1">
          <Card className="glass-card p-4 h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Client Information</h3>
            {client ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-agency-purple" />
                  <span className="text-white">{client.name}</span>
                </div>
                {client.company && (
                  <div className="flex items-center">
                    <Building size={16} className="mr-2 text-agency-purple" />
                    <span className="text-gray-300">{client.company}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-agency-purple" />
                  <a 
                    href={`mailto:${client.email}`} 
                    className="text-gray-300 hover:text-agency-purple transition-colors"
                  >
                    {client.email}
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Client information not available</p>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-2">
                {proposal.status === "draft" && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    onClick={() => onStatusChange("sent")}
                  >
                    <Send size={16} className="mr-2" />
                    Mark as Sent
                  </Button>
                )}
                
                {proposal.status === "sent" && (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-green-400 hover:text-green-300 hover:bg-green-900/20"
                      onClick={() => onStatusChange("accepted")}
                    >
                      <ThumbsUp size={16} className="mr-2" />
                      Mark as Accepted
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => onStatusChange("rejected")}
                    >
                      <ThumbsDown size={16} className="mr-2" />
                      Mark as Rejected
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.print()}
                >
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (client) {
                      window.location.href = `mailto:${client.email}?subject=${encodeURIComponent(`Proposal: ${proposal.title}`)}&body=${encodeURIComponent('Please find attached our proposal for your review.')}`;
                    }
                  }}
                  disabled={!client}
                >
                  <Share2 size={16} className="mr-2" />
                  Email to Client
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Main content panel */}
        <div className="lg:col-span-3">
          <Card className="glass-card p-6 min-h-[600px]">
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300">
              <ReactMarkdown>
                {proposal.content || '*No content yet. Click "Edit" to add content to this proposal.*'}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProposalView;
