// FILE 11: supabase/functions/update-user-profile/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, supabaseAdmin } from '../_shared/supabase.ts';

serve(async (req) => {
  // 1. Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // 2. Auth Check
    const user = await getUserFromRequest(req);

    // 3. Parse and Filter Request Body
    const body = await req.json();
    const ALLOWED_FIELDS = ['name', 'age', 'weight_kg', 'fitness_goal', 'experience_level'];
    
    // Explicitly type payload as a Record to avoid issues with dynamic keys
    const updatePayload: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) {
        updatePayload[key] = body[key];
      }
    }

    // 4. Construct Payload including required unique fields for upsert
    const upsertPayload = {
      id: user.id,
      email: user.email,
      ...updatePayload
    };

    // 5. Upsert into Database
    const { data: upsertedData, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert(upsertPayload)
      .select()
      .single();

    if (upsertError) throw upsertError;

    // 6. Success Response
    return new Response(
      JSON.stringify({ success: true, data: { profile: upsertedData } }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    if (err instanceof Response) return err;
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
