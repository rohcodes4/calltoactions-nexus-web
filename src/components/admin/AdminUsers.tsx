
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X, User, UserCheck, UserX, MailOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { User as UserType } from '@/lib/supabase';
import { fetchUsers, createUser, updateUser } from '@/services/databaseService';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Validation schema
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(1, "Full name is required"),
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "inactive"])
});

const AdminUsers = () => {
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users from the database
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Created",
        description: "The user has been created successfully"
      });
      setEditingUser(null);
      setIsAdding(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive"
      });
    }
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UserType> }) => 
      updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Updated",
        description: "The user has been updated successfully"
      });
      setEditingUser(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive"
      });
    }
  });

  const handleEdit = (user: UserType) => {
    setEditingUser({ ...user });
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newUser: UserType = {
      id: "",
      email: "",
      full_name: "",
      role: "viewer",
      status: "inactive"
    };
    setEditingUser(newUser);
    setIsAdding(true);
  };

  const validateForm = () => {
    if (!editingUser) return false;
    
    try {
      userSchema.parse({
        email: editingUser.email,
        full_name: editingUser.full_name || "",
        role: editingUser.role,
        status: editingUser.status
      });
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
    if (!editingUser || !validateForm()) return;
    
    if (isAdding) {
      // For new users, we don't include the id
      const { id, ...userData } = editingUser;
      createMutation.mutate(userData as UserType);
    } else {
      updateMutation.mutate({ 
        id: editingUser.id, 
        updates: editingUser 
      });
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setIsAdding(false);
  };

  const toggleStatus = (user: UserType) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    updateMutation.mutate({ 
      id: user.id, 
      updates: { status: newStatus }
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/20 text-red-300";
      case "editor": return "bg-green-500/20 text-green-300";
      case "viewer": return "bg-blue-500/20 text-blue-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return <span className="text-green-400">Active</span>;
      case "inactive": return <span className="text-gray-400">Inactive</span>;
      default: return <span>{status}</span>;
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
        Error loading users. Please try again later.
        {error instanceof Error && <div className="text-sm mt-2">{error.message}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Add, edit, or manage user access to the admin panel</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Add User
        </Button>
      </div>

      {editingUser ? (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Add New User" : "Edit User"}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Email</label>
              <input 
                type="email" 
                value={editingUser.email}
                onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="user@example.com"
                disabled={!isAdding} // Only allow email editing for new users
              />
              {!isAdding && (
                <p className="text-xs text-amber-400 mt-1">Email cannot be changed after creation</p>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Full Name</label>
              <input 
                type="text" 
                value={editingUser.full_name || ''}
                onChange={e => setEditingUser({...editingUser, full_name: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="Full Name"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Role</label>
              <select 
                value={editingUser.role}
                onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Admin: Full access to all features<br />
                Editor: Can edit content but not manage users<br />
                Viewer: Read-only access
              </p>
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Status</label>
              <select 
                value={editingUser.status}
                onChange={e => setEditingUser({...editingUser, status: e.target.value as any})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save size={16} className="mr-2" />
              )}
              Save
            </Button>
          </div>
        </Card>
      ) : null}

      <Card className="glass-card p-4 overflow-hidden">
        <div className="rounded-md border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-white/5 border-white/10">
                <TableHead className="text-white">User</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} className="hover:bg-white/5 border-white/10">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                        <User size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.full_name || 'Unnamed User'}</div>
                        <div className="text-sm text-gray-400">
                          <div className="flex items-center">
                            <MailOpen size={12} className="mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getRoleBadgeColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusText(user.status)}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleStatus(user)}
                        className={user.status === "active" ? "text-green-400" : "text-gray-500"}
                      >
                        {user.status === "active" ? <UserCheck size={16} /> : <UserX size={16} />}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No users found. Click "Add User" to create one.
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

export default AdminUsers;
