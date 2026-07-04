import { useState, useEffect } from 'react';
import { getProfile } from '../services/authService';
import { User, Mail, Shield, AlertCircle, Loader2 } from 'lucide-react';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                setProfile(response.data.user);
                console.log("Profile data fetched successfully:", response.data.user);
                console.log("Profile data:", profile);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile. Try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();   //call it immediately after defining it because useEffect cannot be async directly
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium mt-3">Fetching your profile...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="max-w-md bg-rose-50 border border-rose-100 p-6 rounded-2xl text-center animate-fadeIn">
                <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-rose-800">Failed to load profile</h3>
                <p className="text-xs text-rose-600 mt-1.5">{error}</p>
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
         <div className="max-w-md animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Profile</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">

                {/* User Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100/50 text-indigo-705 flex items-center justify-center font-bold text-xl uppercase">
                        {getInitials(profile?.name)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{profile?.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">Candidate Member</p>
                    </div>
                </div>

                {/* Info Fields */}
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</p>
                            <p className="text-sm font-semibold text-slate-800">{profile?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
                            <Mail className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                            <p className="text-sm font-semibold text-slate-800">{profile?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
                            <Shield className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Status</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/50 mt-1">
                                Verified Account
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;