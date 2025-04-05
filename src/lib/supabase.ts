
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string;
  benefits: string[];
  created_at?: string;
};

export type Portfolio = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  link: string;
  created_at?: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  position: string;
  company: string;
  imageUrl: string;
  created_at?: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  isRead: boolean;
};
