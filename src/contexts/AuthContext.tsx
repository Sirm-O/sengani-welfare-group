
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: 'user' | 'admin';
  is_approved: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string, role: 'user' | 'admin') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profileData) {
        console.log('Profile fetched successfully:', profileData);
        setProfile({
          ...profileData,
          role: profileData.role as 'user' | 'admin'
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile when user signs in
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        // Only set loading to false after we've processed the session
        setLoading(false);
      }
    );

    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }

        if (!mounted) return;

        console.log('Initial session:', session?.user?.id || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string, role: 'user' | 'admin') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          phone,
          role
        }
      }
    });

    // If it's an admin signup, send notification email
    if (!error && role === 'admin') {
      try {
        const { error: functionInvokeError } = await supabase.functions.invoke('send-admin-approval-request', {
          body: {
            adminEmail: 'jabuyahsam@gmail.com', // Consider making this configurable
            newAdminDetails: {
              fullName,
              email,
              phone
            }
          }
        });

        if (functionInvokeError) {
          console.error('Error invoking send-admin-approval-request function:', functionInvokeError);
          // Return a more specific error to the client.
          // This helps differentiate from the initial auth.signUp error.
          return {
            error: {
              message: `Admin user ${email} signed up, but failed to send approval email. Please contact support. Function error: ${functionInvokeError.message}`,
              cause: 'function_invoke_failed',
              details: functionInvokeError
            }
          };
        }
      } catch (invocationCatchError) {
        // This catches errors if the invoke call itself fails spectacularly (e.g., network issue to functions endpoint, though less common)
        console.error('Critical error during supabase.functions.invoke call:', invocationCatchError);
        return {
          error: {
            message: `Admin user ${email} signed up, but a critical error occurred while trying to send the approval email. Please contact support. Details: ${(invocationCatchError as Error).message}`,
            cause: 'function_invocation_exception',
            details: invocationCatchError
          }
        };
      }
    }

    // If there was an initial error from supabase.auth.signUp, or if it's not an admin, return the original error object.
    // If it was an admin and email sending was successful, error will be null here.
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
