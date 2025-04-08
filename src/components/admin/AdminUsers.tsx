
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, updateUser, deleteUser } from '@/services/databaseService';
import { Edit, Trash2, AlertOctagon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/lib/supabase';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AdminUsers = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check current user's role
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setCurrentUserRole(data.role);
        }
      }
    };
    
    checkUserRole();
  }, []);

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) => 
      updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Updated",
        description: "The user has been updated successfully"
      });
      setIsEditing(false);
      setCurrentUser(null);
    }
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Deleted",
        description: "The user has been deleted successfully"
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  });

  const handleEditClick = (user: User) => {
    setCurrentUser({ ...user });
    setIsEditing(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !currentUser.id) return;
    
    updateMutation.mutate({ 
      id: currentUser.id, 
      updates: currentUser 
    });
  };

  const confirmDelete = () => {
    if (userToDelete && userToDelete.id) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  const isAdmin = currentUserRole === 'admin';

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
          <p className="text-gray-400">Manage users and their permissions</p>
        </div>
      </div>
      
      {!isAdmin && (
        <Card className="glass-card p-6 mb-6">
          <div className="flex items-center space-x-2 text-amber-400 bg-amber-500/10 p-4 rounded-lg">
            <AlertOctagon size={24} />
            <div>
              <p className="font-medium">Admin Privileges Required</p>
              <p className="text-sm text-amber-300">
                Creating and deleting users requires admin privileges. Contact your Supabase administrator for full access.
              </p>
            </div>
          </div>
        </Card>
      )}

      {isEditing && currentUser && (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  value={currentUser.full_name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  placeholder="Full Name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Role</label>
                <select 
                  name="role"
                  value={currentUser.role}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  disabled={!isAdmin}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                {!isAdmin && (
                  <p className="text-xs text-amber-400 mt-1">Only admins can change roles</p>
                )}
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">Status</label>
                <select 
                  name="status"
                  value={currentUser.status}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  disabled={!isAdmin}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {!isAdmin && (
                  <p className="text-xs text-amber-400 mt-1">Only admins can change status</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setCurrentUser(null);
                }}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
                disabled={updateMutation.isPending || (!isAdmin && (currentUser.role !== 'editor' || currentUser.status !== 'active'))}
              >
                {updateMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : "Update User"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="glass-card p-4 overflow-hidden">
        <div className="rounded-md border border-white/10 overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-white/5 border-white/10">
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} className="hover:bg-white/5 border-white/10">
                  <TableCell className="font-medium text-white">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.full_name || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : user.role === 'editor'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit size={16} />
                      </Button>
                      
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass-card border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {userToDelete && (
            <div className="py-4">
              <p><span className="text-gray-400">Email:</span> {userToDelete.email}</p>
              {userToDelete.full_name && (
                <p><span className="text-gray-400">Name:</span> {userToDelete.full_name}</p>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
