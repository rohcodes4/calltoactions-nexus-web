
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, X, Plus, Trash2, Sparkles } from 'lucide-react';
import { Client } from '@/lib/supabase';

interface AIProposalGeneratorProps {
  clients: Client[];
  onSubmit: (
    clientId: string, 
    title: string, 
    details: { 
      clientInfo: Client, 
      projectScope: string, 
      budget: string, 
      timeline: string, 
      requirements: string[] 
    }
  ) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

const AIProposalGenerator = ({ clients, onSubmit, onCancel, isGenerating }: AIProposalGeneratorProps) => {
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['']);
  
  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };
  
  const updateRequirement = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };
  
  const removeRequirement = (index: number) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
  };

  const handleSubmit = () => {
    const clientInfo = clients.find(c => c.id === clientId);
    if (!clientId || !clientInfo || !title) {
      alert('Please select a client and enter a title');
      return;
    }
    
    // Filter out empty requirements
    const filteredRequirements = requirements.filter(req => req.trim() !== '');
    
    onSubmit(
      clientId,
      title,
      {
        clientInfo,
        projectScope,
        budget,
        timeline,
        requirements: filteredRequirements
      }
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Sparkles size={24} className="mr-2 text-agency-purple" />
          AI Proposal Generator
        </h1>
        <p className="text-gray-400">
          Fill in the details below to generate a professional proposal using AI
        </p>
      </div>

      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Client*</label>
              <select 
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
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
              <label className="text-sm text-gray-300 block mb-1">Proposal Title*</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="e.g. Website Redesign Proposal"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-1">Project Scope</label>
            <textarea 
              value={projectScope}
              onChange={e => setProjectScope(e.target.value)}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
              rows={3}
              placeholder="Describe what the project entails"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Budget</label>
              <input 
                type="text" 
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="e.g. $5,000 - $8,000"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Timeline</label>
              <input 
                type="text" 
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="e.g. 6-8 weeks"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-300">Key Requirements/Features</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addRequirement}
                className="h-8 px-2 text-agency-purple"
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            
            {requirements.map((req, index) => (
              <div key={index} className="flex mb-2">
                <input 
                  type="text" 
                  value={req}
                  onChange={e => updateRequirement(index, e.target.value)}
                  className="w-full p-2 rounded-l bg-white/10 border border-white/20 text-white"
                  placeholder={`Requirement ${index + 1}`}
                />
                <button 
                  className="bg-white/10 px-3 rounded-r border border-white/20 border-l-0 text-red-400 hover:text-red-300"
                  onClick={() => removeRequirement(index)}
                  disabled={requirements.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button 
              variant="outline"
              onClick={onCancel}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Generate Proposal
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIProposalGenerator;
