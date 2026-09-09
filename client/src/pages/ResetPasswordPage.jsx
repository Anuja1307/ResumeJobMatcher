import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get email from location state or query param
        const stateEmail = location.state?.email;
        const queryEmail = new URLSearchParams(location.search).get('email');
        setEmail(stateEmail || queryEmail || '');

        if (!stateEmail && !queryEmail) {
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const validateForm = () => {
        if (otp.length !== 6) {
            setValidationError('Please enter a valid 6-digit OTP.');
            return false;
        }
        if (newPassword.length < 8) {
            setValidationError('Password must be at least 8 characters long.');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setValidationError('Passwords do not match.');
            return false;
        }
        setValidationError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setValidationError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email, otp, newPassword);
            setSuccess('Password reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        setOtp(pastedData);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md transition-all">
                
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 mb-4 border border-indigo-100/50">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reset your password</h1>
                    <p className="text-sm text-slate-500 mt-1.5 text-center">
                        Enter the OTP and your new password
                    </p>
                    <p className="text-sm font-medium text-slate-700 mt-1">{email}</p>
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

                {/* Validation Error */}
                {validationError && (
                    <div className="bg-amber-50 text-amber-700 border border-amber-100 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2.5 animate-fadeIn">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{validationError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* OTP Input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Verification Code
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail className="h-4.5 w-4.5" />
                            </div>
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                onPaste={handleOtpPaste}
                                placeholder="123456"
                                maxLength={6}
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all tracking-widest text-center font-mono"
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-4.5 w-4.5" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                autoComplete="new-password"
                                className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-4.5 w-4.5" />
                            </div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                autoComplete="new-password"
                                className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                            </button>
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
                                <span>Resetting Password...</span>
                            </>
                        ) : (
                            <span>Reset Password</span>
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

export default ResetPasswordPage;
