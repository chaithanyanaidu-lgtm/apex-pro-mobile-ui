/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Screen, UserProfile } from './types';

// Screens
import SplashScreen from './components/screens/SplashScreen';
import OnboardingWelcome from './components/screens/OnboardingWelcome';
import OnboardingGoals from './components/screens/OnboardingGoals';
import OnboardingProfile from './components/screens/OnboardingProfile';
import OnboardingSchedule from './components/screens/OnboardingSchedule';
import OnboardingCalibration from './components/screens/OnboardingCalibration';
import HomeScreen from './components/screens/HomeScreen';
import WorkoutScreen from './components/screens/WorkoutScreen';
import NutritionScreen from './components/screens/NutritionScreen';
import ProgressScreen from './components/screens/ProgressScreen';
import CommunityScreen from './components/screens/CommunityScreen';
import LoginScreen from './components/screens/LoginScreen';
import SignUpScreen from './components/screens/SignUpScreen';

// Supabase
import { supabase } from './lib/supabase';

// Components
import BottomNav from './components/BottomNav';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex',
    gender: null,
    age: 26,
    height: 185,
    weight: 82,
    fitnessLevel: 'intermediate',
    goals: [],
    trainingDays: ['Tue', 'Wed', 'Fri'],
    sessionDuration: 45,
    equipment: 'home'
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('login');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setCurrentScreen('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoalToggle = (id: string) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(id) 
        ? prev.goals.filter(g => g !== id) 
        : [...prev.goals, id]
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const showNav = ['home', 'workout', 'nutrition', 'progress', 'community'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface selection:bg-primary-container/30">
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <SplashScreen 
            key="splash" 
            onComplete={() => {
              supabase.auth.getSession().then(({ data }) => {
                setCurrentScreen(data.session ? 'home' : 'login');
              });
            }} 
          />
        )}
        
        {currentScreen === 'login' && (
          <LoginScreen 
            key="login" 
            onLogin={() => setCurrentScreen('home')} 
            onSignUp={() => setCurrentScreen('signup')} 
          />
        )}

        {currentScreen === 'signup' && (
          <SignUpScreen 
            key="signup" 
            onComplete={() => setCurrentScreen('onboarding-welcome')} 
            onSignIn={() => setCurrentScreen('login')} 
          />
        )}
        
        {currentScreen === 'onboarding-welcome' && (
          <OnboardingWelcome key="welcome" onNext={() => setCurrentScreen('onboarding-goals')} />
        )}

        {currentScreen === 'onboarding-goals' && (
          <OnboardingGoals 
            key="goals"
            selectedGoals={userProfile.goals}
            onToggle={handleGoalToggle}
            onNext={() => setCurrentScreen('onboarding-profile')}
          />
        )}

        {currentScreen === 'onboarding-profile' && (
          <OnboardingProfile 
            key="profile"
            profile={userProfile}
            onUpdate={updateProfile}
            onNext={() => setCurrentScreen('onboarding-schedule')}
          />
        )}

        {currentScreen === 'onboarding-schedule' && (
          <OnboardingSchedule 
            key="schedule"
            profile={userProfile}
            onUpdate={updateProfile}
            onNext={() => setCurrentScreen('onboarding-calibration')}
          />
        )}

        {currentScreen === 'onboarding-calibration' && (
          <OnboardingCalibration 
            key="calibration"
            onComplete={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'home' && <HomeScreen key="home" />}
        {currentScreen === 'workout' && <WorkoutScreen key="workout" />}
        {currentScreen === 'nutrition' && <NutritionScreen key="nutrition" />}
        {currentScreen === 'progress' && <ProgressScreen key="progress" />}
        {currentScreen === 'community' && <CommunityScreen key="community" />}
      </AnimatePresence>

      {showNav && (
        <BottomNav 
          activeScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
        />
      )}
    </div>
  );
}
