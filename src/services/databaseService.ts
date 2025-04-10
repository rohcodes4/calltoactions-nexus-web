import { supabase, Service, Portfolio, Testimonial, Client, Project, GeneralSettings, SocialLinks, Invoice, Proposal, ContactMessage, NewsletterSubscription, User } from '@/lib/supabase';

// General services
export const fetchServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching services:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchServiceById = async (id: string) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const fetchServiceBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching service with slug ${slug}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

// CREATE/UPDATE/DELETE Services
export const createService = async (service: Omit<Service, 'id'>) => {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateService = async (id: string, updates: Partial<Service>) => {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteService = async (id: string) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

// Portfolio items
export const fetchPortfolio = async () => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching portfolio items:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchFeaturedPortfolio = async () => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching featured portfolio items:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchPortfolioById = async (id: string) => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching portfolio item with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const fetchPortfolioByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching portfolio items in category ${category}:`, error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// CREATE/UPDATE/DELETE Portfolio
export const createPortfolioItem = async (item: Omit<Portfolio, 'id'>) => {
  const { data, error } = await supabase
    .from('portfolio')
    .insert([item])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating portfolio item:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updatePortfolioItem = async (id: string, updates: Partial<Portfolio>) => {
  const { data, error } = await supabase
    .from('portfolio')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating portfolio item with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deletePortfolioItem = async (id: string) => {
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting portfolio item with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

// Testimonials
export const fetchTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Settings
export const fetchGeneralSettings = async () => {
  const { data, error } = await supabase
    .from('general_settings')
    .select('*')
    .eq('id', 'e43ea57d-5a15-4677-b9ed-385320a85540')
    .single();
  
  if (error) {
    console.error('Error fetching general settings:', error);
    return null;
  }
  
  return data;
};

export const updateGeneralSettings = async (id: string, updates: Partial<GeneralSettings>) => {
  const { data, error } = await supabase
    .from('general_settings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating general settings with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const fetchSocialLinks = async () => {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('id', '1')
    .single();
  
  if (error) {
    console.error('Error fetching social links:', error);
    return null;
  }
  
  return data;
};

export const updateSocialLinks = async (id: string, updates: Partial<SocialLinks>) => {
  const { data, error } = await supabase
    .from('social_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating social links with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

// Contact messages
export const submitContactForm = async (formData: { name: string; email: string; message: string }) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([
      { 
        name: formData.name,
        email: formData.email,
        message: formData.message,
        isRead: false,
        status: 'unread'
      }
    ]);
  
  if (error) {
    console.error('Error submitting contact form:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const fetchContactMessages = async () => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching contact messages:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const updateContactMessage = async (id: string, updates: Partial<ContactMessage>) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating contact message with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const markMessageAsRead = async (id: string) => {
  return updateContactMessage(id, { isRead: true, status: 'read' });
};

export const markMessageAsUnread = async (id: string) => {
  return updateContactMessage(id, { isRead: false, status: 'unread' });
};

// Newsletter subscriptions
export const subscribeToNewsletter = async (email: string, name?: string) => {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .insert([
      { 
        email,
        name,
        status: 'active'
      }
    ]);
  
  if (error) {
    console.error('Error subscribing to newsletter:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const fetchNewsletterSubscriptions = async () => {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .order('subscribed_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const createNewsletterSubscription = async (subscription: Omit<NewsletterSubscription, 'id'>) => {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .insert([subscription])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating newsletter subscription:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateNewsletterSubscription = async (id: string, updates: Partial<NewsletterSubscription>) => {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating newsletter subscription with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteNewsletterSubscription = async (id: string) => {
  const { error } = await supabase
    .from('newsletter_subscriptions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting newsletter subscription with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const exportNewsletterSubscriptions = async () => {
  const subscribers = await fetchNewsletterSubscriptions();
  
  // Create CSV header
  let csv = "Name,Email,Status,Subscribed Date\n";
  
  // Add rows
  subscribers.forEach(sub => {
    const name = sub.name ? `"${sub.name.replace(/"/g, '""')}"` : '';
    const email = `"${sub.email.replace(/"/g, '""')}"`;
    const status = sub.status || 'active';
    const date = sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : '';
    
    csv += `${name},${email},${status},${date}\n`;
  });
  
  return csv;
};

// User management
export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const createUser = async (userData: Omit<User, 'id'>) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

// Client management
export const fetchClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching clients:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const createClient = async (client: Omit<Client, 'id'>) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateClient = async (id: string, updates: Partial<Client>) => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating client with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteClient = async (id: string) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting client with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

// Project management
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const createProject = async (project: Omit<Project, 'id'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

// Proposal management
export const fetchProposals = async () => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching proposals:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const createProposal = async (proposal: Omit<Proposal, 'id'>) => {
  const { data, error } = await supabase
    .from('proposals')
    .insert([proposal])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating proposal:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateProposal = async (id: string, updates: Partial<Proposal>) => {
  const { data, error } = await supabase
    .from('proposals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating proposal with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteProposal = async (id: string) => {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting proposal with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const generateProposalWithAI = async (clientId: string, prompt: string) => {
  try {
    // Call our edge function instead of external API
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/generate-proposal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({ clientId, prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate proposal');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating proposal with AI:', error);
    throw error;
  }
};

// Invoice management
export const fetchInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('issued_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching invoices:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const createInvoice = async (invoice: Omit<Invoice, 'id'>) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating invoice:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating invoice with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteInvoice = async (id: string) => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting invoice with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const shareInvoice = async (id: string) => {
  const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const { data, error } = await supabase
    .from('invoices')
    .update({ share_token: shareToken })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error generating share token for invoice with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};
