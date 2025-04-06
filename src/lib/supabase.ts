
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://sqjzydohspotalhvpjpf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxanp5ZG9oc3BvdGFsaHZwanBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzQxMzUsImV4cCI6MjA1OTQ1MDEzNX0.hNP1YHb1dbJCGZO36t7IybBspgd9O3YAOKBtwbpOheY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enable debug logging in development
if (import.meta.env.DEV) {
  supabase.handleErrorsWithFallback = (error, fallback) => {
    console.error('Supabase error:', error);
    return fallback;
  };
}

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
  imageUrl: string; // This must match the column name in Supabase
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
  isRead: boolean; // This must match the column name in Supabase
};
