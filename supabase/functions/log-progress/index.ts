// FILE 8: supabase/functions/log-progress/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, supabaseAdmin } from '../_shared/supabase.ts';
import { callClaude, ClaudeMessage } from '../_shared/claude.ts';
import { ProgressInsight } from '../_shared/types.ts';

const SYSTEM_PROMPT = `You are Apex Pro's Progress Analyser AI. You are given a user's recent weight and body composition entries. Analyse the trend objectively and provide motivation. Respond ONLY with valid JSON: { "summary": string, "trend": "improving"|"maintaining"|"declining", "recommendation": string }. No markdown. JSON only.`;

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getUserFromRequest(req);

    const body = await req.json();
    const { weight_kg, body_fat_pct, notes, photo_url } = body;

    if (!weight_kg) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: weight_kg' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert user first
    await supabaseAdmin
      .from('users')
      .upsert({ id: user.id, email: user.email }, { onConflict: 'id', ignoreDuplicates: true });

    // Store Entry
    const { data: entryData, error: entryError } = await supabaseAdmin
      .from('progress_entries')
      .insert({
        user_id: user.id,
        weight_kg,
        body_fat_pct: body_fat_pct ?? null,
        notes: notes ?? null,
        photo_url: photo_url ?? null
      })
      .select()
      .single();

    if (entryError) throw entryError;

    // Fetch Recent History
    const { data: entries, error: historyError } = await supabaseAdmin
      .from('progress_entries')
      .select('weight_kg, body_fat_pct, notes, logged_at')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(7);

    if (historyError) throw historyError;

    // Build AI Context
    const context = entries.map(e =>
      `Date: ${e.logged_at}, Weight: ${e.weight_kg}kg, Body Fat: ${e.body_fat_pct ?? 'N/A'}%, Notes: ${e.notes ?? 'none'}`
    ).join('\n');

    const userMessage = `Analyse my progress data:\n${context}`;
    const messages: ClaudeMessage[] = [{ role: 'user', content: userMessage }];

    const claudeResponse = await callClaude(messages, SYSTEM_PROMPT, 512);

    let insight: ProgressInsight;
    try {
      insight = JSON.parse(claudeResponse.text);
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to parse AI response',
          raw: claudeResponse.text
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabaseAdmin
      .from('ai_logs')
      .insert({
        user_id: user.id,
        agent_type: 'progress_analyser',
        prompt: userMessage,
        response: claudeResponse.text,
        tokens_used: claudeResponse.tokens_used
      });

    return new Response(
      JSON.stringify({ success: true, data: { entry_id: entryData.id, ai_insight: insight } }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    if (err instanceof Response) return err;
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});