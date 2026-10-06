import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Mail, User, Loader2, ArrowRight, CheckCircle2, AlertCircle, Home } from 'lucide-react';

export function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: {
                        username: username.trim(),
                    },
                },
            });

            if (signUpError) throw signUpError;

            // In Supabase, if user already exists, identities array is empty
            if (data.user?.identities && data.user.identities.length === 0) {
                setError('An account with this email address already exists. Please sign in instead.');
                return;
            }

            // If session is returned immediately (email confirmation disabled in Supabase)
            if (data.session) {
                navigate('/admin', { replace: true });
                return;
            }

            // If email confirmation is enabled in Supabase project
            setSuccessMessage(
                `Your account has been created! A confirmation email has been dispatched to ${email.trim()}. Please click the link in your email to confirm your account and sign in.`
            );
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
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
                        Create an Account
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600">
                        Join REI Consulting to track projects and access client tools
                    </p>
                </div>

                {successMessage ? (
                    <div className="space-y-6 pt-2 text-center animate-fade-in">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-heading font-bold text-slate-900">
                                Verify Your Email Address
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                                {successMessage}
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-white bg-accent hover:bg-accent/90 font-semibold text-sm shadow-md transition-all"
                            >
                                <span>Proceed to Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Full Name / Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className="appearance-none relative block w-full pl-10 pr-3 py-2.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                                        placeholder="e.g. Jean Dupont"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email-address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Email Address
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
                                        placeholder="jean.dupont@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Password (min. 6 characters)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={6}
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
                                        Register Account
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="pt-2 text-center text-xs text-slate-600">
                            <span>Already have an account? </span>
                            <Link to="/login" className="font-bold text-accent hover:text-accent/80 hover:underline">
                                Log in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
