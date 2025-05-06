
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import PageTransition from '@/components/PageTransition';

const SharedProposal = () => {
  const { token } = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [client, setClient] = useState<any>(null);
  
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const { data: proposalData, error: proposalError } = await supabase
          .from('proposals')
          .select('*')
          .eq('share_token', token)
          .single();
        
        if (proposalError) throw proposalError;
        
        setProposal(proposalData);
        
        if (proposalData.client_id) {
          const { data: clientData } = await supabase
            .from('clients')
            .select('*')
            .eq('id', proposalData.client_id)
            .single();
          
          setClient(clientData);
        }
      } catch (error) {
        console.error('Error fetching proposal:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchProposal();
    }
  }, [token]);
  
  const handleDownload = () => {
    if (!proposal) return;
    
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text(proposal.title, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Status: ${proposal.status}`, 20, 30);
    if (client) {
      doc.text(`Client: ${client.name}${client.company ? ` (${client.company})` : ''}`, 20, 35);
    }
    
    // Add content - simple version that doesn't parse markdown
    doc.setFontSize(10);
    const contentLines = doc.splitTextToSize(proposal.content || '', 170);
    doc.text(contentLines, 20, 45);
    
    // Save the PDF
    doc.save(`proposal-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-agency-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }
  
  if (!proposal) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Proposal Not Found</h1>
          <p className="text-gray-400 mb-8">The proposal you're looking for doesn't exist or the link has expired.</p>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10">
        <div className="bg-agency-darker rounded-lg border border-white/10 p-6 md:p-10 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                proposal.status === 'draft' ? 'bg-gray-500/20 text-gray-300' :
                proposal.status === 'sent' ? 'bg-blue-500/20 text-blue-300' :
                proposal.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
              <h1 className="text-3xl font-bold text-white mt-2">{proposal.title}</h1>
              {client && (
                <p className="text-gray-400">
                  Prepared for: {client.name} {client.company && `(${client.company})`}
                </p>
              )}
            </div>
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple mt-4 md:mt-0"
            >
              <Download size={16} className="mr-2" /> 
              Download PDF
            </Button>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                strong: ({ node, ...props }) => <span className="font-bold text-agency-purple" {...props} />,
              }}
            >
              {proposal.content || ''}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SharedProposal;
