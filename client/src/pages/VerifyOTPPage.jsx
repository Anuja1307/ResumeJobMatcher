import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/authService';
import { Mail, Shield, ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const VerifyOTPPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get email from location state or query param
        const stateEmail = location.state?.email;
        const queryEmail = new URLSearchParams(location.search).get('email');
        setEmail(stateEmail || queryEmail || '');

        if (!stateEmail && !queryEmail) {
            navigate('/login');
        }
    }, [location, navigate]);

    useEffect(() => {
        let interval;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [countdown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        setLoading(true);
        try {
            await verifyOTP(email, otp);
            setSuccess('Email verified successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');
        setResendLoading(true);
        try {
            const response = await resendOTP(email);
            setSuccess('OTP sent successfully!');
            
            // Check if backend returned cooldown time
            const cooldown = response.data?.cooldown;
            if (cooldown) {
                setCountdown(cooldown);
            } else {
                setCountdown(60); // Default 60 seconds
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to resend OTP';
            setError(message);
            
            // If backend returns remaining cooldown time
            const remainingTime = err.response?.data?.remainingTime;
            if (remainingTime) {
                setCountdown(remainingTime);
            }
        } finally {
            setResendLoading(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    };

    const handlePaste = (e) => {
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
                        <Shield className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verify your email</h1>
                    <p className="text-sm text-slate-500 mt-1.5 text-center">
                        We've sent a 6-digit verification code to your email
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

                <form onSubmit={handleVerify} className="space-y-5">
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
                                onPaste={handlePaste}
                                placeholder="123456"
                                maxLength={6}
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all tracking-widest text-center font-mono"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 active:bg-indigo-850 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <span>Verify Email</span>
                        )}
                    </button>
                </form>

                {/* Resend OTP */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendLoading || countdown > 0}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {resendLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Sending...
                            </span>
                        ) : countdown > 0 ? (
                            `Resend OTP in ${countdown}s`
                        ) : (
                            "Resend OTP"
                        )}
                    </button>
                </div>

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

export default VerifyOTPPage;
