// auth.tsx — Authentication context provider + useAuth hook.
// Responsibilities:
//   - Owns the global auth state: the Supabase session, the current user
//     and the user's public profile (with role).
//   - On mount it restores any persisted session and subscribes to auth
//     state changes (sign in/out, token refresh) so all components stay in
//     sync automatically.
//   - Whenever the user changes it re-fetches the profile row so role and
//     profile fields are always current.
//   - Exposes auth operations used by the UI:
//       signUpWithEmail   -> email + password + full name (PKCE flow)
//       signInWithEmail   -> email + password
//       signInWithApple   -> OAuth redirect to Apple/iCloud
//       signOut           -> ends the session locally & on Supabase
//       updateProfile     -> persists profile edits and refreshes state
//       refreshProfile    -> re-reads the profile row from Supabase
//   - isAdmin is derived from profile.role === 'admin' and drives the
//     AdminRoute guard and admin-only menu items.
//   - useAuth() throws if called outside <AuthProvider>, guarding against
//     misuse.
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { Profile, UserRole } from '../types';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null; session: Session | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null; session: Session | null }>;
  signInWithApple: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    if (!error && data) {
      setProfile(data as Profile);
    }
  }, [session?.user]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [session?.user, refreshProfile]);

  const signUpWithEmail = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/profile`,
      },
    });
    if (error) return { error: error.message, session: null };
    return { error: null, session: data.session };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message, session: null };
    return { error: null, session: data.session };
  }, []);

  const signInWithApple = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/profile`,
        scopes: 'email name',
      },
    });
    if (error) return { error: error.message };
    if (data.url) {
      window.location.href = data.url;
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!session?.user) return { error: 'Not signed in' };
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);
      if (!error) {
        await refreshProfile();
      }
      return { error: error ? error.message : null };
    },
    [session?.user, refreshProfile]
  );

  const value: AuthContextValue = {
    session,
    user,
    profile,
    isLoading,
    isAdmin: profile?.role === 'admin',
    signUpWithEmail,
    signInWithEmail,
    signInWithApple,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
