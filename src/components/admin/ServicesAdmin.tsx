
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string;
  benefits: string[];
}

// Initial mock data - in a real app, this would come from a database
const initialServices = [
  {
    id: "web-design",
    title: "Web Design",
    description: "Stunning, conversion-focused websites that captivate your audience.",
    icon: "Monitor",
    details: "Our web design process focuses on creating visually appealing interfaces.",
    benefits: [
      "Custom design tailored to your brand",
      "Responsive layouts for all devices",
      "User experience optimization"
    ]
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Robust, scalable web applications built with cutting-edge technologies.",
    icon: "Code",
    details: "We build powerful web applications using the latest technologies.",
    benefits: [
      "Clean, efficient code structure",
      "Optimized performance and loading speed",
      "Secure development practices"
    ]
  },
  {
    id: "video-production",
    title: "Video Production",
    description: "Compelling video content that tells your story.",
    icon: "Video",
    details: "From concept to final cut, we create video content that captivates.",
    benefits: [
      "Professional scriptwriting and storyboarding",
      "High-quality filming and equipment",
      "Expert editing and post-production"
    ]
  }
];

const ServicesAdmin = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newService = {
      id: `service-${Date.now()}`,
      title: "",
      description: "",
      icon: "FileText",
      details: "",
      benefits: [""]
    };
    setEditingService(newService);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!editingService) return;
    
    // Validate
    if (!editingService.title.trim() || !editingService.description.trim()) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive"
      });
      return;
    }

    if (isAdding) {
      setServices([...services, editingService]);
      toast({
        title: "Service Added",
        description: `${editingService.title} has been added successfully.`
      });
    } else {
      setServices(services.map(s => 
        s.id === editingService.id ? editingService : s
      ));
      toast({
        title: "Service Updated",
        description: `${editingService.title} has been updated successfully.`
      });
    }
    
    setEditingService(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingService(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const serviceToDelete = services.find(s => s.id === id);
    
    if (window.confirm(`Are you sure you want to delete "${serviceToDelete?.title}"?`)) {
      setServices(services.filter(s => s.id !== id));
      toast({
        title: "Service Deleted",
        description: `${serviceToDelete?.title} has been deleted successfully.`
      });
    }
  };

  const handleBenefitChange = (index: number, value: string) => {
    if (!editingService) return;
    
    const newBenefits = [...editingService.benefits];
    newBenefits[index] = value;
    
    setEditingService({
      ...editingService,
      benefits: newBenefits
    });
  };

  const addBenefit = () => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      benefits: [...editingService.benefits, ""]
    });
  };

  const removeBenefit = (index: number) => {
    if (!editingService) return;
    const newBenefits = [...editingService.benefits];
    newBenefits.splice(index, 1);
    
    setEditingService({
      ...editingService,
      benefits: newBenefits
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services Management</h1>
          <p className="text-gray-400">Add, edit, or remove services from your website</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Add Service
        </Button>
      </div>

      {editingService ? (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Add New Service" : "Edit Service"}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Title</label>
              <input 
                type="text" 
                value={editingService.title}
                onChange={e => setEditingService({...editingService, title: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="Service Title"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Description</label>
              <input 
                type="text" 
                value={editingService.description}
                onChange={e => setEditingService({...editingService, description: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="Short description"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Icon</label>
              <select 
                value={editingService.icon}
                onChange={e => setEditingService({...editingService, icon: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
              >
                <option value="Monitor">Monitor</option>
                <option value="Code">Code</option>
                <option value="Video">Video</option>
                <option value="PenTool">PenTool</option>
                <option value="BarChart">BarChart</option>
                <option value="FileText">FileText</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Details</label>
              <textarea 
                value={editingService.details}
                onChange={e => setEditingService({...editingService, details: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white h-24"
                placeholder="Detailed description"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Benefits</label>
              {editingService.benefits.map((benefit, index) => (
                <div key={index} className="flex mb-2">
                  <input 
                    type="text" 
                    value={benefit}
                    onChange={e => handleBenefitChange(index, e.target.value)}
                    className="flex-1 p-2 rounded-l bg-white/10 border border-white/20 text-white"
                    placeholder={`Benefit ${index + 1}`}
                  />
                  <button 
                    onClick={() => removeBenefit(index)}
                    className="bg-white/10 px-3 rounded-r border border-white/20 border-l-0 text-white hover:bg-white/15"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <Button 
                variant="outline"
                size="sm"
                onClick={addBenefit}
                className="mt-1"
              >
                <Plus size={14} className="mr-1" />
                Add Benefit
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button 
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
            >
              <Save size={16} className="mr-2" />
              Save
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="space-y-4">
        {services.map(service => (
          <Card key={service.id} className="glass-card p-6 overflow-hidden relative">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="text-sm text-gray-500">
                  {service.benefits.length} benefits listed
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(service)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-400"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesAdmin;
