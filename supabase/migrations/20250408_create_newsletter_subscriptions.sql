
-- Create newsletter_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  last_updated TIMESTAMP WITH TIME ZONE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions(email);

-- Add comment to the table
COMMENT ON TABLE public.newsletter_subscriptions IS 'Stores newsletter subscribers information';
