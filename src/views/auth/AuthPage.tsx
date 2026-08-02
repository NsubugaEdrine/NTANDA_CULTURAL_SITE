// AuthPage.tsx — Sign in / Sign up page (public-only route).
// Responsibilities:
//   - Two-panel layout: brand/hero panel + the auth form panel.
//   - Mode toggle between signin and signup; signup adds full-name and
//     confirm-password fields plus client-side validation (password length
//     and match).
//   - Email flow calls signInWithEmail / signUpWithEmail from useAuth.
//     Signup without a session shows an "confirm your email" message; with a
//     session it proceeds to /profile.
//   - Apple/iCloud OAuth button delegates to signInWithApple (redirect).
//   - After login, users are returned to the page they originally requested
//     (from useLocation state) or sent to /dashboard.
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Alert, Button, Input } from '../../components/ui/form';

type Mode = 'signin' | 'signup';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithApple } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setInfo(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    const result =
      mode === 'signup'
        ? await signUpWithEmail(email, password, fullName)
        : await signInWithEmail(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === 'signup') {
      if (result.session) {
        navigate('/profile', { replace: true });
        return;
      }
      setInfo('Account created! Check your email to confirm your address, then sign in.');
      setMode('signin');
      setPassword('');
      setConfirmPassword('');
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleApple = async () => {
    setError(null);
    const result = await signInWithApple();
    if (result.error) setError(result.error);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fdf8f6]">
      {/* Brand panel */}
      <div className="md:w-1/2 bg-[#6f250f] text-white p-8 md:p-16 flex flex-col justify-between pattern-overlay">
        <div>
          <Link to="/" className="font-display-lg-mobile text-3xl font-bold tracking-tight">
            NTANDA
          </Link>
          <p className="font-label-md text-[#ffb9a7] uppercase tracking-widest text-xs mt-1">
            Heritage Platform
          </p>
        </div>
        <div className="hidden md:block">
          <h1 className="font-headline-md text-4xl mb-4 leading-tight">
            Preserve your culture.
            <br />
            Tell your story.
          </h1>
          <p className="font-body-lg text-[#ffb9a7] max-w-md">
            Create personal pages for your cultural posts, vlogs and blogs. Join a community of
            storytellers preserving Africa's heritage.
          </p>
        </div>
        <p className="font-body-md text-sm text-[#ffb9a7]/80 italic">
          "Ancestral storytelling for the digital age."
        </p>
      </div>

      {/* Form panel */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-headline-md text-3xl text-[#1c1b1a]">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="font-body-md text-sm text-[#55423e] mt-1">
              {mode === 'signin'
                ? 'Sign in to continue sharing your heritage.'
                : 'Join NTANDA to contribute cultural content.'}
            </p>
          </div>

          {/* Apple / iCloud sign in */}
          <Button variant="secondary" className="w-full mb-4" onClick={handleApple} type="button">
            <span className="flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M16.365 1.43c0 1.14-.49 2.27-1.23 3.08-.78.85-2.06 1.5-3.1 1.43-.1-1.12.5-2.26 1.21-3.05.79-.87 2.1-1.48 3.12-1.46zM20.5 17.26c-.65 1.46-1.05 2.34-1.93 3.64-1.23 1.82-2.98 4.08-5.14 4.09-1.87.02-2.42-1.2-4.75-1.19-2.33.01-2.93 1.21-4.8 1.19-2.16-.02-3.82-2.05-5.05-3.87C-1.64 15.8-.05 9.3 2.72 6.55c1.75-1.72 4.13-2.3 5.97-2.3 1.87 0 3.04 1.2 4.54 1.2 1.46 0 2.36-1.19 4.56-1.19 1.56 0 3.2.65 4.37 1.79-.57.48-1.6 1.47-1.66 1.84-.06.18.18.5.3.71.26.5 1.17 1.59 1.5 2.16-.5.33-1.68 1.4-1.7 2.01-.02.6.56 1.57.77 2.24z" />
              </svg>
              Continue with Apple (iCloud)
            </span>
          </Button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#dbc1ba]/40"></div>
            <span className="font-label-md text-xs text-[#55423e]">or use email</span>
            <div className="flex-1 h-px bg-[#dbc1ba]/40"></div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                id="fullName"
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Nakato Kintu"
                required
              />
            )}
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
            />
            {mode === 'signup' && (
              <Input
                id="confirmPassword"
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            )}

            {error && <Alert>{error}</Alert>}
            {info && <Alert type="success">{info}</Alert>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </Button>
          </form>

          <p className="font-body-md text-sm text-[#55423e] mt-6 text-center">
            {mode === 'signin' ? (
              <>
                New to NTANDA?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-[#6f250f] font-semibold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-[#6f250f] font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="font-body-md text-xs text-[#88726c] mt-8 text-center">
            After signing up, you'll be guided to complete your profile with a username and
            personal information.
          </p>
        </div>
      </div>
    </div>
  );
};
