import { useState, useEffect } from 'react';
import { getProfile } from '../services/authService';
import { User, Mail, ShieldCheck, AlertCircle, Loader2, CheckCircle2, FileText, Calendar } from 'lucide-react';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                const loadedProfile = response?.data?.user;

                if (!loadedProfile) {
                    throw new Error('No profile data returned by the server.');
                }

                setProfile(loadedProfile);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch profile. Try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium mt-3">Fetching your profile details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md bg-rose-50 border border-rose-100 p-6 rounded-2xl text-center animate-fadeIn mx-auto">
                <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-rose-800">Failed to load profile</h3>
                <p className="text-xs text-rose-600 mt-1.5">{error}</p>
            </div>
        );
    }

    const getInitials = (name, email) => {
        if (name && name.trim()) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (email) {
            return email.slice(0, 2).toUpperCase();
        }
        return 'US';
    };

    const hasResume = Boolean(profile?.resume?.filename || profile?.resume?.path);
    const resumeUploadedDate = profile?.resume?.uploadedAt 
        ? new Date(profile.resume.uploadedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        : null;

    return (
        <div className="max-w-xl animate-fadeIn space-y-6 pb-12">
            <div className="pb-4 border-b border-slate-200/80">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
                <p className="text-sm text-slate-500 mt-1">Manage your identity and candidate membership details.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7 space-y-6">

                {/* User Header Avatar */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 border border-indigo-200 text-white flex items-center justify-center font-extrabold text-xl uppercase shadow-md shadow-indigo-100">
                        {getInitials(profile?.name, profile?.email)}
                    </div>
                    <div className="space-y-1 min-w-0">
                        <h2 className="text-lg font-extrabold text-slate-900 leading-tight truncate">
                            {profile?.name || 'Candidate Member'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <ShieldCheck className="h-3 w-3 text-emerald-600" /> Verified Account
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Fields */}
                <div className="space-y-4">
                    <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-slate-500 shadow-2xs">
                            <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                            <p className="text-xs font-bold text-slate-800">{profile?.name || 'Not specified'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-slate-500 shadow-2xs">
                            <Mail className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                            <p className="text-xs font-bold text-slate-800 truncate">{profile?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className="p-2 bg-white rounded-lg border border-slate-200/80 text-slate-500 shadow-2xs">
                            <FileText className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resume Status</p>
                            {hasResume ? (
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>{profile.resume.filename || 'PDF Resume Uploaded'}</span>
                                    </p>
                                    {resumeUploadedDate && (
                                        <p className="text-[11px] text-slate-500">Uploaded on {resumeUploadedDate}</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs font-semibold text-slate-500">No resume uploaded yet</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;