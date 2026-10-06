import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Mail, Loader2, ArrowRight, AlertCircle, Home } from 'lucide-react';

export function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const cleanIdentifier = identifier.trim();
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: cleanIdentifier,
                password: password,
            });

            if (signInError) throw signInError;

            if (data.session) {
                const destination = (location.state as any)?.from?.pathname || '/admin';
                navigate(destination, { replace: true });
            }
        } catch (err: any) {
            console.error('Sign in error:', err);
            const msg = (err.message || '').toLowerCase();
            if (msg.includes('email not confirmed')) {
                setError('Email not confirmed. Please check your email inbox to verify your account, or ask the system administrator to confirm your account.');
            } else if (msg.includes('invalid login credentials')) {
                setError('Invalid email or password. Please verify your credentials and try again.');
            } else {
                setError(err.message || 'Invalid credentials. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors mb-4"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Back to Homepage</span>
                    </Link>
                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-primary">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600">
                        Sign in to access your REI Consulting dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email / Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none relative block w-full pl-10 pr-3 py-2.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                                    placeholder="admin@reiconsulting.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full pl-10 pr-3 py-2.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                            <div className="leading-relaxed">{error}</div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-300 shadow-lg shadow-accent/25 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="pt-2 text-center text-xs text-slate-600">
                        <span>Don't have an account? </span>
                        <Link to="/signup" className="font-bold text-accent hover:text-accent/80 hover:underline">
                            Register now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
