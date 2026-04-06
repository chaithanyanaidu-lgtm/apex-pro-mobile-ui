// FILE 7: supabase/functions/generate-diet/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, supabaseAdmin } from '../_shared/supabase.ts';
import { callClaude, ClaudeMessage } from '../_shared/claude.ts';
import { DietPlan } from '../_shared/types.ts';

const SYSTEM_PROMPT = `You are Apex Pro's Smart Nutrition AI. Generate a structured 7-day meal plan. When is_indian_meal_plan is true, use Indian foods: dal, roti, rice, paneer, rajma, chana, sabzi, curd, dahi, eggs, chicken, fish, sprouts, oats, banana, apple, nuts. Calorie targets: fat_loss = weight_kg * 22 kcal, muscle_gain = weight_kg * 33 kcal, maintenance = weight_kg * 27 kcal. Protein targets: muscle_gain = weight_kg * 1.8g, fat_loss = weight_kg * 1.4g, maintenance = weight_kg * 1.2g. Respond ONLY with valid JSON: { "plan_name": string, "daily_calories": number, "macros": { "protein_g": number, "carbs_g": number, "fat_g": number }, "days": [ { "day": number, "meals": [ { "meal_type": "breakfast"|"lunch"|"dinner"|"snack", "items": string[], "calories": number, "protein_g": number } ] } ], "hydration_tip": string, "supplements": string[] }. No markdown. JSON only.`;

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getUserFromRequest(req);

    const body = await req.json();
    const { goal, weight_kg, is_indian_meal_plan = true } = body;

    if (!goal) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: goal' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!weight_kg) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: weight_kg' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userMessage = `Generate a ${goal} meal plan for weight=${weight_kg}kg, indian_meals=${is_indian_meal_plan}`;
    const messages: ClaudeMessage[] = [{ role: 'user', content: userMessage }];

    const claudeResponse = await callClaude(messages, SYSTEM_PROMPT);

    let plan: DietPlan;
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

    // 7. Upsert user then store diet plan
    await supabaseAdmin
      .from('users')
      .upsert({ id: user.id, email: user.email }, { onConflict: 'id', ignoreDuplicates: true });

    const { data: dietData, error: dietError } = await supabaseAdmin
      .from('diet_plans')
      .insert({
        user_id: user.id,
        plan_text: JSON.stringify(plan),
        goal,
        weight_kg,
        is_indian_meal_plan
      })
      .select()
      .single();

    if (dietError) throw dietError;

    await supabaseAdmin
      .from('ai_logs')
      .insert({
        user_id: user.id,
        agent_type: 'smart_nutrition',
        prompt: userMessage,
        response: claudeResponse.text,
        tokens_used: claudeResponse.tokens_used
      });

    return new Response(
      JSON.stringify({ success: true, data: { diet_plan_id: dietData.id, plan } }),
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