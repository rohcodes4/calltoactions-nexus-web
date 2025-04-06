
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Calendar, DollarSign, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Project, Client } from '@/lib/supabase';
import { fetchProjects, createProject, updateProject, deleteProject, fetchClients } from '@/services/databaseService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { format } from 'date-fns';
import ProjectForm from './ProjectForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Validation schema
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  client_id: z.string().min(1, "Client is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "active", "completed", "cancelled"]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget: z.number().optional().nullable()
});

const ProjectManager = () => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects from the database
  const { data: projects = [], isLoading: isLoadingProjects, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // Fetch clients for the dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project Created",
        description: "The project has been created successfully"
      });
      setEditingProject(null);
      setIsAdding(false);
    }
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) => 
      updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project Updated",
        description: "The project has been updated successfully"
      });
      setEditingProject(null);
    }
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully"
      });
    }
  });

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newProject: Project = {
      id: "",
      client_id: "",
      title: "",
      description: "",
      status: "pending",
      start_date: new Date().toISOString().split('T')[0],
      budget: null
    };
    setEditingProject(newProject);
    setIsAdding(true);
  };

  const validateForm = () => {
    if (!editingProject) return false;
    
    try {
      projectSchema.parse(editingProject);
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
    if (!editingProject || !validateForm()) return;
    
    if (isAdding) {
      // For new projects, we don't include the id
      const { id, ...projectData } = editingProject;
      createMutation.mutate(projectData as Project);
    } else {
      updateMutation.mutate({ 
        id: editingProject.id, 
        updates: editingProject 
      });
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const projectToDelete = projects.find(p => p.id === id);
    if (confirm(`Are you sure you want to delete project "${projectToDelete?.title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-300";
      case "pending": return "bg-yellow-500/20 text-yellow-300";
      case "completed": return "bg-blue-500/20 text-blue-300";
      case "cancelled": return "bg-red-500/20 text-red-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  if (isLoadingProjects) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="text-red-500 p-4">
        Error loading projects. Please try again later.
        {projectsError instanceof Error && <div className="text-sm mt-2">{projectsError.message}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Management</h1>
          <p className="text-gray-400">Create and manage all your client projects</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </Button>
      </div>

      {editingProject ? (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Create New Project" : "Edit Project"}
          </h2>
          
          <ProjectForm
            project={editingProject}
            clients={clients}
            onChange={setEditingProject}
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
                <TableHead className="text-white">Project</TableHead>
                <TableHead className="text-white">Client</TableHead>
                <TableHead className="text-white">Timeline</TableHead>
                <TableHead className="text-white">Budget</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(project => (
                <TableRow key={project.id} className="hover:bg-white/5 border-white/10">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{project.title}</div>
                      {project.description && (
                        <div className="text-sm text-gray-400 line-clamp-1">
                          {project.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getClientName(project.client_id)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {project.start_date && (
                        <div className="text-sm text-gray-400 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          Started: {format(new Date(project.start_date), 'MMM d, yyyy')}
                        </div>
                      )}
                      {project.end_date && (
                        <div className="text-sm text-gray-400 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          Due: {format(new Date(project.end_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.budget ? (
                      <div className="text-sm flex items-center">
                        <DollarSign size={12} className="mr-1 text-green-400" />
                        {project.budget.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit size={16} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    No projects found. Click "Add Project" to create one.
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

export default ProjectManager;
