import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Loader2, ArrowRight, CheckCircle2, AlertCircle, Home, Eye, EyeOff, RefreshCw } from 'lucide-react';

export function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendStatus, setResendStatus] = useState('');

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const validateEmail = (emailStr: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setResendStatus('');

        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();

        if (!cleanUsername) {
            setError('Please enter your full name or username.');
            return;
        }

        if (!validateEmail(cleanEmail)) {
            setError('Please enter a valid email address (e.g. name@domain.com).');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match. Please re-enter.');
            return;
        }

        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: cleanEmail,
                password: password,
                options: {
                    data: {
                        username: cleanUsername,
                        full_name: cleanUsername,
                    },
                    emailRedirectTo: `${window.location.origin}/admin`,
                },
            });

            if (signUpError) throw signUpError;

            // In Supabase, if user already exists and email confirm is on, identities array is empty
            if (data.user?.identities && data.user.identities.length === 0) {
                setError('An account with this email address is already registered. Please sign in instead.');
                return;
            }

            // If session is returned immediately (e.g. auto-confirm enabled)
            if (data.session) {
                navigate('/admin', { replace: true });
                return;
            }

            // If confirmation email dispatched
            setSuccessMessage(
                `A verification link has been sent to ${cleanEmail}. Please check your inbox (and spam/junk folder) and click the confirmation link to activate your account.`
            );
        } catch (err: any) {
            console.error('Registration error:', err);
            const msg = (err.message || '').toLowerCase();
            const code = err.code || '';

            if (code === 'user_already_exists' || msg.includes('already registered') || msg.includes('user already exists')) {
                setError('An account with this email already exists. Please sign in instead.');
            } else if (code === 'email_address_invalid' || msg.includes('email_address_invalid')) {
                setError('The email address provided is not accepted by the mail validator. Please provide a standard, active email address.');
            } else if (msg.includes('rate limit') || msg.includes('too many')) {
                setError('Too many requests. Please wait a few moments before trying again.');
            } else {
                setError(err.message || 'Registration failed. Please check your details and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) return;

        setResending(true);
        setResendStatus('');

        try {
            const { error: resendErr } = await supabase.auth.resend({
                type: 'signup',
                email: cleanEmail,
                options: {
                    emailRedirectTo: `${window.location.origin}/admin`,
                },
            });

            if (resendErr) throw resendErr;
            setResendStatus('A new confirmation email has been dispatched!');
        } catch (err: any) {
            setResendStatus('Notice: ' + (err.message || 'Please wait a moment before requesting another email.'));
        } finally {
            setResending(false);
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
                        Join REI Consulting to access property management and client services
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

                        {resendStatus && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
                                {resendStatus}
                            </div>
                        )}

                        <div className="pt-2 space-y-3">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-white bg-accent hover:bg-accent/90 font-semibold text-sm shadow-md transition-all cursor-pointer"
                            >
                                <span>Proceed to Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-bold text-slate-600 hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                                <span>{resending ? 'Sending...' : 'Did not receive email? Resend link'}</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Full Name
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
                                    placeholder="your.email@example.com"
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
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
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

                        <div>
                            <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                    className="appearance-none relative block w-full pl-10 pr-10 py-2.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
                                    placeholder="••••••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                                <div className="leading-relaxed">{error}</div>
                            </div>
                        )}

                        <div className="pt-2">
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
