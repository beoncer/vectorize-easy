import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError, AuthResponse, OAuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Types
interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  company_name: string | null;
  billing_address: string | null;
  vat_id: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

interface UserCredits {
  credit_balance: number;
  free_previews: number;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  credits: UserCredits;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<OAuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshCredits: () => Promise<void>;
}

const initialCredits: UserCredits = {
  credit_balance: 0,
  free_previews: 0,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  credits: initialCredits,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ data: { user: null, session: null }, error: null }),
  signInWithGoogle: async () => ({ data: { provider: 'google', url: null }, error: null }),
  signUp: async () => ({ data: { user: null, session: null }, error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  refreshCredits: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    credits: initialCredits,
    isLoading: true,
    isAuthenticated: false,
  });

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  };

  // Fetch user credits
  const fetchUserCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credit_balance, free_previews')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user credits:', error);
      return initialCredits;
    }

    return {
      credit_balance: data.credit_balance,
      free_previews: data.free_previews,
    };
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const [profile, credits] = await Promise.all([
            fetchUserProfile(session.user.id),
            fetchUserCredits(session.user.id),
          ]);

          setState({
            user: session.user,
            profile,
            credits: credits || initialCredits,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            profile: null,
            credits: initialCredits,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const [profile, credits] = await Promise.all([
          fetchUserProfile(session.user.id),
          fetchUserCredits(session.user.id),
        ]);

        setState({
          user: session.user,
          profile,
          credits: credits || initialCredits,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          profile: null,
          credits: initialCredits,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth operations
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
  };

  const updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword });
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!state.user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('user_id', state.user.id);

    if (error) return { error };

    const updatedProfile = await fetchUserProfile(state.user.id);
    if (updatedProfile) {
      setState(prev => ({ ...prev, profile: updatedProfile }));
    }

    return { error: null };
  };

  const refreshCredits = async () => {
    if (!state.user) return;

    const credits = await fetchUserCredits(state.user.id);
    setState(prev => ({ ...prev, credits }));
  };

  const value = {
    ...state,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshCredits,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;

// Export types
export type { UserProfile, UserCredits, AuthState, AuthContextType }; 