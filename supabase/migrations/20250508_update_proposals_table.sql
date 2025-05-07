
-- Add client_name column to proposals table
ALTER TABLE IF EXISTS "public"."proposals" 
ADD COLUMN IF NOT EXISTS "client_name" text;

-- Add share_token column to proposals table  
ALTER TABLE IF EXISTS "public"."proposals"
ADD COLUMN IF NOT EXISTS "share_token" text;

-- Add trigger function to generate share tokens 
CREATE OR REPLACE FUNCTION public.set_proposal_share_token()
RETURNS trigger AS $$
BEGIN
  IF NEW.share_token IS NULL THEN
    NEW.share_token := encode(gen_random_bytes(16), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS tr_set_proposal_share_token ON public.proposals;
CREATE TRIGGER tr_set_proposal_share_token
BEFORE INSERT OR UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.set_proposal_share_token();
