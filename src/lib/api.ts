const BASE_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';

async function getAuthHeaders(): Promise<HeadersInit> {
  const { supabase } = await import('./supabase');
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error('Not authenticated');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function apiFetch<T>(endpoint: string, options: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || 'API request failed');
  return data.data as T;
}

export const api = {
  generateWorkout: (payload: { fitness_goal: string; weight_kg: number; experience_level: string }) =>
    apiFetch('/generate-workout', { method: 'POST', body: JSON.stringify(payload) }),

  generateDiet: (payload: { goal: string; weight_kg: number; is_indian_meal_plan?: boolean }) =>
    apiFetch('/generate-diet', { method: 'POST', body: JSON.stringify(payload) }),

  fitnessChat: (payload: { message: string; conversation_history?: Array<{ role: 'user' | 'assistant'; content: string }> }) =>
    apiFetch('/fitness-chat', { method: 'POST', body: JSON.stringify(payload) }),

  logProgress: (payload: { weight_kg: number; body_fat_pct?: number; notes?: string; photo_url?: string }) =>
    apiFetch('/log-progress', { method: 'POST', body: JSON.stringify(payload) }),

  getUserProfile: () =>
    apiFetch('/get-user-profile', { method: 'GET' }),

  updateUserProfile: (payload: { name?: string; age?: number; weight_kg?: number; fitness_goal?: string; experience_level?: string }) =>
    apiFetch('/update-user-profile', { method: 'PUT', body: JSON.stringify(payload) }),

  getHistory: (type: 'workouts' | 'diet_plans' | 'ai_logs' | 'progress', limit = 10) =>
    apiFetch(`/get-history?type=${type}&limit=${limit}`, { method: 'GET' }),
};
