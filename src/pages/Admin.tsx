
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Settings, Users, FolderKanban, PanelLeft, LogOut, Mail, Lock } from 'lucide-react';
import ServicesAdmin from '@/components/admin/ServicesAdmin';
import PortfolioAdmin from '@/components/admin/PortfolioAdmin';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminUsers from '@/components/admin/AdminUsers';
import ContactSubmissions from '@/components/admin/ContactSubmissions';
import ChangePassword from '@/components/admin/ChangePassword';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Mock authentication check - in a real app, we would check against a backend
  useEffect(() => {
    // Simulate auth check
    const checkAuth = () => {
      // In a real app, this would be a check against session storage or a token
      const mockUserEmail = localStorage.getItem('adminEmail');
      setIsAuthenticated(mockUserEmail === 'rohitparakh4@gmail.com');
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // For demo purposes - fake login
  const handleLogin = () => {
    localStorage.setItem('adminEmail', 'rohitparakh4@gmail.com');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-agency-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-agency-dark pt-20 flex items-center justify-center px-4">
        <Card className="glass-card p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400">Sign in to access the admin dashboard</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Email</label>
              <input 
                type="email" 
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                defaultValue="rohitparakh4@gmail.com"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Password</label>
              <input 
                type="password" 
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                defaultValue="••••••••"
                readOnly
              />
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
              onClick={handleLogin}
            >
              Login
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              This is a demo admin panel. Click login to continue.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agency-dark pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <Card className="glass-card p-4 sticky top-24">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-sm text-gray-400">Manage your website content</p>
              </div>
              
              <nav className="space-y-2">
                <Link 
                  to="/admin/services" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/services') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FolderKanban size={18} className="mr-3" />
                  <span>Services</span>
                </Link>
                
                <Link 
                  to="/admin/portfolio" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/portfolio') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <PanelLeft size={18} className="mr-3" />
                  <span>Portfolio</span>
                </Link>
                
                <Link 
                  to="/admin/messages" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/messages') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Mail size={18} className="mr-3" />
                  <span>Contact Messages</span>
                </Link>
                
                <Link 
                  to="/admin/users" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/users') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Users size={18} className="mr-3" />
                  <span>Users</span>
                </Link>
                
                <Link 
                  to="/admin/password" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/password') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Lock size={18} className="mr-3" />
                  <span>Change Password</span>
                </Link>
                
                <Link 
                  to="/admin/settings" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/settings') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings size={18} className="mr-3" />
                  <span>Settings</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg transition-colors text-gray-400 hover:bg-white/5 hover:text-white w-full text-left"
                >
                  <LogOut size={18} className="mr-3" />
                  <span>Logout</span>
                </button>
              </nav>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/services" replace />} />
              <Route path="/services/*" element={<ServicesAdmin />} />
              <Route path="/portfolio/*" element={<PortfolioAdmin />} />
              <Route path="/messages" element={<ContactSubmissions />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/password" element={<ChangePassword />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
