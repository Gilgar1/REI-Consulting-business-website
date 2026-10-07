import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, ArrowRight, AlertCircle, Home, Eye, EyeOff, CheckCircle2, RefreshCw, KeyRound, X } from 'lucide-react';

export function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);
    const [resendingEmail, setResendingEmail] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Forgot Password Modal State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState(false);
    const [forgotError, setForgotError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // If already authenticated, redirect to destination
    useEffect(() => {
        if (isAuthenticated) {
            const destination = (location.state as any)?.from?.pathname || '/admin';
            navigate(destination, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsEmailUnconfirmed(false);
        setResendSuccess(false);
        setLoading(true);

        const cleanEmail = identifier.trim().toLowerCase();

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
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
            const code = err.code || '';

            if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
                setIsEmailUnconfirmed(true);
                setError('Your email has not been confirmed yet. Please verify your inbox or click below to receive a new link.');
            } else if (code === 'invalid_credentials' || msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
                setError('Invalid email address or password. Please verify your credentials and try again.');
            } else if (msg.includes('too many requests') || msg.includes('rate limit')) {
                setError('Too many login attempts. Please wait a moment before trying again.');
            } else {
                setError(err.message || 'Unable to sign in. Please verify your network connection and credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        if (!identifier) return;
        setResendingEmail(true);
        setResendSuccess(false);

        try {
            const { error: resendErr } = await supabase.auth.resend({
                type: 'signup',
                email: identifier.trim().toLowerCase(),
                options: {
                    emailRedirectTo: `${window.location.origin}/admin`,
                },
            });

            if (resendErr) throw resendErr;
            setResendSuccess(true);
        } catch (err: any) {
            console.error('Resend error:', err);
            setError(err.message || 'Failed to resend confirmation email. Please wait a moment.');
        } finally {
            setResendingEmail(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError('');
        setForgotLoading(true);

        try {
            const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
                forgotEmail.trim().toLowerCase(),
                {
                    redirectTo: `${window.location.origin}/reset-password`,
                }
            );

            if (resetErr) throw resetErr;
            setForgotSuccess(true);
        } catch (err: any) {
            console.error('Password reset error:', err);
            setForgotError(err.message || 'Failed to send reset link. Please check your email address.');
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 relative">
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
                                    placeholder="your.email@example.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotEmail(identifier);
                                        setShowForgotModal(true);
                                        setForgotSuccess(false);
                                        setForgotError('');
                                    }}
                                    className="text-xs text-accent hover:text-accent/80 font-semibold hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full pl-10 pr-10 py-2.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2 animate-fade-in">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                                <div className="leading-relaxed">{error}</div>
                            </div>
                            {isEmailUnconfirmed && (
                                <div className="pt-1 border-t border-rose-200/60 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={handleResendConfirmation}
                                        disabled={resendingEmail}
                                        className="font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${resendingEmail ? 'animate-spin' : ''}`} />
                                        <span>{resendingEmail ? 'Sending...' : 'Resend confirmation link'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {resendSuccess && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                            <div className="leading-relaxed">
                                A fresh verification link has been sent to your email address! Please check your inbox and spam folder.
                            </div>
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

                {/* Forgot Password Modal */}
                {showForgotModal && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative space-y-4 animate-fade-in">
                            <button
                                onClick={() => setShowForgotModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2.5 text-primary">
                                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                                    <KeyRound className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-base">Reset Your Password</h3>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                Enter your registered email address and we'll send you a secure link to create a new password.
                            </p>

                            {forgotSuccess ? (
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Reset Link Dispatched</span>
                                    </div>
                                    <p className="leading-relaxed">
                                        Check your email for the recovery link. Click it to set a new password.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(false)}
                                        className="w-full mt-2 py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword} className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Account Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    {forgotError && (
                                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                                            {forgotError}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotModal(false)}
                                            className="w-1/2 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={forgotLoading}
                                            className="w-1/2 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm disabled:opacity-60"
                                        >
                                            {forgotLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send Link'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
