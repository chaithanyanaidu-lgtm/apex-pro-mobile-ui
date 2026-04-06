-- FILE 1: supabase/migrations/001_initial_schema.sql

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  age INT CHECK (age > 0 AND age < 120),
  weight_kg NUMERIC CHECK (weight_kg > 0 AND weight_kg < 500),
  fitness_goal TEXT CHECK (fitness_goal IN ('fat_loss','muscle_gain','maintenance','endurance')),
  experience_level TEXT CHECK (experience_level IN ('beginner','intermediate','advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Workouts Table
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_text TEXT NOT NULL,
  fitness_goal TEXT,
  experience_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Diet Plans Table
CREATE TABLE public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_text TEXT NOT NULL,
  goal TEXT,
  weight_kg NUMERIC,
  is_indian_meal_plan BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI Logs Table
CREATE TABLE public.ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  agent_type TEXT CHECK (agent_type IN ('workout_coach','fitness_chat','progress_analyser','community_hype','smart_nutrition','re_engagement')),
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Progress Entries Table
CREATE TABLE public.progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  weight_kg NUMERIC CHECK (weight_kg > 0 AND weight_kg < 500),
  body_fat_pct NUMERIC CHECK (body_fat_pct >= 0 AND body_fat_pct <= 100),
  notes TEXT,
  photo_url TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can manage their own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- RLS Policies for workouts
CREATE POLICY "Users can manage their own workouts" ON public.workouts
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for diet_plans
CREATE POLICY "Users can manage their own diet plans" ON public.diet_plans
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for ai_logs
CREATE POLICY "Users can manage their own ai logs" ON public.ai_logs
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for progress_entries
CREATE POLICY "Users can manage their own progress entries" ON public.progress_entries
  FOR ALL USING (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_created_at ON public.workouts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_diet_plans_user_id ON public.diet_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_created_at ON public.diet_plans(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON public.ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_agent_type ON public.ai_logs(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON public.ai_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_progress_entries_user_id ON public.progress_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_entries_logged_at ON public.progress_entries(logged_at DESC);
