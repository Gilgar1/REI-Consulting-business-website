import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
    isAuthenticated: boolean;
    session: Session | null;
    user: User | null;
    role: string | null;
    isAdmin: boolean;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const syncProfileRole = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .maybeSingle();

            if (data?.role) {
                setRole(data.role);
            } else {
                // Single-operator seam: every signed-up user is implicitly admin for now
                setRole('admin');
                // Ensure profile record exists
                supabase.from('profiles').upsert({ id: userId, role: 'admin' }).catch(() => {});
            }
        } catch {
            setRole('admin');
        }
    };

    useEffect(() => {
        let mounted = true;

        // Check active session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!mounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await syncProfileRole(session.user.id);
            } else {
                setRole(null);
            }
            setLoading(false);
        }).catch(() => {
            if (mounted) setLoading(false);
        });

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await syncProfileRole(session.user.id);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setRole(null);
        setLoading(false);
    };

    const isAuthenticated = !!session;
    const isAdmin = role === 'admin';

    return (
        <AuthContext.Provider value={{ isAuthenticated, session, user, role, isAdmin, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

