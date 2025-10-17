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
  UserPlus,
  Mail as MailIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ServicesAdmin from '@/components/admin/ServicesAdmin';
import PortfolioAdmin from '@/components/admin/PortfolioAdmin';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminUsers from '@/components/admin/AdminUsers';
import ContactSubmissions from '@/components/admin/ContactSubmissions';
import ChangePassword from '@/components/admin/ChangePassword';
import ClientManager from '@/components/admin/crm/ClientManager';
import ProjectManager from '@/components/admin/crm/ProjectManager';
import ProposalManager from '@/components/admin/crm/ProposalManager';
import NewsletterManager from '@/components/admin/NewsletterManager';
import InvoiceManager from '@/components/admin/crm/InvoiceManager';
import RegisterForm from '@/components/admin/RegisterForm';
import { supabase } from '@/lib/supabase';
import LogosAdmin from '@/components/admin/LogosAdmin';
import TestimonialsAdmin from '@/components/admin/TestimonialsAdmin';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };
    
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      } else if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('status')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        if (userData.status === 'inactive') {
          await supabase.auth.signOut();
          
          setLoginError('Your account is inactive. Please contact an administrator.');
          toast({
            title: "Access denied",
            description: "Your account is inactive. Please contact an administrator.",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel"
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError('An unexpected error occurred');
      toast({
        title: "Login error",
        description: "An unexpected error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      setIsAuthenticated(false);
    }
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
        {showRegister ? (
          <div className="w-full max-w-md">
            <RegisterForm />
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-gray-400 hover:text-white" 
                onClick={() => setShowRegister(false)}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        ) : (
          <Card className="glass-card p-8 max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-gray-400">Sign in to access the admin dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Password</label>
                <input 
                  type="password" 
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {loginError && (
                <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded">
                  {loginError}
                </div>
              )}
              
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  "Login"
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  className="text-gray-400 hover:text-white" 
                  onClick={() => setShowRegister(true)}
                >
                  Need an account? Register
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Demo credentials: admin@example.com / password123
              </p>
            </form>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agency-dark pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 shrink-0">
            <Card className="glass-card p-4 sticky top-24">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-sm text-gray-400">Manage your website content</p>
              </div>
              
              <div className="lg:hidden mb-4">
                <select 
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  value={location.pathname}
                  onChange={(e) => window.location.href = e.target.value}
                >
                  <option value="/admin/services">Services</option>
                  <option value="/admin/portfolio">Portfolio</option>
                  <option value="/admin/logos">Client Logo's</option>
                  <option value="/admin/testimonials">Testimonials</option>
                  <option value="/admin/messages">Messages</option>
                  <option value="/admin/newsletter">Newsletter</option>
                  <option value="/admin/clients">Clients</option>
                  <option value="/admin/projects">Projects</option>
                  <option value="/admin/proposals">Proposals</option>
                  <option value="/admin/invoices">Invoices</option>
                  <option value="/admin/users">Users</option>
                  <option value="/admin/password">Change Password</option>
                  <option value="/admin/settings">Settings</option>
                </select>
              </div>
              
              <nav className="space-y-1 hidden lg:block">
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
                  to="/admin/logos" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/logos') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Mail size={18} className="mr-3" />
                  <span>Client Logo's</span>
                </Link>
              
                <Link 
                  to="/admin/testimonials" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/testimonials') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Mail size={18} className="mr-3" />
                  <span>Testimonials</span>
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
                
                <Link 
                  to="/admin/newsletter" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/newsletter') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <MailIcon size={18} className="mr-3" />
                  <span>Newsletter</span>
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
                
                <Link 
                  to="/admin/invoices" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname.includes('/admin/invoices') 
                      ? 'bg-agency-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <CreditCard size={18} className="mr-3" />
                  <span>Invoices</span>
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
          
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/services" replace />} />
              <Route path="/services/*" element={<ServicesAdmin />} />
              <Route path="/portfolio/*" element={<PortfolioAdmin />} />
              <Route path="/logos" element={<LogosAdmin />} />
              <Route path="/testimonials" element={<TestimonialsAdmin />} />
              <Route path="/messages" element={<ContactSubmissions />} />
              <Route path="/newsletter" element={<NewsletterManager />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/password" element={<ChangePassword />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="/clients" element={<ClientManager />} />
              <Route path="/projects" element={<ProjectManager />} />
              <Route path="/proposals" element={<ProposalManager />} />
              <Route path="/invoices" element={<InvoiceManager />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
