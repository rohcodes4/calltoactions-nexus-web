
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import PageTransition from '@/components/PageTransition';
import { formatBoldText } from '@/lib/utils';
import { formatProposalContent } from '@/lib/utils';
import { Proposal, Client } from '@/lib/supabase';
import { fetchClients } from '@/services/databaseService';
import { useQuery } from '@tanstack/react-query';

const SharedProposal = () => {
  const { token } = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [client, setClient] = useState<any>(null);
  
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });


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
  
  // const handleDownload = () => {
  //   if (!proposal) return;
    
  //   // Use our utility function to generate a better PDF
  //   import('@/utils/pdfUtils').then(({ generatePdfBlob }) => {
  //     generatePdfBlob({
  //       invoice: {
  //         id: proposal.id,
  //         client_id: proposal.client_id || '',
  //         amount: 0,
  //         issued_date: new Date().toISOString(),
  //         status: proposal.status
  //       },
  //       client: client || { 
  //         id: '', 
  //         name: 'Client', 
  //         email: '', 
  //         status: 'active'
  //       },
  //       companyName: "Your Agency",
  //       companyEmail: "contact@youragency.com",
  //       proposalContent: proposal.content,
  //       proposalTitle: proposal.title
  //     }).then(blob => {
  //       const url = URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = `proposal-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
  //       link.click();
  //       URL.revokeObjectURL(url);
  //     });
  //   });
  // };
  
  const handleDownload = (proposal: Proposal) => {
    const clientInfo = proposal.client_id
      ? clients.find(c => c.id === proposal.client_id)
      : null;
  
    const clientName = clientInfo
      ? `${clientInfo.name}${clientInfo.company ? ` (${clientInfo.company})` : ''}`
      : proposal.client_name || 'Unknown';
  
    const createdAt = proposal.created_at
      ? new Date(proposal.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Unknown date';
  
    const statusLabel = proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1);
    const contentHTML = formatProposalContent(proposal.content || '');
  
    const container = document.createElement('div');
    container.style.background = '#fff'; // force white background
    container.style.color = '#000'; // force black text
    // container.style.fontFamily = `'Inter', 'Helvetica Neue', Helvetica, system-ui, sans-serif`;
    container.style.fontFamily = `'Segoe UI', Helvetica, Arial, sans-serif`;
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.6';
    container.style.width = '600px';
    container.style.padding = '40px'; // uniform padding
  
  
    container.innerHTML = `
      <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #000;">${proposal.title}</h1>
      <div style="color: #000;">${contentHTML}</div>
      ${
        proposal.ai_generated
          ? `<div style="margin-top: 20px; padding: 10px; background-color: #6b21a8; color: white; font-size: 12px;">
               <strong>Note:</strong> This proposal was generated with AI assistance. Please review before sending.
             </div>`
          : ''
      }
    `;
  
    document.body.appendChild(container);
  
    // const doc = new jsPDF('p', 'pt', 'a4');
    const contentHeight = container.scrollHeight;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [595.28, contentHeight + 2], // A4 width, custom height
    });
    doc.html(container, {
      callback: (pdf) => {
        pdf.save(`proposal-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        document.body.removeChild(container);
      },
      x: 0,
      y: 0,
      html2canvas: {
        scale: 1, // default resolution
        useCORS: true
      },
    });
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
      <div className="container mx-auto px-4 py-28">
        <div className="bg-agency-darker rounded-lg border border-white/10 p-6 md:p-10 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
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
              {client ? (
                <p className="text-gray-400">
                  Prepared for: {client.name} {client.company && `(${client.company})`}
                </p>
              ) : proposal.client_name ? (
                <p className="text-gray-400">
                  Prepared for: {proposal.client_name}
                </p>
              ) : null}
            </div>
            <Button 
              onClick={()=>handleDownload(proposal)}
              className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple mt-4 md:mt-0"
            >
              <Download size={16} className="mr-2" /> 
              Download PDF
            </Button>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatProposalContent(proposal.content || '') }} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SharedProposal;
