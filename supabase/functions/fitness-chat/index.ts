// FILE 9: supabase/functions/fitness-chat/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, supabaseAdmin } from '../_shared/supabase.ts';
import { callClaude, ClaudeMessage } from '../_shared/claude.ts';

const SYSTEM_PROMPT = `You are Apex Pro's Fitness Chat AI — an expert personal trainer and nutritionist. You are motivating, concise, and science-backed. You help with fitness, nutrition, recovery, supplements, and training techniques. If asked anything completely unrelated to health or fitness, politely redirect to fitness topics. Keep responses under 200 words unless the user asks for a detailed plan.`;

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getUserFromRequest(req);

    const body = await req.json();
    const { message, conversation_history } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'Message is required and must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const history = Array.isArray(conversation_history) ? conversation_history : [];
    const validHistory: ClaudeMessage[] = history
      .filter((msg: any) =>
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string' &&
        msg.content.trim() !== ''
      )
      .map((msg: any) => ({ role: msg.role, content: msg.content }));

    const messages: ClaudeMessage[] = [...validHistory, { role: 'user', content: message }];

    const claudeResponse = await callClaude(messages, SYSTEM_PROMPT, 1024);

    // Upsert user then log
    await supabaseAdmin
      .from('users')
      .upsert({ id: user.id, email: user.email }, { onConflict: 'id', ignoreDuplicates: true });

    await supabaseAdmin
      .from('ai_logs')
      .insert({
        user_id: user.id,
        agent_type: 'fitness_chat',
        prompt: message,
        response: claudeResponse.text,
        tokens_used: claudeResponse.tokens_used
      });

    return new Response(
      JSON.stringify({ success: true, data: { reply: claudeResponse.text } }),
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