
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { supabase, getUserCredits } from '@/lib/supabase';

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  credits: number;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoading: true,
  isLoggedIn: false,
  credits: 0,
  refreshCredits: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, userId } = useClerkAuth();
  const { user } = useUser();
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Function to refresh user's credit balance
  const refreshCredits = async () => {
    if (userId) {
      const userCredits = await getUserCredits(userId);
      setCredits(userCredits);
    }
  };

  // Initialize user's credit record if it doesn't exist
  const initializeUserCredits = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist in the credits table, create a record
        await supabase
          .from('user_credits')
          .insert({
            user_id: userId,
            credit_balance: 0,
            created_at: new Date().toISOString()
          });
      }

      // Get user credits
      await refreshCredits();
    } catch (error) {
      console.error('Error initializing user credits:', error);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        initializeUserCredits();
      }
      setIsLoading(false);
    }
  }, [isLoaded, userId]);

  return (
    <AuthContext.Provider value={{ 
      userId, 
      isLoading: !isLoaded || isLoading, 
      isLoggedIn: !!userId,
      credits,
      refreshCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
