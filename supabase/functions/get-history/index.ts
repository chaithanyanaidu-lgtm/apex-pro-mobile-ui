// FILE 12: supabase/functions/get-history/index.ts

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

    // 3. Parse URL and Query Params
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const limitParam = parseInt(url.searchParams.get('limit') ?? '10');
    const limit = Math.min(Math.max(limitParam, 1), 50);

    // 4. Validate Type
    const VALID_TYPES = ['workouts', 'diet_plans', 'ai_logs', 'progress'];
    if (!type || !VALID_TYPES.includes(type)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid type. Must be: workouts, diet_plans, ai_logs, progress' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Determine Table and Ordering
    let tableName: string;
    let orderColumn: string;

    switch (type) {
      case 'workouts':
        tableName = 'workouts';
        orderColumn = 'created_at';
        break;
      case 'diet_plans':
        tableName = 'diet_plans';
        orderColumn = 'created_at';
        break;
      case 'ai_logs':
        tableName = 'ai_logs';
        orderColumn = 'created_at';
        break;
      case 'progress':
        tableName = 'progress_entries';
        orderColumn = 'logged_at';
        break;
      default:
        throw new Error('Unreachable code path');
    }

    // 6. Execute Query
    const { data: rows, error: queryError } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .order(orderColumn, { ascending: false })
      .limit(limit);

    if (queryError) throw queryError;

    // 7. Success Response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { 
          items: rows, 
          count: rows.length, 
          type, 
          limit 
        } 
      }),
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
