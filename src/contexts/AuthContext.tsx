
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
  verifyOTP: (phone: string, otp: string) => Promise<{ error: any }>;
  sendOTP: (phone: string) => Promise<{ error: any }>;
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // Type assertion to ensure role is properly typed
          if (profileData) {
            setProfile({
              ...profileData,
              role: profileData.role as 'user' | 'admin'
            });
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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

  const sendOTP = async (phone: string) => {
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database (expires in 5 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const { error } = await supabase
      .from('otp_verifications')
      .insert({
        phone,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString()
      });

    // In a real implementation, you would send the OTP via SMS
    // For demo purposes, we'll just log it
    console.log(`OTP for ${phone}: ${otpCode}`);
    
    return { error };
  };

  const verifyOTP = async (phone: string, otp: string) => {
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', phone)
      .eq('otp_code', otp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return { error: { message: 'Invalid or expired OTP' } };
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', data.id);

    return { error: null };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    verifyOTP,
    sendOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
