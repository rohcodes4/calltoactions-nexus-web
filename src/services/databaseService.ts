
import { supabase, Service, Portfolio, Testimonial, ContactMessage } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Services CRUD
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
  // Modified: Now expecting service without an ID
  const { data, error } = await supabase
    .from('services')
    .insert([{ ...service }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service:', error);
    toast({
      title: 'Error',
      description: 'Failed to create service. Please try again.',
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
      description: 'Failed to update service. Please try again.',
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
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete service. Please try again.',
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

// Portfolio CRUD
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

export const createPortfolioItem = async (item: Omit<Portfolio, 'id'>): Promise<Portfolio | null> => {
  // Modified: Now expecting item without an ID
  const { data, error } = await supabase
    .from('portfolio')
    .insert([{ ...item }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating portfolio item:', error);
    toast({
      title: 'Error',
      description: 'Failed to create portfolio item. Please try again.',
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
      description: 'Failed to update portfolio item. Please try again.',
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
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting portfolio item:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete portfolio item. Please try again.',
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

// Testimonials CRUD
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

// Contact Messages
export const submitContactForm = async (formData: { name: string; email: string; message: string }): Promise<boolean> => {
  const { error } = await supabase
    .from('contact_messages')
    .insert([{ 
      ...formData, 
      isRead: false 
    }]);
  
  if (error) {
    console.error('Error submitting contact form:', error);
    toast({
      title: 'Error',
      description: 'Failed to submit your message. Please try again.',
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

export const markMessageAsRead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('contact_messages')
    .update({ isRead: true })
    .eq('id', id);
  
  if (error) {
    console.error('Error marking message as read:', error);
    toast({
      title: 'Error',
      description: 'Failed to update message status. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
  
  return true;
};
