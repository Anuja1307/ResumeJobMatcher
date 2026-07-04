import { Briefcase, FileText, CheckCircle2, Clock, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashBoard = () => {
    const stats = [
        { label: 'Total Applications', value: '12', description: 'Saved & active listings', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 border-indigo-100/50' },
        { label: 'Resume Score', value: '84%', description: 'Match accuracy average', icon: FileText, color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50' },
        { label: 'Interviews Scheduled', value: '3', description: 'Upcoming conversations', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100/50' },
        { label: 'Offers Received', value: '1', description: 'Active job proposals', icon: CheckCircle2, color: 'text-sky-600 bg-sky-50 border-sky-100/50' }
    ];

    const actions = [
        { title: 'Upload Resume', desc: 'Scan and match your PDF resume', path: '/dashboard/resume', label: 'Go to Resume' },
        { title: 'Track New Job', desc: 'Save a new vacancy to your board', path: '/dashboard/jobs', label: 'Add Job' },
        { title: 'View Profile', desc: 'Manage your personal details', path: '/dashboard/profile', label: 'View Profile' }
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-md border border-slate-800">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back!</h1>
                <p className="text-indigo-200/90 text-sm mt-2 max-w-xl">
                    Redesign complete. Your job application control center is fully connected. Select an option from the sidebar to manage your details or review matches.
                </p>
            </div>

            

            {/* Quick Actions & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Get Started</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        To optimize your application workflow, begin by uploading your primary resume in PDF format. Next, save job postings you are interested in or currently interviewing for. Our matching algorithm automatically references your resume metrics when parsing job postings.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                        <Link to="/dashboard/resume" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
                            <Plus className="h-4 w-4" />
                            <span>Scan Resume</span>
                        </Link>
                        <Link to="/dashboard/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all">
                            <span>View Saved Jobs</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between gap-5">
                    <div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Quick Links</h2>
                        <div className="mt-4 space-y-1">
                            {actions.map((act) => (
                                <Link 
                                    key={act.title} 
                                    to={act.path} 
                                    className="group flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-all duration-200"
                                >
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{act.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-650 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;