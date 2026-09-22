// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OWNER_EMAIL = 'sreesaie33@gmail.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req:any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let record;
  try {
    const body = await req.json();
    record = body.record;
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // @ts-ignore
      Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: OWNER_EMAIL,
      subject: `New Enquiry from ${record.name}`,
      text: `Name: ${record.name}\nPhone: ${record.phone}\nEmail: ${record.email || 'Not provided'}\nService: ${record.service_type}\nMessage: ${record.message || 'Not provided'}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(`Email failed: ${err}`, { status: 500, headers: corsHeaders });
  }

  return new Response('Email sent', { status: 200, headers: corsHeaders });
});
