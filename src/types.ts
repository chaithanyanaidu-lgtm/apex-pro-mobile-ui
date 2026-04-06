export type Screen = 
  | 'splash' 
  | 'onboarding-welcome' 
  | 'onboarding-goals' 
  | 'onboarding-profile' 
  | 'onboarding-schedule' 
  | 'onboarding-calibration'
  | 'login'
  | 'signup'
  | 'home' 
  | 'workout' 
  | 'nutrition' 
  | 'progress' 
  | 'community';

export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | null;
  age: number;
  height: number;
  weight: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'athlete' | null;
  goals: string[];
  trainingDays: string[];
  sessionDuration: number;
  equipment: 'full' | 'home' | 'minimal' | null;
}

export interface Workout {
  id: string;
  title: string;
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  category: string;
  image: string;
  description: string;
}

export interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  title: string;
  protein: number;
  carbs: number;
  fats: number;
  image: string;
}

export interface Milestone {
  id: string;
  title: string;
  icon: string;
  progress: number;
  color: string;
  achieved: boolean;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  role: string;
  image: string;
  content: string;
  likes: number;
  tags: string[];
}
