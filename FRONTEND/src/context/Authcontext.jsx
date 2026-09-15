
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Get existing Supabase session
        const getInitialSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) {
                console.error('Session Error:', error);
            }

            if (mounted) {
                setSession(session);
                setLoading(false);
            }
        };

        getInitialSession();

        // Listen for login/logout/session changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession);
                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Register
    const signUp = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        return { data, error };
    };

    // Login
    const signIn = async (email, password) => {
        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        return { data, error };
    };

    // Google Login
    const signInWithGoogle = async () => {
        const { data, error } =
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });

        return { data, error };
    };

    // Logout
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Logout Error:', error);
        }

        return { error };
    };

    const value = {
        session,
        user: session?.user ?? null,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
