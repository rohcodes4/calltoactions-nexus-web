
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://sqjzydohspotalhvpjpf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxanp5ZG9oc3BvdGFsaHZwanBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzQxMzUsImV4cCI6MjA1OTQ1MDEzNX0.hNP1YHb1dbJCGZO36t7IybBspgd9O3YAOKBtwbpOheY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enable debug logging in development
if (import.meta.env.DEV) {
  console.log('Supabase client initialized in development mode');
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
  slug?: string;
  gallery?: string;
};

// Enhanced Portfolio type with new fields
export type Portfolio = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  link: string;
  client_name?: string;
  completion_date?: string;
  technologies?: string[];
  challenges?: string;
  solutions?: string;
  testimonial_id?: string;
  featured?: boolean;
  gallery?: string[];
  project_duration?: string;
  created_at?: string;
  testimonial?: string;
  testimonial_author?: string;
  results?: string[];
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

// Updated ContactMessage type with improved status management
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  isRead: boolean;
  status: string;
  assigned_to?: string;
  last_updated?: string;
};

// Settings types
export type GeneralSettings = {
  id: string;
  siteTitle: string;
  siteTagline: string;
  adminEmail: string;
  phoneNumber: string;
  address: string;
  updated_at?: string;
};

export type SocialLinks = {
  id: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  updated_at?: string;
};

// Newsletter subscription type
export type NewsletterSubscription = {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
  last_updated?: string;
};

// CRM Types
export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
};

export type Client = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'lead';
  created_at?: string;
  updated_at?: string;
};

export type Project = {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at?: string;
  updated_at?: string;
};

export type Invoice = {
  id: string;
  project_id?: string | null;
  client_id: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string | null;
  issued_date: string;
  paid_date?: string | null;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // New fields
  advance_payment?: number;
  tax_percentage?: number;
  custom_tax_name?: string;
  share_token?: string;
};

export type Proposal = {
  id: string;
  client_id?: string;
  title: string;
  content?: string;
  ai_generated: boolean;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
  share_token?: string;
  client_name?: string; // Added client_name field
};
