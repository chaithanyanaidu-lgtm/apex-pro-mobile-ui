import { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

interface Props {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function LoginScreen({ onLogin, onSignUp }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      onLogin();
    }
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

      <div className="w-full max-w-sm flex flex-col items-center gap-8 relative z-10">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-container/15 border border-primary-container/30 flex items-center justify-center shadow-[0_0_32px_rgba(255,107,53,0.25)]">
            <span className="text-3xl font-headline font-black text-primary-container text-glow">A</span>
          </div>
          <h1 className="font-headline font-black text-4xl uppercase tracking-tighter text-on-surface text-glow">
            APEX <span className="text-primary-container">PRO</span>
          </h1>
          <p className="text-on-surface-variant font-body text-sm text-center">Your AI-powered fitness coach</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full glass-card rounded-2xl p-6 flex flex-col gap-4"
        >
          <h2 className="font-headline font-bold text-xl text-on-surface text-center tracking-tight">Welcome Back</h2>

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

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface font-body text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 focus:ring-1 focus:ring-primary-container/30 transition-all"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3.5 text-on-surface font-body text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 focus:ring-1 focus:ring-primary-container/30 transition-all"
            />
          </div>

          {/* Sign In Button */}
          <button
            id="login-submit"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full mt-2 bg-primary-container text-on-primary-container py-4 px-8 rounded-xl font-headline font-bold text-base uppercase tracking-widest shadow-[0_0_24px_rgba(255,107,53,0.3)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing In…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </motion.div>

        {/* Sign up link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-2"
        >
          <span className="text-on-surface-variant font-label text-sm">Don't have an account?</span>
          <button
            id="goto-signup"
            onClick={onSignUp}
            className="text-primary-container font-headline font-bold text-sm uppercase tracking-widest hover:underline transition-all"
          >
            Sign Up
          </button>
        </motion.div>
      </div>
    </motion.main>
  );
}
