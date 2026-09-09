import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import { Mail, Key, ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess('If an account exists with this email, an OTP has been sent.');
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md transition-all">
                
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 mb-4 border border-indigo-100/50">
                        <Key className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h1>
                    <p className="text-sm text-slate-500 mt-1.5 text-center">
                        Enter your email address and we'll send you a verification code
                    </p>
                </div>

                {/* Success Banner */}
                {success && (
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2.5 animate-fadeIn">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{success}</span>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="bg-rose-50 text-rose-700 border border-rose-100 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2.5 animate-fadeIn">
                        <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail className="h-4.5 w-4.5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="anuja@gmail.com"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 active:bg-indigo-850 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Sending OTP...</span>
                            </>
                        ) : (
                            <span>Send OTP</span>
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <Link 
                        to="/login" 
                        className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ForgotPasswordPage;
