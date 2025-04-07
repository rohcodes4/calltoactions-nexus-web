
import { supabase, Service, Portfolio, Testimonial, ContactMessage, GeneralSettings, SocialLinks, User, Client, Project, Invoice, Proposal, NewsletterSubscription } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// ------------------- SERVICES CRUD -------------------
export const fetchServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching services:', error);
    toast({
      title: 'Error',
      description: 'Failed to load services. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const createService = async (service: Omit<Service, 'id'>): Promise<Service | null> => {
  console.log('Creating service:', service);
  
  const { data, error } = await supabase
    .from('services')
    .insert([{ ...service }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service:', error);
    toast({
      title: 'Error',
      description: `Failed to create service: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Service created successfully',
  });
  
  return data;
};

export const updateService = async (id: string, updates: Partial<Service>): Promise<Service | null> => {
  console.log('Updating service:', id, updates);
  
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating service:', error);
    toast({
      title: 'Error',
      description: `Failed to update service: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Service updated successfully',
  });
  
  return data;
};

export const deleteService = async (id: string): Promise<boolean> => {
  console.log('Deleting service:', id);
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service:', error);
    toast({
      title: 'Error',
      description: `Failed to delete service: ${error.message}`,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Service deleted successfully',
  });
  
  return true;
};

// ------------------- PORTFOLIO CRUD -------------------
export const fetchPortfolio = async (): Promise<Portfolio[]> => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching portfolio:', error);
    toast({
      title: 'Error',
      description: 'Failed to load portfolio. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const fetchPortfolioItem = async (id: string): Promise<Portfolio | null> => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching portfolio item:', error);
    return null;
  }
  
  return data;
};

export const createPortfolioItem = async (item: Omit<Portfolio, 'id'>): Promise<Portfolio | null> => {
  console.log('Creating portfolio item:', item);
  
  const { data, error } = await supabase
    .from('portfolio')
    .insert([{ ...item }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating portfolio item:', error);
    toast({
      title: 'Error',
      description: `Failed to create portfolio item: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Portfolio item created successfully',
  });
  
  return data;
};

export const updatePortfolioItem = async (id: string, updates: Partial<Portfolio>): Promise<Portfolio | null> => {
  console.log('Updating portfolio item:', id, updates);
  
  const { data, error } = await supabase
    .from('portfolio')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating portfolio item:', error);
    toast({
      title: 'Error',
      description: `Failed to update portfolio item: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Portfolio item updated successfully',
  });
  
  return data;
};

export const deletePortfolioItem = async (id: string): Promise<boolean> => {
  console.log('Deleting portfolio item:', id);
  
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting portfolio item:', error);
    toast({
      title: 'Error',
      description: `Failed to delete portfolio item: ${error.message}`,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Portfolio item deleted successfully',
  });
  
  return true;
};

// ------------------- TESTIMONIALS CRUD -------------------
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    toast({
      title: 'Error',
      description: 'Failed to load testimonials. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

// ------------------- CONTACT MESSAGES -------------------
export const submitContactForm = async (formData: { name: string; email: string; message: string }): Promise<boolean> => {
  console.log('Submitting contact form:', formData);
  
  const { error } = await supabase
    .from('contact_messages')
    .insert([{ 
      ...formData, 
      isRead: false,
      status: 'unread'
    }]);
  
  if (error) {
    console.error('Error submitting contact form:', error);
    toast({
      title: 'Error',
      description: `Failed to submit your message: ${error.message}`,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Your message has been sent successfully',
  });
  
  return true;
};

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching contact messages:', error);
    toast({
      title: 'Error',
      description: 'Failed to load messages. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const updateContactMessage = async (id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | null> => {
  console.log('Updating contact message:', id, updates);
  
  const { data, error } = await supabase
    .from('contact_messages')
    .update({
      ...updates,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating contact message:', error);
    toast({
      title: 'Error',
      description: `Failed to update message: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Message updated successfully',
  });
  
  return data;
};

export const markMessageAsRead = async (id: string): Promise<boolean> => {
  return updateContactMessage(id, { isRead: true, status: 'read' })
    .then(result => !!result)
    .catch(() => false);
};

export const markMessageAsUnread = async (id: string): Promise<boolean> => {
  return updateContactMessage(id, { isRead: false, status: 'unread' })
    .then(result => !!result)
    .catch(() => false);
};

// ------------------- SETTINGS -------------------
export const fetchGeneralSettings = async (): Promise<GeneralSettings> => {
  const { data, error } = await supabase
    .from('general_settings')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching general settings:', error);
    throw error;
  }
  
  return data;
};

export const updateGeneralSettings = async (id: string, updates: Partial<GeneralSettings>): Promise<GeneralSettings> => {
  const { data, error } = await supabase
    .from('general_settings')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating general settings:', error);
    throw error;
  }
  
  return data;
};

export const fetchSocialLinks = async (): Promise<SocialLinks> => {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching social links:', error);
    throw error;
  }
  
  return data;
};

export const updateSocialLinks = async (id: string, updates: Partial<SocialLinks>): Promise<SocialLinks> => {
  const { data, error } = await supabase
    .from('social_links')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating social links:', error);
    throw error;
  }
  
  return data;
};

// ------------------- NEWSLETTER SUBSCRIPTIONS -------------------
export const fetchNewsletterSubscriptions = async (): Promise<NewsletterSubscription[]> => {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .order('subscribed_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    toast({
      title: 'Error',
      description: 'Failed to load subscriptions. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const createNewsletterSubscription = async (subscription: Omit<NewsletterSubscription, 'id'>): Promise<NewsletterSubscription | null> => {
  console.log('Creating newsletter subscription:', subscription);
  
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .insert([{ ...subscription }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating newsletter subscription:', error);
    toast({
      title: 'Error',
      description: `Failed to create subscription: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Subscription created successfully',
  });
  
  return data;
};

export const updateNewsletterSubscription = async (id: string, updates: Partial<NewsletterSubscription>): Promise<NewsletterSubscription | null> => {
  console.log('Updating newsletter subscription:', id, updates);
  
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .update({
      ...updates,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating newsletter subscription:', error);
    toast({
      title: 'Error',
      description: `Failed to update subscription: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Subscription updated successfully',
  });
  
  return data;
};

export const deleteNewsletterSubscription = async (id: string): Promise<boolean> => {
  console.log('Deleting newsletter subscription:', id);
  
  const { error } = await supabase
    .from('newsletter_subscriptions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting newsletter subscription:', error);
    toast({
      title: 'Error',
      description: `Failed to delete subscription: ${error.message}`,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Subscription deleted successfully',
  });
  
  return true;
};

// ------------------- USERS -------------------
export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching users:', error);
    toast({
      title: 'Error',
      description: 'Failed to load users. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  console.log('Creating user:', user);
  
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: user.email,
    password: 'temporaryPassword123', // This would be changed by the user later
    email_confirm: true
  });
  
  if (authError) {
    console.error('Error creating auth user:', authError);
    toast({
      title: 'Error',
      description: `Failed to create user: ${authError.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  // Then create the profile record
  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      id: authData.user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user profile:', error);
    toast({
      title: 'Error',
      description: `Failed to create user profile: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'User created successfully',
  });
  
  return data;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  console.log('Updating user:', id, updates);
  
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    toast({
      title: 'Error',
      description: `Failed to update user: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'User updated successfully',
  });
  
  return data;
};

// ------------------- CRM: Clients -------------------
export const fetchClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching clients:', error);
    toast({
      title: 'Error',
      description: 'Failed to load clients. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client | null> => {
  console.log('Creating client:', client);
  
  const { data, error } = await supabase
    .from('clients')
    .insert([{ ...client }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client:', error);
    toast({
      title: 'Error',
      description: `Failed to create client: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Client created successfully',
  });
  
  return data;
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client | null> => {
  console.log('Updating client:', id, updates);
  
  const { data, error } = await supabase
    .from('clients')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating client:', error);
    toast({
      title: 'Error',
      description: `Failed to update client: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Client updated successfully',
  });
  
  return data;
};

export const deleteClient = async (id: string): Promise<boolean> => {
  console.log('Deleting client:', id);
  
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting client:', error);
    toast({
      title: 'Error',
      description: `Failed to delete client: ${error.message}`,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Client deleted successfully',
  });
  
  return true;
};

// ------------------- CRM: Projects -------------------
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    toast({
      title: 'Error',
      description: 'Failed to load projects. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project | null> => {
  console.log('Creating project:', project);
  
  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...project }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    toast({
      title: 'Error',
      description: `Failed to create project: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Project created successfully',
  });
  
  return data;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  console.log('Updating project:', id, updates);
  
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    toast({
      title: 'Error',
      description: `Failed to update project: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Project updated successfully',
  });
  
  return data;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  console.log('Deleting project:', id);
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    toast({
      title: 'Error',
      description: `Failed to delete project: ${error.message}`,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Project deleted successfully',
  });
  
  return true;
};

// ------------------- CRM: Invoices -------------------
export const fetchInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, clients(name), projects(title)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching invoices:', error);
    toast({
      title: 'Error',
      description: 'Failed to load invoices. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const createInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<Invoice | null> => {
  console.log('Creating invoice:', invoice);
  
  const { data, error } = await supabase
    .from('invoices')
    .insert([{ ...invoice }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating invoice:', error);
    toast({
      title: 'Error',
      description: `Failed to create invoice: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Invoice created successfully',
  });
  
  return data;
};

export const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<Invoice | null> => {
  console.log('Updating invoice:', id, updates);
  
  const { data, error } = await supabase
    .from('invoices')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating invoice:', error);
    toast({
      title: 'Error',
      description: `Failed to update invoice: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Invoice updated successfully',
  });
  
  return data;
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  console.log('Deleting invoice:', id);
  
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting invoice:', error);
    toast({
      title: 'Error',
      description: `Failed to delete invoice: ${error.message}`,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Invoice deleted successfully',
  });
  
  return true;
};

// ------------------- CRM: Proposals -------------------
export const fetchProposals = async (): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, clients(name)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching proposals:', error);
    toast({
      title: 'Error',
      description: 'Failed to load proposals. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
  
  return data || [];
};

export const createProposal = async (proposal: Omit<Proposal, 'id'>): Promise<Proposal | null> => {
  console.log('Creating proposal:', proposal);
  
  const { data, error } = await supabase
    .from('proposals')
    .insert([{ ...proposal }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating proposal:', error);
    toast({
      title: 'Error',
      description: `Failed to create proposal: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Proposal created successfully',
  });
  
  return data;
};

export const updateProposal = async (id: string, updates: Partial<Proposal>): Promise<Proposal | null> => {
  console.log('Updating proposal:', id, updates);
  
  const { data, error } = await supabase
    .from('proposals')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating proposal:', error);
    toast({
      title: 'Error',
      description: `Failed to update proposal: ${error.message}`,
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Success',
    description: 'Proposal updated successfully',
  });
  
  return data;
};

export const deleteProposal = async (id: string): Promise<boolean> => {
  console.log('Deleting proposal:', id);
  
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting proposal:', error);
    toast({
      title: 'Error',
      description: `Failed to delete proposal: ${error.message}`,
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Success',
    description: 'Proposal deleted successfully',
  });
  
  return true;
};

// Generate proposal with AI
export const generateProposalWithAI = async (
  clientId: string, 
  title: string, 
  details: { 
    clientInfo: Client, 
    projectScope: string, 
    budget: string, 
    timeline: string, 
    requirements: string[] 
  }
): Promise<Proposal | null> => {
  // Here you'd normally call an AI service through an edge function
  // For now, we'll generate a simple template
  
  const content = `
# ${title}

## Client: ${details.clientInfo.name}

### Project Scope
${details.projectScope}

### Timeline
${details.timeline}

### Budget
${details.budget}

### Requirements
${details.requirements.map(req => `- ${req}`).join('\n')}

## What We Offer

We provide comprehensive solutions that will meet all your requirements while staying within your budget. Our team of experts will work closely with you to ensure the project is completed on time and to your satisfaction.

### Our Process
1. **Discovery Phase**: Understanding your needs and requirements
2. **Planning Phase**: Creating a detailed project plan
3. **Execution Phase**: Implementing the project according to the plan
4. **Delivery Phase**: Final delivery and review
5. **Support Phase**: Ongoing support and maintenance

### Why Choose Us
- Experienced team with a proven track record
- Transparent communication throughout the project
- Attention to detail and quality assurance
- Competitive pricing and flexible payment options
- Dedicated support even after project completion

We look forward to working with you on this exciting project!
`;

  const proposal = {
    client_id: clientId,
    title,
    content,
    ai_generated: true,
    status: 'draft' as const
  };
  
  return createProposal(proposal);
};
