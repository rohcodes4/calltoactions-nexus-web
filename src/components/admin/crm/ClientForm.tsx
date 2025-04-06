
import { Client } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface ClientFormProps {
  client: Client;
  onChange: (client: Client) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const ClientForm = ({ client, onChange, onSave, onCancel, isSaving }: ClientFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Client Name*</label>
          <input 
            type="text" 
            value={client.name || ''}
            onChange={e => onChange({...client, name: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
            placeholder="Full Name or Organization Name"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">Company</label>
          <input 
            type="text" 
            value={client.company || ''}
            onChange={e => onChange({...client, company: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
            placeholder="Company Name (if applicable)"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Email*</label>
          <input 
            type="email" 
            value={client.email || ''}
            onChange={e => onChange({...client, email: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
            placeholder="email@example.com"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">Phone</label>
          <input 
            type="text" 
            value={client.phone || ''}
            onChange={e => onChange({...client, phone: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
            placeholder="Phone Number"
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Address</label>
        <textarea 
          value={client.address || ''}
          onChange={e => onChange({...client, address: e.target.value})}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          rows={2}
          placeholder="Street, City, State, ZIP"
        />
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Website</label>
        <input 
          type="text" 
          value={client.website || ''}
          onChange={e => onChange({...client, website: e.target.value})}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          placeholder="https://example.com"
        />
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Status</label>
        <select 
          value={client.status}
          onChange={e => onChange({...client, status: e.target.value as any})}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
        >
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Lead: Potential client not yet converted<br />
          Active: Current client with active projects<br />
          Inactive: Past client with no current projects
        </p>
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Notes</label>
        <textarea 
          value={client.notes || ''}
          onChange={e => onChange({...client, notes: e.target.value})}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          rows={3}
          placeholder="Add any additional notes about this client"
        />
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
          onClick={onSave}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          ) : (
            <Save size={16} className="mr-2" />
          )}
          Save Client
        </Button>
      </div>
    </div>
  );
};

export default ClientForm;
