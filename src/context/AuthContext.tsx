import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { UserRoleType, University } from '@/types/database';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRoleType | null;
  userUniversity: University | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRoleType | null>(null);
  const [userUniversity, setUserUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role, university_id, university:universities(*)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading user role:', error);
      setUserRole(null);
      setUserUniversity(null);
      return;
    }

    if (data) {
      setUserRole(data.role as UserRoleType);
      setUserUniversity((data.university as unknown as University) ?? null);
    } else {
      setUserRole(null);
      setUserUniversity(null);
    }
  };

  const refreshRole = async () => {
    if (user) {
      await loadUserRole(user.id);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserRole(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          await loadUserRole(session.user.id);
          setLoading(false);
        })();
      } else {
        setUserRole(null);
        setUserUniversity(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    setUserUniversity(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        userUniversity,
        loading,
        signIn,
        signUp,
        signOut,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
