
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to get client details
async function getClientDetails(clientId: string, supabaseUrl: string, supabaseKey: string) {
  const response = await fetch(`${supabaseUrl}/rest/v1/clients?id=eq.${clientId}`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  const clients = await response.json();
  return clients.length > 0 ? clients[0] : null;
}

// Helper function to generate titles based on services and client needs
function generateTitle(clientName: string, prompt: string) {
  const services = [
    "Digital Marketing",
    "Web Development",
    "Social Media Management",
    "SEO Optimization", 
    "Content Creation",
    "Brand Strategy"
  ];
  
  // Extract potential service from prompt
  let serviceType = services[0];
  for (const service of services) {
    if (prompt.toLowerCase().includes(service.toLowerCase())) {
      serviceType = service;
      break;
    }
  }
  
  return `${serviceType} Proposal for ${clientName}`;
}

// Function to generate proposal content based on client and prompt
function generateProposalContent(client: any, prompt: string) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Extract key terms from prompt
  const keyTerms = prompt.split(' ')
    .filter(word => word.length > 4)
    .filter(word => !['please', 'would', 'could', 'provide', 'create', 'generate'].includes(word.toLowerCase()))
    .slice(0, 5);
  
  // Generate random project duration between 2-6 months
  const projectDuration = Math.floor(Math.random() * 4) + 2;
  
  // Generate random budget range
  const minBudget = Math.floor((Math.random() * 5) + 5) * 1000;
  const maxBudget = minBudget + Math.floor((Math.random() * 10) + 5) * 1000;
  
  return `# Professional Services Proposal

## Prepared for ${client.name}${client.company ? ` at ${client.company}` : ''}

**Date:** ${currentDate}
**Valid Until:** ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}

## Executive Summary

We are pleased to present this proposal to ${client.name} for services related to ${keyTerms.join(', ')}. Based on our understanding of your needs, we've developed a comprehensive approach to help you achieve your goals and exceed expectations.

## Project Goals

- Increase your brand visibility and market presence
- Develop effective strategies for ${keyTerms[0] || 'digital marketing'}
- Establish measurable outcomes for project success
- Create sustainable growth through ${keyTerms[1] || 'strategic planning'}
- Implement cutting-edge solutions for ${keyTerms[2] || 'business challenges'}

## Our Approach

### Discovery Phase (${Math.floor(projectDuration / 3)} weeks)
- Comprehensive analysis of current situation
- Stakeholder interviews and requirements gathering
- Market research and competitor analysis
- Definition of key performance indicators

### Implementation Phase (${Math.floor(projectDuration / 2)} months)
- Development of detailed strategic plan
- Regular progress meetings and adjustments
- Implementation of core deliverables
- Ongoing optimization based on performance data

### Evaluation Phase (${Math.floor(projectDuration / 4)} weeks)
- Comprehensive performance review
- Documentation of lessons learned
- Recommendations for future enhancements
- Knowledge transfer and training

## Investment

Based on the scope outlined above, we propose the following investment:

**Project Fee Range:** $${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()}

The exact fee will be determined once we finalize the detailed scope of work after our initial discovery session.

## Terms & Conditions

- 50% deposit required to commence work
- Remaining balance due upon project completion
- Project timeline: ${projectDuration} months
- Includes ${Math.floor(projectDuration * 2)} revision cycles

We look forward to the possibility of working with ${client.name} and helping you achieve exceptional results.`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientId, prompt } = await req.json();
    
    // Validate inputs
    if (!clientId || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: clientId and prompt are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the Supabase URL and key from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client details
    const client = await getClientDetails(clientId, supabaseUrl, supabaseKey);
    
    if (!client) {
      return new Response(
        JSON.stringify({ error: 'Client not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate proposal title and content
    const title = generateTitle(client.name, prompt);
    const content = generateProposalContent(client, prompt);

    // Return the generated proposal
    return new Response(
      JSON.stringify({
        title,
        content,
        client_id: clientId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating proposal:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate proposal' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
