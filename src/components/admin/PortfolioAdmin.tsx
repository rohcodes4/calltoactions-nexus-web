
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X, Link, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Portfolio {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  link: string;
}

// Mock data - in a real app, this would come from a database
const initialPortfolio = [
  {
    id: "1",
    title: "Elegance Rebranding",
    category: "Graphic Design",
    imageUrl: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=800&auto=format&fit=crop",
    description: "Complete rebranding project for a luxury brand, including logo design, color palette, and brand guidelines.",
    link: "",
  },
  {
    id: "2",
    title: "Tech Innovators Website",
    category: "Web Development",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop",
    description: "Fully responsive website design and development for a tech startup, with custom animations and interactive elements.",
    link: "",
  },
  {
    id: "3",
    title: "Urban Beats Campaign",
    category: "Digital Marketing",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
    description: "Comprehensive marketing campaign for a music festival, including social media strategy, content creation, and analytics.",
    link: "",
  }
];

const categories = [
  "Web Design",
  "Web Development",
  "Graphic Design", 
  "Video Production",
  "Digital Marketing",
  "Branding"
];

const PortfolioAdmin = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>(initialPortfolio);
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleEdit = (item: Portfolio) => {
    setEditingItem({ ...item });
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newItem = {
      id: `portfolio-${Date.now()}`,
      title: "",
      category: categories[0],
      imageUrl: "",
      description: "",
      link: ""
    };
    setEditingItem(newItem);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!editingItem) return;
    
    // Validate
    if (!editingItem.title.trim() || !editingItem.description.trim() || !editingItem.imageUrl) {
      toast({
        title: "Error",
        description: "Title, description, and image URL are required",
        variant: "destructive"
      });
      return;
    }

    if (isAdding) {
      setPortfolio([...portfolio, editingItem]);
      toast({
        title: "Portfolio Item Added",
        description: `${editingItem.title} has been added successfully.`
      });
    } else {
      setPortfolio(portfolio.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      toast({
        title: "Portfolio Item Updated",
        description: `${editingItem.title} has been updated successfully.`
      });
    }
    
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const itemToDelete = portfolio.find(item => item.id === id);
    
    if (window.confirm(`Are you sure you want to delete "${itemToDelete?.title}"?`)) {
      setPortfolio(portfolio.filter(item => item.id !== id));
      toast({
        title: "Portfolio Item Deleted",
        description: `${itemToDelete?.title} has been deleted successfully.`
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Management</h1>
          <p className="text-gray-400">Add, edit, or remove portfolio items from your website</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </Button>
      </div>

      {editingItem ? (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Add New Project" : "Edit Project"}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Title</label>
              <input 
                type="text" 
                value={editingItem.title}
                onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="Project Title"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Category</label>
              <select 
                value={editingItem.category}
                onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Image URL</label>
              <div className="flex mb-2">
                <input 
                  type="text" 
                  value={editingItem.imageUrl}
                  onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})}
                  className="w-full p-2 rounded-l bg-white/10 border border-white/20 text-white"
                  placeholder="https://example.com/image.jpg"
                />
                <button 
                  className="bg-white/10 px-3 rounded-r border border-white/20 border-l-0 text-white hover:bg-white/15"
                  onClick={() => {
                    if (editingItem.imageUrl) {
                      window.open(editingItem.imageUrl, '_blank');
                    }
                  }}
                  disabled={!editingItem.imageUrl}
                >
                  <ImageIcon size={16} />
                </button>
              </div>
              {editingItem.imageUrl && (
                <div className="h-40 w-full bg-white/5 rounded overflow-hidden">
                  <img 
                    src={editingItem.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Description</label>
              <textarea 
                value={editingItem.description}
                onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white h-24"
                placeholder="Project description"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Project URL (optional)</label>
              <div className="flex">
                <input 
                  type="text" 
                  value={editingItem.link}
                  onChange={e => setEditingItem({...editingItem, link: e.target.value})}
                  className="w-full p-2 rounded-l bg-white/10 border border-white/20 text-white"
                  placeholder="https://example.com"
                />
                <button 
                  className="bg-white/10 px-3 rounded-r border border-white/20 border-l-0 text-white hover:bg-white/15"
                  onClick={() => {
                    if (editingItem.link) {
                      window.open(editingItem.link, '_blank');
                    }
                  }}
                  disabled={!editingItem.link}
                >
                  <Link size={16} />
                </button>
              </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map(item => (
          <Card key={item.id} className="glass-card overflow-hidden">
            <div className="h-48 relative">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-agency-darker to-transparent opacity-70"></div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-agency-purple mb-2">{item.category}</p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortfolioAdmin;
