
import { supabase, Service, Portfolio, Testimonial, Client, Project, GeneralSettings, SocialLinks } from '@/lib/supabase';

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
    .from('settings')
    .select('*')
    .eq('id', '1')
    .single();
  
  if (error) {
    console.error('Error fetching general settings:', error);
    return null;
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
        status: 'new'
      }
    ]);
  
  if (error) {
    console.error('Error submitting contact form:', error);
    throw new Error(error.message);
  }
  
  return data;
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
