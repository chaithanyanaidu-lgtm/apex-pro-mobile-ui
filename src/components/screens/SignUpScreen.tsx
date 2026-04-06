import { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';

interface Props {
  onComplete: () => void;
  onSignIn: () => void;
}

export default function SignUpScreen({ onComplete, onSignIn }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({ 
      email, 
      password 
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      try {
        // Save the user's name in their profile
        await api.updateUserProfile({ name });
        onComplete();
      } catch (profileError: any) {
        // Even if profiling fails, they signed up. 
        // We'll proceed to onboarding where they can set it again.
        console.error('Profile update error:', profileError);
        onComplete();
      }
    }
    setLoading(false);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative min-h-screen w-full bg-surface-container-lowest flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Atmospheric glows */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary-container/8 blur-[120px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-secondary/6 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="w-full max-w-sm flex flex-col items-center gap-6 relative z-10 py-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="font-headline font-black text-3xl uppercase tracking-tighter text-on-surface text-glow">
            Create <span className="text-primary-container">Account</span>
          </h1>
          <p className="text-on-surface-variant font-body text-sm text-center">Join the elite fitness community</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full glass-card rounded-2xl p-6 flex flex-col gap-4"
        >
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3"
            >
              <p className="text-red-400 font-body text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Full Name</label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface font-body text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 transition-all"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface font-body text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 transition-all"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Password</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface font-body text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Confirm Password</label>
            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface font-body text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 transition-all"
            />
          </div>

          {/* Create Account Button */}
          <button
            id="signup-submit"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full mt-2 bg-primary-container text-on-primary-container py-4 px-8 rounded-xl font-headline font-bold text-base uppercase tracking-widest shadow-[0_0_24px_rgba(255,107,53,0.3)] active:scale-95 disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </motion.div>

        {/* Sign in link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-2"
        >
          <span className="text-on-surface-variant font-label text-sm">Already have an account?</span>
          <button
            id="goto-login"
            onClick={onSignIn}
            className="text-primary-container font-headline font-bold text-sm uppercase tracking-widest hover:underline transition-all"
          >
            Sign In
          </button>
        </motion.div>
      </div>
    </motion.main>
  );
}
