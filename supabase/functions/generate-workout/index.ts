// FILE 6: supabase/functions/generate-workout/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, supabaseAdmin } from '../_shared/supabase.ts';
import { callClaude, ClaudeMessage } from '../_shared/claude.ts';
import { WorkoutPlan } from '../_shared/types.ts';

const SYSTEM_PROMPT = `You are Apex Pro's elite Workout Coach AI. Generate a structured 6-day Push/Pull/Legs split where each muscle group is trained twice per week. Optimize for the user's goal and experience level. Beginner: reduce volume by 30% and use simpler exercises. Intermediate: standard volume with compound lifts. Advanced: high volume with advanced techniques. fat_loss: add cardio finisher notes. muscle_gain: prioritize progressive overload notes. Respond ONLY with valid JSON matching exactly: { "plan_name": string, "duration_weeks": number, "days": [ { "day": number, "focus": string, "exercises": [ { "name": string, "sets": number, "reps": string, "rest_seconds": number, "notes": string } ] } ], "general_tips": string[] }. No markdown. No explanation. JSON only.`;

serve(async (req) => {
  // 1. Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // 2. Auth Check
    const user = await getUserFromRequest(req);

    // 3. Parse Request Body
    const body = await req.json();
    const { fitness_goal, weight_kg, experience_level } = body;

    // 4. Validate Input
    if (!fitness_goal) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: fitness_goal' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!weight_kg) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: weight_kg' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!experience_level) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: experience_level' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Call AI
    const userMessage = `Generate a workout plan for: goal=${fitness_goal}, weight=${weight_kg}kg, experience=${experience_level}`;
    const messages: ClaudeMessage[] = [{ role: 'user', content: userMessage }];

    const claudeResponse = await callClaude(messages, SYSTEM_PROMPT);

    // 6. Parse AI Response
    let plan: WorkoutPlan;
    try {
      plan = JSON.parse(claudeResponse.text);
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

    // 7. Store in Database
    await supabaseAdmin
      .from('users')
      .upsert({ id: user.id, email: user.email }, { onConflict: 'id', ignoreDuplicates: true });

    const { data: workoutData, error: workoutError } = await supabaseAdmin
      .from('workouts')
      .insert({ user_id: user.id, plan_text: JSON.stringify(plan), fitness_goal, experience_level })
      .select()
      .single();

    if (workoutError) throw workoutError;
    // 8. Log AI Usage
    await supabaseAdmin
      .from('ai_logs')
      .insert({
        user_id: user.id,
        agent_type: 'workout_coach',
        prompt: userMessage,
        response: claudeResponse.text,
        tokens_used: claudeResponse.tokens_used
      });

    // 9. Success Response
    return new Response(
      JSON.stringify({ success: true, data: { workout_id: workoutData.id, plan } }),
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

/**
 * @example
 * curl -X POST https://cwsejaptpinqgqplfvno.supabase.co/functions/v1/generate-workout \
 *   -H "Authorization: Bearer YOUR_JWT" \
 *   -H "Content-Type: application/json" \
 *   -d '{"fitness_goal":"muscle_gain","weight_kg":75,"experience_level":"intermediate"}'
 *
 * Success 201: { "success": true, "data": { "workout_id": "uuid", "plan": { ...WorkoutPlan } } }
 * Error 400:   { "success": false, "error": "Missing required field: fitness_goal" }
 * Error 401:   { "success": false, "error": "Invalid or expired token" }
 * Error 500:   { "success": false, "error": "..." }
 */
