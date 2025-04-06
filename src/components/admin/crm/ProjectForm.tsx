
import { Project, Client } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Save, X, Calendar } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface ProjectFormProps {
  project: Project;
  clients: Client[];
  onChange: (project: Project) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const ProjectForm = ({ project, clients, onChange, onSave, onCancel, isSaving }: ProjectFormProps) => {
  const handleBudgetChange = (value: string) => {
    const budget = value === '' ? null : parseFloat(value);
    onChange({ ...project, budget });
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0]; // Convert ISO string to YYYY-MM-DD
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Project Title*</label>
          <input 
            type="text" 
            value={project.title || ''}
            onChange={e => onChange({...project, title: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
            placeholder="Project Name"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">Client*</label>
          <select 
            value={project.client_id || ''}
            onChange={e => onChange({...project, client_id: e.target.value})}
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
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Description</label>
        <textarea 
          value={project.description || ''}
          onChange={e => onChange({...project, description: e.target.value})}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          rows={3}
          placeholder="Describe the project scope and objectives"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal border-white/20 bg-white/10 text-white ${!project.start_date ? 'text-gray-400' : ''}`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {project.start_date 
                  ? format(new Date(project.start_date), 'PPP')
                  : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-agency-darker border-white/20">
              <CalendarComponent
                mode="single"
                selected={project.start_date ? new Date(project.start_date) : undefined}
                onSelect={(date) => onChange({...project, start_date: date?.toISOString()})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal border-white/20 bg-white/10 text-white ${!project.end_date ? 'text-gray-400' : ''}`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {project.end_date 
                  ? format(new Date(project.end_date), 'PPP')
                  : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-agency-darker border-white/20">
              <CalendarComponent
                mode="single"
                selected={project.end_date ? new Date(project.end_date) : undefined}
                onSelect={(date) => onChange({...project, end_date: date?.toISOString()})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Budget ($)</label>
          <input 
            type="number" 
            value={project.budget === null ? '' : project.budget}
            onChange={e => handleBudgetChange(e.target.value)}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
            placeholder="Project Budget (USD)"
            step="100"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">Status</label>
          <select 
            value={project.status}
            onChange={e => onChange({...project, status: e.target.value as any})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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
          Save Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectForm;
