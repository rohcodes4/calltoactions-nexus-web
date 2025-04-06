
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Settings, 
  Users, 
  FolderKanban, 
  PanelLeft, 
  LogOut, 
  Mail, 
  Lock,
  Briefcase,
  FileText,
  CreditCard,
  UserPlus
} from 'lucide-react';
import ServicesAdmin from '@/components/admin/ServicesAdmin';
import PortfolioAdmin from '@/components/admin/PortfolioAdmin';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminUsers from '@/components/admin/AdminUsers';
import ContactSubmissions from '@/components/admin/ContactSubmissions';
import ChangePassword from '@/components/admin/ChangePassword';
import ClientManager from '@/components/admin/crm/ClientManager';
import ProjectManager from '@/components/admin/crm/ProjectManager';
import ProposalManager from '@/components/admin/crm/ProposalManager';
import { supabase } from '@/lib/supabase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      // Get current session from Supabase
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };
    
    checkAuth();

    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // For demo purposes - fake login
  const handleLogin = () => {
    localStorage.setItem('adminEmail', 'rohitparakh4@gmail.com');
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
              
              <nav className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider pl-3 pb-1 pt-2">Content</p>
                
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
                  <span>Messages</span>
                </Link>
                
                <p className="text-xs text-gray-500 uppercase tracking-wider pl-3 pb-1 pt-4">CRM</p>
                
                <Link 
                  to="/admin/clients" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/clients') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <UserPlus size={18} className="mr-3" />
                  <span>Clients</span>
                </Link>
                
                <Link 
                  to="/admin/projects" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/projects') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Briefcase size={18} className="mr-3" />
                  <span>Projects</span>
                </Link>
                
                <Link 
                  to="/admin/proposals" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/proposals') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FileText size={18} className="mr-3" />
                  <span>Proposals</span>
                </Link>
                
                <p className="text-xs text-gray-500 uppercase tracking-wider pl-3 pb-1 pt-4">Admin</p>
                
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
                  className="flex items-center p-3 rounded-lg transition-colors text-gray-400 hover:bg-white/5 hover:text-white w-full text-left mt-4"
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
              <Route path="/clients" element={<ClientManager />} />
              <Route path="/projects" element={<ProjectManager />} />
              <Route path="/proposals" element={<ProposalManager />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
