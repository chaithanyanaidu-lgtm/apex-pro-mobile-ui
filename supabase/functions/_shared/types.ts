// FILE 5: supabase/functions/_shared/types.ts

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  raw?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
}

export interface WorkoutPlanDay {
  day: number;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  plan_name: string;
  duration_weeks: number;
  days: WorkoutPlanDay[];
  general_tips: string[];
}

export interface DietMeal {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: string[];
  calories: number;
  protein_g: number;
}

export interface DietDay {
  day: number;
  meals: DietMeal[];
}

export interface DietPlan {
  plan_name: string;
  daily_calories: number;
  macros: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  days: DietDay[];
  hydration_tip: string;
  supplements: string[];
}

export interface ProgressInsight {
  summary: string;
  trend: 'improving' | 'maintaining' | 'declining';
  recommendation: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  weight_kg: number | null;
  fitness_goal: string | null;
  experience_level: string | null;
  created_at: string;
}
