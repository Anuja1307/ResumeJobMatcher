import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getJobs, getJobMatches } from '../services/jobService';
import JobMatchCard from '../components/JobMatchCard';
import JobMatchSkeleton from '../components/JobMatchSkeleton';
import { 
    Briefcase, 
    FileText, 
    User, 
    CheckCircle2, 
    ArrowRight, 
    Plus, 
    Sparkles, 
    Building2, 
    MapPin, 
    Clock, 
    AlertCircle, 
    Loader2,
    RefreshCw,
    Upload
} from 'lucide-react';

const DashBoard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [jobError, setJobError] = useState('');

    // AI Job Matches state
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [matchError, setMatchError] = useState('');
    const [hasFetchedMatches, setHasFetchedMatches] = useState(false);

    const hasResume = Boolean(user?.resume?.filename || user?.resume?.path);
    const uploadedDate = user?.resume?.uploadedAt 
        ? new Date(user.resume.uploadedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : null;

    const fetchMatches = useCallback(async () => {
        if (!hasResume) return;

        setLoadingMatches(true);
        setMatchError('');

        try {
            const res = await getJobMatches();
            if (res.data?.success && Array.isArray(res.data.matches)) {
                setMatches(res.data.matches);
            } else {
                setMatches([]);
            }
        } catch (err) {
            console.error("Error fetching AI job matches:", err);
            const status = err.response?.status;
            if (status === 400) {
                setMatchError("Resume required. Please upload your resume to view AI matches.");
            } else if (status === 401) {
                setMatchError("Session expired. Please log in again.");
            } else {
                setMatchError("Unable to calculate AI job matches right now. Please try again.");
            }
        } finally {
            setLoadingMatches(false);
            setHasFetchedMatches(true);
        }
    }, [hasResume]);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await getJobs();
                if (res.data?.jobs) {
                    setJobs(res.data.jobs);
                }
            } catch (err) {
                console.error("Failed to load saved jobs for dashboard:", err);
                setJobError("Unable to load saved jobs preview.");
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchSavedJobs();
    }, []);

    // Trigger match calculation once jobs and resume availability are checked
    useEffect(() => {
        if (!loadingJobs && hasResume && jobs.length > 0 && !hasFetchedMatches) {
            fetchMatches();
        }
    }, [loadingJobs, hasResume, jobs.length, hasFetchedMatches, fetchMatches]);

    const handleRefreshMatches = () => {
        fetchMatches();
    };

    const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Candidate');

    const statusColors = {
        saved:        'bg-slate-100 text-slate-700 border-slate-200',
        applied:      'bg-blue-50 text-blue-700 border-blue-200',
        interviewing: 'bg-amber-50 text-amber-700 border-amber-200',
        rejected:     'bg-rose-50 text-rose-700 border-rose-200',
        offered:      'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            {/* WELCOME BANNER */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-md border border-slate-800 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        <span>AI Career Workspace</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Welcome back, {displayName} 👋
                    </h1>
                    <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                        Your AI-powered career workspace. Manage your resume, track job opportunities, and view your real-time AI match scores.
                    </p>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Resume Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60">
                                <FileText className="h-5 w-5" />
                            </div>
                            {hasResume ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Uploaded
                                </span>
                            ) : (
                                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                    Not uploaded
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Resume</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                {hasResume ? `Last updated: ${uploadedDate}` : 'No resume uploaded yet'}
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/dashboard/resume" 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2 transition-colors"
                    >
                        <span>{hasResume ? 'View Resume' : 'Upload Resume'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {/* 2. Saved Jobs Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-extrabold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                {loadingJobs ? '...' : jobs.length}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Saved Jobs</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                {loadingJobs ? 'Loading jobs...' : `${jobs.length} active tracked position${jobs.length === 1 ? '' : 's'}`}
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/dashboard/jobs" 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2 transition-colors"
                    >
                        <span>View jobs</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {/* 3. Profile Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60">
                                <User className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                Verified
                            </span>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Profile</h3>
                            <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]" title={user?.email}>
                                {user?.email || 'Account settings'}
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/dashboard/profile" 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2 transition-colors"
                    >
                        <span>View profile</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>

            {/* AI JOB MATCHES SECTION */}
            <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Job Matches</h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Based on your resume and saved jobs</p>
                    </div>

                    {hasResume && jobs.length > 0 && (
                        <button
                            onClick={handleRefreshMatches}
                            disabled={loadingMatches}
                            className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${loadingMatches ? 'animate-spin' : ''}`} />
                            <span>Refresh Matches</span>
                        </button>
                    )}
                </div>

                {/* CONDITION 1: NO RESUME UPLOADED */}
                {!hasResume ? (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-4 max-w-xl mx-auto shadow-xs">
                        <div className="h-14 w-14 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                            <FileText className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900">Resume Required</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                Upload your resume to generate AI-powered job matches.
                            </p>
                        </div>
                        <Link
                            to="/dashboard/resume"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm"
                        >
                            <Upload className="h-4 w-4" />
                            <span>Upload Resume</span>
                        </Link>
                    </div>
                ) : loadingJobs ? (
                    /* LOADING SAVED JOBS INITIAL CHECK */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <JobMatchSkeleton />
                        <JobMatchSkeleton />
                    </div>
                ) : jobs.length === 0 ? (
                    /* CONDITION 2: HAS RESUME BUT NO SAVED JOBS */
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-4 max-w-xl mx-auto shadow-xs">
                        <div className="h-14 w-14 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                            <Briefcase className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900">No Saved Jobs</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                Save some jobs to see how well your resume matches them.
                            </p>
                        </div>
                        <Link
                            to="/dashboard/jobs"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Browse Saved Jobs</span>
                        </Link>
                    </div>
                ) : loadingMatches ? (
                    /* CONDITION 3: LOADING MATCHES STATE */
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100/80 px-3 py-2 rounded-xl w-fit">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading AI job matches...</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <JobMatchSkeleton />
                            <JobMatchSkeleton />
                        </div>
                    </div>
                ) : matchError ? (
                    /* CONDITION 4: MATCH ERROR STATE */
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-800 text-xs space-y-3">
                        <div className="flex items-center gap-2.5 font-bold text-rose-700">
                            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                            <span>Unable to Load AI Job Matches</span>
                        </div>
                        <p className="text-rose-600 leading-relaxed">{matchError}</p>
                        <button
                            onClick={handleRefreshMatches}
                            className="inline-flex items-center gap-1.5 bg-white border border-rose-200 text-rose-700 font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-rose-100 transition-all cursor-pointer"
                        >
                            <RefreshCw className="h-3 w-3" />
                            <span>Try Again</span>
                        </button>
                    </div>
                ) : matches.length === 0 ? (
                    /* CONDITION 5: NO MATCHES FOUND FROM API */
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3 shadow-xs">
                        <div className="h-12 w-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center mx-auto">
                            <Sparkles className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">No Job Matches Found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            We couldn't calculate match scores for your saved jobs. Try adding more detailed job descriptions or refreshing your resume.
                        </p>
                    </div>
                ) : (
                    /* CONDITION 6: DISPLAY MATCHED JOB CARDS */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {matches.map((matchItem, index) => (
                            <JobMatchCard key={matchItem.job?._id || index} match={matchItem} />
                        ))}
                    </div>
                )}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI RESUME SECTION */}
                <div className="lg:col-span-2 bg-white p-6 md:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Resume & AI Analysis</h2>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">
                            Upload your resume to unlock AI-powered insights. Our system extracts structured information from your PDF to assist with job matching, skill evaluations, and interview prep.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {[
                                { title: "AI Resume Analysis", desc: "Structured parsing of skills & experience" },
                                { title: "Job Matching", desc: "Compare against saved postings" },
                                { title: "Skill Gap Analysis", desc: "Identify key missing qualifications" },
                                { title: "Interview Preparation", desc: "Targeted copilot questions" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center">
                        <Link 
                            to="/dashboard/resume" 
                            className="inline-flex items-center gap-2 text-xs font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                        >
                            {hasResume ? (
                                <>
                                    <FileText className="h-4 w-4" />
                                    <span>View Resume</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    <span>Upload Resume</span>
                                </>
                            )}
                        </Link>
                    </div>
                </div>

                {/* SAVED JOBS PREVIEW */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Saved Jobs Preview</h2>
                            <Link to="/dashboard/jobs" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                                View all →
                            </Link>
                        </div>

                        {loadingJobs ? (
                            <div className="py-8 flex flex-col items-center justify-center text-slate-400">
                                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                                <span className="text-xs mt-2 font-medium">Loading saved jobs...</span>
                            </div>
                        ) : jobError ? (
                            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-100">
                                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                                <span>{jobError}</span>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="py-6 text-center space-y-3">
                                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">No saved jobs yet</p>
                                    <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                                        Save jobs you are interested in to start building your job tracker.
                                    </p>
                                </div>
                                <Link 
                                    to="/dashboard/jobs" 
                                    className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add Job</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {jobs.slice(0, 3).map((job) => (
                                    <div key={job._id} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all space-y-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-xs font-bold text-slate-900 truncate" title={job.title}>
                                                {job.title}
                                            </h4>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${statusColors[job.status] || statusColors.saved}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                            <span className="flex items-center gap-1 truncate">
                                                <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                                                {job.company}
                                            </span>
                                            {job.location && (
                                                <span className="flex items-center gap-1 truncate">
                                                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                                    {job.location}
                                                </span>
                                            )}
                                            {job.experience && (
                                                <span className="flex items-center gap-1 truncate">
                                                    <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                                                    {job.experience}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {jobs.length > 0 && (
                        <Link 
                            to="/dashboard/jobs"
                            className="w-full text-center text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 py-2.5 rounded-xl transition-all block"
                        >
                            View all jobs ({jobs.length}) →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;