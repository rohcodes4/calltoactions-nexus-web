
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';

interface AIProposalGeneratorProps {
  clients: Client[];
  onCancel: () => void;
  isLoading: boolean;
  onSubmit: (clientId: string, prompt: string) => void;
}

const AIProposalGenerator = ({ clients, onCancel, isLoading, onSubmit }: AIProposalGeneratorProps) => {
  const [clientId, setClientId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) {
      setError('Please select a client');
      return;
    }
    
    if (!prompt || prompt.trim().length < 10) {
      setError('Please provide a detailed prompt (at least 10 characters)');
      return;
    }
    
    setError('');
    onSubmit(clientId, prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-300 block mb-2">Client</label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent className="bg-agency-darker border-white/10 text-white">
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-2">Prompt</label>
        <Textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the proposal you want to generate. Include details about services, scope, project goals, etc."
          className="bg-white/5 border-white/10 text-white min-h-[150px]"
        />
        <p className="text-xs text-gray-400 mt-1">
          The more detailed your prompt, the better the generated proposal will be.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-500/20 p-3 rounded-md flex items-start">
          <AlertCircle size={16} className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-white/10"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isLoading ? (
            <>
              <span className="mr-2 animate-spin">⟳</span>
              Generating...
            </>
          ) : (
            "Generate Proposal"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AIProposalGenerator;
