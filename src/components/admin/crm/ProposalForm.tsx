
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client, Proposal } from '@/lib/supabase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bot } from 'lucide-react';

interface ProposalFormProps {
  proposal: Proposal;
  clients: Client[];
  onSave: (proposal: Proposal) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  proposal,
  clients,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [useCustomClient, setUseCustomClient] = useState(!proposal.client_id);
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      id: proposal.id || '',
      title: proposal.title || '',
      content: proposal.content || '',
      client_id: proposal.client_id || '',
      client_name: proposal.client_name || '',
      status: proposal.status || 'draft',
      ai_generated: proposal.ai_generated || false
    }
  });

  const watchContent = watch('content');
  
  const handleFormSubmit = (data: any) => {
    // If using custom client, remove client_id
    if (useCustomClient) {
      data.client_id = null;
    } else {
      data.client_name = null;
    }
    
    onSave(data as Proposal);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Title</label>
              <Input 
                {...field} 
                placeholder="Proposal Title"
                className="bg-white/5 border-white/10 text-white"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message as string}</p>}
            </div>
          )}
        />
        
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Client</label>
          <div className="flex flex-col space-y-3">
            <div className="flex gap-3">
              <Button 
                type="button"
                variant={useCustomClient ? "default" : "outline"}
                onClick={() => setUseCustomClient(true)}
                className={`flex-1 ${useCustomClient ? 'bg-agency-purple hover:bg-agency-purple/90' : 'border-white/10'}`}
              >
                Custom Client
              </Button>
              <Button 
                type="button"
                variant={!useCustomClient ? "default" : "outline"}
                onClick={() => setUseCustomClient(false)}
                className={`flex-1 ${!useCustomClient ? 'bg-agency-purple hover:bg-agency-purple/90' : 'border-white/10'}`}
              >
                Existing Client
              </Button>
            </div>
            
            {useCustomClient ? (
              <Controller
                name="client_name"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field} 
                    placeholder="Client/Company Name"
                    className="bg-white/5 border-white/10 text-white"
                  />
                )}
              />
            ) : (
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent className="bg-agency-darker border-white/10 text-white">
                      <SelectItem value="">No client</SelectItem>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.company && `(${client.company})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </div>
        </div>
        
        <Controller
          name="status"
          control={control}
          rules={{ required: 'Status is required' }}
          render={({ field }) => (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Status</label>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-agency-darker border-white/10 text-white">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-gray-400 block">Content</label>
            <div className="text-xs text-gray-400">
              <span className="text-agency-purple">**bold text**</span> | 
              <span className="ml-2">--- for divider</span> | 
              <span className="ml-2"># Heading 1</span> | 
              <span className="ml-2">## Heading 2</span> | 
              <span className="ml-2">### Heading 3</span>
            </div>
          </div>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                <Textarea 
                  {...field} 
                  placeholder="Write your proposal content here..."
                  className="bg-white/5 border-white/10 text-white min-h-[300px]"
                />
                
                {watchContent && (
                  <Tabs defaultValue="edit">
                    <TabsList className="bg-white/5 border-white/10">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit" className="mt-2">
                      {/* Content is shown in the textarea above */}
                    </TabsContent>
                    <TabsContent value="preview" className="mt-2 prose prose-invert max-w-none border border-white/10 rounded-md p-4 bg-white/5">
                      <div dangerouslySetInnerHTML={{ 
                        __html: watchContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/---/g, '<hr class="border-t border-white/20 my-4" />')
                          .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold mb-4 text-agency-purple">$1</h1>')
                          .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold mb-3 text-agency-blue">$1</h2>')
                          .replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold mb-2 text-agency-teal">$1</h3>')
                          .replace(/\n/g, '<br />')
                      }} />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            )}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={onCancel} variant="outline" className="border-white/10">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple">
          {isLoading ? 'Saving...' : proposal.id ? 'Update Proposal' : 'Create Proposal'}
        </Button>
      </div>
    </form>
  );
};

export default ProposalForm;
