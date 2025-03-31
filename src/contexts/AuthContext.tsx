import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  credits: number;
  freePreviews: number;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoading: true,
  isLoggedIn: false,
  credits: 0,
  freePreviews: 0,
  refreshCredits: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(0);
  const [freePreviews, setFreePreviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to refresh user's credit balance
  const refreshCredits = async () => {
    if (user?.id) {
      try {
        console.log('Refreshing credits for user:', user.id);
        // Fetch credit balance
        const { data, error } = await supabase
          .from('user_credits')
          .select('credit_balance, free_previews')
          .eq('user_id', user.id)
          .single();

        console.log('Refresh credits result:', { data, error });

        if (error) {
          console.error('Error fetching user credits:', error);
        } else {
          console.log('Successfully fetched credits data:', data);
          setCredits(data?.credit_balance || 0);
          setFreePreviews(data?.free_previews || 0);
        }
      } catch (error) {
        console.error('Error refreshing credits:', error);
      }
    }
  };

  // Initialize user credits when user changes
  useEffect(() => {
    if (user?.id) {
      refreshCredits();
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider
      value={{
        userId: user?.id ?? null,
        isLoading,
        isLoggedIn: !!user,
        credits,
        freePreviews,
        refreshCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
