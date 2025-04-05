
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X, User, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
}

// Mock data - in a real app, this would come from a database
const initialUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "rohitparakh4@gmail.com", 
    role: "admin" as const,
    status: "active" as const
  },
  {
    id: "2",
    name: "John Editor",
    email: "john@example.com",
    role: "editor" as const,
    status: "active" as const
  },
  {
    id: "3", 
    name: "Sarah Viewer",
    email: "sarah@example.com",
    role: "viewer" as const,
    status: "inactive" as const
  }
];

const AdminUsers = () => {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleEdit = (user: UserType) => {
    setEditingUser({ ...user });
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: "",
      email: "",
      role: "viewer" as const,
      status: "inactive" as const
    };
    setEditingUser(newUser);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!editingUser) return;
    
    // Validate
    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (isAdding) {
      setUsers([...users, editingUser]);
      toast({
        title: "User Added",
        description: `${editingUser.name} has been added successfully.`
      });
    } else {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      toast({
        title: "User Updated",
        description: `${editingUser.name} has been updated successfully.`
      });
    }
    
    setEditingUser(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    // Don't allow deletion of the default admin
    const userToDelete = users.find(user => user.id === id);
    
    if (userToDelete?.email === "rohitparakh4@gmail.com") {
      toast({
        title: "Cannot Delete",
        description: "The default admin user cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${userToDelete?.name}"?`)) {
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "User Deleted",
        description: `${userToDelete?.name} has been deleted successfully.`
      });
    }
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.status === "active" ? "inactive" : "active";
        return { ...user, status: newStatus as "active" | "inactive" };
      }
      return user;
    }));
    
    const user = users.find(user => user.id === id);
    const newStatus = user?.status === "active" ? "inactive" : "active";
    
    toast({
      title: `User ${newStatus === "active" ? "Activated" : "Deactivated"}`,
      description: `${user?.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`
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
              <label className="text-sm text-gray-300 block mb-1">Name</label>
              <input 
                type="text" 
                value={editingUser.name}
                onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="User Name"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Email</label>
              <input 
                type="email" 
                value={editingUser.email}
                onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="user@example.com"
                disabled={!isAdding && editingUser.email === "rohitparakh4@gmail.com"}
              />
              {!isAdding && editingUser.email === "rohitparakh4@gmail.com" && (
                <p className="text-xs text-amber-400 mt-1">Default admin email cannot be changed</p>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Role</label>
              <select 
                value={editingUser.role}
                onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                disabled={!isAdding && editingUser.email === "rohitparakh4@gmail.com"}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              {!isAdding && editingUser.email === "rohitparakh4@gmail.com" && (
                <p className="text-xs text-amber-400 mt-1">Default admin role cannot be changed</p>
              )}
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Status</label>
              <select 
                value={editingUser.status}
                onChange={e => setEditingUser({...editingUser, status: e.target.value as any})}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                disabled={!isAdding && editingUser.email === "rohitparakh4@gmail.com"}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {!isAdding && editingUser.email === "rohitparakh4@gmail.com" && (
                <p className="text-xs text-amber-400 mt-1">Default admin status cannot be changed</p>
              )}
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
        {users.map(user => (
          <Card key={user.id} className="glass-card p-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toggleStatus(user.id)}
                  disabled={user.email === "rohitparakh4@gmail.com"}
                  className={user.status === "active" ? "text-green-400" : "text-gray-500"}
                >
                  {user.status === "active" ? <UserCheck size={18} /> : <UserX size={18} />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEdit(user)}
                >
                  <Edit size={18} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(user.id)}
                  disabled={user.email === "rohitparakh4@gmail.com"}
                  className="text-red-500 hover:text-red-400 disabled:text-gray-600"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
