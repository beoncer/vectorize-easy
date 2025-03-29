import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { getSupabaseClient } from '@/lib/supabase';

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
  const { isLoaded, userId } = useClerkAuth();
  const { user } = useUser();
  const [credits, setCredits] = useState(0);
  const [freePreviews, setFreePreviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Function to refresh user's credit balance
  const refreshCredits = async () => {
    if (userId) {
      try {
        console.log('Refreshing credits for user:', userId);
        const client = getSupabaseClient(userId);
        // Fetch credit balance
        const { data, error } = await client
          .from('user_credits')
          .select('credit_balance, free_previews')
          .eq('user_id', userId)
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

  // Initialize user's credit record if it doesn't exist
  const initializeUserCredits = async () => {
    if (!userId || !user?.emailAddresses?.[0]?.emailAddress) return;

    try {
      console.log('Initializing credits for user:', userId);
      const client = getSupabaseClient(userId);
      
      // First check if user profile exists
      const { data: profile, error: profileError } = await client
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Create user profile first
        const { error: createProfileError } = await client
          .from('user_profiles')
          .insert({
            user_id: userId,
            email: user.emailAddresses[0].emailAddress,
            company_name: '',
            billing_address: '',
            vat_id: '',
            country: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createProfileError) {
          console.error('Error creating user profile:', createProfileError);
          return;
        }
      }

      // Check if user credits exist
      const { data: existingCredits, error: fetchError } = await client
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('Fetch result:', { existingCredits, fetchError });

      if (fetchError && fetchError.code === 'PGRST116') {
        // No credits record exists, create one
        console.log('Creating new user credits record with free preview');
        const { data: insertData, error: insertError } = await client
          .from('user_credits')
          .insert({
            user_id: userId,
            credit_balance: 0,
            free_previews: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        console.log('Insert result:', { insertData, insertError });

        if (insertError) {
          console.error('Error creating user credits:', insertError);
        } else {
          console.log('Successfully created user credits');
          await refreshCredits();
        }
      } else if (!fetchError) {
        // Credits record exists, just refresh
        await refreshCredits();
      }
    } catch (error) {
      console.error('Error initializing user credits:', error);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      console.log('Auth loaded, userId:', userId);
      if (userId) {
        initializeUserCredits();
      } else {
        // Reset credits and free previews when user logs out
        setCredits(0);
        setFreePreviews(0);
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
      freePreviews,
      refreshCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
