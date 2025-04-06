
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Mail, Phone, Globe, Building, User, Tags } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Client } from '@/lib/supabase';
import { fetchClients, createClient, updateClient, deleteClient } from '@/services/databaseService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import ClientForm from './ClientForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Validation schema
const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "lead"])
});

const ClientManager = () => {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch clients from the database
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Create client mutation
  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Created",
        description: "The client has been created successfully"
      });
      setEditingClient(null);
      setIsAdding(false);
    }
  });

  // Update client mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Client> }) => 
      updateClient(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Updated",
        description: "The client has been updated successfully"
      });
      setEditingClient(null);
    }
  });

  // Delete client mutation
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client Deleted",
        description: "The client has been deleted successfully"
      });
    }
  });

  const handleEdit = (client: Client) => {
    setEditingClient({ ...client });
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newClient: Client = {
      id: "",
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      notes: "",
      status: "lead"
    };
    setEditingClient(newClient);
    setIsAdding(true);
  };

  const validateForm = () => {
    if (!editingClient) return false;
    
    try {
      clientSchema.parse(editingClient);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(e => e.message).join(', ');
        toast({
          title: "Validation Error",
          description: errorMessages,
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const handleSave = () => {
    if (!editingClient || !validateForm()) return;
    
    if (isAdding) {
      // For new clients, we don't include the id
      const { id, ...clientData } = editingClient;
      createMutation.mutate(clientData as Client);
    } else {
      updateMutation.mutate({ 
        id: editingClient.id, 
        updates: editingClient 
      });
    }
  };

  const handleCancel = () => {
    setEditingClient(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const clientToDelete = clients.find(c => c.id === id);
    if (confirm(`Are you sure you want to delete client "${clientToDelete?.name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-300";
      case "inactive": return "bg-gray-500/20 text-gray-300";
      case "lead": return "bg-blue-500/20 text-blue-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading clients. Please try again later.
        {error instanceof Error && <div className="text-sm mt-2">{error.message}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Management</h1>
          <p className="text-gray-400">Add, edit, or manage your client database</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Add Client
        </Button>
      </div>

      {editingClient ? (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Add New Client" : "Edit Client"}
          </h2>
          
          <ClientForm
            client={editingClient}
            onChange={setEditingClient}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={createMutation.isPending || updateMutation.isPending}
          />
        </Card>
      ) : null}

      <Card className="glass-card p-4 overflow-hidden">
        <div className="rounded-md border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-white/5 border-white/10">
                <TableHead className="text-white">Client</TableHead>
                <TableHead className="text-white">Contact</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(client => (
                <TableRow key={client.id} className="hover:bg-white/5 border-white/10">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                        <User size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{client.name}</div>
                        {client.company && (
                          <div className="text-sm text-gray-400 flex items-center">
                            <Building size={12} className="mr-1" />
                            {client.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400 flex items-center">
                        <Mail size={12} className="mr-1" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="text-sm text-gray-400 flex items-center">
                          <Phone size={12} className="mr-1" />
                          {client.phone}
                        </div>
                      )}
                      {client.website && (
                        <div className="text-sm text-gray-400 flex items-center">
                          <Globe size={12} className="mr-1" />
                          <a 
                            href={client.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-agency-purple"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(client.status)}`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit size={16} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {clients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                    No clients found. Click "Add Client" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ClientManager;
