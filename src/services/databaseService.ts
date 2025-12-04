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

// Helper to fetch existing testimonials
const fetchAllTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id');

  if (error) {
    console.error('Error fetching testimonials:', error);
    throw new Error(error.message);
  }

  return data ?? [];
};

// CREATE Portfolio + Testimonial if present
export const createPortfolioItem = async (item: Omit<Portfolio, 'id'>) => {
  const { data: portfolioData, error } = await supabase
    .from('portfolio')
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error('Error creating portfolio item:', error);
    throw new Error(error.message);
  }

  // Create testimonial if present
  if (item.testimonial && item.testimonial_author && item.client_name) {
    const existingTestimonials = await fetchAllTestimonials();
    const order = existingTestimonials.length;

    const testimonial = {
      quote: item.testimonial,
      author: item.testimonial_author,
      company: item.client_name,
      // imageurl: item.imageurl ?? null,
      // position: item.testimonial_position ?? null,
      order
    };

    const { error: testimonialError } = await supabase
      .from('testimonials')
      .insert([testimonial]);

    if (testimonialError) {
      console.error('Error creating testimonial from portfolio:', testimonialError);
    }
  }

  return portfolioData;
};

// UPDATE Portfolio + create Testimonial if newly added
export const updatePortfolioItem = async (id: string, updates: Partial<Portfolio>) => {
  const { data: updatedPortfolio, error } = await supabase
    .from('portfolio')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating portfolio item with ID ${id}:`, error);
    throw new Error(error.message);
  }

  // Only add testimonial if testimonial info newly added
  if (updates.testimonial && updates.testimonial_author && updates.client_name) {
    const existingTestimonials = await fetchAllTestimonials();
    const order = existingTestimonials.length;

    const testimonial = {
      quote: updates.testimonial,
      author: updates.testimonial_author,
      company: updates.client_name,
      // imageurl: updates.imageurl ?? null,
      // position: updates.testimonial_position ?? null,
      order
    };

    const { error: testimonialError } = await supabase
      .from('testimonials')
      .insert([testimonial]);

    if (testimonialError) {
      console.error('Error creating testimonial during portfolio update:', testimonialError);
    }
  }

  return updatedPortfolio;
};


// // CREATE/UPDATE/DELETE Portfolio
// export const createPortfolioItem = async (item: Omit<Portfolio, 'id'>) => {
//   const { data, error } = await supabase
//     .from('portfolio')
//     .insert([item])
//     .select()
//     .single();
  
//   if (error) {
//     console.error('Error creating portfolio item:', error);
//     throw new Error(error.message);
//   }
  
//   return data;
// };

// export const updatePortfolioItem = async (id: string, updates: Partial<Portfolio>) => {
//   const { data, error } = await supabase
//     .from('portfolio')
//     .update(updates)
//     .eq('id', id)
//     .select()
//     .single();
  
//   if (error) {
//     console.error(`Error updating portfolio item with ID ${id}:`, error);
//     throw new Error(error.message);
//   }
  
//   return data;
// };

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
    .eq('id', '0be51db6-e0fb-4ba0-99f1-8c65d0a012ab')
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
  // Create a clean copy of the proposal to avoid circular references
  const cleanProposal = {
    title: proposal.title,
    content: proposal.content,
    client_id: proposal.client_id || null, // Handle null client_id
    status: proposal.status,
    ai_generated: proposal.ai_generated
  };

  const { data, error } = await supabase
    .from('proposals')
    .insert([cleanProposal])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating proposal:', error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateProposal = async (id: string, updates: Partial<Proposal>) => {
  // Create a clean copy of the updates to avoid circular references
  const cleanUpdates = {
    title: updates.title,
    content: updates.content,
    client_id: updates.client_id || null, // Handle null client_id
    status: updates.status,
    ai_generated: updates.ai_generated
  };

  const { data, error } = await supabase
    .from('proposals')
    .update(cleanUpdates)
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
    // Use the correct method to access Supabase URL and key
    const response = await fetch(`${process.env.SUPABASE_URL || 'https://elzggwzlabarqkmjywaf.supabase.co'}/functions/v1/generate-proposal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsemdnd3psYWJhcnFrbWp5d2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MzM2MzEsImV4cCI6MjA3NTIwOTYzMX0.KO-ERCy49q7283AR8OZryAZAqoOqk4uwcLcTKCAGBds'}`
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

// Share proposal
export const shareProposal = async (id: string): Promise<{ share_token: string }> => {
  try {
    // First check if proposal exists
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('id, share_token')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;

    // If proposal already has a share token, return it
    if (proposal.share_token) {
      return { share_token: proposal.share_token };
    }
    
    // Generate a share token
    const shareToken = generateUUID();
    
    // Update the proposal with the share token
    const { error } = await supabase
      .from('proposals')
      .update({ share_token: shareToken })
      .eq('id', id);
      
    if (error) throw error;
    
    return { share_token: shareToken };
  } catch (error) {
    console.error("Error sharing proposal:", error);
    throw new Error(`Failed to share proposal: ${error}`);
  }
};

// Generate UUID function for share tokens
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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

// Add new function to reorder portfolio items
export const reorderPortfolioItems = async (items: Portfolio[]): Promise<void> => {
  try {
    // Create updates that only include id and order fields to avoid null values
    const updates = items.map((item, index) => ({
      id: item.id,
      order: index,
      // We need to maintain these required fields that cannot be null
      title: item.title,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      link: item.link
    }));
    
    // Update each item with its new order
    const { error } = await supabase
      .from('portfolio')
      .upsert(updates, { onConflict: 'id' });
      
    if (error) throw error;
    
    return;
  } catch (error) {
    console.error('Error reordering portfolio items:', error);
    throw error;
  }
};
